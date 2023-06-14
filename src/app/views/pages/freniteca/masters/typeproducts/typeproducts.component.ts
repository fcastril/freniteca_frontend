import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typeproducts',
  templateUrl: './typeproducts.component.html',
  styleUrls: ['./typeproducts.component.scss']
})
export class TypeproductsComponent implements OnInit {

  
  title = "Tipos de Productos"

  constructor() { }

  ngOnInit(): void {
  }

  Submit(Form: NgForm) { }

  register(id: number){
    if(id=== 0) {
      this.route.navigate(['titulos','0']);
    }
  }

  searchTitle(){
    this.api.getSearch('Titles', this.search).subscribe(
      (resp: any)=>{
        this.regs = resp;
      }
    );
  }

  keyupSearch(e: any)
  {
    if (e.keyCode === 13)
    {
      this.searchTitle();
    }
  }

  delete(id: number, idx: number){
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
        this.api.delete('Titles', id).subscribe(
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
