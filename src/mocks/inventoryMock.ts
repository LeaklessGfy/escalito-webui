import { InventoryDTO } from '../dto/InventoryDTO';

export const inventoryMock: InventoryDTO = {
  cash: 100,
  ingredients: [
    {
      provider: 0,
      ingredient: 0,
      stock: 1
    }
  ],
  cocktails: []
};
