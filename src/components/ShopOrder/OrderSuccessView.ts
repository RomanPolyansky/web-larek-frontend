import { IOrder } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";

export class OrderSuccessView extends Component<IOrder> {
  protected _totalWithdawElement: HTMLElement;
  protected _backToShopButton: HTMLButtonElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);
    
    this._backToShopButton = ensureElement('.order-success__close', container) as HTMLButtonElement;
    this._totalWithdawElement = ensureElement('.order-success__description', container) as HTMLElement;

    this._backToShopButton.addEventListener('click', () => {
      events.emit(Events.MODAL__CLOSED);
    });
  }

  set total(value: number) {
    this.setText(this._totalWithdawElement, `Списано ${value} синапсов`);
  }
}