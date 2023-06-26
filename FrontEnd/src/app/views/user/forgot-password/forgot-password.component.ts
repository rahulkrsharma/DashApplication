import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('passwordForm') passwordForm: NgForm;
  buttonDisabled = false;
  buttonState = '';

  constructor(private authService: AuthService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit() {
    if (!this.passwordForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    localStorage.setItem("email",this.passwordForm.value.email);
    this.authService.sendPasswordEmail(this.passwordForm.value.email).subscribe(
      result=>{
        if(result['Item2']== 1){
        this.notifications.create('Done', 'Password reset email is sent, you will be redirected to Reset Password page!', NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
        this.buttonDisabled = false;
        this.buttonState = '';
        setTimeout(() => {
          this.router.navigate(['user/reset-password']);
        }, 6000);
      }
      else{
        this.notifications.create('Done', result['Item1'], NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: true });
        this.buttonDisabled = false;
        this.buttonState = '';

      }
    })
  }

  login(){
    this.router.navigateByUrl("/user/login");
  }

}