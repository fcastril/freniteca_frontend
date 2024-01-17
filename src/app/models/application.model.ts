import { BaseModel } from "./base.model";
import { BrandModel } from "./brand.model";

export class ApplicationModel extends BaseModel{
    code: string;
    description: string;
    assemblerId: string;
    assemblerDescription: string;
    assemblerNavigation: BrandModel;
    descriptionFull: string;
}