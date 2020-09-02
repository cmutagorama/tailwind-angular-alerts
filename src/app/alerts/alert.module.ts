import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertsComponent } from './alerts.component';

@NgModule({
  declarations: [AlertsComponent],
  imports: [
    CommonModule
  ],
  exports: [AlertsComponent]
})
export class AlertModule { }
