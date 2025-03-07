import { IProductItem } from '../../types';

export interface IBasket {
    productsInBasket: IProductItem[];
}

export class BasketModel implements IBasket {
    productsInBasket: IProductItem[];

    constructor() {
        this.productsInBasket = [];
    }

    get itemsInBasket() {
        return this.productsInBasket;
    }

    addItemToBasket(item: IProductItem) {
        if (!this.itemsInBasket.includes(item)) {
            this.productsInBasket.push(item);
        }
    }

    get counter() {
        return this.productsInBasket.length;
    }

    clearBasket() {
        this.productsInBasket = [];
    }

    get totalCost() {
        return this.productsInBasket.reduce(function(totalPrice, currentProduct) {
            return totalPrice + currentProduct.price;
        }, 0);
    }

    get itemsList(): string[] {
        return this.itemsInBasket.map((item)=> item.id)
    }

    removeItemFromBasket(itemToDelete: IProductItem) {
        this.productsInBasket = this.productsInBasket.filter(item => item.id !== itemToDelete.id);
    }
}