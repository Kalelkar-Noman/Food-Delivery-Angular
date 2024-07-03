import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrl: './user-sign-up.component.css',
})
export class UserSignUpComponent {
  phoneNumber: number = 0;
  emailaddress: string = '';
  name: string = '';
  passwordtext: string = '';
  address: string = '';
  city: string = '';
  state: string = '';
  country: string = '';
  pincode = '';
  UserenteredOtp = '';
  Otp = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}
  // OTP generation

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

  userToken: any = '';
  async ngOnInit() {
    this.userToken = this.supabaseService.getCookieValue('Id');
    if (this.userToken && this.userToken != 'null') {
      let { data: MyRegistry, error } = await this.supabaseService.supabase
        .from('MyRegistry')
        .select('*')
        .eq('id', this.userToken);

      if (error) {
        console.log(error);
      }
      if (MyRegistry && MyRegistry.length > 0) {
        this.router.navigate(['/']);
      }
    }
  }
  RequiredValidate(): boolean {
    if (
      this.emailaddress.length > 0 &&
      this.passwordtext.length > 0 &&
      this.name.length > 0 &&
      this.UserenteredOtp.length > 0 &&
      this.phoneNumber > 0
    ) {
      if (this.emailaddress) {
        const gmailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (gmailRegex.test(this.emailaddress)) {
          return true;
        } else {
          alert('The email address is not valid');
        }
      }
    } else {
      alert('please fill all fields');
    }
    return false;
  }
  async OnSubmit() {
    if (this.RequiredValidate()) {
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
              this.supabaseService.setUserLoggedInStatus(true);

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
}
