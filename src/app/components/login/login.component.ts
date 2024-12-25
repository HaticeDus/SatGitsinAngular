import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; // yönlendirme işlemi
import { ServiceUserService } from 'src/app/services/service-user.service';
import { modelUser } from 'src/app/models/modelUser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userList: modelUser[] = [];
  registerForm!: FormGroup;
  showPassword: boolean = false;
  formInitialized: boolean = false; // Form başlatıldı mı kontrolü


  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToastrService,
    private router: Router,
    private apiServiceUSER: ServiceUserService,
  ) { }

  ngOnInit(): void {
    this.initForm(); //asenkron olarak yapılabileceği olasılığına karşı kontrol
  }//ngOnInit end




  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  isPasswordHintVisible(): boolean {
    const passwordControl = this.registerForm.get('password');
    return !!passwordControl?.invalid && (passwordControl.dirty || passwordControl.touched);
  }



  async initForm() {
    this.registerForm = this.formBuilder.group({
      //userId: null,
      // userNameSurname: ['', [Validators.required, Validators.maxLength(30)]],
      userEmail: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(70)])],
      //userAbout: ['', Validators.compose([Validators.required, Validators.maxLength(90)])],
      //userTel: ['', [Validators.required, Validators.maxLength(10)]],
      //userAdress: ['', Validators.compose([Validators.required, Validators.maxLength(150)])],
      userPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{10,}')])],
    });

    this.formInitialized = true; // Form başlatıldı

  }





  loginUser() { //user control

    const userEmail = this.registerForm.value.userEmail;
    const userPassword = this.registerForm.value.userPassword;
    this.apiServiceUSER.get().subscribe(res => {
      this.userList = res;
      // console.log("this.userList: ", this.userList);

      // Kullanıcı listesinde email ve password ile eşleşen bir kullanıcı var mı kontrol ediyoruz
      const findUser = this.userList.find((user) => user.userEmail === userEmail && user.userPassword === userPassword);// gelen kullanıcının nesnesi

      console.log("findUser: ", findUser);

      if (findUser) {
        console.log("kullanıcı bulundu");
        this.toaster.success('HOŞGELDİN !' + "     " + findUser.userNameSurname.toUpperCase(), 'GİRİŞ BAŞARILI');
        sessionStorage.setItem('userID', findUser.userId.toString());
        //sessionStorage.setItem('role', findUser.role);

        // JSON dizesine dönüştür ve localStorage'e kaydet
        localStorage.setItem('loggedInUser', JSON.stringify(findUser));

        // Toast kutucuğunu görüntüledikten 2 saniye sonra anasayfaya yönlendir
        setTimeout(() => {
          this.router.navigate(['home']).then(() => {
            window.location.reload(); // Sayfayı yenileyerek home sayfasına yönlendir
          });
        }, 1000); // 1 saniye (1000 milisaniye) bekleyecek
      }
      else {
        this.toaster.warning('Böyle Bir Hesap Bulunamadı!')
      }
    }, (error) => {
      console.log("API çağrısı sırasında bir hata oluştu:", error);
    });



  }//end userLogin
}
