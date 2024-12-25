import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatHubComponent } from './components/chat-hub/chat-hub.component';
import { AddSellProductComponent } from './components/add-sell-product/add-sell-product.component';
import { AppComponent } from './app.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ProductHomeComponent } from './components/product-home/product-home.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ExampleComponent } from './components/example/example.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { UserPrivatePageComponent } from './components/user-private-page/user-private-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'chat', component: ChatHubComponent },
  { path: 'sell', component: AddSellProductComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'product/:categoryId', component: ProductHomeComponent },
  { path: 'productdetail/:productId', component: ProductDetailComponent },
  { path: 'example/:sellerUserId', component: ExampleComponent },
  { path: 'example', component: ExampleComponent },
  { path: 'userpage/:userId', component: UserPageComponent },
  { path: 'userpage', component: UserPageComponent },
  { path: 'userprivate', component: UserPrivatePageComponent },
  { path: 'userprivate/:userId', component: UserPrivatePageComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
