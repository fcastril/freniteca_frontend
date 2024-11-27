import { BaseModel } from "./base.model";
import { BrandModel } from "./brand.model";
import { TypeProductModel } from "./typeProduct.model";

export class ProductModel extends BaseModel{
    code: string='';
    typeProductId: string='';
    typeProductNavigation: TypeProductModel = new  TypeProductModel();
    brandId: string='';
    brandNavigation: BrandModel = new BrandModel();
    principalImage: string='';
    price1: number=0;
    price2: number=0;
    price3: number=0;


    
}