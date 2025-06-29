export type PaymentMethod = 'card' | 'cash';

export interface IItemsDto {
  total: number,
  items: IItem[],
}

export interface IItem {
  id: string,
  description: string,
  image: string, 
  title: string, 
  category: string, 
  categoryColorClass?: string, 
  price: number | null,
}

export interface IModal {  
  content: HTMLElement,
}

export interface IItemCategory {
  name: string,
  colorClass: string | undefined,
}

export interface IMainPage {
  shopItems: HTMLElement[], 
  basket: HTMLElement,
}

export interface IOrder {
  payment: PaymentMethod,
  email: string, 
  phone: string, 
  address: string,
  total: number, 
  items: IItem[] 
}

export interface IOrderRequest {
  payment: PaymentMethod,
  email: string, 
  phone: string, 
  address: string,
  total: number, 
  items: string[] 
}

export interface IOrderResponse {
  id: string,
  total: number,
}