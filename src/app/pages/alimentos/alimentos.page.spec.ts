import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlimentosPage } from './alimentos.page';

describe('AlimentosPage', () => {
  let component: AlimentosPage;
  let fixture: ComponentFixture<AlimentosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlimentosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
