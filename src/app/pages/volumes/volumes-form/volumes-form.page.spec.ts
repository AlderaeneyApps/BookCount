import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolumesFormPage } from './volumes-form.page';

describe('VolumesFormPage', () => {
  let component: VolumesFormPage;
  let fixture: ComponentFixture<VolumesFormPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumesFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
