import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServeChatHubService {

  private hubConnection: HubConnection;
  private messageReceivedSource = new Subject<any>();

  messageReceived$ = this.messageReceivedSource.asObservable();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7131/chat') // SignalR hub URL
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (user, message) => {
      this.messageReceivedSource.next({ user, message });
    });

    this.startConnection();
  }

  private async startConnection() {
    try {
      await this.hubConnection.start();
      console.log('Connected to SignalR hub');
    } catch (err) {
      console.error('Error while starting SignalR connection:', err);
    }
  }

  sendMessage(user: string, message: string) {
    this.hubConnection.invoke('SendMessage', user, message);
  }
}
