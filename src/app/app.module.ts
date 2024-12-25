import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ChatHubComponent } from './components/chat-hub/chat-hub.component';
import { MatInputModule } from '@angular/material/input';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule } from 'ngx-toastr'; // ngx-toastr'ı burada içe aktarın //önce  --> npm install ngx-toastr 
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { register } from 'swiper/element/bundle'; // import function to register Swiper custom elements
register();// register Swiper custom elements
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';


import { AddSellProductComponent } from './components/add-sell-product/add-sell-product.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProductHomeComponent } from './components/product-home/product-home.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { UserPrivatePageComponent } from './components/user-private-page/user-private-page.component';
import { ExampleComponent } from './components/example/example.component';



@NgModule({
  declarations: [
    AppComponent,
    ChatHubComponent,
    AddSellProductComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProductHomeComponent,
    ProductDetailComponent,
    UserPageComponent,
    UserPrivatePageComponent,
    ExampleComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    ScrollingModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    MatFormFieldModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatBadgeModule

  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
