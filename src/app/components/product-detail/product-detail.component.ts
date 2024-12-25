import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ServiveCategoryService } from 'src/app/services/service-category.service';
import { ServiceProductConditionService } from 'src/app/services/service-product-condition.service';
import { ServiceProductService } from 'src/app/services/service-product.service';
import { ServiceProductImagesService } from 'src/app/services/service-product-images.service';
import { ServiceUserService } from 'src/app/services/service-user.service';
import { modelCategory } from 'src/app/models/modelCategory';
import { modelProductCondition } from 'src/app/models/modelProductCondition';
import { modelProduct } from 'src/app/models/modelProduct';
import { modelUser } from 'src/app/models/modelUser';
import { modelProductImage } from 'src/app/models/modelProductImage';

import { Router } from '@angular/router'; // url ile gönderme
import { ActivatedRoute } from '@angular/router'; //urlden gelen veriyi alma
import { MatDialog } from '@angular/material/dialog';
import Swiper from 'swiper';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent {

  findUser: modelUser | undefined; // oturumu yapan Kullanıcı bilgilerini tutacak değişken
  loggedIn: boolean = false; // Kullanıcının giriş durumunu tutacak değişken

  categoryList: modelCategory[] = [];
  productConditionList: modelProductCondition[] = [];
  productList: modelProduct[] = [];
  productImageList: modelProductImage[] = [];
  userList: modelUser[] = [];

  SelectedProductID: any;// gelen id yi tutan değişken
  findedProduct: modelProduct | undefined; // findedProduct bilgilerini tutacak değişken

  imageUrlsArray: any[] = []; //her product için imageUrls dizi

  constructor(
    private apiServiceProduct: ServiceProductService,
    private apiServiceCategory: ServiveCategoryService,
    private apiServiceCatCondition: ServiceProductConditionService,
    private apiServiceProductImages: ServiceProductImagesService,
    private apiServiceUSER: ServiceUserService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProductConditions();
    this.getProducts();
    this.getProductImages();
    this.getProductID();
    this.getUsers();
    this.getDataStorage();//oturum yapan kişinin bilgilerini al
  }
  getProductID() {
    this.route.params.subscribe(params => {
      this.SelectedProductID = +params['productId']; // "+" ile stringi number'a çeviriyoruz
      console.log("this.SelectedProductID: ", this.SelectedProductID)

      this.apiServiceProduct.get().subscribe(res => {
        this.productList = res; //productList erişemediğim için tekrardan çağırdım

        this.findedProduct = this.productList.find(item => item.productId === this.SelectedProductID);
        //console.log("this.productList: ", this.productList);
        // findedProduct değeri güncellendi, burada işlemleri yapabiliriz
        if (this.findedProduct) {
          // findedProduct'ın productId'si ile eşleşen productImageList içindeki verileri bul
          const matchingImages = this.productImageList.filter(item => item.productId === this.findedProduct?.productId);

          // matchingImages dizisinden sadece imageUrls verilerini içeren yeni bir dizi oluştur
          this.imageUrlsArray = matchingImages.map(item => item.imageUrls);
          //console.log("Matching Images:", this.imageUrlsArray);
        }
      });

    });
  }
  onUserBtnClicked(userId: any) { //buton tıklandğında kullanıcının id'si gitsin genel userpage'e gitsin
    this.router.navigate(['/userpage', userId]);
  }
  onMsgBtnClicked(sellerUserId: any) { //buton tıklandğında kullanıcının id'si gitsin genel userpage'e gitsin
    this.router.navigate(['/example', sellerUserId]);
  }
  onUserPrivClicked(userId: any) {//msg butona tıkladığımda ürün sahibinin priv hesabına userId bilgisi gönderiliyor
    this.router.navigate(['/userprivate', userId]);
  }
  getProducts() { //categoriler geldi
    this.apiServiceProduct.get().subscribe(res => {
      this.productList = res;
      //console.log("productList: ", this.productList);
    });
  }
  getProductImages() { //categoriler geldi
    this.apiServiceProductImages.get().subscribe(res => {
      this.productImageList = res;
      //console.log("productImageList: ", this.productImageList);
    });
  }
  getCategories() { //categoriler geldi
    this.apiServiceCategory.get().subscribe(res => {
      this.categoryList = res;
      //console.log("categoryList: ", this.categoryList);
    });
  }
  getProductConditions() { //product condition geldi
    this.apiServiceCatCondition.get().subscribe(res => {
      this.productConditionList = res;
      //console.log("productConditionList: ", this.productConditionList);
    });
  }
  getUsers() { //get users list
    this.apiServiceUSER.get().subscribe((res: any) => {
      this.userList = res;
      // console.log(this.userList);
    });
  }
  // Bu metod, verilen productId değerine sahip bir ürünün productImageList içinde mevcut olup olmadığını kontrol eder.
  hasMatchingImage(productId: number): boolean {
    return this.productImageList.some(item => item.productId === productId);
  }
  getMatchingImageUrl(productId: number): string | undefined {
    // Bu metod, verilen productId değerine sahip bir ürünün productImageList içinde bulunursa, ilgili ürünün ilk imageUrls bilgisini döndürür. 
    const matchingItem = this.productImageList.find(item => item.productId === productId);
    return matchingItem ? matchingItem.imageUrls : undefined;// Eğer ürün bulunmazsa undefined döner.
  }
  // Tarih verisini istenilen formata dönüştüren fonksiyon
  formatListingDate(listingDate: any): string {
    // Şu anki tarih
    const today = new Date();
    const listingDateObj = new Date(listingDate); // Gelen string tarihini Date nesnesine çevir
    // Tarihler arasındaki farkı hesapla (gün cinsinden)
    const differenceInDays = Math.floor((today.getTime() - listingDateObj.getTime()) / (1000 * 3600 * 24));

    // Bugünse 'Bugün' olarak dön
    if (differenceInDays === 0) {
      return 'Bugün';
    }
    // 7 gün içindeyse 'X gün önce' olarak dön
    else if (differenceInDays <= 7) {
      return `${differenceInDays} gün önce`;
    }
    // 7 gün geçtiyse tarihi biçimlendir
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
  getCategoryNameForProduct(): string | undefined { // category name
    if (this.findedProduct && this.categoryList) {
      const matchingCategory = this.categoryList.find(category => category.categoryId === this.findedProduct?.categoryId);
      return matchingCategory ? matchingCategory.categoryName : undefined;
    }
    return undefined;
  }
  getCategoryConditionName(): string | undefined {//  category condition name

    if (this.findedProduct && this.productConditionList) {
      const matchingCategoryCondition = this.productConditionList.find(category => category.productConditionId === this.findedProduct?.productConditionId);
      return matchingCategoryCondition ? matchingCategoryCondition.productCondition1 : undefined;
    }
    return undefined;
  }
  getUserName(): string | undefined {//  ürünün sahibini getir
    if (this.findedProduct && this.userList) {
      const matchingUser = this.userList.find(user => user.userId === this.findedProduct?.userId);
      return matchingUser ? matchingUser.userNameSurname : undefined;
    }
    return undefined;
  }
  isCurrentUserSeller(): boolean { //oturum sahibinden message buton saklama
    return this.findedProduct?.userId === this.findUser?.userId;
  }
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
      //console.log("oturumu yapan kişi bilgileri: ", this.findUser);
    }

  }
}
