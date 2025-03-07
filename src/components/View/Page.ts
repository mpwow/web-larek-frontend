import {Component} from "../base/Component"
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/events';

interface IPage {
    itemsList: HTMLElement[];
}

export class Page extends Component<IPage> {
    protected container: HTMLElement;
    protected itemsList: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected basketCounter: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.itemsList = ensureElement('.gallery', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
        this.basketCounter = ensureElement('.header__basket-counter', this.container);
    }

    // Сеттер списка переданных отрендеренных HTML элементов в контейнер на странице
    set products(items: HTMLElement[]) {
        this.itemsList.replaceChildren(...items);
    }

    // Обновляет каунтер количества товаров в корзине
    set counter(value: number) {
        this.setText(this.basketCounter, value);
    }

    // Метод для блокировки страницы - нужен при открытии модального окна
    lockScroll() {
        this.toggleClass(this.container, 'page__wrapper_locked');
    }

    render(data: Partial<IPage>): HTMLElement {
        this.counter = 0;
        this.products = data.itemsList;
        this.basketButton.addEventListener('click', ()=> this.events.emit('basket:opened'));
        return this.container;
    }

}