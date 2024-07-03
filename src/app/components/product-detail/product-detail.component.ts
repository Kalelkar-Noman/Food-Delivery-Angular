import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  image = '';
  name = '';
  price = 0;
  description = '';
  dataAvailable = false;
  itemId = this.route.snapshot.params['itemId'];
  product: any[] = [];
  ProductQuantity = 1;
  isAddClicked = false;
  myCartArrayOfObjects: any[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.itemId = this.route.snapshot.params['itemId'];
    if (this.itemId != null) {
      this.dataAvailable = true;
      this.dataFetcher();
    }
  }
  //after view initialised
  async ngAfterViewInit() {
    let localItem = localStorage.getItem('myCartData');
    if (localItem != null) {
      this.myCartArrayOfObjects = JSON.parse(localItem);
      for (let i = 0; i < this.myCartArrayOfObjects.length; i++) {
        if (this.myCartArrayOfObjects[i].id === this.itemId) {
          this.ProductQuantity = this.myCartArrayOfObjects[i].quantity;
          if (this.ProductQuantity > 0) {
            this.isAddClicked = true;
          }
        }
      }
    }
  }

  async dataFetcher() {
    try {
      const { data: ItemsRegistry, error } = await this.supabaseService.supabase
        .from('ItemsRegistry')
        .select('*')
        .eq('item_id', this.itemId);

      this.product = ItemsRegistry;
      this.image = ItemsRegistry[0].item_image;
      this.name = ItemsRegistry[0].item_name;
      this.price = ItemsRegistry[0].item_price;
      this.description = ItemsRegistry[0].item_description;
    } catch (error) {
      console.log(error);
    }
  }

  addBtnClicked() {
    this.isAddClicked = true;
    this.addToCart(this.product);
  }

  addToCart(product: any) {
    let mycartobj = {
      id: product[0].item_id,
      name: product[0].item_name,
      img: product[0].item_image,
      oldprice: product[0].item_price,
      price: product[0].item_price,
      quantity: 1,
    };
    let isDuplicate = false;
    if (this.myCartArrayOfObjects.length > 0) {
      isDuplicate = this.myCartArrayOfObjects.some(
        (obj) => obj.id == mycartobj.id
      );
      if (!isDuplicate) {
        this.myCartArrayOfObjects = [...this.myCartArrayOfObjects, mycartobj];
        localStorage.setItem(
          'myCartData',
          JSON.stringify(this.myCartArrayOfObjects)
        );
      }
    } else {
      this.myCartArrayOfObjects.push(mycartobj);
      localStorage.setItem(
        'myCartData',
        JSON.stringify(this.myCartArrayOfObjects)
      );
    }
  }
  minusbtn(id: any) {
    for (let i = 0; i < this.myCartArrayOfObjects.length; i++) {
      if (this.myCartArrayOfObjects[i].id === id) {
        this.myCartArrayOfObjects[i].quantity -= 1;

        if (this.myCartArrayOfObjects[i].quantity <= 0) {
          // Update price and display
          this.myCartArrayOfObjects.splice(i, 1);

          localStorage.setItem(
            'myCartData',
            JSON.stringify(this.myCartArrayOfObjects)
          );
          this.isAddClicked = false;
          break;
        }
        this.myCartArrayOfObjects[i].price =
          parseInt(this.myCartArrayOfObjects[i].oldprice) *
          parseInt(this.myCartArrayOfObjects[i].quantity);
        this.ProductQuantity = this.myCartArrayOfObjects[i].quantity;
        // Save updated cart data to localStorage
        localStorage.setItem(
          'myCartData',
          JSON.stringify(this.myCartArrayOfObjects)
        );
        break; // Exit the loop after finding and processing the item
      }
    }
  }
  plusbtn(id: any) {
    for (let i = 0; i < this.myCartArrayOfObjects.length; i++) {
      if (this.myCartArrayOfObjects[i].id == id) {
        this.myCartArrayOfObjects[i].quantity =
          parseInt(this.myCartArrayOfObjects[i].quantity) + 1;
        this.myCartArrayOfObjects[i].price =
          parseInt(this.myCartArrayOfObjects[i].oldprice) *
          parseInt(this.myCartArrayOfObjects[i].quantity);
        this.ProductQuantity = this.myCartArrayOfObjects[i].quantity;
        localStorage.setItem(
          'myCartData',
          JSON.stringify(this.myCartArrayOfObjects)
        );
        break;
      }
    }
  }
}
