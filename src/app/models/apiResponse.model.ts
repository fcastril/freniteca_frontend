export class ApiResponseModel<T>{
    status: boolean;
    message: string;
    data: T;
}