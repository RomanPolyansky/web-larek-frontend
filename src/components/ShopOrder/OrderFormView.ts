import { IOrder, PaymentMethod } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";

export class OrderFormView extends Component<IOrder> {
  protected _addressInputElement: HTMLInputElement;
  protected _orderButton: HTMLButtonElement;
  protected _paymentButtonsMap: Map<PaymentMethod, HTMLButtonElement> = new Map();
  protected _errorElement: HTMLElement;
  protected _payment: PaymentMethod = 'cash';

  constructor(
      protected container: HTMLElement, 
      protected events: IEvents, 
      protected addressValidator: (address: string) => boolean) {
    super(container);
    
    this._errorElement = ensureElement('.form__errors', container) as HTMLElement;
    this._addressInputElement = ensureElement('.form__input', container) as HTMLInputElement;
    this._orderButton = ensureElement('.order__button', container) as HTMLButtonElement;

    this.initButtons();

    this.container.addEventListener('submit', (event) => {
        event.preventDefault();
        events.emit(Events.ORDER_FORM__SUBMITTED_INFO, 
          { address: this._addressInputElement.value, payment: this._payment})
    })
    this._addressInputElement.addEventListener('input', () => {
        if (this._addressInputElement.value === '') return;
        if (addressValidator(this._addressInputElement.value)) {
          this.setText(this._errorElement, '');
          this._orderButton.disabled = false;
        } else {
          this.setText(this._errorElement, 'Некорректный адрес');
          this._orderButton.disabled = true;
        }
    });
  }

  private initButtons() {
    const onlinePaymentButton = ensureElement('[name="card"]', this.container) as HTMLButtonElement;
    const cashPaymentButton = ensureElement('[name="cash"]', this.container) as HTMLButtonElement;

    this._paymentButtonsMap.set('card', onlinePaymentButton);
    this._paymentButtonsMap.set('cash', cashPaymentButton);

    this._paymentButtonsMap.forEach((button, method) => {
      button.addEventListener('click', () => {
        this.payment = method;
        this._paymentButtonsMap.forEach((btn, btnKey) => {
          if (btnKey !== method) {
            btn.disabled = false;
          } else {
            btn.disabled = true;
            this.payment = btnKey; 
          }
        });
      });
    });
  }

  set payment(value: PaymentMethod) {
    this._paymentButtonsMap.forEach((button, method) => {
      button.disabled = method === value;
    });
    this._payment = value;
  }

  set address(value: string) {
    this._addressInputElement.value = value;
    if (this.addressValidator(this._addressInputElement.value)) {
      this.setText(this._errorElement, '');
      this._orderButton.disabled = false;
    }
  }
}