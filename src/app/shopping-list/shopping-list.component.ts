import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[] =[];

  constructor(private ShoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.ShoppingListService.getIngredients();
    //we subscribe to the eventEmitter from shopping-list.ts to always get the changed list
    this.ShoppingListService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      }
    );
  }
}
