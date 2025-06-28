import { IItemCategory } from "../../../types";
import { IEvents } from "../../base/EventEmitter";

export class CategoryModel {

  protected _categoryMap: Map<string, IItemCategory> = new Map();

  constructor() {}

  getCategory(categoryName: string): IItemCategory {
    return this._categoryMap.get(categoryName) ?? { name: categoryName, colorClass: '' };
  }

  addCategory(category: IItemCategory): void {
    this._categoryMap.set(category.name, category);
  }
}