import { BaseModel } from "./base.model";
import { BrandModel } from "./brand.model";

export class ApplicationModel extends BaseModel{
    code: string;
    description: string;
    brandId: string;
    brandDescription: string;
    brandNavigation: BrandModel;
    descriptionFull: string;
}