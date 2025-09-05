import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonicModule, IonModal } from '@ionic/angular';
import { TranslocoPipe } from '@jsverse/transloco';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [IonicModule, TranslocoPipe],
})
export class ModalComponent implements OnInit, OnDestroy {
  @ViewChild(IonModal) modal!: IonModal;

  @Input() title!: string;
  @Input() showModal!: BehaviorSubject<boolean>;

  private firstInit = false;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.showModal
      .asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (show: boolean) => {
        if (show) {
          await this.modal.present();
        } else {
          if (this.firstInit) {
            await this.modal.dismiss(undefined, 'cancel');
          }
        }
        this.firstInit = true;
        this.cdRef.markForCheck();
      });
  }

  public async cancel() {
    await this.modal.dismiss(null, 'cancel');
  }
}
