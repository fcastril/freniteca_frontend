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
import { ProductAttributeService } from 'src/app/services/product-attribute.service';
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
  typeProductsAttributes: TypeProductAttributeModel[] = [];
  urlImages: string = '';
  listImagenes: string[] = [];
  isView: boolean= false;

  constructor(private route: ActivatedRoute, 
    private api: ApiService, 
    private router: Router, 
    private fb: FormBuilder,
    private sanitizer: DomSanitizer, 
    private productAttributeService: ProductAttributeService,
    private productService: ProductService) {
   this.urlImages = environment.urlImages;
   }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id')??'';
    this.isView = this.route.snapshot.paramMap.get('view')=='view'??false;

    await this.getTypeProducts();
    await this.getBrands();
    await this.getApplications();

    if (this.id === '') {
      this.subtitle = 'CREANDO';
      this.reg = new ProductModel();
      await this.setFields();
    } else {
      if (this.isView)
      {
        this.subtitle = 'CONSULTANDO';
        this.disabledAll();
      }
      else
      {
        this.subtitle = 'EDITANDO';

      }
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
            }
          );

          await this.api.getCustom('productApplication','listbyProductId','ProductId',this.id).subscribe(
            (resp: any) => {
              this.ProductAttribute.clear();
              if (resp.status) {
                
                this.ProductApplications = resp.data;
                this.loadProductApplications();
              }


            }
          );
          
        }
      );
    }

  }

  async getTypeProducts(){
    this.api.get('typeProduct').subscribe(
      (resp: any) => {
        if (resp.status) {
          resp.data.unshift(
            {
              id: '',
              code: '',
              description: 'Seleccione un tipo de producto',
              dateCreation: new Date(),
              dateLastUpdate: new Date(),
              status: 'active'
            }
          );
          this.typeProducts = resp.data;
        }
      }
    );
  }
  disabledAll(){
    this.frm.controls['code'].disable();
    this.frm.controls['description'].disable();
    this.frm.controls['reference'].disable();
    this.frm.controls['referenceProvider'].disable();
    this.frm.controls['brandId'].disable();
    this.frm.controls['typeProductId'].disable();
    this.frm.controls['typeProductId'].disable();
    this.frm.controls['productEquivalenceId'].disable();
      
    
  }
  async getBrands(){
    this.api.get('brand').subscribe(
      (resp: any) => {
        if (resp.status) {
          resp.data.unshift(
            {
              id: '',
              code: '',
              description: 'Seleccione una marca',
              dateCreation: new Date(),
              dateLastUpdate: new Date(),
              status: 'active'
            }
          );
          this.brands = resp.data;
        }
      }
    );
  }
  async getApplications(){
    this.api.get('application').subscribe(
      (resp: any) => {
        if (resp.status)
        {
          resp.data.unshift(
            {
              id: '',
              code: '',
              description: 'Seleccione una aplicación',
              dateCreation: new Date(),
              dateLastUpdate: new Date(),
              status: 'active'
            }
          );
          this.Applications = resp.data;
        }
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
            var controls = this.ProductAttribute.controls;
            controls.forEach((element:any)=>{
              let productAttributeModel: ProductAttributeModel = {
                id: uuidv4(),
                productId : this.reg.id,
                typeProductAttributeId : element.value.id,
                value : element.value.value,
                dateCreation: new Date(),
                status: 'active',
                dateLastUpdate: new Date()                
              };
              this.api.create('ProductAttribute',productAttributeModel).subscribe();
            });

//TODO: Guardar documentos
//TODO: Guardar Aplicaciones
              this.router.navigateByUrl('/masters/products/admin');
            }
          });
        } else {
          this.api.update('product',this.reg).subscribe(
            (resp: any)=>{
            if (resp.error) {
                Swal.fire('Error al actualizar el Registro','Se presentó un error al actualizar el registro', 'error');
            } else {
              var controls = this.ProductAttribute.controls;
              controls.forEach((element:any)=>{
                this.productAttributeService.getByProductIdAndTypeProductAttributeId(this.id, element.value.id).subscribe(
                  (resp: any) => {
                    if (resp.status) {
                      let productAttributeModel: ProductAttributeModel = {
                        id: '',
                        productId : this.reg.id,
                        typeProductAttributeId : element.value.id,
                        value : element.value.value,
                        dateCreation: new Date(),
                        status: 'active',
                        dateLastUpdate: new Date()                
                      };
                      if (resp.data == null) // crear registros
                      {
                        productAttributeModel.id = uuidv4();
                        this.api.create('productAttribute', productAttributeModel).subscribe(
                          (resp:any) => {
                            if (resp.status){
                              console.log('productAttribute Creado');
                            }
                          },
                          (error: any) => { console.log('error Creado', productAttributeModel); }
                        );
                      } 
                      else {
                        productAttributeModel.id = resp.data.id;
                        productAttributeModel.dateCreation = resp.data.dateCreation;
                        this.api.update('productAttribute', productAttributeModel).subscribe(
                          (resp:any) => {
                            if (resp.status){
                              console.log('productAttribute Creado');
                            }
                          },
                          (error: any) => { console.log('error Creado', productAttributeModel); }
                        );

                      }
                    
                      console.log('resp', resp);
                    }
                  }
                );
              });

//TODO: Guardar documentos
//TODO: Guardar Aplicaciones
              this.router.navigateByUrl('/masters/products/admin');
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


  }
  async setFields(){
    this.frm.controls['code'].setValue(this.reg.code);
    this.frm.controls['description'].setValue(this.reg.description);
    this.frm.controls['reference'].setValue(this.reg.reference);
    this.frm.controls['referenceProvider'].setValue(this.reg.referenceProvider);
    this.frm.controls['brandId'].setValue(this.reg.brandId);
    this.frm.controls['typeProductId'].setValue(this.reg.typeProductId);
    if (this.id !== ''){
      this.frm.controls['typeProductId'].disable();
    }
    await this.selectedTypeProduct(this.reg.typeProductId);
    
    
  }

  get ProductAttribute(){
    return this.frm.controls['productAttributes'] as FormArray;
  }
  addTypeProductAttribute(typeProductId:string = '', descriptionTypeProduct: string = '', value: string = '', id: string = ''){
   const  frmDetail = this.fb.group({
      typeProductId: [typeProductId],
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
    if (reg.value.id != '')
    {
      this.api.delete('ProductApplication',reg.value.id).subscribe(
        (resp: any) => {
          if (resp.status)
          {
            this.Applications.push(reg.value['application']);
          }
          
        }
        );
      } 
      this.ProductApplication.removeAt(idx);

  }
  selectedApplication(idx: number, id: string, application: ApplicationModel){
    debugger;
    var reg = this.ProductApplication.at(idx);
    reg.value['applicationId'] = id;
    reg.value['id'] = this.id;
    var regEncontrar = this.Applications.findIndex(x=>x.id == id);
    reg.value['application'] = this.Applications[regEncontrar];
    this.Applications.splice(regEncontrar, 1);
    //this.loadProductApplications();
  }
  loadProductApplications(){
    this.ProductApplications.forEach((element:any)=>{
      this.addApplication(element.applicationId, element.applicationId, element.applicationNavigation);

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
  back(){
    if (this.isView){
      this.router.navigateByUrl('/masters/products/ppal');

    }else
    {
      this.router.navigateByUrl('/masters/products/admin');

    }
  }
}
