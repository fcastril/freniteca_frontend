import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductAttributeService {


  constructor(private auth: AuthService, private http: HttpClient) { }

  ListByProductId(idProduct:string ){
    return this.http.get(`${ environment.urlApi }productAttribute/ListByProductId?ProductId=${idProduct}`, {headers: this.auth.getHeaders()});
  }

  getByProductIdAndTypeProductAttributeId(idProduct: string, idTypeProduct: string){
    return this.http.get(`${ environment.urlApi }productAttribute/getByProductIdAndTypeProductAttributeId?ProductId=${idProduct}&TypeProductAttributeId=${idTypeProduct}`,  {headers: this.auth.getHeaders()});
  }
}
