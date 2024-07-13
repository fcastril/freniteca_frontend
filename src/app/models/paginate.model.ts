import { filterModel } from "./filter.model";
import { OrderModel } from "./order.model";

export class PaginateModel{
    count: number;
    page: number;
    filters: filterModel[];
    orders: OrderModel[];
    rowsTotal: number;
    pagesTotal: number;
    data: any
}