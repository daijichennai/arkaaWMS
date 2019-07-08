import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListpickPage } from './listpick';

@NgModule({
  declarations: [
    ListpickPage,
  ],
  imports: [
    IonicPageModule.forChild(ListpickPage),
  ],
})
export class ListpickPageModule {}
