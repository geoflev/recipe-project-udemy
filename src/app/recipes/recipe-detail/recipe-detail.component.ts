import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeService: RecipeService,
            private route: ActivatedRoute,
            private router: Router) { }


  ngOnInit(): void {
    //subscribe so we get every change to this id and not only the first time
    //alternative but works only first time
    //this.id = this.route.snapshot.params['id'];
    this.route.params
    .subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    )
  }

  onAddToShoppingList(){
    this.recipeService.onAddIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    //this.router.navigate(['edit'], {relativeTo: this.route});
    //above code works 
    //for a more complex example see below
    this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }
}
