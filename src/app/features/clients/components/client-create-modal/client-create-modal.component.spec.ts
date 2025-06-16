import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCreateModalComponent } from './client-create-modal.component';

describe('ClientCreateModalComponent', () => {
  let component: ClientCreateModalComponent;
  let fixture: ComponentFixture<ClientCreateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCreateModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientCreateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
