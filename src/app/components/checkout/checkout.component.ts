import { Component } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  user_name = '';
  user_phonenumber = 0;
  user_address = '';
  total_price = 0;
  userToken = this.supabaseService.getCookieValue('Id');
  myCartArrayOfObjects: any[] = [];
  constructor(private supabaseService: SupabaseService) {}

  totalUpdate() {
    let localItem = localStorage.getItem('myCartData');
    let myCartArray = [];
    if (localItem != null) {
      myCartArray = JSON.parse(localItem);
      this.total_price = 0;
      myCartArray.forEach((elem: any) => (this.total_price += elem.price));
    } else {
      this.total_price = 0;
    }
  }

  async ngAfterViewInit() {
    this.userToken = this.supabaseService.getCookieValue('Id');
    try {
      let localItem = localStorage.getItem('myCartData');
      if (localItem != null) {
        this.myCartArrayOfObjects = JSON.parse(localItem);
        this.myCartArrayOfObjects.forEach(
          (elem) => (this.total_price += elem.price)
        );
      }

      const { data: MyRegistry } = await this.supabaseService.supabase
        .from('MyRegistry')
        .select('*')
        .eq('id', this.userToken);

      this.user_address = MyRegistry[0].user_address;
      this.user_name = MyRegistry[0].user_name;
      this.user_phonenumber = MyRegistry[0].user_phonenumber;
    } catch (error) {
      console.error('Error fetching items:', error); // Handle errors gracefully
    }
  }

  addToCart(product: any) {
    let mycartobj = {
      id: product.item_id,
      name: product.item_name,
      img: product.item_image,
      oldprice: product.item_price,
      price: product.item_price,
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
        document.getElementById('mySidepanel')?.classList.add('active');
      }
    } else {
      this.myCartArrayOfObjects.push(mycartobj);

      localStorage.setItem(
        'myCartData',
        JSON.stringify(this.myCartArrayOfObjects)
      );
      document.getElementById('mySidepanel')?.classList.add('active');
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
          this.totalUpdate();
          break;
        }

        this.myCartArrayOfObjects[i].price =
          parseInt(this.myCartArrayOfObjects[i].oldprice) *
          parseInt(this.myCartArrayOfObjects[i].quantity);
        // Save updated cart data to localStorage
        localStorage.setItem(
          'myCartData',
          JSON.stringify(this.myCartArrayOfObjects)
        );
        this.totalUpdate();
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

        localStorage.setItem(
          'myCartData',
          JSON.stringify(this.myCartArrayOfObjects)
        );
        this.totalUpdate();
        break;
      }
    }
  }
}
