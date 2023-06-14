import { BaseModel } from "./base.model";

export class SellerModel extends BaseModel{
    code: string;
    name: string;
    email: string;
    cellphone: string;
    userId: string;
    sellerEquivalenceId: string;
}