import { IItemsDto, IShopItem } from "../../types";
import { Events } from "../../utils/constants";
import { Api } from "../base/Api";
import { IEvents } from "../base/EventEmitter";

export class ShopItemModel {
  protected _items: IShopItem[] = [];

  constructor(protected events: IEvents, protected _api: Api) {
    _api.get<IItemsDto>('/product')
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

  getItems(): IShopItem[] {
    return this._items;
  }

  setItems(items: IShopItem[]): void {
    this._items = items;
    this.events.emit(Events.SHOP_ITEMS__CHANGED, this._items);
  }

  async getItemById(id: string): Promise<IShopItem> {
    return await this._api.get<IShopItem>(`/product/${id}`)
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
    