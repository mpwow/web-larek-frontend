import { EventEmitter } from '../base/events';
import {ensureElement, priceFormatter} from "../../utils/utils";

export class OrderSuccessScreen {
    protected orderSuccessScreenContainer: HTMLElement;
    protected orderCompleteButton: HTMLButtonElement;
    protected orderTotalCost: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        this.orderSuccessScreenContainer = container;
        this.orderCompleteButton = this.orderSuccessScreenContainer.querySelector('.order-success__close');
        this.orderCompleteButton = ensureElement<HTMLButtonElement>('.order-success__close', this.orderSuccessScreenContainer);
        this.orderTotalCost = ensureElement<HTMLElement>('.order-success__description', this.orderSuccessScreenContainer);
    }

    set totalOrderCost(value: number) {
        this.orderTotalCost.textContent = `Списано ${priceFormatter(value)} синапсов`;
    }

    render(): HTMLElement {
        this.orderCompleteButton.addEventListener('click', () => {
            this.events.emit('order:complete', {});
        });
        return this.orderSuccessScreenContainer;
    }
}