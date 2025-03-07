import { EventEmitter } from '../base/events';
import {Component} from "../base/Component";
import {IOrderForm} from "../../types";
import {ensureElement} from "../../utils/utils";


export class OrderDeliveryForm extends Component<IOrderForm> {
    protected container: HTMLElement;
    protected paymentTypeOnlineButton: HTMLButtonElement;
    protected paymentTypeOnDeliveryButton: HTMLButtonElement;
    protected deliveryAddressInputField: HTMLInputElement;
    protected orderButtonToContacts: HTMLButtonElement;
    protected formErrors: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.paymentTypeOnDeliveryButton = ensureElement<HTMLButtonElement>('[name="cash"]', this.container);
        this.paymentTypeOnlineButton = ensureElement<HTMLButtonElement>('[name="card"]', this.container);
        this.deliveryAddressInputField = ensureElement<HTMLInputElement>('[name="address"]', this.container);
        this.orderButtonToContacts = ensureElement<HTMLButtonElement>('.order__button', this.container);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
    }

    cash() {
        this.paymentTypeOnDeliveryButton.classList.add('button_alt-active');
        this.paymentTypeOnlineButton.classList.remove('button_alt-active');
        this.validateDeliveryForm();
    }

    card() {
        this.paymentTypeOnlineButton.classList.add('button_alt-active');
        this.paymentTypeOnDeliveryButton.classList.remove('button_alt-active');
        this.validateDeliveryForm();
    }

    // Валидация оплаты на всякий случай
    validateDeliveryForm() {
        // Если выбран один из способ оплаты и поле адреса непустое - форма валидна
        const isPaymentSelected = this.paymentTypeOnlineButton.classList.contains('button_alt-active') ||
            this.paymentTypeOnDeliveryButton.classList.contains('button_alt-active');
        const isAddressFilled = this.deliveryAddressInputField.value.trim() !== '';
        // Активируем кнопку, если оба условия выполнены
        if (isPaymentSelected && isAddressFilled) {
            this.setDisabled(this.orderButtonToContacts, false);
            this.setText(this.formErrors, '')
        } else {
            this.setDisabled(this.orderButtonToContacts, true);
            this.setText(this.formErrors, 'Введите адрес доставки');
        }
    }

    render(): HTMLElement {

        // По умолчанию выбран способ оплаты - Онлайн
        this.card();

        this.orderButtonToContacts.addEventListener('click', ()=> {
            this.events.emit('order:next', {});
        });

        this.paymentTypeOnlineButton.addEventListener('click', ()=> {
            this.card();
            this.events.emit('order:card', {});
        });

        this.paymentTypeOnDeliveryButton.addEventListener('click', ()=> {
            this.cash();
            this.events.emit('order:cash', {});
        });

        // Обработчик для поля адреса
        this.deliveryAddressInputField.addEventListener('input', () => {
            this.events.emit('order:deliveryAddress', { address: this.deliveryAddressInputField.value });
            this.validateDeliveryForm(); // Проверяем валидность формы при изменении поля
        });

        this.validateDeliveryForm();
        return this.container;
    }
}