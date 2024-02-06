import { Component } from '@angular/core';
import { SupabaseService } from '../../supabase.service';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.css',
})
export class AdministrationComponent {
  receivedCategoryData: any[] = [];
  imagePreviews: string = '';
  imagePreviewsLink: string = '';
  id: string = '';
  name: string = '';
  category: string = '';
  price: number = 100;
  description: string = '';
  searchData: any[] = [];
  onchange() {
    this.imagePreviews = this.imagePreviewsLink;
  }
  constructor(private supabaseService: SupabaseService) {
    this.ItemsDataFetcher();
  }
  ngAfterViewInit() {}
  // category list fetching and initialising
  async ItemsDataFetcher() {
    try {
      const { data: ItemsRegistry } = await this.supabaseService.supabase
        .from('ItemsRegistry')
        .select('item_category');

      this.receivedCategoryData = [
        ...new Set(ItemsRegistry.map((element: any) => element.item_category)),
      ];
    } catch (error) {
      console.error('Error fetching items:', error); // Handle errors gracefully
    }
  }
  async searcher() {}
  async fetchItems() {
    let datas;
    try {
      if (this.id.length == 36) {
        const { data, error } = await this.supabaseService.supabase
          .from('ItemsRegistry')
          .select('*')
          .eq('item_id', this.id);

        if (error) {
          throw new Error('Error fetching items:', error);
        }
        datas = data;
      } else {
        const { data, error } = await this.supabaseService.supabase
          .from('ItemsRegistry')
          .select('*')
          .or(
            `item_name.ilike.${
              this.name ? '%' + this.name + '%' : ''
            },item_price.eq.${
              this.price ? this.price : 0
            },item_category.ilike.${
              this.category ? '%' + this.category + '%' : ''
            }`
          );
        if (error) {
          throw new Error('Error fetching items:', error);
        }
        datas = data;

        if (datas < 1) {
          alert('no data found');
        }
      }

      // console.log(datas.length,datas);
    } catch (error) {
      console.log(error);
    }
  }
}
