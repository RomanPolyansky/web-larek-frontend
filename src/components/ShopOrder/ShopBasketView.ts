import { IShopItem, IShopOrder } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement, getFormattedPrice } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";
import { BasketItemView } from "./BasketItemView";

export class ShopBasketView extends Component<IShopOrder> {
  _data: IShopOrder;
  _basketElement: HTMLElement;
  _totalPriceElement: HTMLElement;
  _orderButton: HTMLButtonElement;
  _basketItemTemplate: HTMLElement;
  _events: IEvents;

  constructor(container: HTMLElement, basketItemTemplate: HTMLElement, eventEmitter: IEvents, data: IShopOrder) {
    super(container);
    this._basketItemTemplate = basketItemTemplate;
    this._events = eventEmitter;
    this._data = data;
    
    this._totalPriceElement = ensureElement('.basket__price', container) as HTMLElement;
    this._orderButton = ensureElement('.basket__button', container) as HTMLButtonElement;
    this._basketElement = ensureElement('.basket__list', container) as HTMLElement;
    
    this._orderButton.addEventListener('click', () => {
      eventEmitter.emit(Events.SHOP_ORDER__PROCEED, this._data);
    });
  }

  set total(value: number) {
    this.setText(this._totalPriceElement, getFormattedPrice(value));
  }

  set items(items: IShopItem[]) {
    this._basketElement.innerHTML = '';

    const views = items.map(item => {
      return new BasketItemView(
        this._basketItemTemplate.cloneNode(true) as HTMLElement,
        this._events,
        this._data.items.indexOf(item) + 1, 
        item
      )
    });

    const itemElements = views.map(view => view.render());

    this._basketElement.replaceChildren(...itemElements);

    this.setButtonAvailability(itemElements.length > 0);
  }

  setButtonAvailability(isAvailable: boolean) {
    this._orderButton.disabled = !isAvailable;
  }
}