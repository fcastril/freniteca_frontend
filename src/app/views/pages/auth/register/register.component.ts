import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserModel } from "../../../../models/user.model";
import { NgForm } from "@angular/forms";
import { RoleModel } from "../../../../models/role.model";
import { environment } from "src/environments/environment";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import Swal from "sweetalert2";

import { v4 as uuidv4 } from "uuid";
import { LoginModel } from "src/app/models/login.model";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  public user: UserModel = new UserModel();

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
  }

  onRegister(form: NgForm) {

     if (form.invalid) {
       Object.values(form.controls).forEach((ctrl) => {
         ctrl.markAsTouched();
       });
       Swal.fire({
         title: "Error",
         text: "Hacen falta campos obligatorios",
         icon: "error",
       });
       return;
     }

    this.user.id = uuidv4();
    this.user.rolId = environment.roleDefault;
    this.user.dateCreation = new Date();
    this.user.dateLastUpdate = new Date();
    this.user.status = "active";
      console.log("user", this.user);


    this.api
      .search("user", "UserName", this.user.userName)
      .subscribe((resp: any) => {
        let isSuccessCreate: Boolean = false;
        if (resp.status) {
          if (resp.data == null) {
            isSuccessCreate = true;
          }
        }

        if (isSuccessCreate) {
          this.api.create("user", this.user).subscribe((resp: any) => {


            let login: LoginModel = new LoginModel();
            login.userName = this.user.userName;
            login.password = this.user.password;


            this.auth.login(login).subscribe(
              (resp: any) => {
                if (resp.status) {
                    this.router.navigate(["/search"]);
                
                } else {
                  Swal.fire({
                    title: "Error Autenticación",
                    text: "Usuario y/o contraseña incorrectos",
                    icon: "error",
                  });
                }
              },
              (error: any) => {
                Swal.fire({
                  title: "Error",
                  text: "El usuario y/o la contraseña se encuentran errados",
                  icon: "error",
                });
              }
            );
          });
        }
        else
        {
                Swal.fire({
                  title: "Error",
                  text: "El usuario ya existe",
                  icon: "error",
                });

        }
      });

    // localStorage.setItem('isLoggedin', 'true');
    // if (localStorage.getItem('isLoggedin')) {
    //   this.router.navigate(['/']);
    // }
  }
}
