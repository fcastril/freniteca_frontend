import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Constants } from "src/app/common/constants";
import { LogicalOperators } from "src/app/enums/logicalOperators.enum";
import { Operations } from "src/app/enums/operations.enum";
import { ApplicationModel } from "src/app/models/application.model";
import { BrandModel } from "src/app/models/brand.model";
import { PaginateModel } from "src/app/models/paginate.model";
import { ProductModel } from "src/app/models/product.model";
import { SearchModel } from "src/app/models/search.model";
import { TypeProductModel } from "src/app/models/typeProduct.model";
import { TypeProductAttributeModel } from "src/app/models/typeProductAttribute.model";
import { ApiService } from "src/app/services/api.service";
import { ProductService } from "src/app/services/product.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent implements OnInit {
  frm = this.fb.group({
    code: [""],
    description: [""],
    brandId: [""],
    typeProductId: [""],
    application: [""],
  });

  regs: ProductModel[] = [];
  searchText: "";
  title = "Productos";
  currentPage: number = 1;
  pageCount: number = 12;
  totalPage: number = 0;
  urlImages: string = "";
  typeProducts: TypeProductModel[] = [];
  Applications: ApplicationModel[] = [];
  brands: BrandModel[] = [];
  typeProductsAttributes: TypeProductAttributeModel[] = [];
  isLoading: boolean = false;
  dateNew: Date = new Date();

  isShowPrice: boolean = false;
  isShowDateCreation: boolean = false;
  roleId = atob(localStorage.getItem(environment.roleId));

  constructor(
    private route: Router,
    private fb: FormBuilder,
    private api: ApiService,
    private productService: ProductService,
    private rout: ActivatedRoute,
    private http: HttpClient
  ) {
    this.urlImages = environment.urlImages;
    this.isShowPrice =
      this.roleId == Constants.roles.administrator ||
      this.roleId == Constants.roles.operator ||
      this.roleId == Constants.roles.distribuitor;

    this.isShowDateCreation =
      this.roleId == Constants.roles.administrator ||
      this.roleId == Constants.roles.operator ;
  }

  async ngOnInit(): Promise<void> {
    await this.getTypeProducts();
    await this.getBrands();
    await this.getApplications();
    this.currentPage = 1;
    this.search();

    this.dateNew.setMonth(this.dateNew.getMonth() - environment.monthsNew);
  }

  async getBrands() {
    this.api.get("brand").subscribe((resp: any) => {
      if (resp.status) {
        resp.data.unshift({
          id: "",
          code: "",
          description: "Seleccione una marca de producto - fabricante",
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
          description:
            "Seleccione una aplicación - marca o modelo del vehículo",
          dateCreation: new Date(),
          dateLastUpdate: new Date(),
          status: "active",
        });
        this.Applications = resp.data;
      }
    });
  }
  async getTypeProducts() {
    this.api.get("typeProduct").subscribe((resp: any) => {
      if (resp.status) {
        resp.data.unshift({
          id: "",
          code: "",
          description: "Seleccione un producto",
          dateCreation: new Date(),
          dateLastUpdate: new Date(),
          status: "active",
        });
        this.typeProducts = resp.data;
      }
    });
  }

  async selectedTypeProduct(id: string) {}

  limpiarBusqueda() {
    this.currentPage = 1;
    this.frm.controls["code"].setValue("");
    this.frm.controls["description"].setValue("");
    this.frm.controls["brandId"].setValue("");
    this.frm.controls["typeProductId"].setValue("");
    this.frm.controls["application"].setValue("");
    
    this.search();
  }
  Submit() {
    this.currentPage = 1;
    this.search();
  }

  viewRegister(id: string) {
    this.route.navigateByUrl("/search/productsView/" + id);
  }

  search() {
    //TODO: armar objeto para paginar
    this.isLoading = true;

    let search: SearchModel = {
      code: this.frm.controls["code"].value ?? "",
      description: this.frm.controls["description"].value ?? "",
      brandId: this.frm.controls["brandId"].value ?? "",
      typeProductId: this.frm.controls["typeProductId"].value ?? "",
      application: this.frm.controls["application"].value ?? "",
      pageNo: this.currentPage,
      count: this.pageCount,
    };

    this.productService.postSearch(search).subscribe((resp: any) => {
      this.regs = resp.data.data.sort((a: any, b: any) => a.dateCreation - b.dateCreation);
      this.totalPage = resp.data.pagesTotal;
      this.isLoading = false;
    });
  }

  keyupSearch(e: any) {
    if (e.keyCode === 13) {
      this.currentPage = 1;
      this.search();
    }
  }

  delete(id: string, idx: number) {
    Swal.fire({
      title: "Eliminar Registro",
      text: "¿Desea Eliminar el Registro?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete("product", id).subscribe((resp: any) => {
          if (resp.error) {
            Swal.fire(
              "Error el Eliminar el Registro",
              "se presentó un error al eliminar el registro",
              "error"
            );
          } else {
            this.regs.splice(idx, 1);
            Swal.fire("Registro Eliminado", "", "success");
          }
        });
      }
    });
  }
  back() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.search();
    }
  }
  next() {
    this.currentPage++;
    console.log("next", this.currentPage, this.totalPage);
    console.log(" ------------------------ ");
    this.search();
  }
}
