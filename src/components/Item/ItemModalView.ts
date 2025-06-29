import { IItem } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/EventEmitter";
import { ItemCatalog } from "./ItemCatalog";

export class ItemModalView extends ItemCatalog {
  protected _descriptionElement: HTMLElement;
  protected _toBasketButton: HTMLButtonElement;
  private _isInOrder: boolean = false;

  constructor(container: HTMLElement, eventEmitter: IEvents, data: IItem) {
    super(container, eventEmitter, data);

    this._descriptionElement = ensureElement('.card__text', container) as HTMLElement;
    this._toBasketButton = ensureElement('.card__button', container) as HTMLButtonElement;

    this._toBasketButton.addEventListener('click', () => {
      this._isInOrder ? 
        eventEmitter.emit(Events.SHOP_ORDER__ITEM_REMOVED, this._data)
        : eventEmitter.emit(Events.SHOP_ORDER__ITEM_ADDED, this._data);

      this.toggleButtonState();
    });
  }

  set description(value: string) {
    this.setText(this._descriptionElement, value);
  }

  set buttonState(isInOrder: boolean) {
    this._isInOrder = isInOrder;
    this.setButtonState();
  }

  setButtonState(): void {
    this._isInOrder ?
      this.setText(this._toBasketButton, 'Убрать из корзины')
      : this.setText(this._toBasketButton, 'В корзину');
  }

  toggleButtonState(): void {
    this._isInOrder = !this._isInOrder;
    this.setButtonState();
  }
}