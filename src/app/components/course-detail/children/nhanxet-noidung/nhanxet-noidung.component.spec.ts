import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhanxetNoidungComponent } from './nhanxet-noidung.component';

describe('NhanxetNoidungComponent', () => {
  let component: NhanxetNoidungComponent;
  let fixture: ComponentFixture<NhanxetNoidungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NhanxetNoidungComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NhanxetNoidungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
