import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Direction } from 'src/app/enums/directOrder.enum';
import { LogicalOperators } from 'src/app/enums/logicalOperators.enum';
import { Operations } from 'src/app/enums/operations.enum';
import { PaginateModel } from 'src/app/models/paginate.model';
import { TypeProductModel } from 'src/app/models/typeProduct.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-typeproducts',
  templateUrl: './typeproducts.component.html',
  styleUrls: ['./typeproducts.component.scss']
})
export class TypeproductsComponent implements OnInit {

  regs: TypeProductModel[] = [];
  searchText: '';
  title = "Tipos de Productos";
  currentePage: number = 1;
  pageCount: number = 10;

  constructor(private route: Router, private api: ApiService) { }

  ngOnInit(): void {
    this.search();
  }

  Submit(Form: NgForm) { }

  register(id: string){
    if(id=== '') {
      this.route.navigateByUrl('/masters/typeproducts/'+id);
    }
  }

  search(){
    
    //TODO: armar objeto para paginar

    var paginate: PaginateModel = {
      count: this.pageCount,
      page: this.currentePage,
      filters: [
        { property: 'code', value: this.searchText, operator: Operations.Contains, conditional: LogicalOperators.Or },
        { property: 'description', value: this.searchText, operator: Operations.Contains, conditional: LogicalOperators.Or },
      ],
      orders: [],
      rowsTotal:0,
      pagesTotal:0,
      data:[]
    };
    

    this.api.paginate('typeproduct', paginate).subscribe(
      (resp: any)=>{
        this.regs = resp.data.data;
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
        this.api.delete('typeproduct', id).subscribe(
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

}
