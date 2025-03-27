import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionsHomePage } from './collections-home.page';

describe('CollectionsHomePage', () => {
  let component: CollectionsHomePage;
  let fixture: ComponentFixture<CollectionsHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionsHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
