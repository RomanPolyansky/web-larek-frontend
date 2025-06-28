import { ShopItemCatalog } from "../components/ShopItem/ShopItemCatalog";

export interface IItemsDto {
  total: number,
  items: IShopItem[],
}

export interface IShopItem {
  id: string,
  description: string,
  image: string, 
  title: string, 
  category: string, 
  categoryColorClass?: string, 
  price: number | null,
}

export interface IMainPage {
  shopItems: HTMLElement[], 
  basket: HTMLElement,
}

export type PaymentMethod = 'card' | 'cash';

export interface IShopOrder {
  payment: PaymentMethod,
  email: string, 
  phone: string, 
  address: string,
  total: number, 
  items: IShopItem[] 
}

export interface IShopOrderDto {
  payment: PaymentMethod,
  email: string, 
  phone: string, 
  address: string,
  total: number, 
  items: string[] 
}

export interface IItemCategory {
  name: string,
  colorClass: string | undefined,
}

export interface IShopOrderResponse {
  id: string,
  total: number,
}