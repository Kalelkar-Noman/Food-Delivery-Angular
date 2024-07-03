import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-administration',
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
  price: number = 0;
  description: string = '';
  searchData: any[] = [];
  access = false;
  userToken = this.supabaseService.getCookieValue('Id');

  onchange() {
    this.imagePreviews = this.imagePreviewsLink;
  }
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.ItemsDataFetcher();
  }

  async ngOnInit() {
    // let MyRegistry: any[] = [];
    this.userToken = this.supabaseService.getCookieValue('Id');
    if (this.userToken && this.userToken != 'null') {
      let { data: MyRegistry, error } = await this.supabaseService.supabase
        .from('MyRegistry')
        .select('*')
        .eq('id', this.userToken);

      if (MyRegistry && MyRegistry.length > 0) {
        if (MyRegistry[0].access === 'admin') {
          this.access = true;
        } else {
          this.router.navigate(['HomePage/Administration']);
          // location.replace('/'); // Redirect if not admin
        }
      } else {
        this.router.navigate(['HomePage/Administration']);
      }
    } else {
      this.router.navigate(['HomePage/Administration']);
    }
  }
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
  async insertItems() {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from('ItemsRegistry')
        .insert([
          {
            item_name: this.name,
            item_price: this.price,
            item_image: this.imagePreviews,
            item_category: this.category,
            item_description: this.description,
          },
        ])
        .select();
      if (error) {
        throw new Error('Error fetching items:', error);
      } else {
        alert('data stored successfully');
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateItems() {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from('ItemsRegistry')
        .update([
          {
            item_name: this.name,
            item_price: this.price,
            item_image: this.imagePreviews,
            item_category: this.category,
            item_description: this.description,
          },
        ])
        .select()
        .eq('item_id', this.id);
      if (error) {
        throw new Error('Error fetching items:', error);
      } else {
        alert('data updated successfully');
      }
    } catch (error) {
      console.log(error);
    }
  }
  async deleteItems() {
    try {
      const { data, error } = await this.supabaseService.supabase
        .from('ItemsRegistry')
        .delete()
        .eq('item_id', this.id);
      if (error) {
        throw new Error('Error fetching items:', error);
      } else {
        alert('data deleted successfully');
      }
    } catch (error) {
      console.log(error);
    }
  }
  async fetchItems() {
    try {
      if (this.id.length == 36) {
        const { data, error } = await this.supabaseService.supabase
          .from('ItemsRegistry')
          .select('*')
          .eq('item_id', this.id);

        if (error) {
          throw new Error('Error fetching items:', error);
        }
        this.searchData = data;
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
        data;

        if (data < 1) {
          alert('no data found');
        }
        this.searchData = data;
      }
    } catch (error) {
      console.log(error);
    }
  }
  infoLoader(index: number) {
    this.id = this.searchData[index].item_id;
    this.category = this.searchData[index].item_category;
    this.price = this.searchData[index].item_price;
    this.description = this.searchData[index].item_description;
    this.imagePreviews = this.searchData[index].item_image;
    this.imagePreviewsLink = this.searchData[index].item_image;
  }
}
