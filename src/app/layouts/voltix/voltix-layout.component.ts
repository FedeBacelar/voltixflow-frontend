import { Component } from '@angular/core';
import {SidebarComponent} from "./components/sidebar/sidebar.component";
import {NavbarComponent} from "./components/navbar/navbar.component";
import {RouterOutlet} from "@angular/router";
import {ToastContainerComponent} from "../../shared/components/toast-container.component";

@Component({
  selector: 'app-voltix-layout',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    RouterOutlet,
    ToastContainerComponent
  ],
  templateUrl: './voltix-layout.component.html',
  styleUrl: './voltix-layout.component.scss'
})
export class VoltixLayoutComponent {

}
