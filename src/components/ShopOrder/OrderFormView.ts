import { IOrder, PaymentMethod } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";

export class OrderFormView extends Component<IOrder> {

  private _data: IOrder;
  protected _container: HTMLElement;
  protected _addressInputElement: HTMLInputElement;
  protected _orderButton: HTMLButtonElement;
  protected _paymentButtonsMap: Map<PaymentMethod, HTMLButtonElement> = new Map();

  constructor(container: HTMLElement, events: IEvents, data: IOrder) {
    super(container);
    this._container = container;
    this._data = data;
    
    this._addressInputElement = ensureElement('.form__input', container) as HTMLInputElement;
    this._orderButton = ensureElement('.order__button', container) as HTMLButtonElement;

    this.initButtons();

    this._container.addEventListener('submit', (event) => {
        event.preventDefault();
        this._data.address = this._addressInputElement.value;
        events.emit(Events.ORDER_FORM__SUBMITTED_INFO);
    })
    this._addressInputElement.addEventListener('input', () => {
      this._data.address = this._addressInputElement.value;
      this._orderButton.disabled = !this._addressInputElement.validity.valid
    });
  }

  private initButtons() {
    const onlinePaymentButton = ensureElement('[name="card"]', this.container) as HTMLButtonElement;
    const cashPaymentButton = ensureElement('[name="cash"]', this.container) as HTMLButtonElement;

    this._paymentButtonsMap.set('card', onlinePaymentButton);
    this._paymentButtonsMap.set('cash', cashPaymentButton);

    this._paymentButtonsMap.forEach((button, method) => {
      button.addEventListener('click', () => {
        this._data.payment = method;
        this._paymentButtonsMap.forEach((btn, btnKey) => {
          if (btnKey !== method) {
            btn.disabled = false;
          } else {
            btn.disabled = true;
            this._data.payment = btnKey; 
          }
        });
      });
    });
  }

  set payment(value: PaymentMethod) {
    this._paymentButtonsMap.forEach((button, method) => {
      button.disabled = method === value;
    });
  }
}