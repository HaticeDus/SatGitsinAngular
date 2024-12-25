import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; //urlden gelen veriyi alma
import { ServiceMessageService } from 'src/app/services/service-message.service';
import { ServiceUserService } from 'src/app/services/service-user.service';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ServeChatHubService } from 'src/app/services/serve-chat-hub.service';

import { modelMessage } from 'src/app/models/modelMessage';
import { modelUser } from 'src/app/models/modelUser';


@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})


export class ExampleComponent {

  public findUser: modelUser | undefined; // oturumu yapan Kullanıcı bilgilerini tutacak değişken
  loggedIn: boolean = false; // Kullanıcının giriş durumunu tutacak değişken
  sellerUserId: any; //satıcı userId'yi tutan değişken
  userList: modelUser[] = [];
  messageList: modelMessage[] = []; // Mesajların tutacak değişken
  userMessageRelations: { userId: number, userNameSurname: string }[] = [];

  selectedUser: modelUser | undefined; //chatde seçilen kullanıcı için 

  selectedUserMessages: modelMessage[] = []; //chatde seçilen kullanıcı dizisi

  private connnection: HubConnection;
  //public messages: string[] = [];
  public messages: { user: string, content: string }[] = [];
  public user: string = ""; //karşı tarafa oturumu  yapan kişinin ismi gitsin
  public newMessage: string = ''; //[(ngModel)] ile kullanıcıdan veriyi alınıyor

  constructor(
    private route: ActivatedRoute,
    private apiServiceMessage: ServiceMessageService,
    private apiServiceUSER: ServiceUserService,
    //private chatService: ServeChatHubService
  ) {
    this.connnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7131/chat')
      .build();
  }

  async ngOnInit() {
    this.connnection.on('ReceiveMessage', (user, newMessage) => {
      //this.messages.push(`${user}: ${newMessage}`)
      const messageObject = { user: user, content: newMessage }; // user ve newMessage özelliklerini içeren nesne
      this.messages.push(messageObject);
    });

    try {
      await this.connnection.start();
      console.log('Connected yo SignalR hub');
    } catch (error) {
      console.error('Failed to connect to SignalR hub', error);
    }
    this.getDataStorage();// oturumu yapan kişinin bilgileri geliyor
    this.getMessagesAndUsers(); // oturumu yapan userın mesajlaşma geçmişi // this.createMessageRelations(); burada çağırdım
  }

  //oturum yapan kişinin adı gitsin //signalR
  async sendMessage(user: string | undefined, newMessage: string) {
    if (!user || !newMessage) return;
    await this.connnection.invoke('SendMessage', user, newMessage);
  }



  getMessagesAndUsers() { //tüm mesaj ve kullanıcıları aldım
    this.apiServiceMessage.get().subscribe((res: any) => {
      this.messageList = res;
      this.apiServiceUSER.get().subscribe((res: any) => {
        this.userList = res;
        this.createMessageRelations(); // userList yüklendikten sonra createMessageRelations() çağrılıyor
        this.getSellerId(); //satıcı userId bilgisi burada  userList ulaştıktan sonra aıyorum
      });
    });
  }


  createMessageRelations() {//oturum sahibinin hangi kullanıcı ile yazıştığını getiyoruz
    // Seçili kullanıcının gönderdiği veya aldığı mesajları filtrele
    const currentUserMessages = this.messageList.filter(
      message => (message.senderUserId === this.findUser?.userId || message.receiverUserId === this.findUser?.userId) &&
        message.senderUserId !== this.findUser?.userId
    );
    console.log("currentUserMessages:", currentUserMessages);
    // Kullanıcı mesajlarını kullanarak kullanıcı ilişkilerini oluştur
    this.userMessageRelations = currentUserMessages.map(message => {
      // Mesajın alıcı ve göndereni tespit et
      const otherUserId = message.senderUserId === this.findUser?.userId ? message.receiverUserId : message.senderUserId;

      // Diğer kullanıcıyı kullanıcı listesinde ara
      const otherUser = this.userList.find(user => user.userId === otherUserId);
      // Kullanıcı ilişkisini oluştur ve diziye ekle
      return { userId: otherUserId, userNameSurname: otherUser?.userNameSurname || 'Unknown User' };
    });

    this.userMessageRelations = this.userMessageRelations.filter(// Aynı kullanıcıyı yalnızca bir kez göstermek için filtrele
      (user, index, self) => index === self.findIndex(u => u.userId === user.userId)
    );
    console.log("this.userMessageRelations: ", this.userMessageRelations);
  }


