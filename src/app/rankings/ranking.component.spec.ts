import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingsComponent } from './ranking.component';

describe('RankingsComponent', () => {
  let component: RankingsComponent;
  let fixture: ComponentFixture<RankingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankingsComponent]
    });
    fixture = TestBed.createComponent(RankingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});