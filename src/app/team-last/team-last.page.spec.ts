import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamLastPage } from './team-last.page';

describe('TeamLastPage', () => {
  let component: TeamLastPage;
  let fixture: ComponentFixture<TeamLastPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamLastPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamLastPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
