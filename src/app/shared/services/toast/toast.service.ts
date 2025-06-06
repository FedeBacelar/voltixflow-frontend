import { Injectable, signal } from '@angular/core';

type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _messages = signal<ToastMessage[]>([]);

  messages = this._messages.asReadonly();

  show(message: string, type: ToastType = 'info') {
    this._messages.update(msgs => [...msgs, { message, type }]);

    setTimeout(() => {
      this._messages.update(msgs => msgs.slice(1));
    }, 4000);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }
}
