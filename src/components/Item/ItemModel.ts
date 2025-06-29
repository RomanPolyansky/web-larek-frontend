import { IItemsDto, IItem } from "../../types";
import { Events } from "../../utils/constants";
import { Api } from "../base/Api";
import { IEvents } from "../base/EventEmitter";

export class ItemModel {
  protected _items: IItem[] = [];

  constructor(protected events: IEvents, protected _api: Api) {
    _api.get<IItemsDto>('/api/weblarek/product')
      .then(data => {
        const itemsImageFix = data.items.map(item => {
          item.image = `${process.env.API_ORIGIN}/content/weblarek${item.image}`;
          return item;
        });
        this.setItems(itemsImageFix);
      })
      .catch(error => {
        console.error('Failed to fetch shop items:', error);
      });
  }

  getItems(): IItem[] {
    return this._items;
  }

  setItems(items: IItem[]): void {
    this._items = items;
    this.events.emit(Events.SHOP_ITEMS__CHANGED);
  }

  async getItemById(id: string): Promise<IItem> {
    return await this._api.get<IItem>(`/api/weblarek/product/${id}`)
      .then(data => {
        data.image = `${process.env.API_ORIGIN}/content/weblarek${data.image}`;
        return data;
      })
      .catch((error): null => {
        console.error('Failed to fetch shop items:', error);
        return null;
      });
  }
}
    