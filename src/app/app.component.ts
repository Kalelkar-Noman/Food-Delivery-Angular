import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NgFor, RouterLink, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
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
  Userpid: any;
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}
  async ngAfterViewInit() {
    if (this.userToken && this.userToken != 'null') {
      let { data: MyRegistry, error } = await this.supabaseService.supabase
        .from('MyRegistry')
        .select('*')
        .eq('id', this.userToken);
      // console.log(MyRegistry);
      this.Userpid = MyRegistry[0];
      // console.log(this.Userpid);
      if (this.Userpid.access == 'admin') {
        this.access = true;
        this.isLoggedIn=true
      }else{
        this.isLoggedIn=true
      }
    } else {
      document.cookie =
        'Id=null; expires=Fri, 31 Dec 2060 23:59:59 GMT; path=/';
    }
  }
  title = 'Food-Delivery-Angular';
  access = false;
  isLoggedIn = false;
  // nav controls
  navOpen() {
    document.getElementById('nav-menu')?.classList.add('show-menu');
  }
  navClose() {
    document.getElementById('nav-menu')?.classList.remove('show-menu');
  }

  // login control
  loginClose() {
    document.getElementById('login')?.classList.remove('show-login');
  }
  loginOpen() {
    this.userToken = this.getCookieValue('Id');
    if (this.userToken && this.userToken != 'null') {
      // location.replace('/MYProfile');
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
  SearchItems: any[] = [];
  searchItemName: string = '';
  async onSearchKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // Perform actions when Enter is pressed
      console.log('enter clicked');
      try {
        let { data: ItemsSearch, error } = await this.supabaseService.supabase
          .from('ItemsRegistry')
          .select('*')
          .ilike('item_name', `%${this.searchItemName}%`);
        this.SearchItems = ItemsSearch;
        console.log(this.searchItemName);
        console.log(this.SearchItems);
      } catch (error) {
        console.error('Error fetching items:', error); // Handle errors gracefully
      }
    }
  }
  async onSearchKeyclick() {
    try {
      let { data: ItemsSearch, error } = await this.supabaseService.supabase
        .from('ItemsRegistry')
        .select('*')
        .ilike('item_name', `%${this.searchItemName}%`);
      this.SearchItems = ItemsSearch;
      console.log(this.searchItemName);
      console.log(this.SearchItems);
    } catch (error) {
      console.error('Error fetching items:', error); // Handle errors gracefully
    }
  }
  // search controls
  searchOpen() {
    document.getElementById('search')?.classList.add('show-search');
  }
  searchClose() {
    document.getElementById('search')?.classList.remove('show-search');
  }
  // search results
  searchData = [
    {
      imageaddress:
        'https://images.pexels.com/photos/13990979/pexels-photo-13990979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      name: 'rohan',
      price: 800,
    },
  ];
  // Logger
  emailaddress = '';
  password = '';
  async logger() {
    try {
      let { data: MyRegistry, error } = await this.supabaseService.supabase
        .from('MyRegistry')
        .select('*')
        .eq('user_email', this.emailaddress);
      if (MyRegistry && MyRegistry[0].user_password == this.password) {
        document.cookie = `Id=${MyRegistry[0].id}; expires=Fri, 31 Dec 2060 23:59:59 GMT; path=/`;
        document.getElementById('login')?.classList.remove('show-login');
        this.isLoggedIn = true;
        if (MyRegistry[0].access == 'admin') {
          this.access = true;
          this.isLoggedIn = true;
        }
      }
      this.userToken = this.getCookieValue('Id');
      if (this.userToken == 'null') {
        alert('credentials not matched');
      }
      if (error) {
        alert('credentials not matched');
      }
    } catch (error) {
      console.log('error occured');
    }
  }
}
