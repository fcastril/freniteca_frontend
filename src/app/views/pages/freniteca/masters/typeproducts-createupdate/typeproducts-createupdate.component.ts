import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeProductModel } from 'src/app/models/typeProduct.model';
import { TypeProductAttributeModel } from 'src/app/models/typeProductAttribute.model';
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



  id: string;
  title = 'Tipos de productos';
  subtitle: string;
  reg = new TypeProductModel();
  details: TypeProductAttributeModel[]=[];


  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private fb: FormBuilder) {
   // this.detail.push(this.frmDetail);
   //this.addDetail();
   }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')??'';
    if (this.id === '') {
      this.subtitle = 'CREANDO';
      this.reg = new TypeProductModel();
      this.setFields();
    } else {
      this.subtitle = 'EDITANDO';
      this.api.getId('typeproduct',this.id).subscribe(
        (resp: any) => {
          this.reg = resp.data;
          this.setFields();
          this.api.getCustom('typeproductattribute','listbyTypeProductId','typeProductId',this.id).subscribe(
            (resp: any) => {
              this.details = resp.data;
              this.loadDetail();
            }
          );
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
              this.createUpdateDetail(resp.data.id);
              this.router.navigateByUrl('/masters/typeproducts');
            }
          });
        } else {
          this.api.update('typeproduct',this.reg).subscribe(
            (resp: any)=>{
            if (resp.error) {
                Swal.fire('Error al actualizar el Registro','Se presentó un error al actualizar el registro', 'error');
            } else {
              this.createUpdateDetail(resp.data.id);
              this.router.navigateByUrl('/masters/typeproducts');
            }
          });
        }
      }
    });
  }

  createUpdateDetail(id: string){

      this.detail.controls.forEach((element:any) => {
        let arrayFind = this.details.find(x =>x.id == element.value.id);
        if (arrayFind == null){
          var elem = this.setDetail(id, uuidv4(), element.value);
          this.api.create('typeProductAttribute',elem).subscribe(
            (resp:any) => {
              console.log('Create Type Product', resp);
            }
          );
        }

      });
  }

  setDetail(id: string, idDetail: string, element: any): TypeProductAttributeModel{
    let newElement = new TypeProductAttributeModel();
    newElement.id = uuidv4();
    newElement.typeProductId = id;
    newElement.name = element.typeProductAttribute;
    newElement.dateCreation = new Date();
    newElement.dateLastUpdate = new Date();
    newElement.status = 'active';
    return newElement;
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
  addDetail(value:string = '', id: string = ''){
   const  frmDetail = this.fb.group({
      typeProductAttribute: [value,Validators.required],
      id: [id],
    });

    this.detail.push(frmDetail);
  }
  deleteDetail(idx: number){
    var reg = this.detail.at(idx);

    this.api.delete('typeProductAttribute',reg.value.id).subscribe(
      (resp: any) => {
        console.log('Delete Type Product', resp);
        this.detail.removeAt(idx);
      }
    );

  }

  loadDetail(){
    this.details.forEach((element:any)=>{
      this.addDetail(element.name, element.id);
    });
  }
}
