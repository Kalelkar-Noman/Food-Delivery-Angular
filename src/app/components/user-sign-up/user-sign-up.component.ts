import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

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
  ) {
    emailjs.init({
      publicKey: 'dDFXYIgZV1O0PWQR5',
    });
  }
  // OTP generation

  GenerateOtp() {
    if (this.emailaddress.length > 0 && this.name.length > 0) {
      if (this.emailaddress) {
        const gmailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (gmailRegex.test(this.emailaddress)) {
          let otp = '';
          for (let i = 0; i < 6; i++) {
            otp += Math.floor(Math.random() * 10); // Generate a random digit between 0 and 9
          }
          this.Otp = otp;
          emailjs
            .send('service_nhseehn', 'template_um2lkil', {
              to_name: this.name,
              message: this.Otp,
              to_email: this.emailaddress,
            })
            .then(
              (response) => {
                if (response.status === 200) {
                  // Check for success status code
                  alert('Otp Sent Successfully');
                } else {
                  console.error('Email sending failed:', response); // Log the response for debugging
                }
              }
              // Handle error in the catch block (unchanged)
            );
        } else {
          alert('The email address is not valid');
        }
      }
    } else {
      alert('Please enter the email address and name');
    }
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
