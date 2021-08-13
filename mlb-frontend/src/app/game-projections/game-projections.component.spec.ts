import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameProjectionsComponent } from './game-projections.component';

describe('GameProjectionsComponent', () => {
  let component: GameProjectionsComponent;
  let fixture: ComponentFixture<GameProjectionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameProjectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameProjectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
