import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { NoAuthPage } from './no-auth.page'

const routes: Routes = [
  {
    path: '',
    component: NoAuthPage,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../pages/login/login.module').then(m => m.LoginPageModule)
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoAuthPageRoutingModule {}
