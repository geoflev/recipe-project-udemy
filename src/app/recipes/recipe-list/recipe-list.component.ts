import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe('Test recipe', 'This is simply a test recipe', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Life_In_Recipes.png/640px-Life_In_Recipes.png'),
    new Recipe('Another Test recipe', 'This is simply a test recipe', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Life_In_Recipes.png/640px-Life_In_Recipes.png')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
