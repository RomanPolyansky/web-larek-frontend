import { IItem, IOrder } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement, getFormattedPrice } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";

export class BasketView extends Component<IOrder> {
  _basketElement: HTMLElement;
  _totalPriceElement: HTMLElement;
  _orderButton: HTMLButtonElement;
  constructor(protected container: HTMLElement, protected events: IEvents, protected basketElementsBuilder: (items: IItem[]) => HTMLElement[]) {
    super(container);
    
    this._totalPriceElement = ensureElement('.basket__price', container) as HTMLElement;
    this._orderButton = ensureElement('.basket__button', container) as HTMLButtonElement;
    this._basketElement = ensureElement('.basket__list', container) as HTMLElement;
    
    this._orderButton.addEventListener('click', () => {
      events.emit(Events.SHOP_ORDER__PROCEED);
    });
  }

  set items(value: IItem[]) {
    this._basketElement.innerHTML = '';
    const itemElements = this.basketElementsBuilder(value);
    this._basketElement.replaceChildren(...itemElements);
    this.setButtonAvailability(itemElements.length > 0);
  }

  set total(value: number) {
    this.setText(this._totalPriceElement, getFormattedPrice(value));
  }

  setButtonAvailability(isAvailable: boolean) {
    this._orderButton.disabled = !isAvailable;
  }
}