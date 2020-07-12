import { InventoryDto } from '../entities/dto/InventoryDTO';

export const inventoryMock: InventoryDto = {
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
