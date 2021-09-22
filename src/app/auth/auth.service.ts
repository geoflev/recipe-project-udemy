import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    //get user and his token as a subject to get it continuesly
    //user = new Subject<User>();
    //get user and his token on demand to use it at data storage service on http calls
    user = new BehaviorSubject<User>(null);
    tokenExpirationTimer: any;


    constructor(private http: HttpClient,
        private router: Router) { }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA_q0AqZcXcKwMYQJNVbrxhAKfQ_NIJdJ0',
            {
                email: email,
                password: password,
                returnSecureToken: true
                //tap steps into the observable chain without stopping it or changing it
                //it just executes some code
            }).pipe(catchError(this.handleError), tap(
                resData => {
                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                }
            ));
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        //if we logout manually and not auto we have to clear the timer so it doesnt logout us at another random time when timer ends
        if(this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    //try to autologin user for example after refreshing the page
    //It is used in app component as soon as the app starts
    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        //no userData in local storage, so no user to autologin
        if (!userData) {
            return;
        }

        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));

        //calls the get method token() (boolean)
        if (loadedUser.token) {
            //push loaded user
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA_q0AqZcXcKwMYQJNVbrxhAKfQ_NIJdJ0',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(catchError(this.handleError), tap(
                resData => {
                    this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
                }
            ));
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const tokenExpireDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, userId, token, tokenExpireDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000);
        //save user to localStorage to get token even after refreshing the app
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!';
        //paths for errors in response object
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'The email provided already exists!'
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Email provided was not found';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'Invalid password!';
                break;

        }
        return throwError(errorMessage);
    }
}