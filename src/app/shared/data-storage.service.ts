import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthenticationService } from "../auth/auth.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {
    constructor(private http: HttpClient,
        private recipesService: RecipeService,
        private authService: AuthenticationService) { }

    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        this.http.put('https://ng-course-recipe-book-b15f9-default-rtdb.europe-west1.firebasedatabase.app/recipes.json', recipes).subscribe(
            response => {
                console.log(response);
            }
        );
    }

    fetchRecipes() {
        //take 1 value from that observable. Its not normal subscription that gets values continuesly. It automatically unsubscribes after getting the value
        return this.http.get<Recipe[]>('https://ng-course-recipe-book-b15f9-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        ).pipe(
            map(recipes => {
                return recipes.map(recipe => {
                    //if no ingredients exist set it to [] so this doenst become undefined
                    return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
                });
            })
            , tap(recipes => {
                this.recipesService.setRecipes(recipes);
            }));



    }
}