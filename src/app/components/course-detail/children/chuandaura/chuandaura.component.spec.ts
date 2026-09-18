import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChuandauraComponent } from './chuandaura.component';

describe('ChuandauraComponent', () => {
  let component: ChuandauraComponent;
  let fixture: ComponentFixture<ChuandauraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChuandauraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChuandauraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
