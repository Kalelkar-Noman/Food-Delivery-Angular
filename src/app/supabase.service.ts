import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { createClient } from '@supabase/supabase-js';
// import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  supabase: any;
  constructor() {
    try {
      this.supabase = createClient(
        environment.supabaseUrl,
        environment.supabaseKey
      );
    } catch (error) {
      console.log(error);
    }
  }
  // private dataSource = new BehaviorSubject<any[]>([]);
  // data$ = this.dataSource.asObservable();
  // setData(data: any[]) {
  //   this.dataSource.next(data);
  // }
}
