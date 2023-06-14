import { BaseModel } from "./base.model";

export class ProductModel extends BaseModel{
    code: string;
    reference: string;
    referenceProvider: string;
    description: string;
    aplication: string;
    typeProductId: string;
    productEquivalenceId: string;
    brandId: string;
    
}