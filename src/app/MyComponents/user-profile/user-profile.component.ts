import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';
import { Router } from '@angular/router';

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
    // this.ItemsDataFetcher();
  }
  getCookieValue(cookieName: string) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const [name, value] = cookies[i].split('=');
      if (name === cookieName) {
        return value;
      }
    }
    return null; // Cookie not found
  }
  userToken = this.getCookieValue('Id');
  async ngOnInit() {
    // let MyRegistry: any[] = [];
    this.userToken = this.getCookieValue('Id');
    if (this.userToken && this.userToken != 'null') {
      let { data: MyRegistry, error } = await this.supabaseService.supabase
        .from('MyRegistry')
        .select('*')
        .eq('id', this.userToken);
      this.phoneNumber = MyRegistry[0].user_phonenumber;
      this.emailaddress = MyRegistry[0].user_email;
      this.name = MyRegistry[0].user_name;
      this.passwordtext = MyRegistry[0].user_password;
      this.address = MyRegistry[0].user_address;
      this.city = MyRegistry[0].user_city;
      this.state = MyRegistry[0].user_state;
      this.country = MyRegistry[0].user_country;
      this.pincode = MyRegistry[0].user_pincode;
    } else {
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
