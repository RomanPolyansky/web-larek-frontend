import { IItem } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement, getFormattedPrice } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";

export class ItemCatalog extends Component<IItem> {
  protected _categoryElement: HTMLElement;
  protected _titleElement: HTMLElement;
  protected _imageElement: HTMLImageElement;
  protected _priceElement: HTMLElement;
  protected _openButton: HTMLButtonElement;

  constructor(container: HTMLElement, eventEmitter: IEvents, itemId: string) {
    super(container);
    
    this._openButton = container as HTMLButtonElement;

    this._categoryElement = ensureElement('.card__category', container) as HTMLElement;
    this._titleElement = ensureElement('.card__title', container) as HTMLElement;
    this._imageElement = ensureElement('.card__image', container) as HTMLImageElement;
    this._priceElement = ensureElement('.card__price', container) as HTMLElement;

    this._openButton.addEventListener('click', () => {
      eventEmitter.emit(Events.SHOP_ITEM__CLICKED, {id: itemId});
    });
  }

  set category(value: string) {
    this.setText(this._categoryElement, value);
  }

  set categoryColorClass(value: string) {
    this._categoryElement.classList.add(`card__category_${value}`);
  }

  set title(value: string) {
    this.setText(this._titleElement, value);
  }

  set image(value: string) {
    this.setImage(this._imageElement, value);
  }

  set price(value: number | null) {
      const formattedPrice = getFormattedPrice(value);
      this.setText(this._priceElement, formattedPrice);
  }
}