import { BaseModel } from "./base.model";
import { TypeProductAttributeModel } from "./typeProductAttribute.model";

export class ProductAttributeModel extends BaseModel {
    productId: string;
    typeProductAttributeId: string;
    typeProductAttributeNavigation: TypeProductAttributeModel;
    value: string;
}