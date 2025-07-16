import { TestBed } from '@angular/core/testing';

import { VolumesFormService } from './volumes-form.service';

describe('VolumesFormService', () => {
  let service: VolumesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolumesFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
