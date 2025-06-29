import { IItem, IItemsDto } from "../../types";
import { Api } from "../base/Api";

export class ItemApi extends Api {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options);
  }

  async getItems(): Promise<IItem[]> {
    try {
      const response = await this.get<IItemsDto>('/api/weblarek/product');
      const itemsImageFix = response.items.map(item => {
        item.image = `${process.env.API_ORIGIN}/content/weblarek${item.image}`;
        return item;
      });
      return itemsImageFix;
    } catch (error) {
      console.error('Failed to fetch shop items:', error);
      return [];
    }
  }

  async getItemById(id: string): Promise<IItem | null> {
    try {
      const response = await this.get<IItem>(`/api/weblarek/product/${id}`)
      response.image = `${process.env.API_ORIGIN}/content/weblarek${response.image}`;
      return response;
    } catch (error) {
        console.error(`Failed to fetch shop item with id ${id}:`, error);
        return null;
    }
  }
}