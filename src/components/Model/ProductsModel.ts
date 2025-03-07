import { IProductItem } from '../../types';
import { IEvents } from '../base/events';

export class ProductsModel {
    protected items: IProductItem[];

    constructor(protected events: IEvents) {
        this.items = [];
    };

    set productItems(items: IProductItem[]) {
        this.items = items;
        // Если ответ пришел с непустым списком - шлем событие об успешном загрузке списка товаров
        if (this.items.length !== 0) {
            this.events.emit('product-cards:loaded');
        }
    }

    get productItems() {
        return this.items;
    }
}