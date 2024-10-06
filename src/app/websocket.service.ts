import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private ws: WebSocket | undefined;
  private messages: Subject<any> = new Subject<any>();

  constructor() {
    this.connect();
  }

  private connect(): void {
    this.ws = new WebSocket('ws://192.168.1.8:81'); // Thay đổi IP và cổng nếu cần

    this.ws.onmessage = (event: MessageEvent) => {
      this.messages.next(event.data);
    };

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.ws.onerror = (error: Event) => {
      console.error('WebSocket error', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  public getMessages(): Observable<any> {
    return this.messages.asObservable();
  }

  public sendMessage(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  }
}
