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

## Архитектура приложения

Приложение реализовано через архитектуру MVP, в которой модели данных инкапсулируют логику хранения и работы с данными и уведомляют об изменениях через брокер событий.
Презентером является точка входа в приложение index.ts в которой описывается вся бизнес-логика и и реакция на события. 

## Основные сущности

* Component — базовый абстрактный класс для UI-компонентов.
* EventEmitter — брокер событий, реализует паттерн "наблюдатель".
* Api — класс для работы с REST API (GET/POST).
* ItemModel — модель каталога товаров, загружает и хранит товары.
* OrderModel — модель корзины и заказа.
* MainPageView — представление главной страницы.
* ItemCatalog / ItemModalView — представления карточки товара в каталоге и модальном окне.
* BasketView / BasketItemView — представления корзины и её элементов.
* OrderFormView / ContactsFormView — формы оформления заказа и ввода контактов.
* OrderSuccessView — окно успешного оформления заказа.

**Типы** описаны в index.ts.

## Api

### ItemApi - АПИ для работы с товарами

Получет предметы магазина и возвращает их.

Контркутор
```
constructor(baseUrl: string, options?: RequestInit)
// baseUrl — базовый URL для API
// options — дополнительные параметры запроса (необязательно)
```

Методы:
```
async getItems(): Promise<IItem[]>
// Получить список всех товаров магазина.

async getItemById(id: string): Promise<IItem | null>
// Получить товар по его идентификатору.
```

### OrderApi - АПИ для отправки заказа

Класс для взаимодействия с сервером по оформлению заказов.
Позволяет отправлять заказ пользователя на сервер в нужном формате.

Контркутор
```
constructor(baseUrl: string, options?: RequestInit)
// baseUrl — базовый URL для API
// options — дополнительные параметры запроса (необязательно)
```

Методы:
```
async postOrder(order: IOrder): Promise<IOrderResponse | null>
// Отправляет заказ на сервер, возвращает ответ сервера с id и суммой заказа.

private orderToRequest(order: IOrder): IOrderRequest
// Преобразует объект заказа к формату, необходимому для API (массив товаров заменяется на массив их id).
```

## Событийная архитектура

Всё взаимодействие между компонентами построено на событиях, которые регистрируются и обрабатываются через EventEmitter.
События хранятся в перечислении **Events** в **constants.ts**

## Константы

Для отображения цветных категорий используется Map категорий:
```
export const categories = [
    { name: 'другое', colorClass: 'other' },
    { name: 'софт-скил', colorClass: 'soft' },
    { name: 'хард-скил', colorClass: 'hard' },
    { name: 'кнопка', colorClass: 'button' },
    { name: 'дополнительное', colorClass: 'additional' },
]
```

## Модели

### ItemModel - Модель товаров
Хранит товары и работает с этим хранилищем.
Инициируется с брокером событий для оповещений об изменениях в хранилище.

Поля:
```
protected _items: IItem[]         // массив товаров магазина
protected events: IEvents         // брокер событий для оповещений
protected _api: ItemApi           // API для работы с товарами
```

Контркутор
```
constructor(events: IEvents, _api: ItemApi)
// events — объект для работы с событиями
// _api — экземпляр API для получения товаров
```

Методы:
```
getItems(): IItem[]
// Возвращает текущий массив товаров.

setItems(items: IItem[]): void
// Устанавливает массив товаров и эмитит событие об изменении.

async getItemById(id: string): Promise<IItem>
// Асинхронно получает товар по id через API.

async fetchItems(): Promise<void>
// Асинхронно загружает все товары из API и обновляет
```

### OrderModel - Модель заказа

Класс OrderModel управляет состоянием корзины и заказом пользователя.

Поля:
```
protected _shopOrder: IOrder         // объект текущего заказа
protected _events: IEvents           // брокер событий для оповещений
protected _api: OrderApi             // API для отправки заказа
```

Контркутор
```
constructor(_events: IEvents, _api: OrderApi, shopOrder?: IOrder)
// _events — объект для работы с событиями
// _api — экземпляр API для отправки заказа
// shopOrder — (опционально) начальное состояние заказа
```

Методы:
```
addItem(item: IItem): void
// Добавляет товар в заказ, если его ещё нет.

removeItem(item: IItem): void
// Удаляет товар из заказа по id.

getItemIds(): string[]
// Возвращает массив id товаров в заказе.

getOrder(): IOrder
// Возвращает объект текущего заказа.

calculateTotal(): number
// Пересчитывает и возвращает итоговую сумму заказа.

clearOrder(): void
// Очищает корзину и сбрасывает заказ.

async submitOrder(): Promise<IOrder>
// Отправляет заказ на сервер и возвращает результат.

setOrder(order: IOrder): void
// Полностью заменяет текущий заказ.

validateEmail(email: string): boolean
// Проверяет корректность email.

validatePhone(phone: string): boolean
// Проверяет корректность телефона.

validateAddress(address: string): boolean
// Проверяет корректность адреса.
``` 

