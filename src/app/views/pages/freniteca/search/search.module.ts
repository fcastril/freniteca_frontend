import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FeatherIconModule } from 'src/app/core/feather-icon/feather-icon.module';
import { QuillModule } from 'ngx-quill';
import { ArchwizardModule } from 'angular-archwizard';
import { ProductsComponent } from './products/products.component';
import { ProductsDetailsComponent } from './products-details/products-details.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProductsPdfComponent } from './products-pdf/products-pdf.component';


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
        path: 'productsView/:id',
        component: ProductsDetailsComponent,
      },
            {
        path: 'productsPDF',
        component: ProductsPdfComponent,
      }           
    ]
  }
]


@NgModule({
  declarations: [
    ProductsComponent,
    ProductsDetailsComponent,
    ProductsPdfComponent
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
  ]
})
export class SearchModule { }
