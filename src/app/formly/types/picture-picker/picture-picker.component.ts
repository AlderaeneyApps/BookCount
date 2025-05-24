import { Component } from '@angular/core';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { IonicModule } from '@ionic/angular';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
  Camera,
  CameraPermissionType,
  CameraResultType,
  PermissionStatus,
} from '@capacitor/camera';
import { FormColumnProps } from '../../models';

export interface PicturePickerOptions extends FormColumnProps {
  labelHeader: string;
  labelPhoto: string;
  labelCancel: string;
  labelTakePicture: string;
}

@Component({
  selector: 'app-picture-picker',
  templateUrl: './picture-picker.component.html',
  styleUrls: ['./picture-picker.component.scss'],
  imports: [IonicModule, TranslocoPipe],
})
export class PicturePickerComponent extends FieldType<FieldTypeConfig<PicturePickerOptions>> {
  constructor(private translate: TranslocoService) {
    super();
  }

  public async pickImage() {
    const hasPermission: boolean = await this.checkPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      width: 512,
      promptLabelHeader: this.translate.translate(this.props.labelHeader),
      promptLabelCancel: this.translate.translate(this.props.labelCancel),
      promptLabelPhoto: this.translate.translate(this.props.labelPhoto),
      promptLabelPicture: this.translate.translate(this.props.labelTakePicture),
    });

    // get base64 image data
    const imageData = image.base64String;

    // set the formControl value
    this.formControl.setValue(imageData);
  }

  /**
   * Get permissions and check if they've been granted or ask otherwise
   * Return true if it has permission or false if not granted
   * @private
   */
  private async checkPermissions(): Promise<boolean> {
    const hasPermissions: PermissionStatus = await Camera.checkPermissions();

    const { photos, camera } = hasPermissions;

    const permissions: CameraPermissionType[] = [];
    if (photos !== 'granted' && photos !== 'limited') {
      permissions.push('photos');
    }

    if (camera !== 'granted' && camera !== 'limited') {
      permissions.push('camera');
    }

    if (permissions.length > 0) {
      const grantedPermission: PermissionStatus = await Camera.requestPermissions({
        permissions,
      });

      const { photos: grantedPhotos, camera: grantedCamera } = grantedPermission;
      return !(
        (grantedPhotos !== 'granted' && grantedPhotos !== 'limited') ||
        (grantedCamera !== 'limited' && grantedCamera !== 'granted')
      );
    }

    return true;
  }
}
