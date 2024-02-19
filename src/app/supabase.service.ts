import { Injectable } from '@angular/core';
import { environment } from './environments/environment';
import { createClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
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
  // Reusable Code
  // UserManagement Code
  private _UserAccess = new BehaviorSubject<boolean>(false);
  UserAccess = this._UserAccess.asObservable();
  setAccess(data: boolean) {
    this._UserAccess.next(data);
  }
  private _UserLoggedInStatus = new BehaviorSubject<boolean>(false);
  UserLoggedInStatus = this._UserLoggedInStatus.asObservable();
  setUserLoggedInStatus(data: boolean) {
    this._UserLoggedInStatus.next(data);
  }
  private _UserDetails = new BehaviorSubject<any[]>([]);
  UserDetails = this._UserDetails.asObservable();
  setUserDetails(data: any[]) {
    this._UserDetails.next(data);
  }
  getCookieValue(cookieName: string) {
    const cookies = document.cookie.split('; ');
    for (let i = 0; i < cookies.length; i++) {
      const [name, value] = cookies[i].split('=');
      if (name === cookieName) {
        return value;
      }
    }
    return null; // Cookie not found
  }
}
