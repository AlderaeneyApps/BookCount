import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe } from '@angular/common';
import { FormlyComponent } from '../../../formly';
import { SettingsFormService } from '../../../services/settings-form/settings-form.service';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Settings, SettingsKeys } from '../../../models';
import { SQLiteService } from '../../../sql-services/sqlite.service';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { ToastController } from '@ionic/angular/standalone';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Preferences } from '@capacitor/preferences';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { InitializeAppService } from '../../../sql-services/initialize.app.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss'],
  imports: [IonicModule, AsyncPipe, FormlyComponent, TranslocoPipe],
  providers: [SettingsFormService],
})
export class SettingsPageComponent implements OnInit, OnDestroy {
  public fields!: FormlyFieldConfig[];
  public model$!: Observable<Settings>;
  public form: FormGroup = new FormGroup({});

  @Output() reloadPage = new EventEmitter<void>();

  private destroy$: Subject<void> = new Subject();

  constructor(
    private formService: SettingsFormService,
    private sqliteService: SQLiteService,
    private toastController: ToastController,
    private transloco: TranslocoService,
    private initializeAppService: InitializeAppService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async ngOnInit() {
    this.model$ = this.formService.model$;
    this.formService.fields$
      .pipe(takeUntil(this.destroy$))
      .subscribe((fields: FormlyFieldConfig[]) => {
        this.fields = fields;
      });

    await this.setSettingsModel();
    this.formService.buildFields();
  }

  public modelChange(model: Settings) {
    Object.keys(model).forEach(async (key: string) => {
      switch (key) {
        case 'lang':
          const lang = model[key];
          if (lang) {
            this.transloco.setDefaultLang(lang);
            this.transloco.setActiveLang(lang);
            await this.savePreferences(key, lang);
          }
          break;
      }
    });
  }

  public async saveSqlDatabaseAsJSON() {
    const hasPermission = await this.getFileSystemPermission();
    if (!hasPermission) {
      const permissionGranted = await this.askForPermission();
      if (!permissionGranted) {
        await this.toastController.create({
          duration: 5000,
          message: this.transloco.translate('SETTINGS.PERMISSION_NOT_GRANTED'),
        });
        return;
      }
    }

    const exportedDB = await this.sqliteService.exportDb();
    await Filesystem.writeFile({
      data: exportedDB,
      path: 'BookCounter-exported-data.json',
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  }

  public async loadDatabaseJSON() {
    const hasPermission = await this.getFilePickerPermision();
    if (!hasPermission) {
      const permissionGranted = await this.requestFilePickerPermision();
      if (!permissionGranted) {
        await this.toastController.create({
          duration: 5000,
          message: this.transloco.translate('SETTINGS.PERMISSION_NOT_GRANTED'),
        });
        return;
      }
    }

    const pickedFiles = await FilePicker.pickFiles({
      limit: 1,
      types: ['application/json'],
      readData: true,
    });
    const file = pickedFiles.files[0];
    if (file.data) {
      const blob = this.base64ToBlob(file.data, 'application/json');
      const text = await blob.text();
      const json = JSON.parse(text);
      await this.sqliteService.importDb(JSON.stringify(json['export']));
      await this.initializeAppService.initializeApp();
      this.reloadPage.emit();
    }
  }

  private async getFilePickerPermision() {
    const hasPermission = await FilePicker.checkPermissions();
    const { accessMediaLocation } = hasPermission;
    return accessMediaLocation === 'granted';
  }

  private async requestFilePickerPermision() {
    const hasPermission = await FilePicker.requestPermissions();
    const { accessMediaLocation } = hasPermission;
    return accessMediaLocation === 'granted';
  }

  private async getFileSystemPermission() {
    const permissionStatus = await this.checkFileSystemPermission();

    const { publicStorage } = permissionStatus;
    return publicStorage === 'granted';
  }

  private async checkFileSystemPermission() {
    return await Filesystem.checkPermissions();
  }

  private async askForPermission() {
    const permissionStatus = await Filesystem.requestPermissions();
    const { publicStorage } = permissionStatus;
    return publicStorage === 'granted';
  }

  private async savePreferences(key: string, value: any) {
    await Preferences.set({
      key,
      value,
    });
  }

  private async getPreferences(key: string) {
    return await Preferences.get({
      key,
    });
  }

  private async setSettingsModel() {
    const model: Settings = {};
    for (const key of SettingsKeys) {
      const value = await this.getPreferences(key);
      model[key as keyof Settings] = value.value ?? undefined;
    }
    this.formService.setModel(model);
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length)
      .fill(0)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
}
