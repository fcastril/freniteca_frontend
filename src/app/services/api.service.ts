import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PaginateModel } from '../models/paginate.model';

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private auth: AuthService, private http: HttpClient) {}

  get(controller: string) {
    return this.http.get(`${environment.urlApi}${controller}/get`, {
      headers: this.auth.getHeaders(),
    });
  }

  getId(controller: string, id: string) {
    return this.http.get(
      `${environment.urlApi}${controller}/getById?id=${id}`,
      { headers: this.auth.getHeaders() }
    );
  }

  create(controller: string, data: any) {
    return this.http.post(`${environment.urlApi}${controller}/create`, data, {
      headers: this.auth.getHeaders(),
    });
  }

  update(controller: string, data: any) {
    return this.http.put(`${environment.urlApi}${controller}/update`, data, {
      headers: this.auth.getHeaders(),
    });
  }

  delete(controller: string, id: string) {
    return this.http.delete(
      `${environment.urlApi}${controller}/delete?id=${id}`,
      { headers: this.auth.getHeaders() }
    );
  }

  deleteCustom(controller: string, id1: string, id2: string) {
    return this.http.delete(
      `${environment.urlApi}${controller}/delete/${id2}/${id1}`,
      { headers: this.auth.getHeaders() }
    );
  }

  paginate(controller: string, paginate: PaginateModel) {
    return this.http.post(
      `${environment.urlApi}${controller}/paginator`,
      paginate,
      { headers: this.auth.getHeaders() }
    );
  }
  paginateBasic(controller: string, pageNo: number, pages: number) {
    return this.http.post(
      `${environment.urlApi}${controller}/paginator/pageNo/${pageNo}/pages/${pages}`,
      { headers: this.auth.getHeaders() }
    );
  }
  search(controller: string, property: string, value: string) {
    return this.http.get(
      `${environment.urlApi}${controller}/search/${property}/data/${value}`,
      { headers: this.auth.getHeaders() }
    );
  }
  searchList(controller: string, property: string, value: string) {
    return this.http.get(
      `${environment.urlApi}${controller}/searchList/${property}/data/${value}`,
      { headers: this.auth.getHeaders() }
    );
  }
  getCustom(
    controller: string,
    action: string,
    parameter: string,
    value: string
  ) {
    return this.http.get(
      `${environment.urlApi}${controller}/${action}?${parameter}=${value}`,
      { headers: this.auth.getHeaders() }
    );
  }

  postCustom(controller: string, action: string, data: any) {
    return this.http.post(
      `${environment.urlApi}${controller}/${action}`,
      data,
      { headers: this.auth.getHeaders() }
    );
  }

  postSearchEspecial(
    controller: string,
    value: string,
    pages: number = 10,
    pageNo: number = 1
  ) {
    var data = {
      value: value,
      pages: pages,
      pageNo: pageNo,
    };
    return this.http.post(
      `${environment.urlApi}${controller}/searchEspecial`,
      data,
      { headers: this.auth.getHeaders() }
    );
  }
}







