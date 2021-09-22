import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from "rxjs/operators";
import { AuthenticationService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthenticationService) {
    }


    //add auth as param with the token in every outgoing request
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        //SOS: observable in another observable
        //exhaust waits ofr the 1st observable to complete (user obs), then it gives us the user and in the end with the 2nd obs we return a 2nd observable that replaces the first 
        return this.authService.user.pipe(take(1), exhaustMap(user => {
            if(!user) {
                //when we dont have a user we dont try to modify it
                return next.handle(req);
            }
            const modifiedReq = req.clone(
                {
                    params: new HttpParams().set('auth', user.token)
                });
            return next.handle(modifiedReq);
        }));

    }
}