import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-volumes-home',
  templateUrl: './volumes-home.page.html',
  styleUrls: ['./volumes-home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule],
})
export class VolumesHomePage implements OnInit {
  constructor() {}

  ngOnInit() {
    return;
  }
}
