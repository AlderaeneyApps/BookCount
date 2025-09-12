import { TestBed } from '@angular/core/testing';

import { VolumesPicturesStorageService } from './volumes-pictures-storage.service';

describe('StorageService', () => {
  let service: VolumesPicturesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolumesPicturesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
