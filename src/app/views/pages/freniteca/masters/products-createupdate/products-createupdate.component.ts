import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationModel } from "src/app/models/application.model";
import { BrandModel } from "src/app/models/brand.model";
import { ProductModel } from "src/app/models/product.model";
import { ProductApplicationModel } from "src/app/models/productApplication.model";
import { ProductApplicationViewModel } from "src/app/models/productApplicationView.model";
import { ProductAttributeModel } from "src/app/models/productAttribute.model";
import { ProductAttributeViewModel } from "src/app/models/productAttributeView.model";
import { ProductViewModel } from "src/app/models/productView.model";
import { TypeProductModel } from "src/app/models/typeProduct.model";
import { TypeProductAttributeModel } from "src/app/models/typeProductAttribute.model";
import { ApiService } from "src/app/services/api.service";
import { ProductApplicationService } from "src/app/services/product-application.service";
import { ProductAttributeService } from "src/app/services/product-attribute.service";
import { ProductService } from "src/app/services/product.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-products-createupdate",
  templateUrl: "./products-createupdate.component.html",
  styleUrls: ["./products-createupdate.component.scss"],
})
export class ProductsCreateupdateComponent implements OnInit {
  frm = this.fb.group({
    code: ["", Validators.required],
    productApplications: this.fb.array([]),
    typeProductId: ["", Validators.required],
    productEquivalenceId: [""],
    brandId: ["", Validators.required],
    productAttributes: this.fb.array([]),
    images: this.fb.array([]),
    price1: [0],
    price2: [0],
    price3: [0]
  });

