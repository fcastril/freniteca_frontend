import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TypeproductsComponent } from './typeproducts/typeproducts.component';
import { ProductsComponent } from './products/products.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { QuillModule } from 'ngx-quill';
import { ArchwizardModule } from 'angular-archwizard';
import { ProductsCreateupdateComponent } from './products-createupdate/products-createupdate.component';
import { TypeproductsCreateupdateComponent } from './typeproducts-createupdate/typeproducts-createupdate.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'products/:id',
        component: ProductsCreateupdateComponent,
      },
      {
        path: 'typeproducts',
        component: TypeproductsComponent
      },
      {
        path: 'typeproducts:/id',
        component: TypeproductsCreateupdateComponent
      }
    ]
  }
]

@NgModule({
  declarations: [
    TypeproductsComponent,
    ProductsComponent,
    ProductsCreateupdateComponent,
    TypeproductsCreateupdateComponent
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
export class MastersModule { }
