import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { FileModel } from '../models/file.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private auth: AuthService, private http: HttpClient) { }

  uploadFile(idProduct:string, file:FileModel ){
    return this.http.post(`${ environment.urlApi }product/uploadFiles/${idProduct}`, file, {headers: this.auth.getHeaders()});
  }

  getFiles(idProduct: string){
    return this.http.get(`${ environment.urlApi }product/getFiles/${idProduct}`,  {headers: this.auth.getHeaders()});
  }
}
