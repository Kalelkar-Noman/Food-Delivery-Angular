import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiCacheService {
  constructor() {}

  private cache: Map<string, any> = new Map();

  get(key: string) {
    return this.cache.get(key);
  }

  public set(key: string, value: any): void {
    this.cache.set(key, value);
  }
}
