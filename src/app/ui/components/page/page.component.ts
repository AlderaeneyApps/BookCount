import { Component, Input, OnInit } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslocoPipe } from '@jsverse/transloco';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  imports: [
    IonBackButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    TranslocoPipe,
    IonMenuButton,
  ],
})
export class PageComponent implements OnInit {
  @Input() title!: string;

  public showBackButton = false;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.showBackButton = this.router.navigated;
  }
}
