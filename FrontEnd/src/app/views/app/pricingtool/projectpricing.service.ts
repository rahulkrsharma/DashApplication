import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from "rxjs/Subject";
import { AppConstants } from '../../../shared/app.constants';
import { catchError, map } from 'rxjs/operators';
import { HttpRequestHelper } from '../../../shared/http-request-helper'
import { stringify } from '@angular/compiler/src/util';
import { dataset } from '../dashboards/dashboard.service';
import { toInt } from 'ngx-bootstrap/chronos/utils/type-checks';
import { Colors } from 'src/app/constants/colors.service';


export class ProjectsListResponse {
    isBookmarked:string;
    StockName : string;
    ISIN : string;
    StockScore : number;
    Industry : string
  }

  export class ProjectPricingDetails {
    ProjectDetails : ProjectDetails;
    PriceQuote : PriceQuote[];
    ExpenseQuote : ExpenseQuote[];
  }

  export class ProjectDetails {
    ProjectId : string;
    ProjectName : string;
    ClientName : string;
    Location : string;
    Stage : string;
    StartDate : string;
    EndDate : string;
    ServiceType : string;
    SalesLead : string;
    EngagementLead : string;
    DeliveryLead : string;
    ProjectURL : string;
    projectDetails: string;
    TotalRevenue:number;
    TotalCost:number;
    TotalExpenseValue:number;
    TotalProfitPercent:number;
    TotalProfitabilityCost:number;
    SelectedServiceTypes : ServiceTypesResponse[];
    
  }

  export class ServiceType {
    code: string;
    name: string;
  }
  
  export class PriceQuote {
    ProjectRole: string;
    Level : string;
    Consultant : string;
    RackRate: number;
    CostRate: number;
    Billable: string;
    AppliedRate: number;
    Discount: number;
    ContractType: string;
    LevantCost:number;
    TotalCost:number;
    ClientRate:number;
    ContractPercent:number;
    StartDate:string;
    EndDate:string;
    Capacity:number;
    Subtotal:number;
    DeliveryCost:number;
    CostToSell:number;
    TotalDiscount:number;
    GrossProfit:number;
    DaysPerWeek:number;
    RatePerWeek:number;
    WorkingDays:number;
    ActualWorkingDays:number;
  }

  export class ExpenseQuote {
    ExpenseType: string;
    Description : string;
    Number : number;
    UnitCost : number;
    Billable: number;
    LevantCost : number;
    ClientCost: number;
    Subtotal: number;
  }

  export class SalesForecastResponse {
    MonthName : string;
    ProjectStage : string;
    TotalMonthlyRevenue : number;
  }

  export class RatesResponse {
    LevelId:string;
    Level : string;
    RackRate : number;
    CostRate : number;
  }

  export class ExpenseTypesResponse {
    ExpenseType : string;
    ExpenseDescription: string;
  }

  export class ServiceTypesResponse {
    ServiceType : string;
    ServiceDescription: string;
  }

  export class ConsultantResponse {
    ConsultantId:number;
    UserName : string;
    UserEmail : string;
    ConsultantWorkdays : number;
    Activity : string;
    ProjectName : string;
    ProjectStartDate : string;
    ProjectEndDate : string;
    Capacity : number;
  }

  export class AssetAllocation {
    labels : string [];
    datasets: dataset[]

  }

  export class UsersResponse {
    UserId: number;
    UserName : string;
    UserEmail : string;
    UserRegDate : string;
    Level : string;
    IsAdmin : string;
    IsActivated : string;
    Location : string;
    RackRate : number;
    CostRate : number;
    ToDelete : string;
    FromAdmin: string;
  }

  export class LeavesDetail {
    UserName : string;
    UserId : number;
    LeaveType : string;
    StartDate : string;
    EndDate : string;
    Reason : string;
    Duration : number;
    SupportingDocument : string;
  }

  

  export class QuarterlyData {
    currentQuarterSum:number;
    previousQuarterSum:number;
    nextQuarterSum:number;
    currentQuarterLeaveSum:number;
    previousQuarterLeaveSum:number;
    nextQuarterLeaveSum:number;
    currentQuarterPercentAllocation:number;
    previousQuarterPercentAllocation:number;
    nextQuarterPercentAllocation:number;

  }
  export class UserDetail {
    displayName:string;
    email:string;
    MobileNo:string;
    WorkSchedule:number;
    UserId:number;
    UserRegDate : string;
    Level : string;
    IsAdmin : string;
    IsActivated : string;
    ToDelete: string;
    Location: string;
    FromAdmin: string;
    ProfileImage:string;
    SelectedServiceTypes : ServiceTypesResponse[];
  }

  export class SalesChart {
    labels: string[];
    datasets: {
        label: string;
        borderColor: string;
        backgroundColor: string;
        data: number[];
        borderWidth: number;
    }[];
  }

  export class Appointment {
    title: string;
    startDate: Date;
    endDate: Date;
    dayLong?: boolean;
    recurrence?: string;
}

