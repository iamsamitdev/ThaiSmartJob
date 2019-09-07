import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab5Page } from './tab5.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab5Page }]),
    TranslateModule
  ],
  declarations: [Tab5Page],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class Tab5PageModule { }
