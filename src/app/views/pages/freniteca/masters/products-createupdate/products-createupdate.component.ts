import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandModel } from 'src/app/models/brand.model';
import { ProductModel } from 'src/app/models/product.model';
import { ProductAttributeModel } from 'src/app/models/productAttribute.model';
import { TypeProductModel } from 'src/app/models/typeProduct.model';
import { TypeProductAttributeModel } from 'src/app/models/typeProductAttribute.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-products-createupdate',
  templateUrl: './products-createupdate.component.html',
  styleUrls: ['./products-createupdate.component.scss']
})
export class ProductsCreateupdateComponent implements OnInit {



  frm = this.fb.group({
    code: ['', Validators.required],
    reference: ['', Validators.required],
    referenceProvider: ['', Validators.required],
    description: ['', Validators.required],
    aplication: ['', Validators.required],
    typeProductId: ['', Validators.required],
    productEquivalenceId: [''],
    brandId: ['', Validators.required],
    productAttributes: this.fb.array([]),
    images: this.fb.array([])
  });



  id: string;
  title = 'Productos';
  subtitle: string;
  reg = new ProductModel();
  ProductAttributes: ProductAttributeModel[]=[];
  typeProducts: TypeProductModel[]=[];
  brands: BrandModel[]=[];
  productsEquivalence: ProductModel[]=[];


  constructor(private route: ActivatedRoute, private api: ApiService, private router: Router, private fb: FormBuilder) {
   // this.detail.push(this.frmDetail);
   //this.addDetail();
   }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id')??'';
    await this.getTypeProducts();
    await this.getBrands();
    await this.getProductsEquivalence();

    if (this.id === '') {
      this.subtitle = 'CREANDO';
      this.reg = new ProductModel();
      this.setFields();
    } else {
      this.subtitle = 'EDITANDO';
      this.api.getId('typeproduct',this.id).subscribe(
        (resp: any) => {
          this.reg = resp.data;
          this.setFields();
          this.api.getCustom('productattribute','listbyProductId','ProductId',this.id).subscribe(
            (resp: any) => {
              this.ProductAttributes = resp.data;
              this.loadProductAttributes();
            }
          );
        }
      );
    }
  }

  async getTypeProducts(){
    this.api.get('typeProduct').subscribe(
      (resp: any) => {
        this.typeProducts = resp.data;
      }
    );
  }

  async getBrands(){
    this.api.get('brand').subscribe(
      (resp: any) => {
        this.brands = resp.data;
      }
    );
  }
  async getProductsEquivalence(){
    this.api.get('product').subscribe(
      (resp: any) => {
        this.productsEquivalence = resp.data;
      }
    );
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
          this.api.create('product',this.reg).subscribe(
            (resp: any)=>{
            if (resp.error) {
                Swal.fire('Error al crear el Registro','Se presentó un error al crear el registro', 'error');
            } else {
//TODO: Guaradar datos de atributos
              this.router.navigateByUrl('/masters/products');
            }
          });
        } else {
          this.api.update('product',this.reg).subscribe(
            (resp: any)=>{
            if (resp.error) {
                Swal.fire('Error al actualizar el Registro','Se presentó un error al actualizar el registro', 'error');
            } else {
//TODO: Actualizar datos de atributos
              this.router.navigateByUrl('/masters/products');
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
  get ProductAttribute(){
    return this.frm.controls['productAttributes'] as FormArray;
  }
  addTypeProductAttribute(typeProductId:string = '', descriptionTypeProduct: string = '', value: string = '', id: string = ''){
   const  frmDetail = this.fb.group({
      typeProductAttributeId: [typeProductId],
      descriptionTypeProduct: [descriptionTypeProduct],
      value: [value, Validators.required],
      id: [id],
    });
    this.ProductAttribute.push(frmDetail);
  }
  loadProductAttributes(){
    this.typeProductsAttributes.forEach((element:any)=>{
      this.addTypeProductAttribute(element.typeProductId, element.name, '', element.id);
    });
  }

  typeProductsAttributes: TypeProductAttributeModel[] = [];
  async selectedTypeProduct(event:any){

    this.typeProductsAttributes = [];
    this.ProductAttribute.clear();
    await this.api.getCustom('typeProductAttribute','ListByTypeProductId','TypeProductId',event.id).subscribe(
      (resp: any) => {
        this.typeProductsAttributes = resp.data;
        this.loadProductAttributes();
        
     }
    );
  }


  get Images(){
    return this.frm.controls['images'] as FormArray;
  }

  addImage(){
    const img = this.fb.group({
      data: [''],
      doc: [],
      type: []
    });
    this.Images.push(img);
  }
  handleFileInput(event: any, imgReg: any) {
    if (event.target.files.length) {
      var fileTypes = ['jpg', 'jpeg', 'png', 'pdf'];  //acceptable file types
      var extension = event.target.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
      isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types
      if (isSuccess) { //yes
        // start file reader
        const reader = new FileReader();
        reader.onload = (event) => {
          if(event.target?.result) {
            imgReg.controls["doc"].setValue(event.target?.result);
            imgReg.controls["type"].setValue(extension);
            console.log(imgReg);
          }
        };
        reader.readAsDataURL(event.target.files[0]);
      } else { //no
        alert('Seleccione un archivo compatible.')
      }
    }
  }

}
