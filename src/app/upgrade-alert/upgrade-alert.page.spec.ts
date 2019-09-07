import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeAlertPage } from './upgrade-alert.page';

describe('UpgradeAlertPage', () => {
  let component: UpgradeAlertPage;
  let fixture: ComponentFixture<UpgradeAlertPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeAlertPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeAlertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
