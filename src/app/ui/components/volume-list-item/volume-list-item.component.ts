import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { Observable, Subject } from 'rxjs';
import { Volume } from '../../../models';
import { FormGroup } from '@angular/forms';
import { FieldTypeConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-volume-list-item',
  templateUrl: './volume-list-item.component.html',
  styleUrls: ['./volume-list-item.component.scss'],
  imports: [IonicModule, NgOptimizedImage, TranslocoPipe],
})
export class VolumeListItemComponent implements OnInit, OnDestroy {
  @Input() public volume!: Volume;

  public form: FormGroup = new FormGroup({});
  public fields$!: Observable<FieldTypeConfig[]>;
  public model$!: Observable<Volume>;

  private destroy$: Subject<void> = new Subject<void>();

  constructor() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    return;
  }
}
