import { IModal } from "../../types";
import { Events } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";

export class ModalView extends Component<IModal>  {
  
  protected _content: HTMLElement;
  protected _container: HTMLElement;

  constructor(protected container: HTMLElement, protected events: IEvents) {
    super(container);
    this._container = container;
    this._content = ensureElement('.modal__content', container) as HTMLElement;

    const closeButton = ensureElement('.modal__close', container) as HTMLButtonElement;
    closeButton.addEventListener('click', () => {
      this.close();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
    container.addEventListener('click', (event) => {
      if (event.target === container) {
        this.close();
      }
    });
    this.events.on(Events.MODAL__CLOSED, () => {
      this.close();
    });
  }

  close() {
    this._container.classList.remove('modal_active')
    this._content.replaceChildren();
  }

  open() {
    this._container.classList.add('modal_active')
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
    this.open();
  }
}