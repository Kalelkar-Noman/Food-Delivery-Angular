import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdministrationComponent } from './components/administration/administration.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { HomeComponent } from './components/home/home.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { UserOrderHistoryComponent } from './components/user-order-history/user-order-history.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserSignUpComponent } from './components/user-sign-up/user-sign-up.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AdministrationComponent,
    CheckoutComponent,
    ContactUsComponent,
    HomeComponent,
    ProductDetailComponent,
    UserOrderHistoryComponent,
    UserProfileComponent,
    UserSignUpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterOutlet,
    NgIf,
    NgFor,
    RouterLink,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
