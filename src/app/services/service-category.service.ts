import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiveCategoryService {

  private apiUrl = 'https://localhost:7131/api/Category';

  constructor(private http: HttpClient) { }

  public get(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get(url);
  }
}
