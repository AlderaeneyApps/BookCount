import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesFormV2Page } from './series-form-v2.page';

describe('SeriesFormV2Page', () => {
  let component: SeriesFormV2Page;
  let fixture: ComponentFixture<SeriesFormV2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesFormV2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
