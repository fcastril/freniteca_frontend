import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeProductModel } from 'src/app/models/typeProduct.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-typeproducts-createupdate',
  templateUrl: './typeproducts-createupdate.component.html',
  styleUrls: ['./typeproducts-createupdate.component.scss']
})
export class TypeproductsCreateupdateComponent implements OnInit {

  

  frm = this.fb.group({
    code: ['', Validators.required],
    description: ['', Validators.required],
    attributes: this.fb.array([])
  });

  frmDetail = this.fb.group({
    typeProductAttribute: ['',Validators.required]
  });

  id: string;
  title = 'Tipos de productos';
  subtitle: string;
  reg = new TypeProductModel();


  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.detail.push(this.frmDetail);
    this.id = this.route.snapshot.paramMap.get('id')??'';
    if (this.id === '') {
      this.subtitle = 'CREANDO';
      this.reg = new TypeProductModel();
      this.setFields();
    } else {
      this.subtitle = 'EDITANDO';
      this.api.getId('typeproduct',this.id).subscribe(
        (resp: any) => {
          console.log('resp', resp)
          this.reg = resp.data;
          this.setFields();
        }
      );
    }
  }
  Submit() {
    if (this.frm.invalid) {
      Object.values(this.frm.controls).forEach(ctrl => {
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

        this.setValues();

        this.reg.id = this.id;
        this.reg.dateLastUpdate = new Date();
        if (this.reg.id === ''){
          this.reg.id = uuidv4();
          this.reg.dateCreation = new Date();
          this.reg.status = 'active';
          this.api.create('typeproduct',this.reg).subscribe(
            (resp: any)=>{
            if (resp.error) {
                Swal.fire('Error al crear el Registro','Se presentó un error al crear el registro', 'error');
            } else {
              this.router.navigateByUrl('/masters/typeproducts');
            }
          });
        } else {
          this.api.update('typeproduct',this.reg).subscribe(
            (resp: any)=>{
            if (resp.error) {
                Swal.fire('Error al actualizar el Registro','Se presentó un error al actualizar el registro', 'error');
            } else {
              this.router.navigateByUrl('/masters/typeproducts');
            }
          });
        }
      }
    });
  }

  setValues(){
    this.reg.code = this.frm.get('code')?.value??'';
    this.reg.description = this.frm.get('description')?.value??'';
  }
  setFields(){
    this.frm.controls['code'].setValue(this.reg.code);
    this.frm.controls['description'].setValue(this.reg.description);
    
  }
  get detail(){
    return this.frm.controls['attributes'] as FormArray;
  }
  addDetail(){
    debugger;
    this.detail.push(this.frmDetail);
  }
  deleteDetail(idx: number){
    this.detail.removeAt(idx);
  }
}
