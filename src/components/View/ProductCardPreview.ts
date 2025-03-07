import { ProductCard } from './ProductCard';
import { EventEmitter } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { IProductItem } from '../../types';

export class ProductCardPreview extends ProductCard {
	protected cardText: HTMLElement;
	protected cardButton: HTMLElement;

	constructor(container: HTMLTemplateElement, protected events: EventEmitter) {
		super(container, events);
		this.cardText = ensureElement<HTMLElement>('.card__text', this.container);
		this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
	}

    set description(value: string) {
        this.setText(this.cardText, value);
    };

    // Метод для удаления товара из корзины если открыли карточку с уже добавленным в корзину товаром
    changeCardButtonAddToBasketToRemoveFromBasket(data: IProductItem) {
        this.setText(this.cardButton, 'Удалить из корзины')
        this.cardButton.addEventListener('click', ()=> this.events.emit('product-card:delete', {data}))
    }

	render(data: Partial<IProductItem>): HTMLElement {
        this.price = data.price;
        this.image = data.image;
        this.category = data.category;
        this.title = data.title;
        this.description = data.description
        this.id = data.id;

        // Если в price пришел null - кнопка "Купить" становится неактивной + меняется текст
        if (data.price === null) {
            this.setDisabled(this.cardButton, true);
            this.setText(this.cardButton, 'Недоступно к покупке')
        }

        this.cardButton.addEventListener('click', ()=> this.events.emit('product-card:add-to-basket', {data}))
        return this.container;
	}
}