  imagenSeleccionada = "";
  id: string;
  title = "Productos";
  subtitle: string;
  reg: ProductModel = new ProductModel();
  ProductAttributes: ProductAttributeModel[] = [];
  ProductApplications: ProductApplicationModel[] = [];
  typeProducts: TypeProductModel[] = [];
  brands: BrandModel[] = [];
  Applications: ApplicationModel[] = [];
  ApplicationsFull : ApplicationModel[] = [];
  typeProductsAttributes: TypeProductAttributeModel[] = [];
  urlImages: string = "";
  listImagenes: string[] = [];
  productViewModel: ProductViewModel = new ProductViewModel();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private productAttributeService: ProductAttributeService,
    private productApplicationService: ProductApplicationService,
    private productService: ProductService
  ) {
    this.urlImages = environment.urlImages;
  }

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get("id") ?? "";

    await this.getTypeProducts();
    await this.getBrands();
    await this.getApplications();

    if (this.id === "0") {
      this.subtitle = "CREANDO";
      this.reg = new ProductModel();
      await this.setFields();
    } else {
      this.subtitle = "EDITANDO";

      await this.api.getId("product", this.id).subscribe(async (resp: any) => {
        this.reg = resp.data;
        await this.setFields();
        await this.productService
          .getFiles(this.reg.code)
          .subscribe((resp: any) => {
            if (resp.status) {
              this.listImagenes = resp.data;
              this.imagenSeleccionada = this.listImagenes[0];
            }
          });

        this.typeProductsAttributes = [];
        await this.api
          .getCustom(
            "typeProductAttribute",
            "ListByTypeProductId",
            "TypeProductId",
            this.reg.typeProductId
          )
          .subscribe((resp: any) => {
            this.typeProductsAttributes = resp.data;

            this.api
              .getCustom(
                "productattribute",
                "listbyProductId",
                "ProductId",
                this.id
              )
              .subscribe((resp: any) => {
                this.ProductAttribute.clear();
                if (resp.status) {
                  this.ProductAttributes = resp.data;
                  this.typeProductsAttributes.forEach(
                    (element: TypeProductAttributeModel) => {
                      var res = this.ProductAttributes.filter(
                        (x) => x.typeProductAttributeId == element.id
                      );
                      if (res.length > 0) {
                        element.value = res[0].value;
                      }
                    }
                  );

                  this.loadProductAttributes();
                }
              });
          });

        await this.api
          .getCustom(
            "productApplication",
            "listbyProductId",
            "ProductId",
            this.id
          )
          .subscribe((resp: any) => {
            this.ProductAttribute.clear();
            if (resp.status) {
              this.ProductApplications = resp.data;
              this.loadProductApplications();
            }
          });
      });
    }
  }

  async getTypeProducts() {
    this.api.get("typeProduct").subscribe((resp: any) => {
      if (resp.status) {
        resp.data.unshift({
          id: "",
          code: "",
          description: "Seleccione un tipo de producto",
          dateCreation: new Date(),
          dateLastUpdate: new Date(),
          status: "active",
        });
        this.typeProducts = resp.data;
      }
    });
  }
  disabledAll() {
    this.frm.controls["code"].disable();
    this.frm.controls["brandId"].disable();
    this.frm.controls["typeProductId"].disable();
    this.frm.controls["price1"].disable();
    this.frm.controls["price2"].disable();
    this.frm.controls["price3"].disable();
  }
  async getBrands() {
    this.api.get("brand").subscribe((resp: any) => {
      if (resp.status) {
        resp.data.unshift({
          id: "",
          code: "",
          description: "Seleccione una marca",
          dateCreation: new Date(),
          dateLastUpdate: new Date(),
          status: "active",
        });
        this.brands = resp.data;
      }
    });
  }
  async getApplications() {
    this.api.get("application").subscribe((resp: any) => {
      if (resp.status) {
        resp.data.unshift({
          id: "",
          code: "",
          description: "Seleccione una aplicación",
          dateCreation: new Date(),
          dateLastUpdate: new Date(),
          status: "active",
        });
        this.Applications = resp.data;
        this.ApplicationsFull = [...resp.data];
      }
    });
  }
  Submit() {
    if (this.frm.invalid) {
      Object.values(this.frm.controls).forEach((ctrl) => {
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
        this.setValues();
        console.clear();
        console.log('productViewModel', this.productViewModel);
        this.productViewModel.id = this.id;

        if (this.productViewModel.id === "0") {
          this.productViewModel.id = uuidv4();

        }

        this.api.postCustom("product", "createUpdateWithViewModel", this.productViewModel).subscribe((resp: any) => {
          if (resp.status) {
            Swal.fire({
              title: "Guardado",
              text: "El registro ha sido guardado",
              icon: "success",
            });
            this.router.navigateByUrl("/products/crud");
          } else {
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error al guardar el registro",
              icon: "error",
            });
          }
        });
       
      }
    });
  }

  setValues() {
    this.productViewModel = new  ProductViewModel();

    this.productViewModel.id = this.id=='0'?'':this.id;
    this.productViewModel.code = this.frm.get('code')?.value??'';
    this.reg.code = this.productViewModel.code;
  
    this.reg.typeProductId = this.frm.get("typeProductId")?.value ?? "";
    
    let typeProduct = this.typeProducts.find(
      (x) => x.id == this.reg.typeProductId);

    this.productViewModel.typeProduct = {
      code : typeProduct.code,
      description: typeProduct.description
    };

    this.reg.brandId = this.frm.get("brandId")?.value ?? "";

    let brand = this.brands.find(
      x => x.id == this.reg.brandId
    );
    this.productViewModel.brand = {
      code : brand.code,
      description: brand.description
    };

    this.reg.price1 = this.frm.get("price1")?.value ?? 0;
    this.productViewModel.price1 = this.reg.price1;
    this.reg.price2 = this.frm.get("price2")?.value ?? 0;
    this.productViewModel.price2 = this.reg.price2;
    this.reg.price2 = this.frm.get("price2")?.value ?? 0;
    this.productViewModel.price3 = this.reg.price3;
    this.productViewModel.applications = [];

    
    this.frm.controls["productApplications"].value.forEach((x: any) => {
      let applicationIdx: number = this.ApplicationsFull.findIndex(a => a.id === x.applicationId);
      let application: ApplicationModel = this.ApplicationsFull[applicationIdx];
      let app: ProductApplicationViewModel = {
        assembler: application.assemblerDescription,
        description: application.description,
        value: x.value
      };
      this.productViewModel.applications.push(app);
    });
    
    
    
    this.productViewModel.attributes = [];

    this.frm.controls["productAttributes"]
    .value.forEach((x: any) => {
      
      let attribute: ProductAttributeViewModel = {
        name: x.descriptionTypeProduct,
        value: x.value
      };
      this.productViewModel.attributes.push(attribute);
    });
  }
  async setFields() {
    this.frm.controls["code"].setValue(this.reg.code);
    if (this.id !== "0"){
      this.frm.controls["code"].disable();
    }
    this.frm.controls["brandId"].setValue(this.reg.brandId);
    this.frm.controls["typeProductId"].setValue(this.reg.typeProductId);
    if (this.id !== "0") {
      this.frm.controls["typeProductId"].disable();
    }
    this.frm.controls["price1"].setValue(this.reg.price1);
    this.frm.controls["price2"].setValue(this.reg.price2);
    this.frm.controls["price3"].setValue(this.reg.price3);

    await this.selectedTypeProduct(this.reg.typeProductId);
  }

  get ProductAttribute() {
    return this.frm.controls["productAttributes"] as FormArray;
  }
  addTypeProductAttribute(
    typeProductId: string = "",
    descriptionTypeProduct: string = "",
    value: string = "",
    id: string = ""
  ) {
    const frmDetail = this.fb.group({
      typeProductId: [typeProductId],
      descriptionTypeProduct: [descriptionTypeProduct],
      value: [value, Validators.required],
      id: [id],
    });
    this.ProductAttribute.push(frmDetail);
  }
  loadProductAttributes() {
    this.typeProductsAttributes.sort((a, b) => a.order - b.order)
    .forEach((element: any) => {
      this.addTypeProductAttribute(
      element.typeProductId,
      element.name,
      element.value,
      element.id
      );
    });
  }

  get ProductApplication() {
    return this.frm.controls["productApplications"] as FormArray;
  }
  addApplication(
    applicationId: string = "",
    id: string = "",
    value: string = "",
    application: ApplicationModel
  ) {
    const frmDetail = this.fb.group({
      applicationId: [applicationId],
      application: [application],
      id: [id],
      value: [value],
    });
    this.ProductApplication.push(frmDetail);
  }
  deleteApplication(idx: number) {
    var reg = this.ProductApplication.at(idx);
    if (reg.value.id != "") {
      this.api
        .delete("ProductApplication", reg.value.id)
        .subscribe((resp: any) => {
          if (resp.status) {
            this.Applications.push(reg.value["application"]);
          }
        });
    }
    this.ProductApplication.removeAt(idx);
  }
  selectedApplication(idx: number, id: string, application: ApplicationModel) {
    
    var reg = this.ProductApplication.at(idx);
    this.ProductApplication.removeAt(idx);
    reg.value.applicationId = application.id;
    reg.value.id = this.id;
    var regEncontrar = this.Applications.findIndex((x) => x.id == id);
    reg.value.application = application;
    this.Applications.splice(regEncontrar, 1);
    this.ProductApplication.push(reg);
  }
  loadProductApplications() {
    this.ProductApplications.forEach((element: any) => {
      this.addApplication(
        element.applicationId,
        element.applicationId,
        element.value,
        element.applicationNavigation
      );
    });
  }
  async selectedTypeProduct(id: string) {
    this.typeProductsAttributes = [];
    this.ProductAttribute.clear();
    await this.api
      .getCustom(
        "typeProductAttribute",
        "ListByTypeProductId",
        "TypeProductId",
        id
      )
      .subscribe((resp: any) => {
        this.typeProductsAttributes = resp.data;
        this.loadProductAttributes();
      });
  }

  get Images() {
    return this.frm.controls["images"] as FormArray;
  }

  addImage() {
    const img = this.fb.group({
      data: [""],
      doc: [],
      type: [],
    });
    this.Images.push(img);
  }
  handleFileInput(event: any, imgReg: any) {
    if (event.target.files.length) {
      var fileTypes = ["jpg", "jpeg", "png", "pdf"]; //acceptable file types
      var extension = event.target.files[0].name.split(".").pop().toLowerCase(), //file extension from input file
        isSuccess = fileTypes.indexOf(extension) > -1; //is extension in acceptable types
      if (isSuccess) {
        //yes
        // start file reader
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            imgReg.controls["doc"].setValue(event.target?.result);
            imgReg.controls["type"].setValue(extension);
          }
        };
        reader.readAsDataURL(event.target.files[0]);
      } else {
        //no
        Swal.fire(
          "Selección de Archivo",
          "Solo se permiten las siguientes extensiones de archivos: PNG, JPG, JPGE, PDF",
          "error"
        );
      }
    }
  }

  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  back() {
    this.router.navigateByUrl("/products/crud");
  }
  seleccionarImagen(img: string) {
    this.imagenSeleccionada = img;
  }
}
