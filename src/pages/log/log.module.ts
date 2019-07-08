import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogPage } from './log';

@NgModule({
  declarations: [
    LogPage,
  ],
  imports: [
    IonicPageModule.forChild(LogPage),
  ],
})
export class LogPageModule {}
