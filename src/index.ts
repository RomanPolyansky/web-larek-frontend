import './scss/styles.scss';
import { EventEmitter } from './components/base/EventEmitter';
import { MainPageView } from './components/MainPage/MainPage';
import { ItemModel as ItemModel } from './components/Item/ItemModel';
import { ItemCatalog as ShopItemInCatalog } from './components/Item/ItemCatalog';
import { IItem } from './types';
import { categories, Events } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ItemModalView } from './components/Item/ItemModalView';
import { OrderModel } from './components/ShopOrder/OrderModel';
import { CategoryModel } from './components/Item/Category/CategoryModel';
import { BasketView } from './components/ShopOrder/BasketView';
import { OrderFormView } from './components/ShopOrder/OrderFormView';
import { ContactsFormView } from './components/ShopOrder/ContactsFormView';
import { OrderSuccessView } from './components/ShopOrder/OrderSuccessView';
import { ModalView } from './components/ModalWindow/ModalView';
import { ItemApi } from './components/Item/ItemApi';
import { OrderApi } from './components/ShopOrder/OrderApi';
import { BasketItemView } from './components/ShopOrder/BasketItemView';

const events = new EventEmitter();

const itemApi = new ItemApi(`${process.env.API_ORIGIN}`);
const orderApi = new OrderApi(`${process.env.API_ORIGIN}`);

const shopItemModel = new ItemModel(events, itemApi);
const orderModel = new OrderModel(events, orderApi);
const categoryModel = new CategoryModel();

const mainPageView = new MainPageView(
  ensureElement('.page__wrapper') as HTMLElement,
  events
)
const modalView = new ModalView(ensureElement('.modal'), events);

events.on(Events.SHOP_ITEMS__CHANGED, () => {
  const previews = shopItemModel
    .getItems()
    .map(item => {
      item.categoryColorClass = categoryModel.getCategory(item.category).colorClass;
      const itemElement = new ShopItemInCatalog(
        cloneTemplate('#card-catalog'), 
        events, 
        item.id)
      return itemElement.render(item);
      });
  mainPageView.render({
    shopItems: previews,
  });
});

// Set open shop item modal event
events.on(Events.SHOP_ITEM__CLICKED, async (data: { id: string }) => {
  const item = await shopItemModel.getItemById(data.id);
  item.categoryColorClass = categoryModel.getCategory(item.category).colorClass;
  const itemTemplate = cloneTemplate('#card-preview') as HTMLElement;

  const shopItemModal = new ItemModalView(itemTemplate, events, item.id);
  shopItemModal.buttonState = orderModel.getItemIds().includes(item.id);

  modalView.render({
    content: shopItemModal.render(item),
    contentType: 'item',
  });
});

// Set adding items to the basket event
events.on<IItem>(Events.SHOP_ORDER__ITEM_ADDED, async (data) => {
  const item = await shopItemModel.getItemById(data.id);
  if (item) {
    orderModel.addItem(item);
  }
});

// Set removing items from the basket event
events.on<IItem>(Events.SHOP_ORDER__ITEM_REMOVED, async (data) => {
  const item = await shopItemModel.getItemById(data.id);
  if (item) {
    orderModel.removeItem(item);
  }
});

// Set basket counter change event
events.on(Events.SHOP_ORDER__CHANGED, () => {
  mainPageView.basketCount = orderModel.getItemIds().length;
});

// Set basket items change event
events.on(Events.SHOP_ORDER__CHANGED, () => {
  const order = orderModel.getOrder();
  const basketTemplate = cloneTemplate('#basket') as HTMLElement;
  const shopItemModal = new BasketView(basketTemplate, events, basketItemsElementBuilder);
  if (modalView.contentType === 'order') {
    modalView.render({
      content: shopItemModal.render(order),
      contentType: 'order',
    });
  }
});

events.on(Events.SHOP_ORDER__OPEN, () => {
  const basketTemplate = cloneTemplate('#basket') as HTMLElement;
  const shopOrder = orderModel.getOrder();
  const shopBasketView = new BasketView(basketTemplate, events, basketItemsElementBuilder);
  modalView.render({
    content: shopBasketView.render(shopOrder),
    contentType: 'order',
  });
});

events.on(Events.SHOP_ORDER__PROCEED, () => {
  const order = orderModel.getOrder();
  const modal = cloneTemplate('#order') as HTMLElement;
  const view = new OrderFormView(modal, events, order);
  modalView.render({
    content: view.render(order),
    contentType: 'order',
  });
})

events.on(Events.ORDER_FORM__SUBMITTED_INFO, () => {
  const order = orderModel.getOrder();
  const modal = cloneTemplate('#contacts') as HTMLElement;
  const view = new ContactsFormView(modal, events, orderModel.validateEmail, orderModel.validatePhone);
  modalView.render({
    content: view.render(order),
    contentType: 'order',
  });
});

events.on(Events.ORDER_FORM__SUBMITTED_CONTACTS, 
    async (data: {email: string; phone: string;}) => {
  const orderInMemory = orderModel.getOrder();
  orderInMemory.email = data.email;
  orderInMemory.phone = data.phone;
  const order = await orderModel.submitOrder();
  if (!order) {
    console.error('Order submission failed');
    return;
  }
  const modal = cloneTemplate('#success') as HTMLElement;
  const view = new OrderSuccessView(modal, events);
  modalView.render({
    content: view.render(order),
    contentType: 'order_success',
  });
  events.emit(Events.ORDER__CLOSED);
});

events.on(Events.ORDER__CLOSED, () => {
  orderModel.clearOrder();
});

const basketItemsElementBuilder = (orderItems: IItem[]) => orderItems.map(item => {
  const basketItemView = new BasketItemView(
    cloneTemplate('#card-basket') as HTMLElement,
    events,
    orderItems.indexOf(item) + 1,
    item.id
  );
  return basketItemView.render({...item, });
});

categories.forEach(category => categoryModel.addCategory(category));
shopItemModel.fetchItems();