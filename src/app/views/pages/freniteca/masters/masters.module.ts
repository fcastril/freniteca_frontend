
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationsCreateupdateComponent } from './applications-createupdate/applications-createupdate.component';
import { ArchwizardModule } from 'angular-archwizard';
import { AssemblersComponent } from './assemblers/assemblers.component';
import { AssemblersCreateupdateComponent } from './assemblers-createupdate/assemblers-createupdate.component';
import { BrandsComponent } from './brands/brands.component';
import { BrandsCreateupdateComponent } from './brands-createupdate/brands-createupdate.component';
import { CommonModule } from '@angular/common';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProductsCreateupdateComponent } from './products-createupdate/products-createupdate.component';
import { QuillModule } from 'ngx-quill';
import { RouterModule, Routes } from '@angular/router';
import { TypeproductsComponent } from './typeproducts/typeproducts.component';
import { TypeproductsCreateupdateComponent } from './typeproducts-createupdate/typeproducts-createupdate.component';

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        redirectTo: "products",
        pathMatch: "full",
      },
      {
        path: "products/:id",
        component: ProductsCreateupdateComponent,
      },
      {
        path: "typeproducts",
        component: TypeproductsComponent,
      },
      {
        path: "typeproducts/:id",
        component: TypeproductsCreateupdateComponent,
      },
      {
        path: "assemblers",
        component: AssemblersComponent,
      },
      {
        path: "assembler/:id",
        component: AssemblersCreateupdateComponent,
      },
      {
        path: "brands",
        component: BrandsComponent,
      },
      {
        path: "brands/:id",
        component: BrandsCreateupdateComponent,
      },
      {
        path: "applications",
        component: ApplicationsComponent,
      },
      {
        path: "applications/:id",
        component: ApplicationsCreateupdateComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    ApplicationsComponent,
    ApplicationsCreateupdateComponent,
    AssemblersComponent,
    AssemblersCreateupdateComponent,
    BrandsComponent,
    BrandsCreateupdateComponent,
    ProductsCreateupdateComponent,
    TypeproductsComponent,
    TypeproductsCreateupdateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FeatherIconModule,
    QuillModule.forRoot(), // ngx-quill
    ArchwizardModule, // angular-archwizard
    NgSelectModule,
    PdfViewerModule
  ],
})
export class MastersModule {}
