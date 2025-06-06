import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastContainerComponent} from "./shared/components/toast-container.component";
import {AuthService} from "./core/services/auth.service";
import {ToastService} from "./shared/services/toast/toast.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast-container></app-toast-container>
  `,
})
export class AppComponent {
  constructor() {
  }
}
