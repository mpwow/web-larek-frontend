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
                    throw new Error('Ошибка формата ответа от сервера');
                }
            })
            .catch((err) => {
                console.log('Ошибка при получении списка товаров:', err);
                throw new Error('Ошибка при получении списка товаров');
            });
    }

    postOrder(order:IOrderRequest): Promise<IOrderResponse> {
        return this.post('/order', order)
            .then((data: IOrderResponse) => {
                return data;
            })
            .catch((err) => {
                console.error('Ошибка при отправке заказа:', err);
                throw new Error('Не удалось отправить заказ');
            });
    }
}