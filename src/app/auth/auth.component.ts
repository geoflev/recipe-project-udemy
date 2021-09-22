import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService, AuthResponseData } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent {

    constructor(private authService: AuthenticationService,
        private router: Router) { }
    isLogInMode = true;
    isLoading = false;
    error: string = null;

    onSwitchMode() {
        this.isLogInMode = !this.isLogInMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData>;

        this.isLoading = true;
        //DRY principle we introduce an observable and assign the subscription on it
        //so we dont dublicate .subscribe method
        if (this.isLogInMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signup(email, password);
        }

        authObs.subscribe(
            data => {
                console.log(data);
                this.router.navigate(['/recipes']);
                this.isLoading = false;
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoading = false;
            }
        );
        form.reset();
    }

}