import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { FlexLayoutModule } from '@angular/flex-layout'
import { MatListModule } from '@angular/material/list'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatNativeDateModule } from '@angular/material/core'
import { MatInputModule } from '@angular/material/input'
import { RouterModule } from '@angular/router'
import { MatMenuModule } from '@angular/material/menu'

// COMPONENTS
import { ChooseTravelComponent } from './choose-travel/choose-travel.component'
import { ChooseSeatComponent } from './choose-seat/choose-seat.component'
import { ChooseServicesComponent } from './choose-services/choose-services.component'
import { ConfirmationComponent } from './confirmation/confirmation.component'
import { PaymentComponent } from './payment/payment.component'

const components = [
  ChooseTravelComponent,
  ChooseServicesComponent,
  ChooseSeatComponent,
  ConfirmationComponent,
  PaymentComponent
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    IonicModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatListModule,
    RouterModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [MatDatepickerModule, MatNativeDateModule],
  exports: [
    components,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatListModule
  ],
  entryComponents: []
})
export class ComponentsModule {}
