import { TestBed } from '@angular/core/testing';

import { SettingsFormService } from './settings-form.service';

describe('SettingsFormService', () => {
  let service: SettingsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
