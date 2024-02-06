import { Routes } from '@angular/router';
import { HomeComponent } from './MyComponents/home/home.component';
import { ContactUsComponent } from './MyComponents/contact-us/contact-us.component';
import { CheckoutComponent } from './MyComponents/checkout/checkout.component';
import { AdministrationComponent } from './MyComponents/administration/administration.component';
import { UserOrderHistoryComponent } from './MyComponents/user-order-history/user-order-history.component';
import { UserProfileComponent } from './MyComponents/user-profile/user-profile.component';
import { ProductDetailComponent } from './MyComponents/product-detail/product-detail.component';
import { UserSignUpComponent } from './MyComponents/user-sign-up/user-sign-up.component';

export const routes: Routes = [
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
