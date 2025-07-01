import { TestBed } from '@angular/core/testing';

import { VolumeListItemFormService } from './volume-list-item-form.service';

describe('VolumeListItemFormService', () => {
  let service: VolumeListItemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolumeListItemFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
