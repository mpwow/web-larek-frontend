import { EventEmitter } from '../base/events';
import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";
import {IOrderForm} from "../../types";

export class OrderContactsForm extends Component<IOrderForm>{
    protected container: HTMLElement;
    protected deliveryEmailInputField: HTMLInputElement;
    protected deliveryPhoneInputField: HTMLInputElement;
    protected orderButtonToSuccess: HTMLButtonElement;
    protected formErrors: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.deliveryEmailInputField = ensureElement<HTMLInputElement>('[name="email"]', this.container);
        this.deliveryPhoneInputField = ensureElement<HTMLInputElement>('[name="phone"]', this.container);
        this.orderButtonToSuccess = ensureElement<HTMLButtonElement>('.order__complete', this.container);
        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('submit', (event) => {
            this.events.emit('order:done', {});
            event.preventDefault();
        });
    }

    // Метод для проверки валидности формы с контактами
    validateForm() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(\+7|8)[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

        const isPhoneValid = phoneRegex.test(this.deliveryPhoneInputField.value.trim().toLowerCase());
        const isEmailValid = emailRegex.test(this.deliveryEmailInputField.value.trim().toLowerCase());

        // Активируем кнопку, если оба условия выполнены
        if (isPhoneValid && isEmailValid) {
            this.setDisabled(this.orderButtonToSuccess, false);
            this.setText(this.formErrors, '');
        } else if(isEmailValid && !isPhoneValid) {
            this.setDisabled(this.orderButtonToSuccess, true);
            this.setText(this.formErrors, 'Введите номер телефона');
        } else if (!isEmailValid && isPhoneValid) {
            this.setDisabled(this.orderButtonToSuccess, true);
            this.setText(this.formErrors, 'Введите Email');
        } else {
            this.setDisabled(this.orderButtonToSuccess, true);
            this.setText(this.formErrors, 'Введите Email');
        }
    }

    render(): HTMLElement {

        this.deliveryEmailInputField.addEventListener('input', () => {
            this.events.emit('order:email', { email: this.deliveryEmailInputField.value });
            this.validateForm();
        });

        this.deliveryPhoneInputField.addEventListener('input', () => {
            this.events.emit('order:phone', { phone: this.deliveryPhoneInputField.value });
            this.validateForm();
        });

        this.validateForm()
        return this.container;
    }
}