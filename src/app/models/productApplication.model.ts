import { BaseModel } from "./base.model";

export class ProductApplicationModel extends BaseModel {
    productId: string;
    applicationId: string;
    value: string;
}