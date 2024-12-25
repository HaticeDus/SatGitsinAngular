import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; // yönlendirme işlemi
import { ServiceUserService } from 'src/app/services/service-user.service';
import { modelUser } from 'src/app/models/modelUser';

@Component({
  selector: 'app-user-private-page',
  templateUrl: './user-private-page.component.html',
  styleUrls: ['./user-private-page.component.css']
})

export class UserPrivatePageComponent {
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
    this.getUsers();
  }//ngOnInit end


  getUsers() { //get users list
    this.apiServiceUSER.get().subscribe(
      (response: any) => {
        this.userList = response;
       // console.log(this.userList);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  async initForm() {
    this.registerForm = this.formBuilder.group({
      //userId: null,
      userNameSurname: ['', [Validators.required, Validators.maxLength(30)]],
      userEmail: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(70)])],
      userAbout: ['', Validators.compose([Validators.required, Validators.maxLength(90)])],
      userTel: ['', [Validators.required, Validators.maxLength(10)]],
      userAdress: ['', Validators.compose([Validators.required, Validators.maxLength(150)])],
      userPassword: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{10,}')])],
    });

    this.formInitialized = true; // Form başlatıldı

  }

  addUser() { //adress ve kullanıcıyı aynı anda ekleyen fonksiyon

    console.log("this.registerForm.value: ", this.registerForm.value);
    console.log("\n\n\n\nthis.formInitialized :", this.formInitialized + "\n" + "this.registerForm.valid :", this.registerForm.valid);
    const userNameSurname = this.registerForm.value.userNameSurname;
    const userEmail = this.registerForm.value.userEmail;
    const userAbout = this.registerForm.value.userAbout;
    const userTel = this.registerForm.value.userTel;
    const userAdress = this.registerForm.value.userAdress;
    const userPassword = this.registerForm.value.userPassword;

    if (this.formInitialized /*&& this.registerForm.valid*/) {
      this.apiServiceUSER.post(userNameSurname,userEmail,userAbout,userTel,userAdress,userPassword)
        .subscribe({
          next: (res) => {
            
            this.toaster.success('Please contact admin for enable access', 'Registered Successfully');
            console.log('Please contact admin for enable access', 'Registered Successfully');
            this.router.navigate(['home']);
          }
        });
    }
    else {
      this.toaster.warning('Please check your data! and enter valid data.');
      console.log("Please check your data! and enter valid data. ");
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  isPasswordHintVisible(): boolean {
    const passwordControl = this.registerForm.get('password');
    return !!passwordControl?.invalid && (passwordControl.dirty || passwordControl.touched);
  }
}
