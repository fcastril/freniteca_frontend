import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationModel } from 'src/app/models/application.model';
import { BrandModel } from 'src/app/models/brand.model';
import { ProductModel } from 'src/app/models/product.model';
import { ProductApplicationModel } from 'src/app/models/productApplication.model';
import { ProductAttributeModel } from 'src/app/models/productAttribute.model';
import { TypeProductModel } from 'src/app/models/typeProduct.model';
import { TypeProductAttributeModel } from 'src/app/models/typeProductAttribute.model';
import { ApiService } from 'src/app/services/api.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
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
    productApplications: this.fb.array([]),
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
  ProductApplications: ProductApplicationModel[]=[];
  typeProducts: TypeProductModel[]=[];
  Applications: ApplicationModel[] = [];
  brands: BrandModel[]=[];
  productsEquivalence: ProductModel[]=[];
  typeProductsAttributes: TypeProductAttributeModel[] = [];
  urlImages: string = '';
  listImagenes: string[] = [];

  constructor(private route: ActivatedRoute, 
    private api: ApiService, 
    private router: Router, 
    private fb: FormBuilder,
    private sanitizer: DomSanitizer, 
    private productService: ProductService) {
   // this.detail.push(this.frmDetail);
   //this.addDetail();
   this.urlImages = environment.urlImages;
   }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id')??'';
    await this.getTypeProducts();
    await this.getBrands();
    await this.getProductsEquivalence();
    await this.getApplications();

    if (this.id === '') {
      this.subtitle = 'CREANDO';
      this.reg = new ProductModel();
      await this.setFields();
    } else {
      this.subtitle = 'EDITANDO';
      await this.api.getId('product',this.id).subscribe(
        async (resp: any) => {
          this.reg = resp.data;
          await this.setFields();
          await this.productService.getFiles(this.id).subscribe(
            (resp: any) => {
              if (resp.status){
                this.listImagenes = resp.data;
              }
            }
          );
          
          this.typeProductsAttributes = [];
          await this.api.getCustom('typeProductAttribute','ListByTypeProductId','TypeProductId',this.reg.typeProductId).subscribe(
            (resp: any) => {
                this.typeProductsAttributes = resp.data;

                this.api.getCustom('productattribute','listbyProductId','ProductId',this.id).subscribe(
                  (resp: any) => {
                    this.ProductAttribute.clear();
                    if (resp.status){
                      this.ProductAttributes = resp.data;
                      this.typeProductsAttributes.forEach((element: TypeProductAttributeModel)=>{
                        var res = this.ProductAttributes.filter(x=>x.typeProductAttributeId == element.id);
                        if (res.length >0)
                        {
                          element.value = res[0].value;
                        }
                      });              
  
                      this.loadProductAttributes();
        
                    }
      
                  }
                );

                this.api.getCustom('productApplication','listbyProductId','ProductId',this.id).subscribe(
                  (resp: any) => {
                    this.ProductAttribute.clear();
                    if (resp.status) {

                      this.ProductApplications = resp.data;
                      this.typeProductsAttributes.forEach((element: TypeProductAttributeModel)=>{
                        var res = this.ProductAttributes.filter(x=>x.typeProductAttributeId == element.id);
                        if (res.length >0)
                        {
                          element.value = res[0].value;
                        }
                      });              
  
                      this.loadProductAttributes();
                    }
      
      
                  }
                );
            }
          );
          
        }
      );
    }

  }

  async getTypeProducts(){
    this.api.get('typeProduct').subscribe(
      (resp: any) => {
        if (resp.status)
          this.typeProducts = resp.data;
      }
    );
  }

  async getBrands(){
    this.api.get('brand').subscribe(
      (resp: any) => {
        if (resp.status)
          this.brands = resp.data;
      }
    );
  }
  async getProductsEquivalence(){
    this.api.get('product').subscribe(
      (resp: any) => {
        if (resp.status)
          this.productsEquivalence = resp.data;
      }
    );
  }
  async getApplications(){
    this.api.get('application').subscribe(
      (resp: any) => {
        if (resp.status)
          this.Applications = resp.data;
        console.log('this.Applications', this.Applications);
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
//TODO: Guardar datos de atributos
//TODO: Guardar documentos
//TODO: Guardar Aplicaciones
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
//TODO: Guardar documentos
//TODO: Guardar Aplicaciones
              this.router.navigateByUrl('/masters/products');
            }
          });
        }
      }
    });
  }

  setValues(){
    this.reg.code = this.frm.get('code')?.value??'';
    this.reg.reference = this.frm.get('reference')?.value??'';
    this.reg.referenceProvider = this.frm.get('referenceProvider')?.value??'';
    this.reg.description = this.frm.get('description')?.value??'';
    this.reg.brandId = this.frm.get('brandId')?.value??'';
    this.reg.typeProductId = this.frm.get('typeProductId')?.value ?? '';
    this.reg.productEquivalenceId = this.frm.get('productEquivalence')?.value ?? '';


  }
  async setFields(){
    this.frm.controls['code'].setValue(this.reg.code);
    this.frm.controls['description'].setValue(this.reg.description);
    this.frm.controls['reference'].setValue(this.reg.reference);
    this.frm.controls['referenceProvider'].setValue(this.reg.referenceProvider);
    this.frm.controls['brandId'].setValue(this.reg.brandId);
    this.frm.controls['typeProductId'].setValue(this.reg.typeProductId);
    this.frm.controls['typeProductId'].disable();
    this.frm.controls['productEquivalenceId'].setValue(this.reg.productEquivalenceId=='00000000-0000-0000-0000-000000000000' ? '' : this.reg.productEquivalenceId);
    await this.selectedTypeProduct(this.reg.typeProductId);
    
    
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
      this.addTypeProductAttribute(element.typeProductId, element.name, element.value, element.id);
    });
  }



  get ProductApplication(){
    return this.frm.controls['productApplications'] as FormArray;
  }
  addApplication(applicationId:string = '', id: string = '', application: ApplicationModel){
   const  frmDetail = this.fb.group({
      applicationId: [applicationId],
      application: [application],
      id: [id],
    });
    this.ProductApplication.push(frmDetail);
  }
  deleteApplication(idx: number){
    var reg = this.ProductApplication.at(idx);

    this.api.delete('ProductApplication',reg.value.id).subscribe(
      (resp: any) => {
        if (resp.status)
          this.ProductApplication.removeAt(idx);
          this.Applications.push(reg.value['application']);
      }
    );

  }
  selectedApplication(idx: number, id: string, application: ApplicationModel){
    var reg = this.ProductApplication.at(idx);
    var regEncontrar = this.Applications.findIndex(x=>x.id == id);
    reg.value['applicationId'] = id;
    reg.value['id'] = this.id;
    reg.value['application'] = this.Applications[regEncontrar];
    this.Applications.splice(regEncontrar, 1);
    //this.loadProductApplications();
  }
  loadProductApplications(){
    this.ProductApplications.forEach((element:any)=>{
      this.api.getId('Application', element.applicationId).subscribe(
        (resp:any) => {
          if (resp.status){
            this.addApplication(element.applicationId, element.id, resp.data);
          }
        }
      );
    });
  }
  async selectedTypeProduct(id:string){

    this.typeProductsAttributes = [];
    this.ProductAttribute.clear();
    await this.api.getCustom('typeProductAttribute','ListByTypeProductId','TypeProductId',id).subscribe(
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
          }
        };
        reader.readAsDataURL(event.target.files[0]);
      } else { //no
        Swal.fire('Selección de Archivo','Solo se permiten las siguientes extensiones de archivos: PNG, JPG, JPGE, PDF','error');
      }
    }
  }

  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
}
