import './scss/styles.scss';
import {ApiModel} from "./components/Model/ApiModel";
import {API_URL} from "./utils/constants";
import { ProductsModel } from './components/Model/ProductsModel';
import { EventEmitter } from './components/base/events';
import {Page} from "./components/View/Page";
import {ProductCard} from "./components/View/ProductCard";
import {cloneTemplate} from "./utils/utils";
import {Modal} from "./components/View/Modal";
import {IProductItem} from "./types";
import {ProductCardPreview} from "./components/View/ProductCardPreview";
import {BasketModel} from "./components/Model/BasketModel";
import {Basket} from "./components/View/Basket";
import {BasketItem} from "./components/View/BasketItem";
import {OrderModel} from "./components/Model/OrderModel";
import {OrderDeliveryForm} from "./components/View/OrderDeliveryForm";
import {OrderContactsForm} from "./components/View/OrderContactForm";
import {OrderSuccessScreen} from "./components/View/OrderSuccessScreen";

const contentPage = document.querySelector('.page__wrapper') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;

const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;

const basketContainerTemplate = document.querySelector('.basket') as HTMLElement;
const basketItemTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

const orderDeliveryFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const orderContactsFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const orderSuccessTemplate = document.querySelector('#success') as HTMLTemplateElement;

const events = new EventEmitter();
const productsApi = new ApiModel(API_URL);
const products = new ProductsModel(events);
const page = new Page(contentPage, events);
const modal = new Modal(modalContainer, events);
const basket = new BasketModel();
const basketContent = new Basket(basketContainerTemplate, events);
const order = new OrderModel(events);
const orderDeliveryForm = new OrderDeliveryForm(cloneTemplate(orderDeliveryFormTemplate), events);
const orderContactsForm = new OrderContactsForm(cloneTemplate(orderContactsFormTemplate), events);
const orderSuccessScreen = new OrderSuccessScreen(cloneTemplate(orderSuccessTemplate), events);

// Получаем с бэка список товаров и обрабатываем ответ
productsApi.getProducts()
    .then(
        response => {
            products.productItems = response;
        })
    .catch(() => {
        `При получении данных произошла ошибка`
    });

// При успешном получении данных срабатывает событие и отрисовываем карточки на странице
events.on('product-cards:loaded', () => {
    const productsItemsListHTML = products.productItems.map(productItem =>
        new ProductCard(cloneTemplate(cardTemplate), events).render(productItem));
    page.render({itemsList: productsItemsListHTML});
});

// По клику на карточку срабатывает событие, модалка становится видимой и в нее добавляется контент
events.on('product-card:opened', ({productData} : {productData : IProductItem}) => {
    const cardPreview = new ProductCardPreview(cloneTemplate(cardPreviewTemplate), events);
    modal.setContent(cardPreview.render(productData));
    // Проверяем есть ли в корзине этот товар
    // Если есть - кнопка "Купить" меняется на "Удалить из корзины"
    if (basket.itemsInBasket.includes(productData)) {
        cardPreview.changeCardButtonAddToBasketToRemoveFromBasket(productData)
    }
    modal.open();
});

// При нажатии на "Купить" в превью карточки товара
events.on('product-card:add-to-basket', ( cardData : { data: IProductItem }) => {
    basket.addItemToBasket(cardData.data);
    page.counter = basket.counter;
    modal.clearContent()
    modal.close();

});

// При открытии модалки выключается скролл страницы
events.on('modal:opened', () => {
    page.lockScroll();
})

// При закрытии модалки включается скролл страницы
events.on('modal:closed', () => {
    page.lockScroll();
})

// По клику на корзину открывается модалка с корзиной
events.on('basket:opened', () => {
    console.log(basket.itemsInBasket);
    basketContent.itemsInBasket = basket.itemsInBasket.map((item, index) => {
        const basketItem = new BasketItem(cloneTemplate(basketItemTemplate), events);
        basketItem.index = index + 1; // Сеттер индекса элемента для нумерации в корзине
        return basketItem.render(item);
    });

    basketContent.totalPrice = basket.totalCost;
    modal.setContent(basketContent.render());
    modal.open();
});

// По клику на удалить товар в корзине

events.on('item:delete', (itemData: { data: IProductItem }) => {
    // Удаляем элемент из корзины
    basket.removeItemFromBasket(itemData.data);

    basketContent.itemsInBasket = basket.itemsInBasket.map((item, index) => {
        const basketItem = new BasketItem(cloneTemplate(basketItemTemplate), events);
        basketItem.index = index + 1; // Обновляем индексы
        return basketItem.render(item);
    });

    // Обновляем счётчик и общую стоимость
    page.counter = basket.counter;
    basketContent.totalPrice = basket.totalCost;

    // Обновляем содержимое модального окна
    modal.setContent(basketContent.render());
});

// По клику на удалить товар в карточке
events.on('product-card:delete', (itemData: { data: IProductItem }) => {
    // Удаляем элемент из корзины
    basket.removeItemFromBasket(itemData.data);
    // Обновляем счётчик
    page.counter = basket.counter;
    modal.close();
});

// Кликаем по кнопке "Оформить" в корзине - переходим на форму выбора способа оплаты и адреса доставки
events.on('order:start', ()=> {
    modal.clearContent();
    modal.setContent(orderDeliveryForm.render());
    order.orderItems = basket.itemsList;
    order.totalCost = basket.totalCost;
});

events.on('order:card', ()=> {
    order.paymentType = 'online';
});

events.on('order:cash', ()=> {
    order.paymentType = 'cash';
});

events.on('order:deliveryAddress', (eventData: { address: string }) => {
    order.deliveryAddress = eventData.address;
});

events.on('order:next', ()=> {
    modal.clearContent();
    modal.setContent(orderContactsForm.render());
});


events.on('order:email', (eventData: { email: string }) => {
    order.userEmail = eventData.email;
});

events.on('order:phone', (eventData: { phone: string }) => {
    order.userPhone = eventData.phone;
});

events.on('order:done', ()=> {
    productsApi.postOrder(order.orderRequest).then((result) => {
        orderSuccessScreen.totalOrderCost = result.total;

    })
        .then(() => {
            modal.clearContent();
            modal.setContent(orderSuccessScreen.render());
            basket.clearBasket();
            order.orderItems = [];
            page.counter = basket.counter;
            }
        )
    .catch((error) => {
        console.log(`Ошибка при отправке заказа - ${error}`);
    })
})

events.on('order:complete', ()=> {
    modal.close();
})