import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
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
  async logInUser(emailaddress: string, password: string) {
    let cookieValue = 'null';
    try {
      let { data: MyRegistry, error } = await this.supabase
        .from('MyRegistry')
        .select('*')
        .eq('user_email', emailaddress);
      if (MyRegistry.length > 0 && MyRegistry[0].user_password == password) {
        document.cookie = `Id=${MyRegistry[0].id}; expires=Fri, 31 Dec 2060 23:59:59 GMT; path=/`;
        document.getElementById('login')?.classList.remove('show-login');
        this.setUserLoggedInStatus(true);
        if (MyRegistry[0].access == 'admin') {
          this.setAccess(true);
          this.setUserLoggedInStatus(true);
        }
        this.setUserDetails(MyRegistry);
      }
      cookieValue = this.getCookieValue('Id') || 'null';
      if (cookieValue == 'null') {
        alert('credentials not matched');
      }
      if (error) {
        alert('credentials not matched');
      }
    } catch (error) {
      console.log('error occured', error);
    }
    return cookieValue ? cookieValue : 'null';
  }
}
