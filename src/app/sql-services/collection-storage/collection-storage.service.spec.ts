import { TestBed } from '@angular/core/testing';

import { CollectionStorageService } from './collection-storage.service';

describe('StorageService', () => {
  let service: CollectionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
