import { TestBed } from '@angular/core/testing';

import { SeriesPicturesStorageService } from './series-pictures-storage.service';

describe('StorageService', () => {
  let service: SeriesPicturesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeriesPicturesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
