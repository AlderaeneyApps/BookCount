import { TestBed } from '@angular/core/testing';

import { SeriesStorageService } from './series-storage.service';

describe('StorageService', () => {
  let service: SeriesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeriesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
