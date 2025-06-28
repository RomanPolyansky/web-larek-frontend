import { IMainPage } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";

export class MainPage extends Component<IMainPage> {
  protected _shopItemsContainer: HTMLElement;
  protected _basketCounter: HTMLElement;
  protected _basketButton: HTMLButtonElement;

  constructor(container: HTMLElement, eventEmitter: IEvents) {
    super(container);

    this._shopItemsContainer = ensureElement('.gallery', container) as HTMLElement;
    this._basketCounter = ensureElement('.header__basket-counter', container) as HTMLButtonElement;
    this._basketButton = ensureElement('.header__basket', container) as HTMLButtonElement;
  
    this._basketButton.addEventListener('click', () => {
      eventEmitter.emit(Events.SHOP_ORDER__OPEN);
    });
  }




  set basketCount(value: number) {
    this.setText(this._basketCounter, value.toString());
  }

  set shopItems(items: HTMLElement[]) {
    this._shopItemsContainer.replaceChildren(...items);
  }
}