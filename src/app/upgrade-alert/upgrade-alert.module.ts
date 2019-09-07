import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UpgradeAlertPage } from './upgrade-alert.page';

const routes: Routes = [
  {
    path: '',
    component: UpgradeAlertPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UpgradeAlertPage]
})
export class UpgradeAlertPageModule {}
