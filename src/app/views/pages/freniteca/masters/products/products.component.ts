import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LogicalOperators } from 'src/app/enums/logicalOperators.enum';
import { Operations } from 'src/app/enums/operations.enum';
import { ApplicationModel } from 'src/app/models/application.model';
import { BrandModel } from 'src/app/models/brand.model';
import { PaginateModel } from 'src/app/models/paginate.model';
import { ProductModel } from 'src/app/models/product.model';
import { SearchModel } from 'src/app/models/search.model';
import { TypeProductModel } from 'src/app/models/typeProduct.model';
import { TypeProductAttributeModel } from 'src/app/models/typeProductAttribute.model';
import { ApiService } from 'src/app/services/api.service';
import { ProductService } from 'src/app/services/product.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {



  frm = this.fb.group({
    code: [''],
    description: [''],
    brandId: [''],
    typeProductId: [''],
    application: ['']
  });

  regs: ProductModel[] = [];
  searchText: '';
  title = "Productos";
  currentPage: number = 1;
  pageCount: number = 10;
  totalPage: number = 0;
  urlImages: string = '';
  typeProducts: TypeProductModel[]=[];
  Applications: ApplicationModel[] = [];
  brands: BrandModel[]=[];
  typeProductsAttributes: TypeProductAttributeModel[] = [];



  constructor(private route: Router, 
              private fb: FormBuilder,
              private api: ApiService, 
              private productService: ProductService,
              private rout: ActivatedRoute) {
    this.urlImages = environment.urlImages;
   }

  async ngOnInit(): Promise<void> {
    await this.getTypeProducts();
    await this.getBrands();
    await this.getApplications();
    this.search();
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

  async selectedTypeProduct(id:string){

    // this.typeProductsAttributes = [];
    // this.ProductAttribute.clear();
    // await this.api.getCustom('typeProductAttribute','ListByTypeProductId','TypeProductId',id).subscribe(
    //   (resp: any) => {
    //       this.typeProductsAttributes = resp.data;
    //       this.loadProductAttributes();
    //  }
    // );
  }

  // get ProductAttribute(){
  //   return this.frm.controls['productAttributes'] as FormArray;
  // }
  // addTypeProductAttribute(typeProductId:string = '', descriptionTypeProduct: string = '', value: string = '', id: string = ''){
  //  const  frmDetail = this.fb.group({
  //     typeProductId: [typeProductId],
  //     descriptionTypeProduct: [descriptionTypeProduct],
  //     value: [value, Validators.required],
  //     id: [id],
  //   });
  //   this.ProductAttribute.push(frmDetail);
  // }
  // loadProductAttributes(){
  //   this.typeProductsAttributes.forEach((element:any)=>{
  //     this.addTypeProductAttribute(element.typeProductId, element.name, element.value, element.id);
  //   });
  // }
  limpiarBusqueda(){
    this.search();
  }
  Submit() { 
    let search: SearchModel = {
      code: this.frm.controls['code'].value??'',
      description: this.frm.controls['description'].value??'',
      brandId: this.frm.controls['brandId'].value??'',
      typeProductId: this.frm.controls['typeProductId'].value??'',
      application: this.frm.controls['application'].value??'',
      pageNo: 1,
      count: 10

    }

    this.productService.postSearch(search).subscribe(
      (resp: any) => {
        this.regs = resp.data;
        this.totalPage = 1;
      }
    );
    

  }

  register(id: string){
      this.route.navigateByUrl('/masters/products/'+id);
  }

  search(){
    
    //TODO: armar objeto para paginar
    let search: SearchModel = {
      code: this.frm.controls["code"].value ?? "",
      description: this.frm.controls["description"].value ?? "",
      brandId: this.frm.controls["brandId"].value ?? "",
      typeProductId: this.frm.controls["typeProductId"].value ?? "",
      application: this.frm.controls["application"].value ?? "",
      pageNo: 1,
      count: 10,
    };

    this.productService.postSearch(search).subscribe((resp: any) => {
      this.regs = resp.data;
      this.totalPage = 1;
    });
  }

  keyupSearch(e: any)
  {
    if (e.keyCode === 13)
    {
      this.search();
    }
  }

  delete(id: string, idx: number){
    Swal.fire(
      {
        title: 'Eliminar Registro',
        text: '¿Desea Eliminar el Registro?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Eliminar'
      }
    ).then((result)=> {
      if (result.isConfirmed){
        this.api.delete('product', id).subscribe(
          (resp:any) =>
          {
            if (resp.error) {
              Swal.fire('Error el Eliminar el Registro', 'se presentó un error al eliminar el registro', 'error');
            } else {
              this.regs.splice(idx,1);
              Swal.fire('Registro Eliminado', '', 'success');
            }
          }
        );
      }
    });
  }
  back(){
    if (this.currentPage>0){
      this.currentPage --;
      this.search();
    }
  }
  next(){
    this.currentPage++;
    this.search();
  }

}
