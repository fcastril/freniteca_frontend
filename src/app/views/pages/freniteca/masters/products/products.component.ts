import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LogicalOperators } from 'src/app/enums/logicalOperators.enum';
import { Operations } from 'src/app/enums/operations.enum';
import { PaginateModel } from 'src/app/models/paginate.model';
import { ProductModel } from 'src/app/models/product.model';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {



  regs: ProductModel[] = [];
  searchText: '';
  title = "Productos";
  currentPage: number = 1;
  pageCount: number = 10;
  totalPage: number = 0;
  urlImages: string = '';
  isView: boolean = false;

  constructor(private route: Router, private api: ApiService, private rout: ActivatedRoute) {
    this.urlImages = environment.urlImages;
   }

  ngOnInit(): void {
    var param = this.rout.snapshot.paramMap.get('view') 
    this.isView = param==='ppal' ??false;
    this.search();
  }

  Submit(Form: NgForm) { }

  register(id: string){
    if(id=== '') {
      this.route.navigateByUrl('/masters/products/admin/'+id);
    }
  }

  search(){
    
    //TODO: armar objeto para paginar

    var paginate: PaginateModel = {
      count: this.pageCount,
      page: this.currentPage,
      filters: [
        { property: 'code', value: this.searchText, operator: Operations.Contains, conditional: LogicalOperators.Or },
        { property: 'reference', value: this.searchText, operator: Operations.Contains, conditional: LogicalOperators.Or },
        { property: 'referenceProvider', value: this.searchText, operator: Operations.Contains, conditional: LogicalOperators.Or },
        { property: 'description', value: this.searchText, operator: Operations.Contains, conditional: LogicalOperators.Or },
      ],
      orders: [],
      rowsTotal:0,
      pagesTotal:0,
      data:[]
    };

    this.api.paginate('product', paginate).subscribe(
      (resp: any)=>{
        this.regs = resp.data.data;
        this.totalPage = resp.data.pagesTotal;
      }
    );
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