## Отображения

### ModalView - Модальное окно
Отражает модальное окно.

Поля:
```
protected _content: HTMLElement         // контейнер для контента модального окна
protected _container: HTMLElement       // корневой элемент модального окна
protected _contentType: ContentType     // тип содержимого модального окна
protected events: IEvents               // брокер событий для взаимодействия с приложением
```

Контркутор
```
constructor(container: HTMLElement, events: IEvents)
// container — DOM-элемент модального окна
// events — объект для работы с событиями
```

Методы:
```
close(): void
// Закрывает модальное окно и очищает его содержимое.

open(): void
// Открывает модальное окно.

set content(value: HTMLElement)
// Устанавливает содержимое модального окна и открывает его.

set contentType(value: ContentType)
// Устанавливает тип содержимого модального окна.

get contentType(): ContentType
// Возвращает текущий тип содержимого модального
``` 

### MainPage - Главная страница

Содержит список со всеми товарами и кнопку корзины.


Поля:
```
protected _shopItemsContainer: HTMLElement   // контейнер для карточек товаров
protected _basketCounter: HTMLElement        // элемент-счётчик товаров в корзине
protected _basketButton: HTMLButtonElement   // кнопка открытия корзины
```

Конструктор:
```
constructor(container: HTMLElement, eventEmitter: IEvents)
// container — DOM-элемент главной страницы
// eventEmitter — объект для работы с событиями
```

Методы:
```
set basketCount(value: number): void
// Устанавливает и отображает количество товаров в корзине.

set shopItems(items: HTMLElement[]): void
// Отображает карточки товаров на главной странице.
```

### ItemCatalog - Карточка товара в каталоге

Кликабельная карточка товара. При клике на элемент, открывается модальное окно товара.

Поля:
```
protected _categoryElement: HTMLElement         // элемент для отображения категории товара
protected _titleElement: HTMLElement           // элемент для отображения названия товара
protected _imageElement: HTMLImageElement      // элемент для изображения товара
protected _priceElement: HTMLElement           // элемент для отображения цены товара
protected _openButton: HTMLButtonElement  // кнопка/элемент для открытия диалога с товаром
```

Конструктор:
```
constructor(container: HTMLElement, eventEmitter: IEvents, itemId: string)
// container — DOM-элемент карточки товара
// eventEmitter — объект для работы с событиями
// itemId — идентификатор товара
```

Методы:
```
set category(value: string): void
// Устанавливает название категории товара.

set categoryColorClass(value: string): void
// Добавляет CSS-класс для цветового оформления категории.

set title(value: string): void
// Устанавливает название товара.

set image(value: string): void
// Устанавливает изображение товара.

set price(value: number | null): void
// Устанавливает и форматирует цену товара.
```

### ItemModalView - Модальное окно товара

Содержит все основные поля товара.

Поля:
```
protected _descriptionElement: HTMLElement      // элемент для отображения описания товара
protected _toBasketButton: HTMLButtonElement    // кнопка добавления/удаления товара из корзины
private _isInOrder: boolean                    // флаг: находится ли товар в корзине
```

Конструктор:
```
constructor(container: HTMLElement, eventEmitter: IEvents, itemId: string)
// container — DOM-элемент модального окна товара
// eventEmitter — объект для работы с событиями
// itemId — идентификатор товара
```

Методы:
```
set description(value: string): void
// Устанавливает описание товара в модальном окне.

set buttonState(isInOrder: boolean): void
// Устанавливает состояние кнопки (товар в корзине или нет).

setButtonState(): void
// Обновляет текст кнопки в зависимости от состояния _isInOrder.

toggleButtonState(): void
// Переключает состояние _isInOrder и обновляет текст кнопки.
```

### BasketView - Модальное окно корзины

Содержит все добавленные в корзину товары.

Поля:
```
_basketElement: HTMLElement                // контейнер для списка товаров в корзине
_totalPriceElement: HTMLElement            // элемент для отображения итоговой суммы заказа
_orderButton: HTMLButtonElement            // кнопка оформления заказа
protected container: HTMLElement           // DOM-элемент модального окна корзины
protected events: IEvents                  // объект для работы с событиями
protected basketElementsBuilder: (items: IItem[]) => HTMLElement[] // функция для генерации DOM-элементов товаров
```

Конструктор:
```
constructor(
  container: HTMLElement,
  events: IEvents,
  basketElementsBuilder: (items: IItem[]) => HTMLElement[]
)
// container — DOM-элемент корзины
// events — объект для работы с событиями
// basketElementsBuilder — функция для создания DOM-элементов товаров корзины
```

