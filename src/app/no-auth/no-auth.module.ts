import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { IonicModule } from '@ionic/angular'

import { NoAuthPageRoutingModule } from './no-auth-routing.module'

import { NoAuthPage } from './no-auth.page'

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, NoAuthPageRoutingModule],
  declarations: [NoAuthPage]
})
export class NoAuthPageModule {}
