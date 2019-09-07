import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConfirmPaymentPage } from './confirm-payment.page';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: ConfirmPaymentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule ,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConfirmPaymentPage]
})
export class ConfirmPaymentPageModule { }
