# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

### IProductItem
Содержит данные одной единицы товара.
```
interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: ItemCategory;
    price: number | null;
}
type ItemCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';
```
### IOrderRequest
Содержит данные для отправки заказа на сервер
```
interface IOrderRequest {
    payment: string,
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[]
}
```
### IOrderResponse
Содержит данные объекта при получении ответа при успешном заказе
```
interface IOrderResponse {
	id: string;
    total: number;
}
```
### IOrderForm
Поля формы (состоит из двух экранов) с заказом
```
interface IOrderForm {
    email: string;
    phone: string;
    address: string;
    payment: string;
}
```

## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие 

### Слой данных

#### Класс ProductsModel
Класс отвечает за хранение и логику работы с данными товаров.\
Конструктор класса принимает экземпляр брокера событий\
В полях класса хранятся следующие данные:
- items: IProductItem[]- массив объектов товаров

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- setProductItems - сеттер для сохранения данных товаров
- getProductItems - геттер для получения данных из поля класса

#### Класс BasketModel
Класс отвечает за хранение и логику работы с данными корзины.\
В полях класса хранятся следующие данные:
- productsInBasket: IProductItem[]- массив объектов товаров в корзине

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- itemsInBasket - геттер для получения списка товаров в корзине
- addItemToBasket - метод для добавления товара в корзине
- counter - геттер для получения количества товаров в списке 
- clearBasket - метод очищает корзину
- totalCost - геттер для получения общей стоимости товаров в корзине
- itemsList - геттер списка айдишников товаров в корзине
- removeItemFromBasket - метод для удаления товаров в корзине

#### Класс OrderModel
Класс отвечает за хранение и логику работы с данными заказа.\
В полях класса хранятся следующие данные:
- payment: данные об оплате заказа. По умолчанию записывается значение 'online' 
- email: данные о почте юзера
- phone: данные об телефоне юзера
- address: адрес юзера
- items: список айдишников товаров в заказе
- total: общая стоимость заказа

Класс представляет набор сеттеров для полей, а также метод геттер orderRequest - возвращает объект с данными

Так же класс предоставляет набор методов для взаимодействия с этими данными.
- itemsInBasket - геттер для получения списка товаров в корзине
- addItemToBasket - метод для добавления товара в корзине
- counter - геттер для получения количества товаров в списке
- clearBasket - метод очищает корзину
- totalCost - геттер для получения общей стоимости товаров в корзине
- itemsList - геттер списка айдишников товаров в корзине
- removeItemFromBasket - метод для удаления товаров в корзине

### Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal
Реализует модальное окно.\
Так же предоставляет методы `open` и `close` для управления отображением модального окна.
- Конструктор принимает контейнер модального окна из разметки и экземпляр класса `EventEmitter` для возможности инициации событий.\
- Метод setContent принимает HTMLElement и отображает его внутри модального окна
- Метод clearContent очищаем содержимое модального окна

#### Класс Page
Реализует главную страницу приложения и отображения на ней списка карточек товаров.\ -
- Конструктор принимает контейнер главной страницы из разметки для отображения в ней контента - списка карточек\
- Сеттер products принимает список HTML-элементов и передает эти элементы в разметку
- Сеттер counter принимает number для отрисовки каунтера на кнопке с корзиной
- Метод lockScroll при вызове включает/выключает скролл в экземпляре класса (используется при открытии/закрытии модалки)
- Метод render принимает объект с типом данных IPage с свойством itemsList, вызывает сеттеры для установки значений в поля basketCounter и itemsList

#### Класс ProductCard
Реализует отображение карточки на главной странице приложения.\ -
- Конструктор принимает контейнер карточки - темплейт из разметки и экземпляр класса `EventEmitter` для возможности инициации событий. \
- Поля класса - элементы для отрисовки карточки
- Сеттеры для установки значений в поля класса
- Метод render принимает объект с типом данных IProductItem и вызывает сеттеры для записи полей объекта в поля инстанса

