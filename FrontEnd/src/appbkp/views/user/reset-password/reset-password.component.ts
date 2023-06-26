import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild('resetForm') resetForm: NgForm;
  emailModel = 'demo@vien.com';
  passwordModel = 'demovien1122';

  buttonDisabled = false;
  buttonState = '';

  constructor(
    private authService: AuthService,
    private notifications: NotificationsService,
    private router: Router
  ) {}

  ngOnInit() {}

  onSubmit() {
    if (!this.resetForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';
    this.authService.resetPassword(this.resetForm.value).subscribe(
      result=>{
        this.notifications.create(
          'Done',
         result,
          NotificationType.Bare,
          { theClass: 'outline primary', timeOut: 6000, showProgressBar: true }
        );
        this.buttonDisabled = false;
        this.buttonState = '';
        setTimeout(() => {
          this.router.navigate(['user/login']);
        }, 6000);
    });
  }
}