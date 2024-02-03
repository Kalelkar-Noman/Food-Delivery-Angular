import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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
  constructor(private supabaseService: SupabaseService) {}
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
  // login control
  loginClose() {
    document.getElementById('login')?.classList.remove('show-login');
  }
  loginOpen() {
    document.getElementById('login')?.classList.add('show-login');
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
}
