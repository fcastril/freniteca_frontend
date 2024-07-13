import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { SellersComponent } from './sellers/sellers.component';
import { ZonesComponent } from './zones/zones.component';
import { LogsComponent } from './logs/logs.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { QuillModule } from 'ngx-quill';
import { ArchwizardModule } from 'angular-archwizard';
import { LogsCreateupdateComponent } from './logs-createupdate/logs-createupdate.component';
import { ZonesCreateupdateComponent } from './zones-createupdate/zones-createupdate.component';
import { SellersCreateupdateComponent } from './sellers-createupdate/sellers-createupdate.component';
import { UsersCreateupdateComponent } from './users-createupdate/users-createupdate.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/:id',
        component: UsersCreateupdateComponent,
      },
      {
        path: 'sellers',
        component: SellersComponent,
      },
      {
        path: 'sellers/:id',
        component: SellersCreateupdateComponent,
      },
      {
        path: 'zones',
        component: ZonesComponent,
      },
      {
        path: 'zones/:id',
        component: ZonesCreateupdateComponent,
      },  
      {
        path: 'logs',
        component: LogsComponent,
      },
      {
        path: 'logs/:id',
        component: LogsCreateupdateComponent,
      },               
    ]
  }
]

@NgModule({
  declarations: [
    UsersComponent,
    RolesComponent,
    SellersComponent,
    ZonesComponent,
    LogsComponent,
    LogsCreateupdateComponent,
    ZonesCreateupdateComponent,
    SellersCreateupdateComponent,
    UsersCreateupdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FeatherIconModule,
    QuillModule.forRoot(), // ngx-quill
    ArchwizardModule, // angular-archwizard
  ]
})
export class SecurityModule { }
