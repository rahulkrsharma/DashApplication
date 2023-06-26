import { AfterViewInit, Component, Injectable, Input, OnInit } from '@angular/core';
import { DashboardService, StockListResponse, UserGoal } from '../dashboard.service';
import { Subject } from 'rxjs/Subject';
import { createChart } from 'lightweight-charts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { NotificationsService, NotificationType } from 'angular2-notifications';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
// import { NotificationsService, NotificationType } from 'angular2-notifications';




@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls:['./goals.component.css']
})

@Injectable({
    providedIn: 'root'
 })
export class GoalsComponent  {

    @Input() title:string;
    subscription:Subscription;
    goals:UserGoal;
    constructor(private readonly dashboardService:DashboardService,
        private translate: TranslateService,
        private SpinnerService: NgxSpinnerService){
        this.subscription = this.dashboardService.GetUserGoal()
    .subscribe(result=>{
        this.goals = result;
    })
    }

    OnSuccess(successMessage:string){

            // this.notifications.create('Success', successMessage, NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
      }

    saveUserGoal(){
      this.SpinnerService.show();
        this.dashboardService.saveUserGoal(this.goals).subscribe(
            result=>{
              if(result == "Created")
              {
                
                this.OnSuccess('Goals created successfully');
               
              } else if(result == "Updated")
              {
                this.OnSuccess('Goals updated successfully');

              } 
              this.SpinnerService.hide();
            }
          );   
        }

    }
