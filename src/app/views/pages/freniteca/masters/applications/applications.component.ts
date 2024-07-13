import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LogicalOperators } from 'src/app/enums/logicalOperators.enum';
import { Operations } from 'src/app/enums/operations.enum';
import { ApplicationModel } from 'src/app/models/application.model';
import { PaginateModel } from 'src/app/models/paginate.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {



  regs: ApplicationModel[] = [];
  searchText: '';
  title = "Aplicaciones";
  currentPage: number = 1;
  pageCount: number = 10;
  totalPage: number = 0;
  controller: string = 'application';

  constructor(private route: Router, private api: ApiService) { }

  ngOnInit(): void {
    this.search();
  }

  Submit(Form: NgForm) { }

  register(id: string){
    if(id=== '') {
      this.route.navigateByUrl('/masters/applications/'+id);
    }
  }

  search(){
    
    //TODO: armar objeto para paginar

    var paginate: PaginateModel = {
      count: this.pageCount,
      page: this.currentPage,
      filters: [
        { property: 'code', value: this.searchText, operator: Operations.Contains, conditional: LogicalOperators.Or },
        { property: 'description', value: this.searchText, operator: Operations.Contains, conditional: LogicalOperators.Or },
        { property: 'descriptionAssembler', value: this.searchText, operator: Operations.Contains, conditional: LogicalOperators.Or },


      ],

      orders: [],
      rowsTotal:0,
      pagesTotal:0,
      data:[]
    };
    

    this.api.paginate(this.controller, paginate).subscribe(
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
        this.api.delete(this.controller, id).subscribe(
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
