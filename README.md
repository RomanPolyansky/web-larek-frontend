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

## Модели

### ShopItemModel - Модель товаров
Хранит товары и работает с этим хранилищем.
Инициируется с брокером событий для оповещений об изменениях в хранилище.
```
_items: IShopItem[] // хранение всех товаров
```

Методы:
```
setItems(items: IShopItem[]): void 
getItems(): IShopItem[]
getItemById(id: string): IShopItem | undefined
```

### ShopItem - Товар 

Представляет собой товар в магазине. 
Имеет следующие поля:
```
id: string, // уникальный идентификатор
description: string, // описание товара
image: string, // относительная ссылка на изображение товара, к примеру: "/5_Dots.svg"
title: string, // название товара, к примеру: "+1 час в сутках",
category: string, // категеория товара, к примеру: "софт-скил",
price: number, // цена товара в у.е.
``` 

### ShopOrder - Информация о заказе

Представляет собой информацию о заказе. 
Имеет следующие поля:
```
payment: string, // способ оплаты, например: "online"
email: string, // email покупателя
phone: string, // номер телефона покупателя
address: string, // адрес покупателя 
total: number, // итоговая сумма по корзине
items: string[] // массив с айди ShopItem в корзине
``` 

## Отображения

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