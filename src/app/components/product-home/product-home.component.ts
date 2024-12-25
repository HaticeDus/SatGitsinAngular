import { Component } from '@angular/core';
import { ServiveCategoryService } from 'src/app/services/service-category.service';
import { ServiceProductConditionService } from 'src/app/services/service-product-condition.service';
import { ServiceProductService } from 'src/app/services/service-product.service';
import { ServiceProductImagesService } from 'src/app/services/service-product-images.service';
import { modelCategory } from 'src/app/models/modelCategory';
import { modelProductCondition } from 'src/app/models/modelProductCondition';
import { modelProduct } from 'src/app/models/modelProduct';
import { modelUser } from 'src/app/models/modelUser';
import { modelProductImage } from 'src/app/models/modelProductImage';
import { Router } from '@angular/router';// url ile gönderme
import { ActivatedRoute } from '@angular/router'; //urlden gelen veriyi alma

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrls: ['./product-home.component.css']
})
export class ProductHomeComponent {

  categoryList: modelCategory[] = [];
  productConditionList: modelProductCondition[] = [];
  productList: modelProduct[] = [];
  productImageList: modelProductImage[] = [];
  SelectedCategoryId: any;

  constructor(
    private apiServiceProduct: ServiceProductService,
    private apiServiceCategory: ServiveCategoryService,
    private apiServiceCatCondition: ServiceProductConditionService,
    private apiServiceProductImages: ServiceProductImagesService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProductConditions();
    this.getProducts();
    this.getProductImages();

    this.getCategoryId();//app.ts menüden gelen categoryId 
  }


  getProducts() { //categoriler geldi
    this.apiServiceProduct.get().subscribe(res => {
      this.productList = res;
      // console.log("productList: ", this.productList);
    });
  }

  filterProductsByCategory(categoryId: number) {
    return this.productList.filter(item => item.categoryId === categoryId);
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
      // console.log("categoryList: ", this.categoryList);
    });
  }

  getProductConditions() { //product condition geldi
    this.apiServiceCatCondition.get().subscribe(res => {
      this.productConditionList = res;
      // console.log("productConditionList: ", this.productConditionList);
    });
  }

  getCategoryId() { //app.ts menüden gelen categoryId 
    this.route.params.subscribe(params => {
      this.SelectedCategoryId = +params['categoryId']; // "+" ile stringi number'a çeviriyoruz
      //console.log("this.SelectedCategoryId: ", this.SelectedCategoryId);
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



  
  onCardClicked(productId: any) {
    // this.cardClicked.emit(); // carda tıkladığımda productId verisini gönderiyor
    this.router.navigate(['/productdetail', productId]);
  }

}
