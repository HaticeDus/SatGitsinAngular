import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceProductService {

  private apiUrl = 'https://localhost:7131/api/Product';

  constructor(private http: HttpClient) { }

  public get(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get(url);
  }



  //https://localhost:7131/api/Product?ProductName=Profesyonel%20Ud&ProductPrice=10000
  //&ProductDescript=Saadettin%20SANDI%20%26%20Bahad%C4%B1r%20SANDI%20imalat%C4%B1%20ud%20Tekne%20%3A%20Maun%20G%C3%B6%C4%9F%C3%BCs%20%3A%20Ladin%20Burgular%20%3A%20Karbonfiber%20Klevye%20%3A%20Bobinga%202020%20yap%C4%B1m%C4%B1d%C4%B1r%20.
  //&ProductConditionId=1&UserId=701&CategoryId=9

  public post(ProductName: any, ProductPrice: any, ProductDescript: any, ProductConditionId: any, UserId: any, CategoryId: any): Observable<any> {

    const url = this.apiUrl + `?ProductName=${ProductName}&ProductPrice=${ProductPrice}&ProductDescript=${ProductDescript}&ProductConditionId=${ProductConditionId}&UserId=${UserId}&CategoryId=${CategoryId}`;

    console.log('------service kısmı------')
    console.log('',);
    console.log('post-product-url: ', url);

    return this.http.post(url, null);
  }














}
