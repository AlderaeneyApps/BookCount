import { TestBed } from '@angular/core/testing';

import { PicturesStorageService } from './pictures-storage.service';

describe('StorageService', () => {
  let service: PicturesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PicturesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
