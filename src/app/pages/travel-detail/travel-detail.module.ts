import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatNativeDateModule } from '@angular/material/core'
import { MatInputModule } from '@angular/material/input'

import { IonicModule } from '@ionic/angular'

import { TravelDetailPageRoutingModule } from './travel-detail-routing.module'

import { ComponentsModule } from '../../components/components.module'

import { TravelDetailPage } from './travel-detail.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TravelDetailPageRoutingModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    ComponentsModule
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  declarations: [TravelDetailPage]
})
export class TravelDetailPageModule {}
