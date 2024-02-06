import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../supabase.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [NgIf],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  image = '';
  name = '';
  price = 0;
  description = '';
  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute
  ) {}
  dataAvailable = false;
  itemId = this.route.snapshot.params['itemId'];
  async ngOnInit() {
    this.itemId = this.route.snapshot.params['itemId'];
    if (this.itemId != null) {
      this.dataAvailable = true;
      this.dataFetcher();
    }
  }
  async dataFetcher() {
    try {
      const { data: ItemsRegistry, error } = await this.supabaseService.supabase
        .from('ItemsRegistry')
        .select('*')
        .eq('item_id', this.itemId);
      this.image = ItemsRegistry[0].item_image;
      this.name = ItemsRegistry[0].item_name;
      this.price = ItemsRegistry[0].item_price;
      this.description = ItemsRegistry[0].item_description;
    } catch (error) {
      console.log(error);
    }
  }
}
