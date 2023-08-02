import { BaseModel } from "./base.model";

export class ProductAttributeModel extends BaseModel {
    productId: string;
    typeProductAttributeId: string;
    value: string;
}