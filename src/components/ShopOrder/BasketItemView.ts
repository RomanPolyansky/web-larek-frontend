import { IItem } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement, getFormattedPrice } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";

export class BasketItemView extends Component<IItem> {
  private _titleElement: HTMLElement;
  private _priceElement: HTMLElement;
  private _deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, eventEmitter: IEvents, itemIndex: number, itemId: string) {
    super(container);

    this._titleElement = ensureElement('.card__title', container) as HTMLElement;
    this._priceElement = ensureElement('.card__price', container) as HTMLElement;
    this._deleteButton = ensureElement('.basket__item-delete', container) as HTMLButtonElement;

    this._deleteButton.addEventListener('click', () => {
      eventEmitter.emit(Events.SHOP_ORDER__ITEM_REMOVED, { id: itemId });
    });
    
    const _itemIndexElement = ensureElement('.basket__item-index', container) as HTMLElement;
    this.setText(_itemIndexElement, itemIndex.toString());
  }

  set title(value: string) {
    this._titleElement.textContent = value;
  }

  set price(value: number) {
    this.setText(this._priceElement, getFormattedPrice(value));
  }
}