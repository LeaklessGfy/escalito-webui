export interface IIngredientDTO {
  ingredient: number;
  provider: number;
  stock: number;
}

export interface ICocktailDTO {
  cocktail: number;
  price: number;
  hype: number;
}

export interface IInventoryDTO {
  cash: number;
  ingredients: IIngredientDTO[];
  cocktails: ICocktailDTO[];
  employees: number[];
}
