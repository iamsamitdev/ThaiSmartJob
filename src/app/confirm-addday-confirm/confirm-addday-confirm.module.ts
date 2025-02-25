import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfirmAdddayConfirmPage } from './confirm-addday-confirm.page';

const routes: Routes = [
  {
    path: '',
    component: ConfirmAdddayConfirmPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConfirmAdddayConfirmPage]
})
export class ConfirmAdddayConfirmPageModule {}
