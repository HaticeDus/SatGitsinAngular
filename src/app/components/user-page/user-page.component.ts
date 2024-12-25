import { Component } from '@angular/core';
import { ServiceProductService } from 'src/app/services/service-product.service';
import { ServiceProductImagesService } from 'src/app/services/service-product-images.service';
import { ServiceUserService } from 'src/app/services/service-user.service';
import { modelProduct } from 'src/app/models/modelProduct';
import { modelProductImage } from 'src/app/models/modelProductImage';
import { modelUser } from 'src/app/models/modelUser';
import { ActivatedRoute } from '@angular/router'; //urlden gelen veriyi alma
import { Router } from '@angular/router';// url ile gönderme


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent {

  productList: modelProduct[] = [];
  productImageList: modelProductImage[] = [];
  userList: modelUser[] = [];
  user: modelUser | undefined;
  sendingUserId: any;

  constructor(
    private apiServiceProduct: ServiceProductService,
    private apiServiceProductImages: ServiceProductImagesService,
    private apiServiceUSER: ServiceUserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getProducts();
    this.getProductImages();
    this.getUsers();
    this.getUserId();

  }


  getProducts() { //categoriler geldi
    this.apiServiceProduct.get().subscribe(res => {
      this.productList = res;
      // console.log("productList: ", this.productList);
    });
  }
  getProductImages() { //categoriler geldi
    this.apiServiceProductImages.get().subscribe(res => {
      this.productImageList = res;
      //console.log("productImageList: ", this.productImageList);
    });
  }
  getUsers() { //get users list
    this.apiServiceUSER.get().subscribe((res: any) => {
      this.userList = res;
      // console.log(this.userList);
      this.getUserId(); //bu method da userList ulaşmak için çağırdım
    });
  }

  getUserId() { //productDetail'den gelen userId  ile productListen user çeken method
    this.route.params.subscribe(params => {
      this.sendingUserId = +params['userId']; // "+" ile stringi number'a çeviriyoruz
      //console.log("this.sendingUserId: ", this.sendingUserId)
    });

    this.user = this.userList.find(user => user.userId === this.sendingUserId);
  }

  onCardClicked(productId: any) {
    // this.cardClicked.emit(); // carda tıkladığımda productId verisini gönderiyor
    this.router.navigate(['/productdetail', productId]);
  }

  // Bu metod, verilen productId değerine sahip bir ürünün productImageList içinde mevcut olup olmadığını kontrol eder.
  hasMatchingImage(productId: number): boolean {
    return this.productImageList.some(item => item.productId === productId);
  }

  // Bu metod, verilen productId değerine sahip bir ürünün productImageList içinde bulunursa, ilgili ürünün ilk imageUrls bilgisini döndürür. 
  getMatchingImageUrl(productId: number): string | undefined {
    const matchingItem = this.productImageList.find(item => item.productId === productId);
    return matchingItem ? matchingItem.imageUrls : undefined;// Eğer ürün bulunmazsa undefined döner.
  }

  // Tarih verisini istenilen formata dönüştüren fonksiyon
  formatListingDate(listingDate: string): string {
    // Şu anki tarih ve saat (UTC)
    const now = new Date();
    
    // Gelen tarihi UTC formatına çevir
    const listingDateObj = new Date(listingDate + 'Z'); // 'Z' UTC formatını belirtir
    
    // Tarihler arasındaki farkı hesapla (milisaniye cinsinden)
    const timeDifference = now.getTime() - listingDateObj.getTime();

    // Bir günün milisaniye cinsinden süresi
    const oneDayInMillis = 24 * 60 * 60 * 1000;

    // Bugünse 'Bugün' olarak dön
    if (timeDifference < oneDayInMillis && now.getDate() === listingDateObj.getDate()) {
      return 'Bugün';
    }
    // Dünse 'Dün' olarak dön
    else if (timeDifference < 2 * oneDayInMillis && now.getDate() - listingDateObj.getDate() === 1) {
      return 'Dün';
    }
    // 7 gün içindeyse 'X gün önce' olarak dön
    else if (timeDifference < 7 * oneDayInMillis) {
      const daysAgo = Math.floor(timeDifference / oneDayInMillis);
      return `${daysAgo} gün önce`;
    }
    // Diğer durumlar için tarihi biçimlendir
    else {
      // Ay adlarını içeren bir dizi oluştur
      const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];

      // Biçimlendirilmiş tarih oluştur
      const formattedDate = `${listingDateObj.getDate()} ${months[listingDateObj.getMonth()]}`;
      return formattedDate;
    }
}

}
