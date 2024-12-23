import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LogicalOperators } from 'src/app/enums/logicalOperators.enum';
import { Operations } from 'src/app/enums/operations.enum';
import { BrandModel } from 'src/app/models/brand.model';
import { PaginateModel } from 'src/app/models/paginate.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {


  regs: BrandModel[] = [];
  searchText: '';
  title = "Marcas";
  currentPage: number = 1;
  pageCount: number = 10;
  totalPage: number = 0;
  controller: string = 'brand';

  constructor(private route: Router, private api: ApiService) { }

  ngOnInit(): void {
    this.search();
  }

  Submit(Form: NgForm) { }

  register(id: string){
    if(id=== '') {
      this.route.navigateByUrl('/masters/brands/'+id);
    }
  }

  search(){
    
       this.api
         .postSearchEspecial(this.controller, this.searchText)
         .subscribe((resp: any) => {
           this.regs = resp.data.data;
           this.totalPage = resp.data.pagesTotal;
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
        this.api.delete('brand', id).subscribe(
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