export class ScheduleData {
  consultant: string;
  profileUrl: string;
  Week1: string;
  Week2: string;
  Week3: string;
  Week4: string;
  Week5: string;
  Week6: string;
  Week7: string;
  Week8: string;
  Week9: string;
  Week10: string;
  Week11: string;
  Week12: string;
  RowSpan: number;
  RepeatCount:number;

}

export class UtlisationData {
  Level: string;
  SupplyOrDemand: string;
  Week1: string;
  Week2: string;
  Week3: string;
  Week4: string;
  Week5: string;
  Week6: string;
  Week7: string;
  Week8: string;
  Week9: string;
  Week10: string;
  Week11: string;
  Week12: string;
  RowSpan: number;
  RepeatCount:number;

}

 



  


  @Injectable({ providedIn: 'root' })
export class ProjectPricingService {

  barChData : SalesChart ;

  

  

    projectDetails : ProjectPricingDetails;
    userId  = localStorage.getItem("UserId");
    UserName = localStorage.getItem("UserName");

    constructor(private httpClient: HttpClient
        ) {
        //  this.barChData = {
        //     labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        //     datasets: [
        //       {
        //         label: 'Cakes',
        //         borderColor: Colors.getColors().themeColor1,
        //         backgroundColor: Colors.getColors().themeColor1_10,
        //         data: [456, 479, 324, 569, 702, 600],
        //         borderWidth: 2
        //       },
        //       {
        //         label: 'Desserts',
        //         borderColor: Colors.getColors().themeColor2,
        //         backgroundColor: Colors.getColors().themeColor2_10,
        //         data: [364, 504, 605, 400, 345, 320],
        //         borderWidth: 2
        //       }
        //     ]
        //   };
        }

