import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../supabase.service';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    // this.supabaseService.setData(this.UniqueCategoryIconList);
  }
  Itemsdata: any[] = []; //all Items data storing
  UniqueCategoryIconList: Array<string> = []; //for unique category

  //after view initialised
  async ngAfterViewInit() {
    this.carouselItems = document.querySelector('.carousel-items');
    await this.ItemsDataFetcher();
    // console.log(this.UniqueCategoryIconList);
  }

  // data fetching and initialising
  async ItemsDataFetcher() {
    try {
      const { data: ItemsRegistry } = await this.supabaseService.supabase
        .from('ItemsRegistry')
        .select('*');
      this.Itemsdata = ItemsRegistry;
      // console.log(this.Itemsdata);
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
  currentScrollLeft = 0;
  prevButtonVisible = false;
  carouselItems = document.querySelector('.carousel-items');
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
  cartClose() {
    document.getElementById('mySidepanel')?.classList.toggle('active');
  }
  cartOpen() {
    document.getElementById('mySidepanel')?.classList.toggle('active');
  }
  // for product details
  navigateToDetails(itemId: string) {
    console.log('clicked');

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
}
