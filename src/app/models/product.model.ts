import { BaseModel } from "./base.model";
import { BrandModel } from "./brand.model";
import { TypeProductModel } from "./typeProduct.model";

export class ProductModel extends BaseModel{
    code: string;
    typeProductId: string;
    typeProductNavigation: TypeProductModel = new  TypeProductModel();
    brandId: string;
    brandNavigation: BrandModel = new BrandModel();
    principalImage: string;
    price1: number;
    price2: number;
    price3: number;
    
}