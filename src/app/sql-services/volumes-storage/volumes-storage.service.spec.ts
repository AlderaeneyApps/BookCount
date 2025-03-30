import { TestBed } from '@angular/core/testing';

import { VolumesStorageService } from './volumes-storage.service';

describe('StorageService', () => {
  let service: VolumesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolumesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