#### Класс ProductCardPreview
Класс расширяет класс ProductCard и реализует отображение превью карточки по клику.\ -
- Конструктор принимает контейнер превью карточки - темплейт из разметки и экземпляр класса `EventEmitter` для возможности инициации событий. \
- Поля класса - описание товара и кнопка "Купить"
- Сеттер для установки значений в поля класса
- Метод changeCardButtonAddToBasketToRemoveFromBasket - используется для изменения кнопки если товар в карточке уже в коризине
- Метод render принимает объект с типом данных IProductItem и вызывает сеттеры для записи полей объекта в поля инстанса

#### Класс Basket
Класс отображения корзины.\ -
- Конструктор принимает контейнер корзины - темплейт из разметки и экземпляр класса `EventEmitter` для возможности инициации событий. \
- Поля класса - кнопка "Оформить", контейнер под список товаров, элемент для отображения суммы заказа
- Сеттер для суммы заказа и товаров в корзину
- Метод render для отрисовки контейнера в разметку

#### Класс BasketItem
Класс отображения конкретного элемента в корзине.\ -
- Конструктор принимает контейнер отдельного товара - темплейт из разметки и экземпляр класса `EventEmitter` для возможности инициации событий. \
- Поля класса - кнопка с удалением товара, номер товара в списке, название, стоимость
- Сеттер для полей класса
- Метод render для отрисовки контейнера в разметку внутри корзины

#### Класс OrderDeliveryForm
Класс отображения формы заказа с полем ввода адреса и кнопки выбора способа оплаты. По умолчанию выбрана оплата картой.\ -
- Конструктор принимает контейнер формы - темплейт из разметки и экземпляр класса `EventEmitter` для возможности инициации событий. \
- Поля класса - кнопки с выбором способа оплаты, поле ввода адреса, кнопка перехода дальше, элемент для отображения ошибки
- Методы cash и card с отрисовкой кнопок, метод валидации формы
- Метод render для отрисовки контейнера в разметку

#### Класс OrderContactsForm
Класс отображения формы заказа с полями ввода контактов пользователя - адреса почты и номера телефона.\ -
- Конструктор принимает контейнер формы - темплейт из разметки и экземпляр класса `EventEmitter` для возможности инициации событий. \
- Поля класса - инпуты для ввода email и телефона пользователя, кнопка завершения заказа, элемент для отображения ошибки
- Метод валидации формы
- Метод render для отрисовки контейнера в разметку


#### Класс OrderSuccessScreen
Класс отображения экрана успешного заказа.\ -
- Конструктор принимает контейнер отдельного товара - темплейт из разметки и экземпляр класса `EventEmitter` для возможности инициации событий. \
- Поля класса - кнопка для закрытия экрана и элемент для отображения списанной суммы за заказ
- Метод render для отрисовки контейнера в разметку

### Слой коммуникации

#### Класс ApiModel
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.\
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*Список всех событий, которые могут генерироваться в системе:*\
*События изменения данных (генерируются классами моделями данных)*
- `product-cards:loaded` - карточки отобразились на странице

*События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление)*
- `modal:opened` - открытие модального окна
- `modal:closed` - закрытие модального окна
- `product-card:opened` - открытие карточки товара
- `product-card:add-to-basket` - добавление товара в корзину
- `item:delete` - удаление товара в корзине
- `product-card:delete` - удаление товара в карточке
- `order:start` - нажатие на "Оформить" в корзине
- `order:card` - пользователь выбрал оплату картой
- `order:cash` - пользователь выбрал оплату наличными
- `order:deliveryAddress` - пользователь вводит данные в поле адреса
- `order:next` - переход на ввод контактов пользователя
- `order:email` - пользователь вводит данные в поле электронной почты
- `order:phone` - пользователь вводит данные в поле телефона
- `order:done` - сабмит формы с заказом
- `order:complete` - нажатие кнопки на результирующем экране после успешного заказа