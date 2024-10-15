import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LogicalOperators } from 'src/app/enums/logicalOperators.enum';
import { Operations } from 'src/app/enums/operations.enum';
import { PaginateModel } from 'src/app/models/paginate.model';
import { UserModel } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  regs: UserModel[]=[];
  searchText: "";
  title = "Usuarios";
  currentPage: number = 1;
  pageCount: number = 10;
  totalPage: number = 0;
  isLoading: boolean = false;

  constructor(private route: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.search();
  }

  search() {
    this.isLoading = true;
    var paginate: PaginateModel = {
      count: this.pageCount,
      page: this.currentPage,
      filters: [
        {
          property: "userName",
          value: this.searchText,
          operator: Operations.Contains,
          conditional: LogicalOperators.Or,
        },
        {
          property: "name",
          value: this.searchText,
          operator: Operations.Contains,
          conditional: LogicalOperators.Or,
        },
      ],
      orders: [],
      rowsTotal: 0,
      pagesTotal: 0,
      data: [],
    };

    this.api.paginate("user", paginate).subscribe((resp: any) => {
      this.regs = resp.data.data;
      this.totalPage = resp.data.pagesTotal;
      this.isLoading = false;
    });
  }

  Submit(Form: NgForm) {}

  register(id: string) {
    if (id === "") {
      this.route.navigateByUrl("/security/users/" + id);
    }
  }

  keyupSearch(e: any) {
    if (e.keyCode === 13) {
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
        this.api.delete("user", id).subscribe((resp: any) => {
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
    this.search();
  }
}
