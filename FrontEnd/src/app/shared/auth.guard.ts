import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  ActivatedRoute,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ProjectPricingService } from '../views/app/pricingtool/projectpricing.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute,private projectPricingService: ProjectPricingService) {}
  
  async canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    var UserId = localStorage.getItem("UserId");
        var Emailid = localStorage.getItem("EmailId");
        var IsAuthenticated = localStorage.getItem("IsAuthenticated");
    
    if(IsAuthenticated){
      return true;
      }
      else{
        this.router.navigate(['/login'], { relativeTo: this.route });
        return false;
      }
    }
  
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var UserId = localStorage.getItem("UserId");
        var Emailid = localStorage.getItem("EmailId");
        var IsAuthenticated = localStorage.getItem("IsAuthenticated");
    
    if(IsAuthenticated){
      return true;
      }
      else{
        this.router.navigate(['/login'], { relativeTo: this.route });
        return false;
      }
    }
}
