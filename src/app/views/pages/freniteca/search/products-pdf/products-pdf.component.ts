import { Component, OnInit } from "@angular/core";
import pdfmake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfmake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-products-pdf",
  templateUrl: "./products-pdf.component.html",
  styleUrls: ["./products-pdf.component.css"],
})
export class ProductsPdfComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  createPdf() {
    const pdfDefinition: any = {
      content: [{ text: "Hello World!", fontSize: 20 }],
    };

    const pdf = pdfmake.createPdf(pdfDefinition);
    pdf.open();
  }
}
