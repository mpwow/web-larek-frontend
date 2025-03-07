export type ItemCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: ItemCategory;
    price: number | null;
}

export interface IOrderRequest {
    payment: string,
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[]
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: string;
}