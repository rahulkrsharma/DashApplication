import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
import { environment } from 'src/environments/environment';
import { SignInValidation } from '../../../utils/app.enums'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm: NgForm;
  emailModel = 'loveforneo@gmail.com';
  passwordModel = 'Neo12345@';

  buttonDisabled = false;
  buttonState = '';

  constructor(private authService: AuthService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit() {
  }

  OnErrorOccured(errorMessage:string){
    this.buttonDisabled = false;
        this.buttonState = '';
        this.notifications.create('Error', errorMessage, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
  }

  onSubmit() {
    if (!this.loginForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.authService.signIn(this.loginForm.value).
      subscribe( result => 
        { 
          if(result['code']== SignInValidation.SignInSuccessful)
          {
            localStorage.setItem("UserId",result['UserID']);
            this.router.navigate([environment.adminRoot]);
          } 
          else if(result['code']== SignInValidation.EmailIdNotRegistered)
          {
              this.OnErrorOccured("Email id is not registered");
          } 
          else if(result['code']== SignInValidation.PasswordNotCorrect)
          {
              this.OnErrorOccured("Password is not correct. Please enter the correct one");
          }
          else if(result['code']== SignInValidation.AccountNotActive)
          {
              this.OnErrorOccured("Account is not yet actived. We have sent an email to activate your account ");
          }
          else if(result['code']== SignInValidation.ErrorOcccured)
          {
              this.OnErrorOccured("An error occured");
          }
       },
       error => {
        this.buttonDisabled = false;
        this.buttonState = '';
        this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
    })
  }
}
