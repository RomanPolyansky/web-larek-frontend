import { IItemsDto, IItem } from "../../types";
import { Events } from "../../utils/constants";
import { Api } from "../base/Api";
import { IEvents } from "../base/EventEmitter";
import { ItemApi } from "./ItemApi";

export class ItemModel {
  protected _items: IItem[] = [];

  constructor(protected events: IEvents, protected _api: ItemApi) {}

  getItems(): IItem[] {
    return this._items;
  }

  setItems(items: IItem[]): void {
    this._items = items;
    this.events.emit(Events.SHOP_ITEMS__CHANGED);
  }

  async getItemById(id: string): Promise<IItem> {
    return await this._api.getItemById(id);
  }

  async fetchItems(): Promise<void> {
    try {
      await this._api.getItems()
      .then(items => {
        this._items = items;
      });
      this.events.emit(Events.SHOP_ITEMS__CHANGED);
    } catch (error) {
      console.error('Failed to fetch shop items:', error);
    }
  }
}
    