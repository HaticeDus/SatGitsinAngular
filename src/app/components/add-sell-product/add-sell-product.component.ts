import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ServiveCategoryService } from 'src/app/services/service-category.service';
import { ServiceProductConditionService } from 'src/app/services/service-product-condition.service';
import { ServiceProductService } from 'src/app/services/service-product.service';
import { ServiceProductImagesService } from 'src/app/services/service-product-images.service';
import { modelCategory } from 'src/app/models/modelCategory';
import { modelProductCondition } from 'src/app/models/modelProductCondition';
import { modelProduct } from 'src/app/models/modelProduct';
import { modelUser } from 'src/app/models/modelUser';
import { modelProductImage } from 'src/app/models/modelProductImage';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-sell-product',
  templateUrl: './add-sell-product.component.html',
  styleUrls: ['./add-sell-product.component.css']
})
export class AddSellProductComponent {

  findUser: modelUser | undefined; // Kullanıcı bilgilerini tutacak değişken
  loggedIn: boolean = false; // Kullanıcının giriş durumunu tutacak değişken

  // [(ngModel)] ile gelen veriler
  productName: string = '';
  productPrice: number = 0;
  productDescript: string = '';
  selectedproductConditionId: number = 1; // Default selected condition
  selectedcategoryId: number = 1; // Default selected category

  //Resim için
  //selectedImages: File[] = [];
  selectedImages: modelProductImage[] = [];
  previewImageUrls: string[] = [];
  repeatArray = Array(5).fill(null);// max  5 tane resim

  categoryList: modelCategory[] = [];
  productConditionList: modelProductCondition[] = [];
  productList: modelProduct[] = [];

  constructor(
    private apiServiceProduct: ServiceProductService,
    private apiServiceCategory: ServiveCategoryService,
    private apiServiceCatCondition: ServiceProductConditionService,
    private apiServiceProductImages: ServiceProductImagesService,
    private snackBar: MatSnackBar, // SnackBar için servis
    private ngZone: NgZone, // NgZone ekledik
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCategories();
    this.getProductConditions();
    this.getProducts();
    this.getDataStorage();// findUser getiriyo
    //this.addProduct();
  }

  getProducts() { //categoriler geldi
    this.apiServiceProduct.get().subscribe(res => {
      this.productList = res;
      // console.log("productList: ", this.productList);
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

 


  addProduct() {
    const UserId = this.findUser?.userId;
    console.log("UserId: ", UserId);

    this.apiServiceProduct.post(this.productName, this.productPrice, this.productDescript, this.selectedproductConditionId, UserId, this.selectedcategoryId)
      .subscribe(
        (product: modelProduct) => {
          console.log("Product added: ", product);

          this.uploadProductImages(product.productId); //yeni oluşan product'ın productId'sini gönder

          this.snackBar.open('Ürün başarıyla eklendi', 'Kapat', {
            duration: 3000,
            verticalPosition: 'top'
          }).afterDismissed().subscribe(() => {
            this.router.navigate(['/home']); // 'home' ürün kaydedildikten sonra home sayfasına yönlendir.
          });
        },
        error => {
          console.error("Error adding product: ", error);
          this.snackBar.open('Ürün eklenirken hata oluştu', 'Kapat', {
            duration: 3000,
            verticalPosition: 'top'

          });
        }
      );
  }

  onFileChange(event: any, index: number) {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageUrl = this.getPreviewImage(files[0]);// resmin url bilgisi alındı
      if (imageUrl) {
        this.selectedImages[index] = imageUrl; //resimlerin urlleri atandı
      }
      //Seçilen dosyanın önizleme URL'si hesaplanarak 'previewImageUrls' dizisine atanır.
      this.previewImageUrls[index] = this.getPreviewImage(files[0]);
    }


  }

  //ön izleme methodu
  getPreviewImage(image: File): any {
    return image ? URL.createObjectURL(image) : '';
    // URL.createObjectURL kullanarak dosyanın bir URL'sini oluşturur
  }


  uploadProductImages(productId: number) {
    //const formData = new FormData();

    for (const imageURL of this.selectedImages) {
      //formData.append('files', image, image.name);
      //console.log("imageURL:", imageURL);
      //console.log("this.selectedImages: ", this.selectedImages);
      this.apiServiceProductImages.post(imageURL, productId)//resim urlleri tek tek database kayıt ediliyor
        .subscribe(
          (images: modelProductImage[]) => {
            // console.log("Product images added: ", images);
            this.getProducts();
          },
          error => {
            console.error("Error adding product images: ", error);
            this.snackBar.open('Ürün resimleri eklenirken hata oluştu', 'Kapat', {
              duration: 3000,
              verticalPosition: 'top'
            });
          }
        );
    }

  }

  //KULLANICI LOGİN İŞLEMLERİ
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
      // console.log("this.findUser: ", this.findUser);
      //this.addProduct();//UserId için çağırdım //ngOnInite boş gelmesini sağlıyor engelle
    }
  }