  getSellerId() {
    // --------------ürün satıcısının userId bilgisini al ve default olarak oturum yapan ve ürün sahibi arasında chat açılsın--------------
    this.route.params.subscribe(params => {
      this.sellerUserId = +params['sellerUserId']; // "+" ile stringi number'a çeviriyoruz
      console.log("ürün satıcısının userId'si: ", this.sellerUserId);

      // Selected user'ı belirlemek için userList'den uygun kullanıcıyı bul
      this.selectedUser = this.userList.find(user => user.userId === this.sellerUserId);
      // console.log("userList: ", this.userList);
      console.log("Selected user: ", this.selectedUser);
      this.loadMessages();
    });
  }

  selectUser(user: any) { //chat sayfasında kullanıcıyı seçersem önceki mesajlaşmayı getiriyor 
    this.selectedUser = user;
    this.loadMessages();
  }

  loadMessages() { // sadece oturumu yapan kullanıcı ile seçilen kullanıcı arasındaki mesajları filtreleme
    if (this.findUser && this.selectedUser) {
      // Simulated API call to load messages between currentUser and selectedUser
      this.apiServiceMessage.get().subscribe((res: any) => {
        const messages: modelMessage[] = res; // API'den gelen mesajları modelMessage tipine dönüştür
        // Filtreleme işlemleri
        this.selectedUserMessages = messages.filter(
          (message: modelMessage) => (
            (message.senderUserId === this.findUser?.userId && message.receiverUserId === this.selectedUser?.userId) ||
            (message.senderUserId === this.selectedUser?.userId && message.receiverUserId === this.findUser?.userId)
          )
        );
        console.log("this.selectedUserMessages: ", this.selectedUserMessages);
      });
    }
  }

  // saveMessage() {//database'e kaydettiriyorum
  //   if (this.selectedUser && this.newMessage.trim() !== '') {
  //     // Bu kısım, seçili bir kullanıcının bulunup bulunmadığını ve gönderilecek mesajın boş olup olmadığını kontrol eder.
  //     const senderUserId = this.findUser?.userId;
  //     const receiverUserId = this.selectedUser?.userId; //chatde seçilen kullanıcı nesnesi
  //     const messageText = this.newMessage;//girilen mesaj


  //     this.apiServiceMessage.post(senderUserId, receiverUserId, messageText).subscribe(
  //       (response) => {
  //         console.log("Mesaj gönderildi:", response);

  //       },
  //       (error) => {
  //         console.error("Mesaj gönderilirken hata oluştu:", error);
  //       }
  //     );
  //     // mesaj gönderildikten sonra metin kutusunu temizle.
  //     this.newMessage = '';
  //   }
  // }

  async saveMessage() {
    if (this.selectedUser && this.newMessage.trim() !== '') {
      const currentUser = this.findUser?.userNameSurname;
      const senderUserId = this.findUser?.userId;
      const receiverUserId = this.selectedUser?.userId;
      const messageText = this.newMessage;

      try {
        const response = await this.apiServiceMessage.post(senderUserId, receiverUserId, messageText).toPromise();
        console.log("Mesaj gönderildi:", response);

        // Mesaj gönderildikten sonra metin kutusunu temizle
        this.newMessage = '';

        // Artık mesajı SignalR ile gönderebilirsiniz
        this.sendMessage(currentUser, messageText);
      } catch (error) {
        console.error("Mesaj gönderilirken hata oluştu:", error);
      }
    }
  }

  //db'deki sa:dk veriyor
  formatDate(date: Date | string): string {
    if (date) {
      const pipe = new DatePipe('en-US');
      return pipe.transform(date, 'HH:mm') || ''; // 24 saatlik saat ve dakika formatı veya boş dize
    } else {
      return '';
    }
  }
  //şimdiki sa:dk döndürüyor (signalR)
  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Saat
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Dakika

    return `${hours}:${minutes}`;
  }
  isMyMessage(message: any) { //chatde renk değiştirmek için
    return message.senderUserId === this.findUser?.userId;
  }

  // -------------LOGIN İŞLEMLERİ-------------
  // localStorage'den veriyi almak için promisified bir fonksiyon
  private getLoggedInUser(): Promise<string | null> {
    return new Promise((resolve) => {
      const loggedInUser = localStorage.getItem('loggedInUser');
      resolve(loggedInUser);
    });
  }
  // Özyinelemeli olarak localStorage'den veriyi al
  async getDataStorage() {
    const loggedInUser = await this.getLoggedInUser();
    if (loggedInUser) {
      this.loggedIn = true; // Kullanıcı giriş yapmış olarak işaretlenir
      this.findUser = JSON.parse(loggedInUser);
      console.log("oturumu yapan userId: ", this.findUser?.userId);
      this.user = this.findUser?.userNameSurname || ''; // Eğer userNameSurname undefined ise boş string atama
      console.log(" this.user: ", this.user);
    }
  }

}
