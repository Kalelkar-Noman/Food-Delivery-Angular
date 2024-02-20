import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgFor, RouterLink, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Food-Delivery-Angular';
  access = false;
  isLoggedIn = false;
  userToken = this.supabaseService.getCookieValue('Id');
  Userpid: any;
  SearchItems: any[] = [];
  searchItemName: string = '';
  emailaddress: string = '';
  password: string = '';
  LogInBtn = true;
  yourAccessServiceSubscription: Subscription;
  yourIsLoggedInServiceSubscription: Subscription;
  // to access particular Cookie

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.yourAccessServiceSubscription =
      this.supabaseService.UserAccess.subscribe((data) => {
        this.access = data;
      });
    this.yourIsLoggedInServiceSubscription =
      this.supabaseService.UserLoggedInStatus.subscribe((data) => {
        this.isLoggedIn = data;
      });
  }

  async ngOnInit() {
    if (this.userToken && this.userToken != 'null') {
      try {
        let { data: MyRegistry, error } = await this.supabaseService.supabase
          .from('MyRegistry')
          .select('*')
          .eq('id', this.userToken);
        this.Userpid = MyRegistry[0];
        if (this.Userpid.access == 'admin') {
          this.supabaseService.setAccess(true);
        }
        this.supabaseService.setUserLoggedInStatus(true);

        this.supabaseService.setUserDetails(MyRegistry);
      } catch (error) {
        console.log(error);
      }
    } else {
      document.cookie =
        'Id=null; expires=Fri, 31 Dec 2060 23:59:59 GMT; path=/';
    }
  }

  // nav controls
  navOpenClose() {
    document.getElementById('nav-menu')?.classList.toggle('show-menu');
  }
  // login control
  loginClose() {
    document.getElementById('login')?.classList.remove('show-login');
  }
  loginOpen() {
    this.userToken = this.supabaseService.getCookieValue('Id');
    if (this.userToken && this.userToken != 'null') {
      this.router.navigate(['MYProfile']);
    } else {
      document.getElementById('login')?.classList.add('show-login');
    }
  }
  OpenSignUp() {
    document.getElementById('login')?.classList.remove('show-login');
    this.router.navigate(['SignUp']);
  }
  // search

  async onSearchSubmit() {
    // Perform search actions
    try {
      let { data: ItemsSearch, error } = await this.supabaseService.supabase
        .from('ItemsRegistry')
        .select('*')
        .ilike('item_name', `%${this.searchItemName}%`);
      this.SearchItems = ItemsSearch;
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }
  navigateToDetails(itemId: string) {
    document.getElementById('search')?.classList.remove('show-search');
    this.router.navigate(['ProductDetails', itemId]);
  }
  // search controls
  searchOpenClose() {
    document.getElementById('search')?.classList.toggle('show-search');
  }

  // Logger

  // Custom Validation
  RequiredValidate(): boolean {
    if (this.emailaddress.trim() != '' && this.password.trim() != '') {
      if (this.emailaddress) {
        const gmailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
        if (gmailRegex.test(this.emailaddress)) {
          return true;
        } else {
          alert('The email address is not valid');
        }
      }
    } else {
      alert('please fill both fields');
    }
    return false;
  }
  async logger() {
    if (this.RequiredValidate()) {
      this.LogInBtn = false;

      try {
        let { data: MyRegistry, error } = await this.supabaseService.supabase
          .from('MyRegistry')
          .select('*')
          .eq('user_email', this.emailaddress);
        if (
          MyRegistry.length > 0 &&
          MyRegistry[0].user_password == this.password
        ) {
          document.cookie = `Id=${MyRegistry[0].id}; expires=Fri, 31 Dec 2060 23:59:59 GMT; path=/`;
          document.getElementById('login')?.classList.remove('show-login');
          this.isLoggedIn = true;
          if (MyRegistry[0].access == 'admin') {
            this.supabaseService.setAccess(true);
            this.supabaseService.setUserLoggedInStatus(true);
          }
          this.supabaseService.setUserDetails(MyRegistry);
        }

        this.userToken = this.supabaseService.getCookieValue('Id');
        if (this.userToken == 'null') {
          alert('credentials not matched');
        }
        if (error) {
          alert('credentials not matched');
        }
      } catch (error) {
        console.log('error occured', error);
      }
      this.LogInBtn = true;
    }
  }
}
