import { Inventory } from '../Inventory';
import { CocktailExtended } from '../dynamic/CocktailExtended';
import { IngredientExtended } from '../dynamic/IngredientExtended';
import { CocktailKey } from '../static/Cocktail';
import { EmployeeKey } from '../static/Employee';
import { IngredientKey } from '../static/Ingredient';
import { ProviderKey } from '../static/Provider';
import { buildCocktailExtended } from '../values/Cocktails';
import { buildIngredientExtended } from '../values/Ingredients';

export interface IngredientDto {
  ingredient: number;
  provider: number;
  stock: number;
}

export interface CocktailDto {
  cocktail: number;
  price: number;
  hype: number;
}

export interface InventoryDto {
  cash: number;
  ingredients: IngredientDto[];
  cocktails: CocktailDto[];
  employees: number[];
}

function extractIngredients(
  dto: IngredientDto[]
): Map<IngredientKey, Map<ProviderKey, IngredientExtended>> {
  const ingredients = new Map<
    IngredientKey,
    Map<ProviderKey, IngredientExtended>
  >();

  for (const ingredientDto of dto) {
    const ingredientKey = ingredientDto.ingredient;
    const providerKey = ingredientDto.provider;
    const stock = ingredientDto.stock;

    const providers =
      ingredients.get(ingredientKey) ??
      new Map<ProviderKey, IngredientExtended>();

    if (providers.has(providerKey)) {
      throw new Error('Duplicate entry in providers ' + providerKey);
    }

    const ingredientExtended = buildIngredientExtended(
      ingredientKey,
      providerKey,
      stock
    );

    providers.set(providerKey, ingredientExtended);
    ingredients.set(ingredientKey, providers);
  }

  return ingredients;
}

function extractCocktails(
  dto: CocktailDto[]
): Map<CocktailKey, CocktailExtended> {
  const cocktails = new Map<CocktailKey, CocktailExtended>();
  for (const cocktailDto of dto) {
    const cocktail = buildCocktailExtended(
      cocktailDto.cocktail,
      cocktailDto.price,
      cocktailDto.hype
    );
    cocktails.set(cocktailDto.cocktail, cocktail);
  }
  return cocktails;
}

function extractEmployees(dto: number[]): Set<EmployeeKey> {
  const employees = new Set<EmployeeKey>();
  for (const employee of dto) {
    employees.add(employee);
  }
  return employees;
}

export function fromDto(dto: InventoryDto): Inventory {
  const ingredients = extractIngredients(dto.ingredients);
  const cocktails = extractCocktails(dto.cocktails);
  const employees = extractEmployees(dto.employees);

  return new Inventory(dto.cash, ingredients, cocktails, employees);
}
