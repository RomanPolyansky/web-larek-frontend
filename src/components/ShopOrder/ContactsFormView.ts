import { IOrder } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";

export class ContactsFormView extends Component<IOrder> {

  protected _data: IOrder;
  protected _container: HTMLElement;
  protected _emailInputElement: HTMLInputElement;
  protected _phoneInputElement: HTMLInputElement;
  protected _proceedButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents, data: IOrder) {
    super(container);
    this._container = container;
    this._data = data;

    this._emailInputElement = ensureElement('[name="email"]', container) as HTMLInputElement;
    this._phoneInputElement = ensureElement('[name="phone"]', container) as HTMLInputElement;
    this._proceedButton = ensureElement('.modal__actions .button', container) as HTMLButtonElement;

    this._proceedButton.addEventListener('click', (event) => {
      event.preventDefault();
      this._data.email = this._emailInputElement.value;
      this._data.phone = this._phoneInputElement.value;
      events.emit(Events.ORDER_FORM__SUBMITTED_CONTACTS, this._data);
    });

    this._emailInputElement.addEventListener('input', () => {
      this._data.email = this._emailInputElement.value;
      this._proceedButton.disabled = !this._emailInputElement.validity.valid || !this._phoneInputElement.validity.valid;
    });
    this._phoneInputElement.addEventListener('input', () => {
      this._data.phone = this._phoneInputElement.value;
      this._proceedButton.disabled = !this._emailInputElement.validity.valid || !this._phoneInputElement.validity.valid;
    });
  }
}