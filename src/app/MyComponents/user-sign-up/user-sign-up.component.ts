import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-user-sign-up',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css',
})
export class UserSignUpComponent {
  phoneNumber: number = 0;
  emailaddress = '';
  name = '';
  passwordtext = '';
  address = '';
  city = '';
  state = '';
  country = '';
  pincode = '';
  UserenteredOtp = '';
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}
  Otp = '';
  GenerateOtp() {
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
    }
    this.Otp = otp;
    alert(
      'Sorry our api limit reached we cannot send email as it is a dummy project its not a problem  Here is your OTP:' +
        this.Otp
    );
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
      console.log(MyRegistry);
      if (error) {
        console.log(error);
      }

      if (MyRegistry && MyRegistry.length > 0) {
        this.router.navigate(['/']);
      }
    }
  }
  async OnSubmit() {
    if (this.Otp == this.UserenteredOtp && this.Otp.length > 2) {
      try {
        const { data, error } = await this.supabaseService.supabase
          .from('MyRegistry')
          .insert([
            {
              user_name: this.name,
              user_password: this.passwordtext,
              user_email: this.emailaddress,
              user_phonenumber: this.phoneNumber,
              user_state: this.state,
              user_country: this.country,
              user_city: this.city,
              user_pincode: this.pincode,
            },
          ])
          .select();
        if (error) {
          alert('something went wrong looks please try again');
        } else {
          try {
            let { data: MyRegistry, error } =
              await this.supabaseService.supabase
                .from('MyRegistry')
                .select('*')
                .eq('user_email', this.emailaddress);
            document.cookie = `Id=${MyRegistry[0].id}; expires=Fri, 31 Dec 2060 23:59:59 GMT; path=/`;
            if (MyRegistry && MyRegistry.length > 0) {
              this.router.navigate(['/']);
            }
          } catch (error) {
            console.log('error occured');
          }
        }
      } catch (error) {
        alert(
          'something went wrong looks please try again with different email'
        );
      }
    } else {
      alert('OTP is incorrect');
    }
  }
}
