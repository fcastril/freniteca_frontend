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
    debugger;
    var url = `${ this.url }user/login`;


    this.http.post(url,user).subscribe((resp:any)=>{
      console.log('login', resp);
    },
    (error: any)=>{console.error('login error', error)});

    return this.http.post(url, user)
      .pipe(
        map((resp: any) => {
          debugger;
          if (resp.status) {
            localStorage.setItem(environment.isLoggin, btoa('true'));
            localStorage.setItem(environment.token, resp.data.token);
            localStorage.setItem(environment.username, btoa(resp.data.userName));
            localStorage.setItem(environment.expires, btoa(resp.data.expira.toString()));
          }

          return resp;
        })
      );
  }

  loggout()
  {
    localStorage.removeItem(environment.isLoggin);
    localStorage.removeItem(environment.token);
    localStorage.removeItem(environment.username);
    localStorage.removeItem(environment.expires);
  }

  getUsername(): string {
    return atob(localStorage.getItem(environment.username)??'');
  }
  isLoggedin(){
    let resp = false;
    let localStorageData = atob(localStorage.getItem(environment.isLoggin)??'')
    if (localStorageData === 'true')
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

  getHeaders(){
    return new HttpHeaders({Authorization: `Bearer ${this.getToken()}`});
  }
}
