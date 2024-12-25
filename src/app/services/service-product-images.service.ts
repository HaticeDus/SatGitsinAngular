import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceProductImagesService {

  private apiUrl = 'https://localhost:7131/api/ProductImages';

  constructor(private http: HttpClient) { }

  public get(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get(url);
  }



  //https://localhost:7131/api/ProductImages?ImageUrls=https%3A%2F%2Fapollo-ireland.akamaized.net%2Fv1%2Ffiles%2Fz44ttvtmfdp4-OLXAUTOTR%2Fimage%3Bs%3D780x0%3Bq%3D60
  //&ProductId=505
  public post(ImageUrls: any, ProductId: any): Observable<any> {

    const url = this.apiUrl + `?ImageUrls=${ImageUrls}&ProductId=${ProductId}`;

    console.log('post-productImages-url: ', url);
    return this.http.post(url, null);
  }
















}
