import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginModel } from '../models/login.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = '';

  constructor(private http: HttpClient) { 
    this.url = environment.urlApi;
  }

  login(user: LoginModel) {
    var url = `${ this.url }user/login`;


    this.http.post(url,user).subscribe((resp:any)=>{
      console.log('login', resp);
    },
    (error: any)=>{console.error('login error', error)});

    return this.http.post(url, user)
      .pipe(
        map((resp: any) => {
          if (resp.status) {
            localStorage.setItem(environment.isLoggin, btoa('true'));
            localStorage.setItem(environment.token, resp.data.token);
            localStorage.setItem(environment.expires, btoa(resp.data.expira.toString()));
            localStorage.setItem(environment.roleId, btoa(resp.data.profile.id));

            var userJson:string = JSON.stringify(resp.data.user);
            

            localStorage.setItem(environment.user, btoa(userJson));
          }

          return resp;
        })
      );
  }

  loggout()
  {
    localStorage.removeItem(environment.isLoggin);
    localStorage.removeItem(environment.token);
    localStorage.removeItem(environment.expires);
    localStorage.removeItem(environment.roleId);
    localStorage.removeItem(environment.user);
  }


  isLoggedin(){
    let resp = false;

    let token = localStorage.getItem(environment.token);
    let expires = new Date(atob(localStorage.getItem(environment.expires)));
    if (token && expires > new Date())
    {
      resp = true;
    }
    return resp;
  }

  getToken(): string {
    let token = '';
    if (this.isLoggedin())
    {
     token = localStorage.getItem(environment.token)??'';
    }
    return token;
  }
  getRoleId(): string {
    let roleId = '';
    if (this.isLoggedin())
    {
     roleId = localStorage.getItem(environment.roleId)??'';
    }
    return roleId;
  }

  getHeaders(){
    return new HttpHeaders({Authorization: `Bearer ${this.getToken()}`});
  }
}
