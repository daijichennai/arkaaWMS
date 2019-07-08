import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PickdetailsPage } from './pickdetails';

@NgModule({
  declarations: [
    PickdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PickdetailsPage),
  ],
})
export class PickdetailsPageModule {}
