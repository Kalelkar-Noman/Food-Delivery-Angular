import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  phoneNumber: number = 0;
  emailaddress = '';
  name = '';
  passwordtext = '';
  address = '';
  city = '';
  state = '';
  country = '';
  pincode = '';
  edit = false;
  passVisibility: string = 'password';
  togglePassVisibility() {
    if (this.passVisibility == 'text') {
      this.passVisibility = 'password';
    } else {
      this.passVisibility = 'text';
    }
  }
  editEnable() {
    this.edit = true;
  }
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    supabaseService.UserDetails.forEach((data) => {});

    this.yourServiceSubscription = this.supabaseService.UserDetails.subscribe(
      (data) => {
        if (data && data.length > 0) {
          this.phoneNumber = data[0].user_phonenumber || '';
          this.emailaddress = data[0].user_email || '';
          this.name = data[0].user_name || '';
          this.passwordtext = data[0].user_password || '';
          this.address = data[0].user_address || '';
          this.city = data[0].user_city || '';
          this.state = data[0].user_state || '';
          this.country = data[0].user_country || '';
          this.pincode = data[0].user_pincode || '';
        }
      }
    );
  }

  userToken = this.supabaseService.getCookieValue('Id');
  yourServiceSubscription: Subscription;
  async ngOnInit() {
    this.userToken = this.supabaseService.getCookieValue('Id');
    if (!this.userToken && this.userToken == 'null') {
      location.replace('/');
    }
  }
  // Log Off
  LogOut() {
    document.cookie = `Id=null;path=/`;
    this.supabaseService.setAccess(false);
    this.supabaseService.setUserDetails([]);
    this.supabaseService.setUserLoggedInStatus(false);
    this.router.navigate(['/']);
  }
}
