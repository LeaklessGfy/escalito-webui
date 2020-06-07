export interface IngredientInventoryDTO {
  provider: number;
  ingredient: number;
  stock: number;
}

export interface CocktailInventoryDTO {
  cocktail: number;
  price: number;
  hype: number;
}

export interface InventoryDTO {
  cash: number;
  ingredients: IngredientInventoryDTO[];
  cocktails: CocktailInventoryDTO[];
}