  // // Dosya seçme işlemi gerçekleştiğinde çağrılan fonksiyon.
  // // Parametre olarak gelen 'event', seçilen dosyaları içerir.
  // // 'index' parametresi, hangi resim önizlemesinin güncelleneceğini belirtir.
  // onFileChange(event: any, index: number) {
  //   // Seçilen dosyaları 'files' değişkenine atar.
  //   const files = event.target.files;

  //   // Eğer dosya seçildiyse işleme devam edilir.
  //   if (files) {
  //     // Seçilen dosyanın 'index' numarasına karşılık gelen 'selectedImages' dizisine atanır.
  //     this.selectedImages[index] = files[0];

  //     // Seçilen dosyanın önizleme URL'si hesaplanarak 'previewImageUrls' dizisine atanır.
  //     this.previewImageUrls[index] = this.getPreviewImage(files[0]);
  //   }
  // }



  // // Dosya seçme işlemi gerçekleştiğinde çağrılan fonksiyon.
  // // Parametre olarak gelen 'event', seçilen dosyaları içerir.
  // // 'index' parametresi, hangi resim önizlemesinin güncelleneceğini belirtir.
  // onFileChange(event: any, index: number) {
  //   const files = event.target.files;

  //   // Eğer dosya seçildiyse işleme devam edilir.
  //   if (files) {
  //     // Seçilen her dosya, belirtilen 'index' numarasına karşılık gelen resim önizlemesine atanır.
  //     for (const file of files) {
  //       this.selectedImages[index] = file;
  //     }
  //   }
  // }

  // // Resim önizlemesi oluşturmak için kullanılan fonksiyon.
  // // Parametre olarak gelen 'image', gösterilmek istenen resim dosyasını içerir.
  // // Eğer 'image' varsa, resim için bir URL oluşturulur ve döndürülür.
  // // Eğer 'image' yoksa, boş bir dize döndürülür.
  // getPreviewImage(image: File): any {
  //   return image ? URL.createObjectURL(image) : '';
  // }


   // productConditions = [
  //   { ProductConditionId: 1, ProductCondition1: 'Yeni' },
  //   { ProductConditionId: 2, ProductCondition1: 'Yeni gibi' },
  //   { ProductConditionId: 3, ProductCondition1: 'İyi' },
  //   { ProductConditionId: 4, ProductCondition1: 'Makul' },
  //   { ProductConditionId: 5, ProductCondition1: 'Yıpranmış' }
  // ];
  // categories = [
  //   { CategoryId: 1, CategoryName: 'Araba' },
  //   { CategoryId: 2, CategoryName: 'Telefon' },
  //   { CategoryId: 3, CategoryName: 'Ev Eşyaları' },
  //   { CategoryId: 4, CategoryName: 'Elektronik' },
  //   { CategoryId: 5, CategoryName: 'Motosiklet' },
  //   { CategoryId: 6, CategoryName: 'Diğer Araçlar' },
  //   { CategoryId: 7, CategoryName: 'Bebek ve Çocuk' },
  //   { CategoryId: 8, CategoryName: 'Spor ve Outdoor' },
  //   { CategoryId: 9, CategoryName: 'Hobi ve Eğlence' },
  //   { CategoryId: 10, CategoryName: 'Giyim Aksesuar' }
  // ];

}


