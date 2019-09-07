import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotiUpgradePage } from './noti-upgrade.page';

describe('NotiUpgradePage', () => {
  let component: NotiUpgradePage;
  let fixture: ComponentFixture<NotiUpgradePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotiUpgradePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotiUpgradePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
