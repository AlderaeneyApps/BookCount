import { Component, OnDestroy, OnInit } from '@angular/core';
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

  private destroy$: Subject<void> = new Subject();

  constructor(
    private formService: SettingsFormService,
    private sqliteService: SQLiteService,
    private toastController: ToastController,
    private transloco: TranslocoService,
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
}
