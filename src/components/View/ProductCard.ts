import { ensureElement, priceFormatter, imageLinkFormatter } from '../../utils/utils';
import { IProductItem } from '../../types';
import { CDN_URL } from '../../utils/constants';
import { EventEmitter } from '../base/events';
import {Component} from "../base/Component"

export class ProductCard extends Component<IProductItem> {
    protected container: HTMLElement;
    protected productCardImage: HTMLImageElement;
    protected productCardTitle: HTMLElement;
    protected productCardCategory: HTMLElement;
    protected productCardPrice: HTMLElement;
    protected productCardId: string;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.productCardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.productCardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.productCardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.productCardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    }

    set id(value: string) {
        this.productCardId = value;
    }

    set title(value: string) {
        this.setText(this.productCardTitle, value);
    }

    get title() {
        return this.productCardTitle.textContent;
    }

    set image(value: string) {
        this.setImage(this.productCardImage, imageLinkFormatter(CDN_URL, value), this.title);
    }

    set price(value: number | null) {
        this.setText(this.productCardPrice, priceFormatter(value))
    }

    set category(value: string) {
        this.setText(this.productCardCategory, value);
        switch(value) {
            case 'софт-скил':
                this.productCardCategory.classList.add('card__category_soft');
                break;
            case 'другое':
                this.productCardCategory.classList.add('card__category_other');
                break;
            case 'дополнительное':
                this.productCardCategory.classList.add('card__category_additional');
                break;
            case 'кнопка':
                this.productCardCategory.classList.add('card__category_button');
                break;
            case 'хард-скил':
                this.productCardCategory.classList.add('card__category_hard');
                break;
            default:
                this.productCardCategory.classList.add('card__category_other');
        }
    }

    // Приватный метод для добавления обработчика
    private addClickHandler(data: Partial<IProductItem>) {
        this.container.addEventListener('click', () =>
            this.events.emit('product-card:opened', { productData: data })
        );
    }

    render(data: Partial<IProductItem>): HTMLElement {
        super.render(data);
        //this.container.addEventListener('click', ()=> this.events.emit('product-card:opened', {productData: data}));
        this.addClickHandler(data);
        return this.container;
    }

}