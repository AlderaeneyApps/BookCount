import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgOptimizedImage } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Picture, Volume } from '../../../models';
import { FormGroup } from '@angular/forms';
import { FieldTypeConfig } from '@ngx-formly/core';
import { PicturesStorageService } from '../../../sql-services/pictures-storage/pictures-storage.service';

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
  public pictures!: Picture[];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private pictureStorage: PicturesStorageService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit() {
    const { id } = this.volume;

    await this.pictureStorage.getPictures(id!);

    this.pictureStorage
      .fetchPictures()
      .pipe(takeUntil(this.destroy$))
      .subscribe(pictures => {
        this.pictures = pictures;
      });
  }
}