Методы:
```
set items(value: IItem[]): void
// Отображает список товаров в корзине и активирует/деактивирует кнопку заказа.

set total(value: number): void
// Устанавливает и отображает итоговую сумму заказа.

setButtonAvailability(isAvailable: boolean): void
// Включает или выключает кнопку оформления заказа в зависимости от наличия товаров.
```

### OrderFormView - Модальное окно подтверждения информации о заказе

Запрашивает у пользователя информацию по заказу после нажатия кнопки оформления заказа.

Поля:
```
protected _addressInputElement: HTMLInputElement           // поле ввода адреса доставки
protected _orderButton: HTMLButtonElement                  // кнопка оформления заказа
protected _paymentButtonsMap: Map<PaymentMethod, HTMLButtonElement> // карта кнопок выбора способа оплаты
protected _errorElement: HTMLElement                       // элемент для вывода ошибок валидации
protected _payment: PaymentMethod                          // выбранный способ оплаты
protected container: HTMLElement                           // DOM-элемент формы заказа
protected events: IEvents                                  // объект для работы с событиями
protected addressValidator: (address: string) => boolean   // функция для валидации адреса
```

Конструктор:
```
constructor(
  container: HTMLElement,
  events: IEvents,
  addressValidator: (address: string) => boolean
)
// container — DOM-элемент формы заказа
// events — объект для работы с событиями
// addressValidator — функция для проверки корректности адреса
```

Методы:
```
private initButtons(): void
// Инициализирует кнопки выбора способа оплаты и их обработчики.

set payment(value: PaymentMethod): void
// Устанавливает выбранный способ оплаты и обновляет состояние кнопок.

set address(value: string): void
// Устанавливает значение поля адреса и валидирует его.
```


### ContactsFormView - Модальное окно запроса контактной информации

Запрашивает у пользователя контактной информации.

Поля:
```
protected _emailInputElement: HTMLInputElement      // поле ввода email
protected _phoneInputElement: HTMLInputElement      // поле ввода телефона
protected _proceedButton: HTMLButtonElement         // кнопка продолжения оформления заказа
protected _errorElement: HTMLElement                // элемент для вывода ошибок валидации
protected container: HTMLElement                    // DOM-элемент формы
protected events: IEvents                           // объект для работы с событиями
```

Конструктор:
```
constructor(
  container: HTMLElement,
  events: IEvents,
  emailValidator: (email: string) => boolean,
  phoneValidator: (phone: string) => boolean
)
// container — DOM-элемент формы контактов
// events — объект для работы с событиями
// emailValidator — функция для проверки корректности email
// phoneValidator — функция для проверки корректности телефона
```

Методы:
```
private setValidity(
  validator: (value: string) => boolean,
  value: string,
  errorMessage: string
): boolean
// Проверяет валидность значения, выводит ошибку и управляет доступностью кнопки.
```


### OrderSuccessView - Модальное окно оформления заказа
Сообщает о выполнении/невыполнении(?) заказа.

Поля:
```
protected _totalWithdawElement: HTMLElement      // элемент для отображения итоговой суммы заказа
protected _backToShopButton: HTMLButtonElement   // кнопка возврата в магазин
protected container: HTMLElement                 // DOM-элемент окна успеха
protected events: IEvents                        // объект для работы с событиями
```

Конструктор:
```
constructor(container: HTMLElement, events: IEvents)
// container — DOM-элемент окна успешного заказа
// events — объект для работы с событиями
```

Методы:
```
set total(value: number): void
// Устанавливает и отображает итоговую сумму заказа в окне
```

## Типы

### ContentType

Тип, определяющий контент модального окна

```
export type ContentType = 'item' | 'order' | 'order_success';
```

### PaymentMethod

Тип, определяющий способ оплаты.

```
type PaymentMethod = 'card' | 'cash';
```

### IItem

Интерфейс, описывающий товар.

```
interface IItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  categoryColorClass?: string; // CSS-класс для цвета категории (опционально)
  price: number | null;
}
```

### IItemCategory

Интерфейс для категории товара.

```
interface IItemCategory {
  name: string;
  colorClass: string | undefined;
}
```

### IItemsDto

Интерфейс для ответа API, возвращающего список товаров:

```
interface IItemsDto {
  total: number; // кол-во товаров
  items: IItem[];
}
```

### IMainPage

Интерфейс для данных главной страницы.

```
interface IMainPage {
  shopItems: HTMLElement[];
  basket: HTMLElement;
}
```

### IOrder

Интерфейс для заказа.

```
interface IOrder {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: IItem[];
}
```

### IOrderRequest

Интерфейс для отправки заказа на сервер

```
interface IOrderRequest {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[]; // id товаров
}
```

### IOrderResponse

Интерфейс для ответа сервера после оформления заказа.

```
interface IOrderResponse {
  id: string; // id заказа
  total: number; // сумма заказа
}
```

### IModal

Интерфейс для отражения модального окна.

```
export interface IModal {  
  content: HTMLElement,
}
```