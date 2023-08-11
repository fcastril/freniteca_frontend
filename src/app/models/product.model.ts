import { BaseModel } from "./base.model";

export class ProductModel extends BaseModel{
    code: string;
    reference: string;
    referenceProvider: string;
    description: string;
    typeProductId: string;
    brandId: string;
    
}