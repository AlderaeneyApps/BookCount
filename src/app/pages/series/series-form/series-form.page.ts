import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageComponent } from '../../../ui/components/page/page.component';

@Component({
  selector: 'app-series-form',
  templateUrl: './series-form.page.html',
  styleUrls: ['./series-form.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PageComponent],
})
export class SeriesFormPage implements OnInit {
  public title!: string;

  constructor() {}

  ngOnInit() {}
}
