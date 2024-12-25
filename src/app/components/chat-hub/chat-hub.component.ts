import { Component } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';


import { modelUser } from 'src/app/models/modelUser';
import { modelMessage } from 'src/app/models/modelMessage';
import { ServiceMessageService } from 'src/app/services/service-message.service';
import { ServiceUserService } from 'src/app/services/service-user.service';

@Component({
  selector: 'app-chat-hub',
  templateUrl: './chat-hub.component.html',
  styleUrls: ['./chat-hub.component.css']
})

export class ChatHubComponent {
  //oturumu yapan kişi bilgileri
  findUser: modelUser | undefined; // oturumu yapan Kullanıcı bilgilerini tutan değişken
  loggedIn: boolean = false; // Kullanıcının giriş durumunu tutacak değişken
  messageList: modelMessage[] = []; // Mesajların tutacak değişken
  userList: modelUser[] = [];



  private connnection: HubConnection;
  public messages: string[] = [];
  public user: string = ""; //karşı tarafa oturumu  yapan kişinin ismi gitsin
  public message: string = "";


  constructor(
    private apiServiceMessage: ServiceMessageService,
    private apiServiceUSER: ServiceUserService,
    // @Inject(MAT_DIALOG_DATA) public datafromProductDetail: any //satıcının user bilgilerini tutan değişken 
  ) {
    this.connnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7131/chat')
      .build();
  }

  async ngOnInit() {
    this.connnection.on('ReceiveMessage', (user, message) => {
      this.messages.push(`${user}: ${message}`)
    });
    try {
      await this.connnection.start();
      console.log('Connected yo SignalR hub');
    } catch (error) {
      console.error('Failed to connect to SignalR hub', error);
    }
    this.getDataStorage();//oturumu yapan user bilgisini aldım
    // this.getMessages();
  }

  //oturum yapan kişinin adı gidiyor
  async sendMessage(user: string, message: string) {
    if (!user || !message) return;
    await this.connnection.invoke('SendMessage', user, message);
  }


  // getMessages() { //tüm mesajları aldım
  //   this.apiServiceMessage.get().subscribe((res: any) => {
  //     this.messageList = res;
  //     //console.log(this.messageList);

  //     if (this.findUser) { //receiverUserId veya senderUserId ile oturumu yapan userId aynı ise bilgileri getir 
  //       const userId = this.findUser.userId;
  //       this.messageList = this.messageList.filter(message => (message.receiverUserId === userId || message.senderUserId === userId));
  //     }

  //     console.log(this.messageList);

  //     this.apiServiceUSER.get().subscribe((res: any) => {
  //       this.userList = res;

  //     });
  //   })
  // }

  getUserName(id: any): string | undefined {// id sahibinin ismini döndür
    if (this.findUser && this.userList) {
      const matchingUser = this.userList.find(user => user.userId === id);
      return matchingUser ? matchingUser.userNameSurname : undefined;
    }
    return undefined;
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
      //console.log("this.findUser: ", this.findUser?.userNameSurname);
      this.user = this.findUser?.userNameSurname || ""; // Boş dize kullanılabilir 
      console.log("this.user: ", this.user);

    }
  }
  //SenderUserId : oturum yapan kişinin userId  
  //receiverUserId: ürünü satan kişinin userId

  saveMessages() { //database'e kaydettiriyorum
    // const senderUserId = this.findUser?.userId;
    // const receiverUserId = this.datafromProductDetail.userId;//satıcı userId
    // const messageText = this.message;

    // this.apiServiceMessage.post(senderUserId, receiverUserId, messageText).subscribe(
    //   (response) => {
    //     // Başarılı bir şekilde mesaj gönderildiğinde burası çalışacak
    //     console.log("Mesaj gönderildi:", response);
    //     // İsteğe bağlı olarak başka işlemler yapabilirsiniz
    //   },
    //   (error) => {
    //     // Mesaj gönderirken bir hata oluştuğunda burası çalışacak
    //     console.error("Mesaj gönderilirken hata oluştu:", error);
    //     // İsteğe bağlı olarak hata işleme adımları ekleyebilirsiniz
    //   }
    // );
  }
}
