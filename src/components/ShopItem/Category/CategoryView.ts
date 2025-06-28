import { IItemCategory } from "../../../types";
import { Component } from "../../base/Component";

export class CategoryView extends Component<IItemCategory> {

  protected _data: IItemCategory;
  protected _nameElement: HTMLElement;

  constructor(container: HTMLElement, data: IItemCategory) {
    super(container);
    
    this._data = data;

    this._nameElement = container.querySelector('.card__category') as HTMLElement;
  }

  set name(value: string) {
    this.setText(this._nameElement, value);
  }

  set color(colorClass: string) {
    this._nameElement.classList.add(colorClass);
  }
}