import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { AppConstants } from '../shared/app.constants'

import { getUserRole } from 'src/app/utils/util';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HttpRequestHelper } from '../shared/http-request-helper'

export interface IURL{
  URL: string;
}
export interface ISignInCredentials {
  email: string;
  password: string;
}

export interface ICreateCredentials {
  email: string;
  password: string;
  displayName: string;
  Location: string;
}

export interface IPasswordReset {
  email : string;
  code: string;
  newPassword: string;
}

export class SignInResponse {
  code : number;
  message : string;
}

export class RegisterResponse {
  code : number;
  message : string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  sendVercodecred: ICreateCredentials = {
    email : "",
    password : "",
    displayName :"",
    Location :""
  }
  constructor(private auth: AngularFireAuth,  
              private httpClient: HttpClient
              ) {

              }

  signIn(credentials: ISignInCredentials) : Observable<SignInResponse> {
    return this.httpClient.post(AppConstants.loginUrl,credentials)

        .pipe(map(response => <SignInResponse>response),
               catchError(HttpRequestHelper.handleError)
               ) as Observable<SignInResponse>;   
  }
  
  signOut() {
    return from(this.auth.signOut());
  }

  register(credentials: ICreateCredentials): Observable<RegisterResponse>{
    return this.httpClient.post(AppConstants.registerUrl,credentials)
    .pipe(map(response => <RegisterResponse>response),
    catchError(HttpRequestHelper.handleError)
    ) as Observable<RegisterResponse>;
  

  }

  sendPasswordEmail(email: string)  {
    return this.httpClient.get(AppConstants.sendVercodeUrl + email+'/')

    .pipe(map(response => response),
           catchError(HttpRequestHelper.handleError)
           ) as Observable<string>;   
  }

  fetchStatus(emailId:string,verificationCode:string): Observable<string>{
    return this.httpClient.get(AppConstants.activateAccountUrl + emailId + '/'+ verificationCode+'/')
    
    .pipe(map(response => response),
           catchError(HttpRequestHelper.handleError)
           ) as Observable<string>;  
  }

  resetPassword(credentials: IPasswordReset) {
    credentials.email = localStorage.getItem("email");
    return this.httpClient.post(AppConstants.resetPasswordUrl,credentials)

    .pipe(map(response => response),
           catchError(HttpRequestHelper.handleError)
           ) as Observable<string>;   
  }

  async getUser() {
    const u = await this.auth.currentUser;
    return { ...u, role: getUserRole() };
  }
}