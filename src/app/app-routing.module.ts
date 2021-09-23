import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    { path: '', redirectTo: 'recipes', pathMatch: 'full' },
    //lazy loading
    //as soon as the user enters /recipes, only then the recipes bundle is downloaded
    { path: 'recipes', loadChildren: () =>  import('./recipes/recipes.module').then(module => module.RecipesModule)},
    { path: 'shopping-list', loadChildren: () =>  import('./shopping-list/shopping-list.module').then(module => module.ShoppingListModule)},
    { path: 'auth', loadChildren: () =>  import('./auth/auth.module').then(module => module.AuthModule)}
]

@NgModule({
    //preload all modules for example when we are at auth page, download and load all modules
    //good because we dont have to download all the app when we try to access auth, but later
    //so the initial download is still small (lazy loading)
    imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutingModule{}