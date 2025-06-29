import { IOrder } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";

export class ContactsFormView extends Component<IOrder> {
  protected _container: HTMLElement;
  protected _emailInputElement: HTMLInputElement;
  protected _phoneInputElement: HTMLInputElement;
  protected _proceedButton: HTMLButtonElement;
  protected _errorElement: HTMLElement;

  constructor(container: HTMLElement, events: IEvents, emailValidator: (email: string) => boolean, phoneValidator: (phone: string) => boolean) {
    super(container);
    this._container = container;

    this._errorElement = ensureElement('.form__errors', container) as HTMLElement;
    this._emailInputElement = ensureElement('[name="email"]', container) as HTMLInputElement;
    this._phoneInputElement = ensureElement('[name="phone"]', container) as HTMLInputElement;
    this._proceedButton = ensureElement('.modal__actions .button', container) as HTMLButtonElement;

    this._proceedButton.addEventListener('click', (event) => {
      event.preventDefault();
      events.emit(Events.ORDER_FORM__SUBMITTED_CONTACTS, {
        email: this._emailInputElement.value,
        phone: this._phoneInputElement.value,
      });
    });

    this._emailInputElement.addEventListener('input', () => {
      if (this._emailInputElement.value === '') return;
      const isValidEmail = this.setValidity(emailValidator, this._emailInputElement.value, 'Некорректный email');
      if (isValidEmail && this._phoneInputElement.value !== '') {
        const isValidPhone = this.setValidity(phoneValidator, this._phoneInputElement.value, 'Некорректный телефон');
        if (isValidPhone) {
          this._proceedButton.disabled = false;
        }
      }
    });
    this._phoneInputElement.addEventListener('input', () => {
      const isValidPhone = this.setValidity(phoneValidator, this._phoneInputElement.value, 'Некорректный телефон');
      if (isValidPhone && this._emailInputElement.value !== '') {
        const isValidEmail = this.setValidity(emailValidator, this._emailInputElement.value, 'Некорректный email');
        if (isValidEmail) {
          this._proceedButton.disabled = false;
        }
      }
    });
  }

  private setValidity(
    validator: (value: string) => boolean,
    value: string,
    errorMessage: string): boolean {
    if (validator(value)) {
      this.setText(this._errorElement, '');
      return true;
    } else {
      this.setText(this._errorElement, errorMessage);
      this._proceedButton.disabled = true;
      return false;
    }
  }
}