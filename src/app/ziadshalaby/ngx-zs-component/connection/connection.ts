import { Component, effect, output, signal } from '@angular/core';

@Component({
  selector: 'ZS-connection',
  imports: [],
  templateUrl: './connection.html',
  styleUrl: './connection.css'
})
export class Connection {
  readonly isOnline = signal<boolean>(true);
  readonly isOnlineEv = output<boolean>();

  private onlineListener = () => this.isOnline.set(true);
  private offlineListener = () => this.isOnline.set(false);

  constructor() {
    this.checkOnline();

    window.addEventListener('online', this.onlineListener);
    window.addEventListener('offline', this.offlineListener);

    effect(() => {
      const status = this.isOnline();
      this.isOnlineEv.emit(status);
    })
  }

  private checkOnline() {
    if(navigator.onLine) this.onlineListener()
    else this.offlineListener()
  }
}
