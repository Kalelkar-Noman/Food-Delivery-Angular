import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private supabaseService: SupabaseService) {}
  Itemsdata: any[] = []; //all Items data storing
  UniqueCategoryIconList: Array<string> = []; //for unique category

  //after view initialised
  async ngAfterViewInit() {
    await this.ItemsDataFetcher();
    console.log(this.UniqueCategoryIconList);
  }

  // data fetching and initialising
  async ItemsDataFetcher() {
    try {
      const { data: ItemsRegistry } = await this.supabaseService.supabase
        .from('ItemsRegistry')
        .select('*');
      this.Itemsdata = ItemsRegistry;
      console.log(this.Itemsdata);
      this.UniqueCategoryIconList = [
        ...new Set(this.Itemsdata.map((element) => element.item_category)),
      ];
    } catch (error) {
      console.error('Error fetching items:', error); // Handle errors gracefully
    }
  }

  // For category Icon placing
  categoryIcon(category: string): string {
    // this.categoryIconlist.push(category);
    switch (category.toLocaleLowerCase()) {
      case 'sushi':
        return '🍣';
      case 'burger':
        return '🍔';
      case 'pizza':
        return '🍕';
      case 'veg':
        return '🍀';
      default:
        return '';
    }
  }
}
