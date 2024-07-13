import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductApplicationService {


  constructor(private auth: AuthService, private http: HttpClient) { }

  ListByProductId(idProduct:string ){
    return this.http.get(`${ environment.urlApi }productApplication/ListByProductId?ProductId=${idProduct}`, {headers: this.auth.getHeaders()});
  }

  getByProductIdAndApplicationId(idProduct: string, idTypeProduct: string){
    return this.http.get(`${ environment.urlApi }productApplication/getByProductIdAndApplicationId?ProductId=${idProduct}&ApplicationId=${idTypeProduct}`,  {headers: this.auth.getHeaders()});
  }
}
