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

Базовый адрес API задаётся через переменную окружения API_ORIGIN и внедряется через webpack.
Все запросы к API выполняются через класс Api реализованный через паттерн синглтон и внедряющийся в модели данных.
Для получения списка товаров: GET /api/weblarek/product
Для получения товара по id: GET /api/weblarek/product/:id
Для оформления заказа: POST /api/weblarek/order
Для получения ссылки на изображение подставляется: {API_ORIGIN}/content/weblarek/{image}

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
_items: IShopItem[] // хранение всех товаров
```

Методы:
```
getItems(): IItem[]
setItems(items: IItem[]): void
async getItemById(id: string): Promise<IItem | null>
```

После получения данных фиксирует путь к изображению.
В случае ошибки возвращает null и выводит ошибку в консоль.

### OrderModel - Модель заказа

Класс OrderModel управляет состоянием корзины и заказом пользователя.

Поля:
```
_shopOrder: IOrder // Объект текущего заказа
```

Методы:
```
addItem(item: IItem)
removeItem(item: IItem)
getOrder(): IOrder
calculateTotal(): number // приватный
clearOrder()
submitOrder(): Promise<IOrder>
``` 

## Отображения

### ModalView - Модальное окно
Отражает модальное окно.
```
content: HTMLElement; // контент модального окна
container: HTMLElement; // контейнер самого модального окна
```

### MainPage - Главная страница
Содержит список со всеми товарами и кнопку корзины.
```
shopItemsContainer: HTMLElement, // контейнеров товаров в магазине
basket: HTMLButtonElement, // корзина с иконкой кол-ва товаров
```

### ShopItemInCatalog - Карточка товара в каталоге
Кликабельная карточка товара. При клике на элемент, открывается модальное окно товара.

### ShopItemModalView - Модальное окно товара
Содержит все основные поля товара.
```
closeButton: HtmlButtonElement, // кнопка закрытия окна
buyButton: HtmlButtonElement, // кнопка добавления товара в корзину
```

### BasketModalView - Модальное окно корзины
Содержит все добавленные в корзину товары.
```
closeButton: HtmlButtonElement, // кнопка закрытия окна
basketList: BasketItemList, // список товаров
orderButton: HtmlButtonElement, // кнопка оформления заказа
totalSum: number, // итог. Меняется при изменении позиций
```

### OrderModalFormView - Модальное окно подтверждения информации о заказе
Запрашивает у пользователя информацию по заказу после нажатия кнопки оформления заказа.
```
closeButton: HtmlButtonElement, // кнопка закрытия окна
nextButton: HtmlButtonElement, // кнопка продолжения. Активна только при валидации формы
onlinePayment: HtmlButtonElement, // выбор оплаты: онлайн
cashPayment: HtmlButtonElement, // выбор оплаты: наличными
addressInput: HtmlInputElement, // адрес покупателя. Должен валидироваться для продолжения
```

### ContactsModalFormView - Модальное окно запроса контактной информации
Запрашивает у пользователя контактной информации.
```
closeButton: HtmlButtonElement, // кнопка закрытия окна
buyButton: HtmlButtonElement, // кнопка оплаты. Активна только при валидации формы
emailInput: HtmlInputElement, // е-мейл покупателя. Должен валидироваться для продолжения
phoneInput: HtmlInputElement, // телефон покупателя. Должен валидироваться для продолжения
```

### OrderSubmitResultModalView - Модальное окно оформления заказа
Сообщает о выполнении/невыполнении(?) заказа.
```
closeButton: HtmlButtonElement, // кнопка закрытия окна
backToStore: HtmlButtonElement, // кнопка возвращения в магазин
```

## Типы

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