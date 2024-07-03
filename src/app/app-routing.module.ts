import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { UserOrderHistoryComponent } from './components/user-order-history/user-order-history.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { UserSignUpComponent } from './components/user-sign-up/user-sign-up.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'HomePage',
  },
  {
    path: 'Contact-Us',
    component: ContactUsComponent,
    title: 'Contact-Us',
  },
  {
    path: 'CheckOut',
    component: CheckoutComponent,
    title: 'CheckOut',
  },
  {
    path: 'HomePage/Administration',
    component: AdministrationComponent,
    title: 'Adminitration',
  },

  {
    path: 'OrderHistory',
    component: UserOrderHistoryComponent,
    title: 'Order History',
  },
  {
    path: 'MYProfile',
    component: UserProfileComponent,
    title: 'MyProfile',
  },
  {
    path: 'ProductDetails/:itemId',
    component: ProductDetailComponent,
    title: 'ProductDetails',
  },
  {
    path: 'SignUp',
    component: UserSignUpComponent,
    title: 'SignUp',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
