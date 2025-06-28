import { EventEmitter } from './components/base/EventEmitter';
import { MainPage } from './components/MainPage/MainPage';
import { ShopItemModel } from './components/ShopItem/ShopItemModel';
import { ShopItemCatalog as ShopItemInCatalog } from './components/ShopItem/ShopItemCatalog';
import './scss/styles.scss';
import { IShopItem } from './types';
import { categories, Events, testShpopItems as testShopItems } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ShopItemModalView } from './components/ShopItem/ShopItemModalView';
import { ShopOrderModel } from './components/ShopOrder/ShopOrderModel';
import { CategoryModel } from './components/ShopItem/Category/CategoryModel';
import { ShopBasketView } from './components/ShopOrder/ShopBasketView';
import { OrderFormView } from './components/ShopOrder/OrderFormView';
import { ContactsFormView } from './components/ShopOrder/ContactsFormView';
import { OrderSuccessView } from './components/ShopOrder/OrderSuccessView';
import { Api } from './components/base/Api';

const events = new EventEmitter();

const api = new Api(`${process.env.API_ORIGIN}/api/weblarek`);

const shopItemModel = new ShopItemModel(events, api);
const shopOrderModel = new ShopOrderModel(events, api);
const categoryModel = new CategoryModel();

const modalWindow = ensureElement('#modal-container') as HTMLElement;
const modalContent = ensureElement('.modal__content') as HTMLElement;

const mainPage = new MainPage(
  ensureElement('.page__wrapper') as HTMLElement,
  events
)

type CurrentModalWindow = 'order_contacts' | 'order_info' | 'card-preview' | 'basket' | null;
let currentModalWindow: CurrentModalWindow = null;

events.on(Events.SHOP_ITEMS__CHANGED, (items: IShopItem[]) => {
  console.log('Shop items updated:', items);
  const previews = shopItemModel
    .getItems()
    .map(item => {
      item.categoryColorClass = categoryModel.getCategory(item.category).colorClass;
      const itemElement = new ShopItemInCatalog(
        cloneTemplate('#card-catalog'), 
        events, 
        item)
      return itemElement.render(item);
      });
  mainPage.render({
    shopItems: previews,
  });
});

// Set open shop item modal event
events.on(Events.SHOP_ITEM__CLICKED, async (data: { id: string }) => {
  const item = await shopItemModel.getItemById(data.id);
  console.log('Shop item clicked:', item);
  item.categoryColorClass = categoryModel.getCategory(item.category).colorClass;
  const modal = cloneTemplate('#card-preview') as HTMLElement;

  const shopItemModal = new ShopItemModalView(modal, events, item);
  shopItemModal.buttonState = shopOrderModel.getItemIds().includes(item.id);
  shopItemModal.render(item);
  modalContent.replaceChildren(modal);
  modalWindow.classList.add('modal_active');
  currentModalWindow = 'card-preview';
});

events.on(Events.MODAL__CLOSED, () => {
  modalWindow.classList.remove('modal_active');
  modalContent.replaceChildren();
  currentModalWindow = null;
});

// Set adding items to the basket event
events.on<IShopItem>(Events.SHOP_ORDER__ITEM_ADDED, async (data) => {
  const item = await shopItemModel.getItemById(data.id);
  if (item) {
    shopOrderModel.addItem(item);
  }
});

// Set removing items from the basket event
events.on<IShopItem>(Events.SHOP_ORDER__ITEM_REMOVED, async (data) => {
  const item = await shopItemModel.getItemById(data.id);
  if (item) {
    shopOrderModel.removeItem(item);
  }
});

// Set basket counter change event
events.on(Events.SHOP_ORDER__CHANGED, () => {
  mainPage.basketCount = shopOrderModel.getItemIds().length;
});

// Set basket items change event
events.on(Events.SHOP_ORDER__CHANGED, () => {
  // if shop basket is open, update it
  if (currentModalWindow !== 'basket') return;
  const order = shopOrderModel.getOrder();
  const shopItemModal = new ShopBasketView(modalWindow, cloneTemplate('#card-basket'), events, order);
  shopItemModal.render(order);
});

events.on(Events.SHOP_ORDER__OPEN, () => {
    const modal = cloneTemplate('#basket') as HTMLElement;
    const shopOrder = shopOrderModel.getOrder();
    const shopBasketView = new ShopBasketView(modal, cloneTemplate('#card-basket'), events, shopOrder);
    modalContent.replaceChildren(shopBasketView.render(shopOrder));
    modalWindow.classList.add('modal_active');
    currentModalWindow = 'basket';
});

events.on(Events.SHOP_ORDER__PROCEED, () => {
  const order = shopOrderModel.getOrder();
  const modal = cloneTemplate('#order') as HTMLElement;
  const view = new OrderFormView(modal, events, order);
  modalContent.replaceChildren(view.render(order));
  modalWindow.classList.add('modal_active');
  currentModalWindow = 'order_info';
})

events.on(Events.ORDER_FORM__SUBMITTED_INFO, () => {
  const order = shopOrderModel.getOrder();
  const modal = cloneTemplate('#contacts') as HTMLElement;
  const view = new ContactsFormView(modal, events, order);
  modalContent.replaceChildren(view.render(order));
  modalWindow.classList.add('modal_active');
  currentModalWindow = 'order_contacts';
});

events.on(Events.ORDER_FORM__SUBMITTED_CONTACTS, async () => {
  const order = await shopOrderModel.submitOrder();
  if (!order) {
    console.error('Order submission failed');
    return;
  }
  console.log('Order submitted:', order);
  const modal = cloneTemplate('#success') as HTMLElement;
  const view = new OrderSuccessView(modal, events, order);
  modalContent.replaceChildren(view.render(order));
  events.emit(Events.ORDER__CLOSED);
});

events.on(Events.ORDER__CLOSED, () => {
  shopOrderModel.clearOrder();
});

const initializeModalEvents = () => {
  ensureElement('.modal__close').addEventListener('click', () => {
    events.emit(Events.MODAL__CLOSED);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      events.emit(Events.MODAL__CLOSED);
    }
  });
  modalWindow.addEventListener('click', (event) => {
    if (event.target === modalWindow) {
      events.emit(Events.MODAL__CLOSED);
    }
  });
}

initializeModalEvents();

categories.forEach(category => categoryModel.addCategory(category));

console.log('Shop items set:', shopItemModel.getItems());