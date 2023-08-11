import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationModel } from 'src/app/models/application.model';
import { BrandModel } from 'src/app/models/brand.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-applications-createupdate',
  templateUrl: './applications-createupdate.component.html',
  styleUrls: ['./applications-createupdate.component.scss']
})
export class ApplicationsCreateupdateComponent implements OnInit {



  id: string;
  title = 'Aplicaciones';
  subtitle: string;
  reg = new ApplicationModel();
  brands: BrandModel[] = [];
  controller: string = 'application';

  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id')??'';
    await this.getBrands();
    if (this.id === '') {
      this.subtitle = 'CREANDO';
      this.reg = new ApplicationModel();
    } else {
      this.subtitle = 'EDITANDO';
      this.api.getId(this.controller,this.id).subscribe(
        (resp: any) => {
          this.reg = resp.data;
        }
      );
    }
  }
  
  async getBrands(){
    this.api.get('brand').subscribe((resp:any)=>{
      if (resp.status){
        this.brands = resp.data;
      }
    });

  }

  selectedBrand(e:any){
    this.reg.brandNavigation = e;
  }

  Submit(form: NgForm) {
    if (form.invalid) {
      Object.values(form.control).forEach(ctrl => {
        ctrl.markAsTouched();
      });
      Swal.fire({
        title: 'Error',
        text: 'Hacen falta campos obligatorios',
        icon: 'error'
      });
      return;
    }
    Swal.fire(
      {
        title: 'Confirmar Guardar !!!',
        text: '¿Está seguro de guardar el registro actual?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Guardar'
      }
    ).then((result) => {
      if (result.isConfirmed) {
        this.reg.id = this.id;
        this.reg.dateLastUpdate = new Date();
        if (this.reg.id === ''){
          this.reg.id = uuidv4();
          this.reg.dateCreation = new Date();
          this.reg.status = 'active';
          this.api.create(this.controller,this.reg).subscribe(
            (resp: any)=>{
            if (resp.error) {
                Swal.fire('Error al crear el Registro','Se presentó un error al crear el registro', 'error');
            } else {
              this.router.navigateByUrl('/masters/applications');
            }
          });
        } else {
          this.api.update(this.controller,this.reg).subscribe(
            (resp: any)=>{
            if (resp.error) {
                Swal.fire('Error al actualizar el Registro','Se presentó un error al actualizar el registro', 'error');
            } else {
              this.router.navigateByUrl('/masters/applications');
            }
          });
        }
      }
    });
  }


}
