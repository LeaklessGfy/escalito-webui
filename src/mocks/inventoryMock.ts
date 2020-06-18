import { IInventoryDTO } from '../dto/InventoryDTO';

export const inventoryMock: IInventoryDTO = {
  cash: 100,
  ingredients: [
    {
      provider: 0,
      ingredient: 0,
      stock: 1
    }
  ],
  cocktails: [],
  employees: []
};
