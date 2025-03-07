import { EventEmitter } from '../base/events';
import {Component} from "../base/Component";
import {IProductItem} from "../../types";
import { ensureElement, priceFormatter } from '../../utils/utils';

export class Basket extends Component<IProductItem>{
    protected container: HTMLElement;
    protected basketList: HTMLElement;
    protected orderButton: HTMLButtonElement;
    protected totalSum: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalSum = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.button', this.container);
        this.basketList.innerHTML = '';
    }

    set totalPrice(value:number) {
        let i : string
        value === 0 ? i = '' : i = priceFormatter(value);
        this.setText(this.totalSum, i)
    }


    set itemsInBasket(items: HTMLElement[]) {
        this.basketList.replaceChildren(...items);
    }

    render(): HTMLElement {
        this.orderButton.addEventListener('click', ()=> {
            this.events.emit('order:start', {});
        })

        if (this.basketList.innerHTML === '') {
            this.setDisabled(this.orderButton, true);
        } else {
            this.setDisabled(this.orderButton, false);
        }

        return this.container;
    }
}