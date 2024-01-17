import { BaseModel } from "./base.model";

export class ProductModel extends BaseModel{
    code: string;
    typeProductId: string;
    brandId: string;
    principalImage: string;
    precio1: number;
    precio2: number;
    precio3: number;
    
}