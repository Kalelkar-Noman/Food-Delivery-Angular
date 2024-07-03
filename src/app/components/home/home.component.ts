import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  Itemsdata: any[] = []; //all Items data storing
  UniqueCategoryIconList: Array<string> = []; //for unique category
  currentScrollLeft = 0;
  prevButtonVisible = false;
  carouselItems = document.querySelector('.carousel-items');
  myCartArrayOfObjects: any[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  //after view initialised
  async ngAfterViewInit() {
    this.carouselItems = document.querySelector('.carousel-items');
    await this.ItemsDataFetcher();
    let localItem = localStorage.getItem('myCartData');
    if (localItem != null) {
      this.myCartArrayOfObjects = JSON.parse(localItem);
    }
  }

  // data fetching and initialising
  async ItemsDataFetcher() {
    try {
      const { data: ItemsRegistry } = await this.supabaseService.supabase
        .from('ItemsRegistry')
        .select('*');
      this.Itemsdata = ItemsRegistry;

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
  // carousel sliding

  // Handle next button click:
  carouselNextBtnClick() {
    // let innerCon = carouselItems?.querySelector('.inner-con');
    let itemWidth = (
      this.carouselItems?.querySelector('.inner-con') as HTMLElement
    )?.offsetWidth;
    this.currentScrollLeft += itemWidth;
    let maxScrollLeft = this.carouselItems
      ? this.carouselItems?.scrollWidth - this.carouselItems?.clientWidth
      : 0;
    this.currentScrollLeft = Math.min(this.currentScrollLeft, maxScrollLeft);
    this.carouselItems?.scrollTo({
      left: this.currentScrollLeft,
      behavior: 'smooth', // Enable smooth scrolling
    });
    this.prevButtonVisible = true;
    let prevElement = document.getElementById('carousel-prev');
    if (prevElement) {
      prevElement.style.visibility = 'visible';
    }
  }
  // Handle prev button click:
  carouselPrevBtnClick() {
    let itemWidth = (
      this.carouselItems?.querySelector('.inner-con') as HTMLElement
    )?.offsetWidth;
    this.currentScrollLeft -= itemWidth;
    // Limit scrolling to prevent going beyond the start
    this.currentScrollLeft = Math.max(this.currentScrollLeft, 0);
    this.carouselItems?.scrollTo({
      left: this.currentScrollLeft,
      behavior: 'smooth',
    });
    // Hide prev button if scrolled back to start
    if (this.currentScrollLeft === 0) {
      this.prevButtonVisible = false;
      let prevElement = document.getElementById('carousel-prev');
      if (prevElement) {
        prevElement.style.visibility = 'hidden';
      }
    }
  }
  // for cart
  cartOpenClose() {
    document.getElementById('mySidepanel')?.classList.toggle('active');
  }

  // for product details
  navigateToDetails(itemId: string) {
    this.router.navigate(['ProductDetails', itemId]);
  }
  async selectedCategoryLoad(i: Number = -1, item: string = '*') {
    const categorys = document.querySelectorAll('.inner-con');
    localStorage.setItem('catid', `Inner_Menu${i}`);
    categorys.forEach((cat) => {
      cat.classList.remove('inner-con-active');
    });
    document
      .getElementById(`Inner_Menu${i}`)
      ?.classList.add('inner-con-active');
    try {
      if (item == '*') {
        const { data: ItemsRegistry } = await this.supabaseService.supabase
          .from('ItemsRegistry')
          .select('*');
        this.Itemsdata = ItemsRegistry;
      } else {
        const { data: ItemsRegistry } = await this.supabaseService.supabase
          .from('ItemsRegistry')
          .select('*')
          .eq('item_category', item);
        this.Itemsdata = ItemsRegistry;
      }
    } catch (error) {
      console.error('Error fetching items:', error); // Handle errors gracefully
    }
  }
  // cart

  addToCart(product: any, e: Event) {
    e.stopPropagation();
    e.preventDefault();
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
        // document.getElementById('mySidepanel')?.classList.add('active');
      }
    } else {
      this.myCartArrayOfObjects.push(mycartobj);

      localStorage.setItem(
        'myCartData',
        JSON.stringify(this.myCartArrayOfObjects)
      );
      // document.getElementById('mySidepanel')?.classList.add('active');
    }
    document.getElementById('mySidepanel')?.classList.toggle('active');
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
        break;
      }
    }
  }
}
