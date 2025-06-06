import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoltixLayoutComponent } from './voltix-layout.component';

describe('VoltixLayoutComponent', () => {
  let component: VoltixLayoutComponent;
  let fixture: ComponentFixture<VoltixLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoltixLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VoltixLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
