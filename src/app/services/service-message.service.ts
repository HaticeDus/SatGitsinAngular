import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceMessageService {

  private apiUrl = 'https://localhost:7131/api/Message';
  constructor(private http: HttpClient) { }


  public get(): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.get(url);
  }


  //https://localhost:7131/api/Message?SenderUserId=701&ReceiverUserId=700&MessageText=Merhabalarr

  public post(SenderUserId: any, ReceiverUserId: any, MessageText: any): Observable<any> {

    const url = this.apiUrl + `?SenderUserId=${SenderUserId}&ReceiverUserId=${ReceiverUserId}&MessageText=${MessageText}`;

    console.log('message-url: ', url);
    return this.http.post(url, null);
  }


}
