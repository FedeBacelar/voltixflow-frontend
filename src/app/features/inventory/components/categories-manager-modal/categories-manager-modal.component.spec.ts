import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesManagerModalComponent } from './categories-manager-modal.component';

describe('CategoriesManagerModalComponent', () => {
  let component: CategoriesManagerModalComponent;
  let fixture: ComponentFixture<CategoriesManagerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesManagerModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoriesManagerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
