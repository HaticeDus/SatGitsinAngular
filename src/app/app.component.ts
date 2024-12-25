import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ServiveCategoryService } from './services/service-category.service';
import { modelCategory } from 'src/app/models/modelCategory';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { modelUser } from './models/modelUser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SatGitsinAngular';
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';


  findUser: modelUser | undefined; // oturumu yapan Kullanıcı bilgilerini tutacak değişken
  loggedIn: boolean = false; // Kullanıcının giriş durumunu tutacak değişken

  categoryList: modelCategory[] = [];

  constructor(
    private apiServiceCATEGORY: ServiveCategoryService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  goToHome() {
    // this.router.navigate(['home']);
    // window.location.href = "http://localhost:4200/home";
    window.location.href = "home";

  }
  ngOnInit() {
    this.getCategories();
    this.getDataStorage();// findUser getiriyor
  }


  getCategories() {
    this.apiServiceCATEGORY.get().subscribe(
      (response: any) => {
        this.categoryList = response;
        //console.log(this.categoryList);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


  onMenuClicked(categoryId: any) {
    // this.cardClicked.emit(); // carda tıkladığımda productId verisini product-home'a gönderiyor
    this.router.navigate(['product/', categoryId]);
  }

  //------------------------LOGOUT------------------------
  openSnackBar() {
    const snackBarRef = this._snackBar.open('Çıkış Yapmak İstediğinize Emin misiniz?', 'Çıkış Yap', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5000, // Snackbar'ın görüntülenme süresi (ms cinsinden)
      panelClass: ['logout-snackbar'], // Özel sınıf adı
    });

    snackBarRef.onAction().subscribe(() => {
      this.logout(); // Bildirim kutusunda "Çıkış Yap" düğmesine tıklandığında logout() yöntemini çağır
    });
  }
  // Çıkış yap ve sessionStorage'ı temizle
  logout() {
    this.findUser = undefined; // Kullanıcı verisini sıfırla
    sessionStorage.clear(); // SessionStorage'ı temizle
    localStorage.removeItem('loggedInUser'); // localStorage'deki veriyi sil
    this.loggedIn = false; // Kullanıcı giriş yapmamış olarak işaretlenir
    this.router.navigate(['/home']); // Anasayfaya yönlendir
    window.location.reload(); //çıkış yap sayfayı yenile
  }


  //------------------------LOGIN------------------------

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
      // console.log("oturumu yapan kişi bilgileri: ", this.findUser);
    }
  }
}
