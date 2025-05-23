import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionFormV2Page } from './collection-form-v2.page';

describe('CollectionFormV2Page', () => {
  let component: CollectionFormV2Page;
  let fixture: ComponentFixture<CollectionFormV2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionFormV2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
