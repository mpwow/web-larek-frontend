import { ApiListResponse, Api } from '../base/api';
import {IProductItem, IOrderResponse, IOrderRequest} from '../../types';

export interface IApiModel {
    getProducts(): Promise<IProductItem[]>;
    postOrder(order: IOrderRequest): Promise<IOrderResponse>;
}

export class ApiModel extends Api {
    getProducts(): Promise<IProductItem[]> {
        return this.get('/product')
            .then((response: ApiListResponse<IProductItem>) => {
                if (response && Array.isArray(response.items)) {
                    return response.items;
                } else {
                    return [];
                }
            })
            .catch((err) => {
                console.log('Ошибка при получении списка товаров:', err);
                return [];
            });
    }

    postOrder(order:IOrderRequest): Promise<IOrderResponse> {
        return this.post('/order', order)
            .then((data: IOrderResponse) => {
                return data;
            })
            .catch((err) => {
                console.error('Ошибка при отправке заказа:', err);
                throw {};
            });
    }
}