import { Service } from '../../remote/Service';
import {
  CocktailMapper,
  EmployeeMapper,
  IngredientMapper,
  Inventory
} from '../Inventory';
import { IngredientExtended } from '../dynamic/IngredientExtended';
import { Employee } from '../static/Employee';
import { ProviderKey } from '../static/Provider';
import { buildCocktailExtended } from '../values/Cocktails';
import { Employees } from '../values/Employees';
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

function extractIngredients(dto: IngredientDto[]): IngredientMapper {
  const ingredients: IngredientMapper = new Map();

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

function extractCocktails(dto: CocktailDto[]): CocktailMapper {
  const cocktails: CocktailMapper = new Map();
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

function extractEmployees(dto: number[]): EmployeeMapper {
  const employees: EmployeeMapper = new Map();
  const objects = Employees();
  for (const employee of dto) {
    employees.set(employee, objects.get(employee) as Employee);
  }
  return employees;
}

export function fromDto(service: Service, dto: InventoryDto): Inventory {
  const cash = dto.cash;
  const ingredients = extractIngredients(dto.ingredients);
  const cocktails = extractCocktails(dto.cocktails);
  const employees = extractEmployees(dto.employees);

  return new Inventory(service, cash, ingredients, cocktails, employees);
}
