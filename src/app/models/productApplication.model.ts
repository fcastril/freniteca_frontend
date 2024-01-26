import { ApplicationModel } from "./application.model";
import { BaseModel } from "./base.model";
import { ProductModel } from "./product.model";

export class ProductApplicationModel extends BaseModel {
    productId: string;
    productNavigation: ProductModel;
    applicationId: string;
    applicationNavigation: ApplicationModel;
    value: string;
}