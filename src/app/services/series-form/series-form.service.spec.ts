import { TestBed } from '@angular/core/testing';

import { SeriesFormService } from './series-form.service';

describe('VolumesFormService', () => {
  let service: SeriesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeriesFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
