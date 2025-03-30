import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriesHomePage } from './series-home.page';

describe('SeriesHomePage', () => {
  let component: SeriesHomePage;
  let fixture: ComponentFixture<SeriesHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
