import { BaseComponent } from '../views/layout/base/base.component';
import { BrandViewModel } from './brandView.model';
import { ProductApplicationViewModel } from './productApplicationView.model';
import { ProductAttributeViewModel } from './productAttributeView.model';
import { ProductDocument } from './productDocument.model';
import { TypeProductViewModel } from './typeProductView.model';
export class ProductViewModel {
    id: string = '';
    code: string = '';
    typeProduct: TypeProductViewModel = new TypeProductViewModel();
    brand: BrandViewModel = new BrandViewModel();
    principalImage: string = '';
    price1: number = 0;
    price2: number = 0;
    price3: number = 0;
    applications: ProductApplicationViewModel[] =[];
    attributes: ProductAttributeViewModel[]=[];
    documents: ProductDocument[]=[];

}