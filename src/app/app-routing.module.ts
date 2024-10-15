import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './views/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ErrorPageComponent } from './views/pages/error-page/error-page.component';
import { ProductsSearchComponent } from './views/pages/freniteca/search/productsSearch/productsSearch.component';


const routes: Routes = [
  { path:'auth', loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'products/:type',
        component: ProductsSearchComponent
      },
      {
        path: 'search',
        loadChildren: () => import('./views/pages/freniteca/search/search.module').then(m => m.SearchModule)
      },
      {
        path: 'masters',
        loadChildren: () => import('./views/pages/freniteca/masters/masters.module').then(m => m.MastersModule)
      },
      {
        path: 'security',
        loadChildren: () => import('./views/pages/freniteca/security/security.module').then(m => m.SecurityModule)
      },
      { path: '', redirectTo: 'products', pathMatch: 'full' }, 
      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { 
    path: 'error',
    component: ErrorPageComponent,
    data: {
      'type': 404,
      'title': 'Page Not Found',
      'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    }
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
