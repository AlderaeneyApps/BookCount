import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.scss'],
  imports: [IonicModule, ModalComponent],
})
export class ImageModalComponent {
  @Input() pictures!: string[] | null | undefined;
  @Input() alt!: string | null | undefined;

  public showModal: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public openModal() {
    this.showModal.next(true);
  }
}
