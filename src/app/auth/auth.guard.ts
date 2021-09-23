import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, pipe } from "rxjs";
import { map, take, tap } from "rxjs/operators";
import { AuthenticationService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthenticationService,
            private router: Router){}

    //user observable returns a user so we pipe to return a boolean
    //guard has to be declared in app-routing.module
    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        return this.authService.user.pipe(
            //take(1) to only listen to this observable once and then unsubscribe
            take(1),
            map(user => {
            //instead we use this approach
            const isAuth = !!user;
            if(isAuth) {
                return true;
            }
            return this.router.createUrlTree(['/auth']);
        })

        //we could use this approach to redirect a user that isnt authenticated if he tried to access a page that he shouldnt
        // ,tap(isAuth => {
        //     if(!isAuth){
        //         this.router.navigate(['/auth'])
        //     }
        // })
        
        );
    }
}