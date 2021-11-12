import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { AuthPage } from './auth.page'

const routes: Routes = [
  {
    path: 'auth',
    component: AuthPage,
    children: [
      {
        path: 'travel-detail',
        loadChildren: () =>
          import('../pages/travel-detail/travel-detail.module').then(
            m => m.TravelDetailPageModule
          )
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthPageRoutingModule {}
