import { EventEmitter } from '../base/events';
import {ensureElement} from "../../utils/utils";

export class Modal {
    protected container: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected contentContainer: HTMLElement;
    protected isOpen: boolean; // Флаг для отслеживания состояния модалки - без него багует закрытие модалки

    constructor(container: HTMLElement, protected events: EventEmitter) {
        this.container = container;
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container) as HTMLButtonElement;
        this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container) as HTMLElement;

        // Закрытие модального окна по клику на кнопку закрытия
        this.closeButton.addEventListener('click', () => this.close());

        // Закрытие модального окна по клику вне его области
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });
        this.isOpen = false; // при создании инстанса класса модалка пока закрыта
    }

    open() {
        this.container.classList.toggle('modal_active');
        this.isOpen = true;
        this.events.emit('modal:opened');
    }

    close() {
        if (this.isOpen) {
            this.container.classList.toggle('modal_active');
            this.clearContent();
            this.isOpen = false;
            this.events.emit('modal:closed');
        }
    }

    setContent(content: HTMLElement) {
        this.contentContainer.appendChild(content);
    }

    clearContent() {
        this.contentContainer.innerHTML = '';
    }
}