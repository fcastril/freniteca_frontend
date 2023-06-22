import { BaseModel } from "./base.model";

export class ProductAttributeModel extends BaseModel {
    productId: string;
    typeProductId: string;
    value: string;
}