import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {
    constructor(private shoppingListService: ShoppingListService) {
            
    }

    private recipes: Recipe[] = [
        new Recipe(
            'Tasty Schnitzel', 
            'This is a simple Tasty Schnitzel recipe', 
            'https://www.daringgourmet.com/wp-content/uploads/2014/03/Schnitzel-1-1.jpg',
            [
                new Ingredient('Bread', 2),
                new Ingredient('Ham', 4),
                new Ingredient('Chicken', 8),
            ]),
        new Recipe(
            'Black Angus Burger', 
            'This is a simple Black Angus Burger recipe', 
            'https://www.argiro.gr/wp-content/uploads/2018/09/afrata-psomakia-burger-768x645.jpg',
            [
                new Ingredient('Water', 1),
                new Ingredient('Milk', 7),
                new Ingredient('Pork', 3),
            ])
      ];

      getRecipe(index: number) {
        return this.recipes[index];
      }

      getRecipes() {
          //return an exact copy of this array
          return this.recipes.slice();
      }

      onAddIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
      }

      addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
      }

      updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
      }
}
