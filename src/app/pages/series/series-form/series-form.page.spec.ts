import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesFormPage } from './series-form.page';

describe('SeriesFormPage', () => {
  let component: SeriesFormPage;
  let fixture: ComponentFixture<SeriesFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
