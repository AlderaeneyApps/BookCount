import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CollectionStorageService } from '../../../sql-services/collection-storage/collection-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTION_TYPE } from '../../../models';

@Component({
  selector: 'app-collection-form',
  templateUrl: './collection-form.page.html',
  styleUrls: ['./collection-form.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
  ],
})
export class CollectionFormPage implements OnInit {
  public mode: ACTION_TYPE = ACTION_TYPE.CREATE;
  public isCreation: boolean = true;
  public form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });
  public loadingData: boolean = true;

  constructor(
    private collectionStorageService: CollectionStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) {
    this.mode = this.route.snapshot.data['mode'];
    this.isCreation = this.mode === ACTION_TYPE.CREATE;
  }

  ngOnInit() {
    if (this.isCreation) {
    } else {
    }
  }

  public submit() {
    this.form.updateValueAndValidity();
    if (this.form.invalid) {
      return;
    }
  }
}
