import { EventEmitter } from '../base/events';
import { ensureElement, priceFormatter } from '../../utils/utils';
import { IProductItem } from '../../types';
import {Component} from "../base/Component";

export class BasketItem extends Component<IProductItem>{
    protected container: HTMLElement;
    protected itemDelete: HTMLButtonElement;
    protected itemPrice: HTMLElement;
    protected itemCount: HTMLElement
    protected ItemTitle: HTMLElement;
    protected itemId: string;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.itemPrice = ensureElement<HTMLElement>('.card__price', this.container);
        this.ItemTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.itemCount = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.itemDelete = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);
    }

    set price(value: number) {
        this.setText(this.itemPrice, priceFormatter(value));
    }

    set title(value: string) {
        this.ItemTitle.textContent =  value;
    }

    set id(value: string) {
        this.itemId = value;
    }

    get id() {
        return this.itemId;
    }

    // Устанавливаем позицию элемента
    set index(value: number) {
        this.setText(this.itemCount, value);
    }

    render(data: Partial<IProductItem>): HTMLElement {
        this.price = data.price;
        this.title = data.title;
        this.id = data.id;
        this.itemDelete.addEventListener('click', ()=> {
            this.events.emit('item:delete', {data});
        })
        return this.container;
    }
}