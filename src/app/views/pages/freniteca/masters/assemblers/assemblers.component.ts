import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LogicalOperators } from 'src/app/enums/logicalOperators.enum';
import { Operations } from 'src/app/enums/operations.enum';
import { AssemblerModel } from 'src/app/models/assembler.model';
import { filterModel } from 'src/app/models/filter.model';
import { PaginateModel } from 'src/app/models/paginate.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assemblers',
  templateUrl: './assemblers.component.html',
  styleUrls: ['./assemblers.component.scss']
})
export class AssemblersComponent implements OnInit {


  regs: AssemblerModel[] = [];
  searchText: '';
  title = "Ensambladoras";
  currentPage: number = 1;
  pageCount: number = 10;
  totalPage: number = 0;

  constructor(private route: Router, private api: ApiService) { }

  ngOnInit(): void {
    this.searchText = '';
    this.search();
  }

  Submit(Form: NgForm) { }

  register(id: string){
    console.log(id);
    if(id=== '0') {
      console.log('abrir master/assemblers-createupdate');
      this.route.navigateByUrl('/masters/assemblers/'+id);
    }
  }

  search(){
    
    //TODO: armar objeto para paginar
console.log('searchText', this.searchText);


    let filtersData: filterModel[]= [];
    
    if (this.searchText !== ''){
      filtersData = [
        { property: 'code', value: this.searchText, operator: Operations.Contains, conditional: LogicalOperators.Or },
        { property: 'description', value: this.searchText, operator: Operations.Contains, conditional: LogicalOperators.Or },
      ]
    }



    var paginate: PaginateModel = {
      count: this.pageCount,
      page: this.currentPage,
      filters: filtersData,
      orders: [],
      rowsTotal:0,
      pagesTotal:0,
      data:[]
    };
    
    this.api.paginate('assembler', paginate).subscribe(
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
      console.log('searchText', this.searchText);
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
        this.api.delete('assembler', id).subscribe(
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