    getProjects(sortingCriteria: string,searchText: string) : Observable<ProjectsListResponse[]> {
        return this.httpClient.get(AppConstants.projectListUrl + "/" + sortingCriteria + "/" + searchText) 
            .pipe(map(response => <ProjectsListResponse[]>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<ProjectsListResponse[]>;   
      }

      getPricingFiles() : Observable<ProjectsListResponse[]> {
        var UserName = localStorage.getItem("UserName");
        return this.httpClient.get(AppConstants.pricingFilesUrl + "/" + UserName) 
            .pipe(map(response => <ProjectsListResponse[]>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<ProjectsListResponse[]>;   
      }

      getUserWork() : Observable<ConsultantResponse[]> {
        var UserName = localStorage.getItem("UserName");
        return this.httpClient.get(AppConstants.resourceWorkUrl + "/" + UserName) 
            .pipe(map(response => <ConsultantResponse[]>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<ConsultantResponse[]>;   
      }

      getProjectsById(projectId: string) : Observable<ProjectPricingDetails> {
        return this.httpClient.get(AppConstants.projectDetailsByIdUrl + "/" + projectId) 
            .pipe(map(response => <ProjectPricingDetails>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<ProjectPricingDetails>;   
      }

      fetchProjectDetailsById(projectId: string) : Observable<ProjectPricingDetails> {
        return this.httpClient.get(AppConstants.projectDetailsByIdUrl + projectId) 
            .pipe(map(response => <ProjectPricingDetails>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<ProjectPricingDetails>;   
      }

      fetchLeaves() : Observable<LeavesDetail[]> {
        return this.httpClient.get(AppConstants.leavesDetailUrl + this.userId) 
        .pipe(map(response => <LeavesDetail[]>response),
               catchError(HttpRequestHelper.handleError)
               ) as Observable<LeavesDetail[]>;
      }

      fetchScheduleData() : Observable<ScheduleData[]> {
        return this.httpClient.get(AppConstants.scheduleDetailsUrl + '/' +this.userId) 
        .pipe(map(response => <ScheduleData[]>response),
               catchError(HttpRequestHelper.handleError)
               ) as Observable<ScheduleData[]>;
      }

      fetchTeamAllocation() : Observable<ScheduleData[]> {
        return this.httpClient.get(AppConstants.teamAllocationsUrl) 
        .pipe(map(response => <ScheduleData[]>response),
               catchError(HttpRequestHelper.handleError)
               ) as Observable<ScheduleData[]>;
      }

      UtilisationByLevels() : Observable<UtlisationData[]> {
        return this.httpClient.get(AppConstants.utilisationbylevelUrl) 
        .pipe(map(response => <UtlisationData[]>response),
               catchError(HttpRequestHelper.handleError)
               ) as Observable<UtlisationData[]>;
      }

      

      saveProjectPricing(projectPricingDetails: ProjectPricingDetails,projectId: string): Observable<string>{
        this.projectDetails = projectPricingDetails;
        if(projectId!='' || projectId!=undefined){
          this.projectDetails.ProjectDetails.ProjectId = projectId;
        }
        
        return this.httpClient.post(AppConstants.saveProjectPricingUrl,this.projectDetails)
        .pipe(map(response => <string>response),
        catchError(HttpRequestHelper.handleError)
        ) as Observable<string>;
      
    
      }

      saveRate(rates:RatesResponse[]):Observable<string>{
        return this.httpClient.post(AppConstants.saveRatesUrl,rates)
        .pipe(map(response => <string>response),
        catchError(HttpRequestHelper.handleError)
        ) as Observable<string>;
      };

      manageLeaves(leavesDetail:LeavesDetail[]):Observable<string>{
        var UserName = localStorage.getItem("UserName");
        if(leavesDetail.length > 0){
        leavesDetail[0].UserId =Number(this.userId);
        leavesDetail[0].UserName = UserName;
        }

        return this.httpClient.post(AppConstants.manageLeavesUrl + '/'+ this.userId,leavesDetail)
        .pipe(map(response => <string>response),
        catchError(HttpRequestHelper.handleError)
        ) as Observable<string>;
      };
      
      saveExpenseTypes(expenseTypes:ExpenseTypesResponse[]):Observable<string>{
        return this.httpClient.post(AppConstants.saveExpenseTypesUrl,expenseTypes)
        .pipe(map(response => <string>response),
        catchError(HttpRequestHelper.handleError)
        ) as Observable<string>;
      };

      saveServiceTypes(serviceTypes:ServiceTypesResponse[]):Observable<string>{
        return this.httpClient.post(AppConstants.saveServiceTypesUrl,serviceTypes)
        .pipe(map(response => <string>response),
        catchError(HttpRequestHelper.handleError)
        ) as Observable<string>;
      };

      getRates() : Observable<RatesResponse[]> {
        return this.httpClient.get(AppConstants.fetchRateUrl) 
            .pipe(map(response => <RatesResponse[]>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<RatesResponse[]>;   
      }

      fetchUsers() : Observable<UsersResponse[]> {
        return this.httpClient.get(AppConstants.fetchUsersListUrl) 
            .pipe(map(response => <UsersResponse[]>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<UsersResponse[]>;   
      }

      fetchUserInfo() : Observable<UserDetail> {
        this.userId = localStorage.getItem("UserId");
        return this.httpClient.get(AppConstants.fetchUserInfoUrl + this.userId) 
            .pipe(map(response => <UserDetail>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<UserDetail>;   
      }

      fetchQuarterlyData() : Observable<QuarterlyData> {
        this.userId = localStorage.getItem("UserId");
        return this.httpClient.get(AppConstants.fetchQuarterlyDataUrl + this.userId) 
            .pipe(map(response => <QuarterlyData>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<QuarterlyData>;   
      }

      saveUserDetails(userDetails:UsersResponse):Observable<UsersResponse[]>{
        userDetails.FromAdmin = localStorage.getItem("IsAdmin");
        return this.httpClient.post(AppConstants.managerUserDetailsUrl,userDetails)
        .pipe(map(response => <UsersResponse[]>response),
        catchError(HttpRequestHelper.handleError)
        ) as Observable<UsersResponse[]>;
      };

      saveProfileDetails(userDetails:UserDetail):Observable<UserDetail[]>{
        return this.httpClient.post(AppConstants.managerUserDetailsUrl,userDetails)
        .pipe(map(response => <UserDetail[]>response),
        catchError(HttpRequestHelper.handleError)
        ) as Observable<UserDetail[]>;
      };

      fetchSalesForecast() : Observable<SalesChart> {
        return this.httpClient.get(AppConstants.salesForecastUrl) 
            .pipe(map(response => <SalesChart>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<SalesChart>;   
      }

      deletePricing(projectName:string) : Observable<ProjectsListResponse[]>{
        return this.httpClient.get(AppConstants.deletePricingUrl + "/" + projectName) 
            .pipe(map(response => <ProjectsListResponse[]>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<ProjectsListResponse[]>;
      }

      getSalesForecastData() : SalesChart {
        return this.barChData as SalesChart;   
      }

      setSalesForecastData(salesData: SalesChart) {
        this.barChData = salesData;
      }

    
}