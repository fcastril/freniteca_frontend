import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleModel } from 'src/app/models/role.model';
import { UserModel } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-users-createupdate",
  templateUrl: "./users-createupdate.component.html",
  styleUrls: ["./users-createupdate.component.scss"],
})
export class UsersCreateupdateComponent implements OnInit {
  id: string;
  title = "Usuarios";
  subtitle: string;
  reg = new UserModel();
  password2: string = "";
  roles: RoleModel[] = [];
  selectedRole;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id") ?? "";

    this.getRoles();

    if (this.id === "") {
      this.subtitle = "CREANDO";
      this.reg = new UserModel();
    } else {
      this.subtitle = "EDITANDO";
      console.log("id", this.id);
      this.api.getId("user", this.id).subscribe((resp: any) => {
        this.reg = resp.data;
        console.log("reg", this.reg);
        this.selectedRole = this.reg.rolId;
      });
    }
  }

  getRoles() {
    this.api.get("rol").subscribe((resp: any) => {
      this.roles = [
        {
          id: "",
          name: "Seleccione un Rol",
        },
        ...resp.data,
      ];
    });
  }
  selectedChange($event){
    this.reg.rolId = this.selectedRole.id;

  }

  Submit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.control).forEach((ctrl) => {
        ctrl.markAsTouched();
      });
      Swal.fire({
        title: "Error",
        text: "Hacen falta campos obligatorios",
        icon: "error",
      });
      return;
    }
    Swal.fire({
      title: "Confirmar Guardar !!!",
      text: "¿Está seguro de guardar el registro actual?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Guardar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.reg.id = this.id;
        this.reg.dateLastUpdate = new Date();
        this.reg.rolId = this.selectedRole;
        if (this.reg.id === "") {
          this.reg.id = uuidv4();
          this.reg.dateCreation = new Date();
          this.reg.status = "active";

          this.api.create("user", this.reg).subscribe((resp: any) => {
            if (resp.error) {
              Swal.fire(
                "Error al crear el Registro",
                "Se presentó un error al crear el registro",
                "error"
              );
            } else {
              this.router.navigateByUrl("/security/users");
            }
          });
        } else {
          this.api.update("user", this.reg).subscribe((resp: any) => {
            if (resp.error) {
              Swal.fire(
                "Error al actualizar el Registro",
                "Se presentó un error al actualizar el registro",
                "error"
              );
            } else {
              this.router.navigateByUrl("/security/users");
            }
          });
        }
      }
    });
  }
}
