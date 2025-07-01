import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VolumesHomePage } from './volumes-home.page';

describe('VolumesHomePage', () => {
  let component: VolumesHomePage;
  let fixture: ComponentFixture<VolumesHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumesHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
