import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageComponent } from '../../../ui/components/page/page.component';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-series-home',
  templateUrl: './series-home.page.html',
  styleUrls: ['./series-home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, PageComponent],
})
export class SeriesHomePage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
