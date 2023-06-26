import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import{ RegisterValidation } from 'src/app/utils/app.enums';
import { countries } from '../../../../app/data/country-data-store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  @ViewChild('registerForm') registerForm: NgForm;
  buttonDisabled = false;
  buttonState = '';
  selectedCountry;
  // countries: any[] = ['India', 'Australia', 'United States'];
  public countryList:any = countries; 


  constructor(private authService: AuthService, private notifications: NotificationsService, private router: Router) { }

  ngOnInit() {
    
  }
  OnErrorOccured(errorMessage:string){
    this.buttonDisabled = false;
        this.buttonState = '';
        this.notifications.create('Error', errorMessage, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
  }

  OnSuccess(successMessage:string){
    this.buttonDisabled = false;
        this.buttonState = '';
        this.notifications.create('Success', successMessage, NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
  }
  onSubmit() {
    if (!this.registerForm.valid || this.buttonDisabled) {
      return;
    }
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    // this.authService.register(this.registerForm.value).then((user) => {
    //   this.router.navigate([environment.adminRoot]);
    // }).catch((error) => {
    //   this.notifications.create('Error', error.message, NotificationType.Bare, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
    //   this.buttonDisabled = false;
    //   this.buttonState = '';
    // });

    this.authService.register(this.registerForm.value).subscribe(
      result=>{
        if(result['code'] == RegisterValidation.AccountNotActive)
        {
          this.OnSuccess(result['message']);
          this.registerForm.resetForm();
        } else if(result['code'] == RegisterValidation.AlreadyRegistered)
        {
          this.OnErrorOccured('User already registered');
        } else if(result['code'] == RegisterValidation.ErrorOcccured)
        {
          this.OnErrorOccured('An error occured');
        }
      }
    );   
  }
}
