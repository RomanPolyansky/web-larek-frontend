import { IItemCategory } from "../../../types";

export class CategoryModel {

  protected _categoryMap: Map<string, IItemCategory> = new Map();

  getCategory(categoryName: string): IItemCategory {
    return this._categoryMap.get(categoryName) ?? { name: categoryName, colorClass: '' };
  }

  addCategory(category: IItemCategory): void {
    this._categoryMap.set(category.name, category);
  }
}