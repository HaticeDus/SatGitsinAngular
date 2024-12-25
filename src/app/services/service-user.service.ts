import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServiceUserService {

  private apiUrl = 'https://localhost:7131/api/User';

  constructor(private http: HttpClient) { }


  public get(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get(url);
  }


  //https://localhost:7131/api/User?UserNameSurname=S%C3%BCleyman%20Demir&UserEmail=demir21%40example.com&UserAbout=Antikac%C4%B1&UserTel=5641238564&UserAdress=Osmangazi%2FBursa&UserPassword=antikAci0%5E
  public post(userNameSurname: any, userEmail: any, userAbout: any, userTel: any, userAdress: any, userPassword: any): Observable<any> {

    const url = this.apiUrl + `?UserNameSurname=${userNameSurname}&UserEmail=${userEmail}&UserAbout=${userAbout}&UserTel=${userTel}&UserAdress=${userAdress}&UserPassword=${userPassword}`;

    console.log('------service kısmı------')
    console.log('',);
    console.log('post-kullanıcılar-url: ', url);

    return this.http.post(url, null);
  }











}
