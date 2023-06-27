import { Component, OnInit } from '@angular/core';
import { countries } from '../../../../data/country-data-store'
import { AssetAllocation, AssetsOverview } from '../../dashboards/dashboard.service';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { assets } from 'src/app/data/assetsoverview';
import { expenseQuotes} from 'src/app/data/expenseQuote'
import { priceQuotes} from 'src/app/data/priceQuote'
import { ConsultantResponse, ExpenseQuote, PriceQuote, ProjectDetails, ProjectPricingDetails, ProjectPricingService, RatesResponse, ServiceType } from '../projectpricing.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService, NotificationType } from 'angular2-notifications';

@Component({
  selector: 'app-createprojectpricing',
  templateUrl: './createprojectpricing.component.html',
  styleUrls: ['./createprojectpricing.component.scss']
})
export class CreateprojectpricingComponent implements OnInit {
  disabled: boolean = false;
  minDate: string;
  validationFailed = false;
  validationFailedMessages : string[] = [];
  
  projectDetails: ProjectDetails = {
    ProjectId:'',
    ProjectName: '',
    ClientName: '',
    Location: '',
    Stage: '',
    StartDate: '',
    EndDate: '',
    ServiceType: '',
    SalesLead: '',
    EngagementLead: '',
    DeliveryLead: '',
    ProjectURL: '',
    projectDetails: '',
    TotalRevenue:0,
    TotalCost:0,
    TotalExpenseValue:0,
    TotalProfitabilityCost:0,
    TotalProfitPercent:0,
    SelectedServiceTypes: []
  };
  assets:AssetsOverview[];
  priceQuoteContractor:PriceQuote[] =[{
    ProjectRole: '',
    Level : '',
    Consultant : '',
    RackRate: 0,
    CostRate:0,
    Billable: '',
    AppliedRate: 0,
    Discount: 0,
    ContractType: '',
    LevantCost:0,
    TotalCost:0,
    ClientRate:0,
    ContractPercent:0,
    StartDate:'',
    EndDate:'',
    Capacity:0,
    Subtotal:0,
    DeliveryCost:0,
    CostToSell:0,
    TotalDiscount:0,
    GrossProfit:0,
    DaysPerWeek:0,
    RatePerWeek:0,
    WorkingDays:0,
    ActualWorkingDays:0

  }];
  priceQuote:PriceQuote[] = [{
    ProjectRole: '',
    Level : '',
    Consultant : '',
    RackRate: 0,
    CostRate:0,
    Billable: '',
    AppliedRate: 0,
    Discount: 0,
    ContractType: '',
    LevantCost:0,
    TotalCost:0,
    ClientRate:0,
    ContractPercent:0,
    StartDate:'',
    EndDate:'',
    Capacity:0,
    Subtotal:0,
    DeliveryCost:0,
    CostToSell:0,
    TotalDiscount:0,
    GrossProfit:0,
    DaysPerWeek:0,
    RatePerWeek:0,
    WorkingDays:0,
    ActualWorkingDays:0

  }];

  expenseQuote : ExpenseQuote[] = [{
    ExpenseType :'',
    Description:'',
    Number:0,
    UnitCost:0,
    Billable:0,
    LevantCost:0,
    ClientCost:0,
    Subtotal:0
  }];

  newExpenseAttribute : ExpenseQuote ={
    ExpenseType :'',
    Description:'',
    Number:0,
    UnitCost:0,
    Billable:0,
    LevantCost:0,
    ClientCost:0,
    Subtotal:0
  };

  ProjectPricingDetails : ProjectPricingDetails={
    ProjectDetails: new ProjectDetails,
    PriceQuote: [],
    ExpenseQuote: []
  };



  newAttribute:any ={};
  ColumnMode = ColumnMode;
  selected = [];
  SelectionType = SelectionType;
  itemsPerPage = 10;
  selectAllState = '';
  assetData:AssetAllocation;
  i:number =0;
  totalNetWorth=0;
  isContractType=false;
  isCollapsed = false;
  panelOpenState = false;
  messageEvents: string;
  ratesList : RatesResponse[];
  consultants : ConsultantResponse[];
  isCollapsed2 = false;
  isCollapsedAnimated = false;
  editable = false;
  isCollapsedEvents = false;
  ProjectId ='';
  isOpen = true;

  isInlineCollapsed = false;

  rackRate:number;
  costRate:number;
  TotalRevenue:number =0;
  TotalExpenseValue:number =0;
  TotalFeesExpenses:number =0;
  TotalClientCost:number=0;
  FeesWithSubtotal:number =0;
  TotalRevenueConsultant:number =0;
  TotalRevenueContractor:number =0;
  TotalProfitabilityCost:number =0;
  TotalProfitPercent: number = 0;
  TotalProfitabilityConsultant:number =0;
  TotalProfitabilityContractor:number =0;
  TotalProfitabilityLevantCost:number =0;
  TotalCost:number=0;
  TotalDeliveryCost:number =0;
  TotalDeliveryCostConstulant:number =0;
  TotalDeliveryCostContractor:number =0;
  TotalCostToSell:number =0;
  TotalCostToSellConsultant:number =0;
  TotalCostToSellContractor:number =0;
  TotalLevantCost:number=0;
  TotalExpense:number=0;
  TotalProfitability:number=0;
  ProfitabilityPercent:number=0;
  showAddNewRowConsultant =false;
  showAddNewRowContractor =false;
  showAddNewRowExpense =false;
  editing = {};
  rows = [];
  data = [];

    columns = [       
        { prop: 'ProjectRole', name: 'ProjectRole' },
        { prop: 'Level', name: 'Level' },
        { prop: 'Consultant', name: 'Consultant' },
        { prop: 'RackRate', name: 'RackRate' },
        { prop: 'CostRate', name: 'CostRate' },
        { prop: 'Billable', name: 'Billable' },
        { prop: 'AppliedRate', name: 'AppliedRate' },
        { prop: 'Discount', name: 'Discount' },
        { prop: 'ContractType', name: 'ContractType' },
        { prop: 'LevantCost', name: 'LevantCost' },
        { prop: 'TotalCost', name: 'TotalCost' },
        { prop: 'ClientRate', name: 'ClientRate' },
        { prop: 'ContractPercent', name: 'ContractPercent' },
        { prop: 'StartDate', name: 'StartDate' },
        { prop: 'EndDate', name: 'EndDate' },
        { prop: 'Capacity', name: 'Capacity' },
        { prop: 'DaysPerWeek', name: 'DaysPerWeek' },
        { prop: 'RatePerWeek', name: 'RatePerWeek' },
        { prop: 'Subtotal', name: 'Subtotal' },
        { prop: 'DeliveryCost', name: 'DeliveryCost' },
        { prop: 'CostToSell', name: 'CostToSell' },
        { prop: 'TotalDiscount', name: 'TotalDiscount' },
        { prop: 'GrossProfit', name: 'GrossProfit' }
        
      ];

      expensecolumns = [       
        { prop: 'ExpenseType', name: 'ExpenseType' },
        { prop: 'Description', name: 'Description' },
        { prop: 'Number', name: 'Number' },
        { prop: 'UnitCost', name: 'UnitCost' }
      ];

    
  public countryList:any [] = [
    { code: "Sydney", name: "Sydney" },
    { code: "Melbourne", name: "Melbourne" },
    { code: "Canberra", name: "Canberra" }, 
    { code: "Brisbane", name: "Brisbane" },
    { code: "Adelaide", name: "Adelaide" },
    { code: "Perth", name: "Perth" }, 
    { code: "Hobart", name: "Hobart" },
    { code: "Other", name: "Other" }
  ]; 

  
  public stages: any [] = [
    { code: "Identified", name: "Identified" },
    { code: "Contacted", name: "Contacted" },
    { code: "Needs Analysis", name: "Needs Analysis" }, 
    { code: "Qualified", name: "Qualified" },
    { code: "Proposed", name: "Proposed" },
    { code: "Won", name: "Won" }, 
    { code: "Lost", name: "Lost" },
    { code: "Abandoned", name: "Abandoned" },
    { code: "Won & Completed", name: "Won & Completed" }
  ];

  public billables : any [] = [
    { code: "Yes", name: "Yes" },
    { code: "No", name: "No" }
  ];

  public contractType : any [] = [
    { code: "SoleTrader", name: "Sole Trader" },
    { code: "PtyLtd", name: "Pty Ltd" }
  ];

  // public expenseList: any [] = [
  //   { code: "Flight", name: "Flight" },
  //   { code: "Accomodation", name: "Accomodation" },
  //   { code: "Meals", name: "Meals" },
  //   { code: "Taxi", name: "Taxi" },
  //   { code: "Other", name: "Other" }
  // ];

  // public serviceTypes: ServiceType [] = [
  //   { code: "ChangeManagement", name: "Change Management" },
  //   { code: "OrganistationDesign", name: "Organistation Design" },
  //   { code: "StrategicChange", name: "Strategic Change" },
  //   { code: "OrganistationDevelopment", name: "Organistation Development" },
  //   { code: "HRTransformation", name: "HR Transformation" },
  //   { code: "UXImprovement", name: "UX/Process Improvement" }
  // ];

  public expenseList: any [] = [];

  public serviceTypes: ServiceType [] = [];

  //items = this.serviceTypes;

  constructor(private projectPricingService: ProjectPricingService,private SpinnerService: NgxSpinnerService,
    private _router:Router, private notifications: NotificationsService,private route: ActivatedRoute) { 
    this.minDate = this.getCurrentDate();
    //this.priceQuote = priceQuotes;
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
  
    this.assets = assets;
      this.route.queryParams.subscribe(params => {
        console.log(params.projectId);
        this.ProjectId = params.projectId;
        if(this.ProjectId!=undefined)
        {
        this.SpinnerService.show();
        this.projectPricingService.getProjectsById(this.ProjectId).subscribe(
          result=>{
            var i=0;

             this.projectDetails = result.ProjectDetails;
             this.priceQuoteContractor = result.PriceQuote.filter(x=>x.ContractType!="" && x.ContractType!=null);
             this.priceQuote = result.PriceQuote.filter(x=>x.ContractType=="" || x.ContractType==null);

             if(this.priceQuote.length == 0){
              this.addNewRow();
             }

             if(this.priceQuoteContractor.length == 0){
              this.addNewRowContractor();
             }
 
            //  for(i=0;i<result.PriceQuote.length;i++){
            //   if(result.PriceQuote[i].ContractType!=""){
            //     this.priceQuoteContractor.push(result.PriceQuote[i]);
            //   }else {
            //     this.priceQuote.push(result.PriceQuote[i]);
            //   }
            //  }
             this.expenseQuote = result.ExpenseQuote;
             if(this.expenseQuote.length == 0){
              this.addNewExpenseRow();
             }

             this.calculateTotalRevenue();
             this.calculateTotalCostRevenue();
             this.calculateTotalExpense();
             this.calculateTotalProfitability();
             
             //this.expenseQuote = expenseQuotes;
             this.SpinnerService.hide();
          }
        ); 
      }
      });
  
      if(this.priceQuote.length==0){
        this.showAddNewRowConsultant = true;
        this.addNewRow();
      }

      if(this.priceQuoteContractor.length==0){
        this.showAddNewRowContractor = true;
        this.addNewRowContractor();
      }

      if(this.expenseQuote.length==0){
        this.showAddNewRowExpense = true;
        this.addNewExpenseRow();
      }
      
      //this.assetData.labels.push('bankAccount','creditCards','crypto');
      //this.assetData.datasets.push()
  
      this.projectPricingService.getRates().subscribe(
        result=>{
          this.ratesList = result["Item1"];
          this.consultants = result["Item2"];
          this.expenseList = result["Item3"];
          this.serviceTypes = result["Item4"];
  
        }
      )
  

    
  }

  collapsed(): void {
    this.messageEvents = 'collapsed';
  }

  collapses(): void {
    this.messageEvents = 'collapses';
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    //this.setSelectAllState();
  }

  calculateTotalCostRevenue(){
    this.TotalDeliveryCost=0;
    this.TotalDeliveryCostConstulant=0;
    this.TotalDeliveryCostContractor=0;
    this.TotalCostToSell=0;
    this.TotalCostToSellConsultant=0;
    this.TotalCostToSellContractor = 0;
    this.TotalLevantCost = 0;
    this.projectDetails.TotalCost = 0;

    if(this.priceQuote.length > 0){
      for(this.i = 0;this.i< this.priceQuote.length;this.i++){
        if(this.priceQuote[this.i]["DeliveryCost"]!=undefined){
          this.TotalDeliveryCostConstulant = this.TotalDeliveryCostConstulant + this.priceQuote[this.i]["DeliveryCost"];
        }

        if(this.priceQuote[this.i]["CostToSell"]!=undefined){
          this.TotalCostToSellConsultant = this.TotalCostToSellConsultant + this.priceQuote[this.i]["CostToSell"];
        }
      }
    }

    if(this.priceQuoteContractor.length > 0){
      for(this.i = 0;this.i< this.priceQuoteContractor.length;this.i++){
        if(this.priceQuoteContractor[this.i]["DeliveryCost"]!=undefined){
          this.TotalDeliveryCostContractor = this.TotalDeliveryCostContractor + this.priceQuoteContractor[this.i]["DeliveryCost"];
        }

        if(this.priceQuoteContractor[this.i]["CostToSell"]!=undefined){
          this.TotalCostToSellContractor = this.TotalCostToSellContractor + this.priceQuoteContractor[this.i]["CostToSell"];
        }
      }
    }

    this.TotalDeliveryCost = Math.round(this.TotalDeliveryCostConstulant + this.TotalDeliveryCostContractor);
    this.TotalCostToSell = Math.round(this.TotalCostToSellConsultant + this.TotalCostToSellContractor);
    

    if(this.expenseQuote.length > 0){
      for(this.i = 0;this.i< this.expenseQuote.length;this.i++){
        if(this.expenseQuote[this.i]["LevantCost"]!=undefined){
          this.TotalLevantCost = this.TotalLevantCost + this.expenseQuote[this.i]["LevantCost"];
        }
      }
    }

    this.projectDetails.TotalCost = Math.round(this.TotalDeliveryCost + this.TotalCostToSell + this.TotalLevantCost);
  }

  calculateTotalRevenue(){
    this.projectDetails.TotalRevenue=0;
    this.TotalRevenueConsultant = 0;
    this.TotalRevenueContractor = 0;

    if(this.priceQuote.length > 0){
      for(this.i = 0;this.i< this.priceQuote.length;this.i++){
        if(this.priceQuote[this.i]["Subtotal"]!=undefined){
          this.TotalRevenueConsultant = this.TotalRevenueConsultant + this.priceQuote[this.i]["Subtotal"];
        }
      }
    }

    if(this.priceQuoteContractor.length > 0){
      for(this.i = 0;this.i< this.priceQuoteContractor.length;this.i++){
        if(this.priceQuoteContractor[this.i]["Subtotal"]!=undefined){
          this.TotalRevenueContractor = this.TotalRevenueContractor + this.priceQuoteContractor[this.i]["Subtotal"];
        }
      }
    }
    this.projectDetails.TotalRevenue =Math.round(this.TotalRevenueConsultant + this.TotalRevenueContractor);
    this.FeesWithSubtotal =Math.round(Number(this.projectDetails.TotalRevenue) + Number(this.projectDetails.TotalRevenue * 0.1)); 
  }

  calculateTotalExpense(){
    this.projectDetails.TotalExpenseValue=0;
    this.TotalClientCost=0;
    this.TotalFeesExpenses =0;

    if(this.expenseQuote.length > 0){
      for(this.i = 0;this.i< this.expenseQuote.length;this.i++){
        if(this.expenseQuote[this.i]["Subtotal"]!=undefined){
          this.projectDetails.TotalExpenseValue = this.projectDetails.TotalExpenseValue + this.expenseQuote[this.i]["Subtotal"];
          this.TotalClientCost = this.TotalClientCost + this.expenseQuote[this.i]["ClientCost"];
        }
      }
    }

    this.TotalFeesExpenses =Math.round(Number(this.FeesWithSubtotal) + Number(this.TotalClientCost));
  }

  calculateTotalProfitability(){
   
    this.projectDetails.TotalProfitabilityCost = Math.round(this.projectDetails.TotalRevenue - this.projectDetails.TotalCost);
    var prValue = Number(this.projectDetails.TotalProfitabilityCost) / Number(this.projectDetails.TotalRevenue);
    this.projectDetails.TotalProfitPercent = Math.round(prValue * 100);
    if(this.projectDetails.TotalProfitPercent==null || Number.isNaN(this.projectDetails.TotalProfitPercent)){
      this.projectDetails.TotalProfitPercent = 0;
    }
  }

  savePricingDetails(){
    this.validationFailed = false;
    this.validationFailedMessages = [];
    var i=0;
    this.SpinnerService.show();
    this.ProjectPricingDetails.ProjectDetails = this.projectDetails;
    this.ProjectPricingDetails.PriceQuote = this.priceQuote.filter(x=>x.ProjectRole!=null || x.ProjectRole!='');
    this.ProjectPricingDetails.ExpenseQuote = this.expenseQuote.filter(x=>x.Subtotal>0);;
    this.priceQuoteContractor = this.priceQuoteContractor.filter(x=>x.LevantCost>0);
    if(this.priceQuoteContractor.length > 0){
      for(i=0;i<this.priceQuoteContractor.length;i++)
      this.priceQuote.push(this.priceQuoteContractor[i]);
    }
  
   this.validateFields(this.projectDetails);
   if(this.validationFailedMessages[0]!= null){
    this.SpinnerService.hide();
    this.validationFailed = true;
   }
    if(this.hasDuplicateResource(this.priceQuote)){
      console.log("Same resource is allocated for project");
      this.SpinnerService.hide();
      this.validationFailed = true;
      this.validationFailedMessages.push("Same resource is allocated for multiple enteries");
    }  
    
    if(!this.validationFailed){
      this.ProjectPricingDetails.PriceQuote = this.priceQuote;
    this.projectPricingService.saveProjectPricing(this.ProjectPricingDetails,this.ProjectId).subscribe(
      result=>{
      
        this.SpinnerService.hide();
        if(result == "Saved")
        {
          this.OnSuccess('Project Details successfully saved');
          this._router.navigate(['/app/projectpricing'], { relativeTo: this.route });
        }
      }
    );  
    this.SpinnerService.hide();
    console.log("Price Quote"+this.priceQuote);
    console.log("Expense Quote"+this.expenseQuote);
    }
    else{
      this.priceQuoteContractor = this.priceQuote.filter(x=>x.ContractType!="" && x.ContractType!=null);
      this.priceQuote = this.priceQuote.filter(x=>x.ContractType=="" || x.ContractType==null);

    }
}

OnSuccess(successMessage:string){
      this.notifications.create('Success', successMessage, NotificationType.Success, { theClass: 'outline primary', timeOut: 6000, showProgressBar: false });
}

applyDiscount(event,cell, rowIndex){
  this.priceQuote[rowIndex]['Discount'] =this.priceQuote[rowIndex]['RackRate'] - event.target.value;
}
CalculateFteRates(level:string,rowIndex){
  this.priceQuote[rowIndex]['RackRate'] = this.ratesList.filter(x=>x.Level==level)[0].RackRate;
  this.priceQuote[rowIndex]['CostRate'] = this.ratesList.filter(x=>x.Level==level)[0].CostRate;
  this.priceQuote[rowIndex]['Discount'] = this.priceQuote[rowIndex]['RackRate'] - this.priceQuote[rowIndex]['AppliedRate'];
}

CalculateContractorRates(level:string, rowIndex){
  this.priceQuoteContractor[rowIndex]['RackRate'] = this.ratesList.filter(x=>x.Level==level)[0].RackRate;
  this.priceQuoteContractor[rowIndex]['CostRate'] = this.ratesList.filter(x=>x.Level==level)[0].CostRate;
  this.priceQuoteContractor[rowIndex]['Discount'] = this.priceQuoteContractor[rowIndex]['RackRate'] - this.priceQuoteContractor[rowIndex]['AppliedRate'];
}


calculateContractPercent(event,cell, rowIndex){

this.priceQuote[rowIndex]['ContractPercent'] = (event.target.value - (+this.priceQuote[rowIndex]['TotalCost'] * 1.1))*100/ event.target.value
console.log(this.priceQuote[0]);
}


CalculateFteRatePerWeek(capacity:number,rowIndex){
if(this.priceQuote[rowIndex]['Consultant']!=''){
  var consultantWorkDays = this.consultants.filter(x=>x.UserName == this.priceQuote[rowIndex]['Consultant'] )[0].ConsultantWorkdays;
  this.priceQuote[rowIndex]['DaysPerWeek'] = (consultantWorkDays * capacity)/100;
  this.priceQuote[rowIndex]['RatePerWeek'] = this.priceQuote[rowIndex]['DaysPerWeek'] * this.priceQuote[rowIndex]['AppliedRate'];
}



if(this.priceQuote[rowIndex]['WorkingDays'] > 0){
  this.priceQuote[rowIndex]['Subtotal'] = Number(this.priceQuote[rowIndex]['WorkingDays']) * Number(this.priceQuote[rowIndex]['AppliedRate']);
  this.priceQuote[rowIndex]['DeliveryCost'] =Number(this.priceQuote[rowIndex]['WorkingDays']) * Number(this.priceQuote[rowIndex]['CostRate']);
  this.priceQuote[rowIndex]['TotalDiscount'] = Number(this.priceQuote[rowIndex]['WorkingDays']) * Number(this.priceQuote[rowIndex]['Discount']);
}

if(this.priceQuote[rowIndex]['Subtotal'] > 0){
  if(this.priceQuote[rowIndex]['Level']!= 'FY24 Director' || this.priceQuote[rowIndex]['Level']!= 'FY24 Principal'){
    this.priceQuote[rowIndex]['CostToSell'] = Number(this.priceQuote[rowIndex]['Subtotal']) * 0.125;
  }
  this.priceQuote[rowIndex]['GrossProfit'] = Number(this.priceQuote[rowIndex]['Subtotal']) - (Number(this.priceQuote[rowIndex]['DeliveryCost']) + Number(this.priceQuote[rowIndex]['CostToSell']));  
}


}

CalculateFteRatePerWeekActualWorkingDay(capacity:number,rowIndex){

  if(this.priceQuote[rowIndex]['Consultant']!=''){
    var consultantWorkDays = this.consultants.filter(x=>x.UserName == this.priceQuote[rowIndex]['Consultant'] )[0].ConsultantWorkdays;
    this.priceQuote[rowIndex]['DaysPerWeek'] = (consultantWorkDays * capacity)/100;
    this.priceQuote[rowIndex]['RatePerWeek'] = this.priceQuote[rowIndex]['DaysPerWeek'] * this.priceQuote[rowIndex]['AppliedRate'];
  }
  
  
  
  if(this.priceQuote[rowIndex]['ActualWorkingDays'] > 0){
  
    this.priceQuote[rowIndex]['Subtotal'] = Number(this.priceQuote[rowIndex]['ActualWorkingDays']) * Number(this.priceQuote[rowIndex]['AppliedRate']);
    this.priceQuote[rowIndex]['DeliveryCost'] =Number(this.priceQuote[rowIndex]['ActualWorkingDays']) * Number(this.priceQuote[rowIndex]['CostRate']);
    this.priceQuote[rowIndex]['TotalDiscount'] = Number(this.priceQuote[rowIndex]['ActualWorkingDays']) * Number(this.priceQuote[rowIndex]['Discount']);
  
  }
  
  if(this.priceQuote[rowIndex]['Subtotal'] > 0){
  
    if(this.priceQuote[rowIndex]['Level']!= 'Director' || this.priceQuote[rowIndex]['Level']!= 'Manager'){
      this.priceQuote[rowIndex]['CostToSell'] = (Number(this.priceQuote[rowIndex]['Subtotal']) * 0.1) * 1.1;
    }
  
    this.priceQuote[rowIndex]['GrossProfit'] = Number(this.priceQuote[rowIndex]['Subtotal']) - (Number(this.priceQuote[rowIndex]['DeliveryCost']) + Number(this.priceQuote[rowIndex]['CostToSell']));  
  
    
  }
  
  
  }

CalculateContractorRatePerWeek(capacity:number,rowIndex){

if(this.priceQuoteContractor[rowIndex]['Consultant']!=''){
  var consultantWorkDays = this.consultants.filter(x=>x.UserName == this.priceQuoteContractor[rowIndex]['Consultant'] )[0].ConsultantWorkdays;
  this.priceQuoteContractor[rowIndex]['DaysPerWeek'] = (consultantWorkDays * capacity)/100;
  if(this.priceQuoteContractor[rowIndex]['ContractType']==="Sole Trader" || this.priceQuoteContractor[rowIndex]['ContractType']==="Pty Ltd") 
  {
    this.priceQuoteContractor[rowIndex]['RatePerWeek'] = Number(this.priceQuoteContractor[rowIndex]['DaysPerWeek']) * Number(this.priceQuoteContractor[rowIndex]['ClientRate']);
  } 
}

if(this.priceQuoteContractor[rowIndex]['WorkingDays'] > 0){
  this.priceQuoteContractor[rowIndex]['Subtotal'] = Number(this.priceQuoteContractor[rowIndex]['WorkingDays'] )* Number(this.priceQuoteContractor[rowIndex]['ClientRate']);
  this.priceQuoteContractor[rowIndex]['DeliveryCost'] =Number(this.priceQuoteContractor[rowIndex]['WorkingDays']) * Number(this.priceQuoteContractor[rowIndex]['TotalCost']);
  this.priceQuoteContractor[rowIndex]['TotalDiscount'] = Number(this.priceQuoteContractor[rowIndex]['WorkingDays']) * Number(this.priceQuoteContractor[rowIndex]['Discount']);
}

if(this.priceQuoteContractor[rowIndex]['Subtotal'] > 0){

  if(this.priceQuoteContractor[rowIndex]['Level']!= 'Director' || this.priceQuoteContractor[rowIndex]['Level']!= 'Manager'){
    this.priceQuoteContractor[rowIndex]['CostToSell'] = (Number(this.priceQuoteContractor[rowIndex]['Subtotal']) * 0.1) * 1.1;
  }

  this.priceQuoteContractor[rowIndex]['GrossProfit'] = Number(this.priceQuoteContractor[rowIndex]['Subtotal']) - (Number(this.priceQuoteContractor[rowIndex]['DeliveryCost']) + Number(this.priceQuoteContractor[rowIndex]['CostToSell']));  

}


}

CalculateContractorPerWeekActualWorkingDay(capacity:number,rowIndex){
  if(this.priceQuoteContractor[rowIndex]['Consultant']!=''){
    var consultantWorkDays = this.consultants.filter(x=>x.UserName == this.priceQuoteContractor[rowIndex]['Consultant'] )[0].ConsultantWorkdays;
    this.priceQuoteContractor[rowIndex]['DaysPerWeek'] = (consultantWorkDays * capacity)/100;
    if(this.priceQuoteContractor[rowIndex]['ContractType']==="Sole Trader" || this.priceQuoteContractor[rowIndex]['ContractType']==="Pty Ltd") 
    {
      this.priceQuoteContractor[rowIndex]['RatePerWeek'] = (+this.priceQuoteContractor[rowIndex]['DaysPerWeek'] * this.priceQuoteContractor[rowIndex]['ClientRate']);
    } 
  }
  
  if(this.priceQuoteContractor[rowIndex]['ActualWorkingDays'] > 0){
    this.priceQuoteContractor[rowIndex]['Subtotal'] = (+this.priceQuoteContractor[rowIndex]['ActualWorkingDays'] * this.priceQuoteContractor[rowIndex]['ClientRate']);
    this.priceQuoteContractor[rowIndex]['DeliveryCost'] =Number(this.priceQuoteContractor[rowIndex]['ActualWorkingDays']) * Number(this.priceQuoteContractor[rowIndex]['TotalCost']);
    this.priceQuoteContractor[rowIndex]['TotalDiscount'] = Number(this.priceQuoteContractor[rowIndex]['ActualWorkingDays']) * Number(this.priceQuoteContractor[rowIndex]['Discount']);
  }
  
  if(this.priceQuoteContractor[rowIndex]['Subtotal'] > 0){
  
    if(this.priceQuoteContractor[rowIndex]['Level']!= 'Director' || this.priceQuoteContractor[rowIndex]['Level']!= 'Manager'){
      this.priceQuoteContractor[rowIndex]['CostToSell'] = (Number(this.priceQuoteContractor[rowIndex]['Subtotal']) * 0.1) * 1.1;
    }
  
    this.priceQuoteContractor[rowIndex]['GrossProfit'] = Number(this.priceQuoteContractor[rowIndex]['Subtotal']) - (Number(this.priceQuoteContractor[rowIndex]['DeliveryCost']) + Number(this.priceQuoteContractor[rowIndex]['CostToSell']));  
  
  }
  

}


calculateTotalCost(event,cell, rowIndex){
  this.priceQuote[rowIndex]['LevantCost'] = event.target.value;
  if(this.priceQuote[rowIndex]['ContractType']=='Sole Trader'){
  this.priceQuote[rowIndex]['TotalCost'] = +(event.target.value * 0.0832) + (+event.target.value)
  } else{
    this.priceQuote[rowIndex]['TotalCost']  = event.target.value
  }
  
  console.log(this.priceQuote[0]);
}

CalculateFteWorkingDays(rowIndex){
  if(this.priceQuote[rowIndex]['StartDate']!=undefined && this.priceQuote[rowIndex]['EndDate']!=undefined){
    var startDate = this.priceQuote[rowIndex]['StartDate'];
    var endDate = this.priceQuote[rowIndex]['EndDate'];
    var numOfDates =this.getBusinessDatesCount(startDate,endDate);
    // if(this.priceQuote[rowIndex]['Capacity']>=5){
    //   this.priceQuote[rowIndex]['WorkingDays'] = (numOfDates * Number(this.priceQuote[rowIndex]['Capacity']))/100;
    // }else{
      this.priceQuote[rowIndex]['WorkingDays'] = numOfDates;
      // if(this.priceQuote[rowIndex]['WorkingDays']!=this.priceQuote[rowIndex]['ActualWorkingDays']){
      // this.priceQuote[rowIndex]['ActualWorkingDays'] = this.priceQuote[rowIndex]['WorkingDays'];
      // }
   // }
  
  }  
}




CalculateContractorWorkingDays(rowIndex){

  if(this.priceQuoteContractor[rowIndex]['StartDate']!=undefined && this.priceQuoteContractor[rowIndex]['EndDate']!=undefined){
    var startDate = this.priceQuoteContractor[rowIndex]['StartDate'];
    var endDate = this.priceQuoteContractor[rowIndex]['EndDate'];
    var numOfDates =this.getBusinessDatesCount(startDate,endDate);
    if(this.priceQuoteContractor[rowIndex]['Capacity']>=10){
      this.priceQuoteContractor[rowIndex]['WorkingDays'] = (numOfDates * Number(this.priceQuoteContractor[rowIndex]['Capacity']))/100;
    }else{
      this.priceQuoteContractor[rowIndex]['WorkingDays'] = numOfDates;
    }
  }  
}

getBusinessDatesCount(startDate, endDate) {
  //startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  //endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  let days = 0;
  const curDate = startDate;
  while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      if (!((dayOfWeek === 6) || (dayOfWeek === 0))) {
        days++;
      }
      curDate.setDate(curDate.getDate() + 1);
  }
  return days;
  }

ApplyContractType(event,cell, rowIndex){
  this.priceQuote[rowIndex]['ContractType'] = event.target.value;
  if(this.priceQuote[rowIndex]['LevantCost']>0){
    if(event.target.value =='Sole Trader' ){
      this.priceQuote[rowIndex]['TotalCost'] = (Number(this.priceQuote[rowIndex]['LevantCost']) * 0.053) + (Number(this.priceQuote[rowIndex]['LevantCost']) * 0.003) + (Number(this.priceQuote[rowIndex]['LevantCost']));
    } else{
      this.priceQuote[rowIndex]['TotalCost'] = +(this.priceQuote[rowIndex]['LevantCost']);
    }
  }

 

  if(this.priceQuote[rowIndex]['TotalCost'] > 0 && this.priceQuote[rowIndex]['ClientRate'] > 0){
    this.priceQuote[rowIndex]['ContractPercent'] = (this.priceQuote[rowIndex]['ClientRate'] - (+this.priceQuote[rowIndex]['TotalCost'] * 1.1))*100/ this.priceQuote[rowIndex]['ClientRate'];
  }
  console.log(this.priceQuote[0]);
}


FetchContractorRates(contractType:string,cell, rowIndex){
  if(this.priceQuoteContractor[rowIndex]['LevantCost']>0){
    if(contractType =='Sole Trader' ){
      this.priceQuoteContractor[rowIndex]['TotalCost'] = (Number(this.priceQuoteContractor[rowIndex]['LevantCost']) * 0.053) + (Number(this.priceQuoteContractor[rowIndex]['LevantCost']) * 0.003) + (Number(this.priceQuoteContractor[rowIndex]['LevantCost']));
    } else{
      this.priceQuoteContractor[rowIndex]['TotalCost'] = Number(this.priceQuoteContractor[rowIndex]['LevantCost']);
    }
  }

}

  addNewRow(){
    this.priceQuote.push(this.newAttribute);
    this.priceQuote = [...this.priceQuote];
    this.newAttribute = {};

}

addNewRowContractor(){
  this.priceQuoteContractor.push(this.newAttribute);
    this.priceQuoteContractor = [...this.priceQuoteContractor];
    this.newAttribute = {};
}

addNewExpenseRow(){
  this.expenseQuote.push(this.newExpenseAttribute);
  this.expenseQuote = [...this.expenseQuote];
  this.newExpenseAttribute = {
    ExpenseType :'',
    Description:'',
    Number:0,
    UnitCost:0,
    Billable:0,
    LevantCost:0,
    ClientCost:0,
    Subtotal:0
  };

}

deleteRowContractor(index:number){
  this.priceQuoteContractor.splice(index,1);
  this.priceQuoteContractor = [...this.priceQuoteContractor];
  this.calculateTotalRevenue();
  this.calculateTotalCostRevenue();
  this.calculateTotalExpense();
  this.calculateTotalProfitability();
}

deleteRow(index:number){
  this.priceQuote.splice(index,1);
  this.priceQuote = [...this.priceQuote];
  this.calculateTotalRevenue();
  this.calculateTotalCostRevenue();
  this.calculateTotalExpense();
  this.calculateTotalProfitability();
}



deleteExpenseRow(index:number){
this.expenseQuote.splice(index,1);
this.expenseQuote = [...this.expenseQuote];
this.calculateTotalExpense();
}

UpdateActualValue(event, cell, rowIndex){
  this.priceQuote[rowIndex]['ActualWorkingDays'] = this.priceQuote[rowIndex]['WorkingDays'];
}

updateAssetsValue(event, cell, rowIndex) {
  console.log('inline editing rowIndex', rowIndex);
  this.editing[rowIndex + '-' + cell] = false;
  this.priceQuote[rowIndex][cell] = event.target.value;

  //Level Logic // -- Rack Rate- Cost Rate & Discount Calculation
  
  if(this.priceQuote[rowIndex]['Level']!=""){
    this.CalculateFteRates(this.priceQuote[rowIndex]['Level'],rowIndex);
  }
  
  //Start Date logic -- Working Days Calculation

  if(this.priceQuote[rowIndex]['StartDate']!="" && this.priceQuote[rowIndex]['EndDate']!=""){
    this.CalculateFteWorkingDays(rowIndex);
  }

  //DaysPerWeek & RatePerWeek Calculation
  //Subtotal,Delivery Cost & Total Discout Calculation
  //Cost to Sell & Gross Profit Calculation
  if(cell == 'EndDate'){
    this.CalculateFteRatePerWeek(100,rowIndex);
    this.priceQuote[rowIndex]['ActualWorkingDays'] = this.priceQuote[rowIndex]['WorkingDays'];
  }
  //DaysPerWeek & RatePerWeek Calculation based on ActualWorkingDays Calculation
  else{
    this.CalculateFteRatePerWeekActualWorkingDay(100,rowIndex);
  }

  //TotalRevenue & Fees With Subtotal Calculation
  this.calculateTotalRevenue();
  //TotalCost Calculation
  this.calculateTotalCostRevenue();
  //TotalFeesExpense Calculation
  this.calculateTotalExpense();
  //TotalProfitPercent Calculation
  this.calculateTotalProfitability();


  this.priceQuote = [...this.priceQuote];
  console.log(this.priceQuote);
}

updateContractorValue(event, cell, rowIndex) {
  console.log('inline editing rowIndex', rowIndex);
  this.editing[rowIndex + '-' + cell] = false;
  this.priceQuoteContractor[rowIndex][cell] = event.target.value;
 

   //Level Logic // -- Rack Rate- Cost Rate & Discount Calculation
  if(this.priceQuoteContractor[rowIndex]['Level']!=""){
    this.CalculateContractorRates(this.priceQuoteContractor[rowIndex]['Level'],rowIndex);
  }

  if(this.priceQuoteContractor[rowIndex]['ContractType']!=""){
    this.FetchContractorRates(this.priceQuoteContractor[rowIndex]['ContractType'],cell,rowIndex);
  }

  if(this.priceQuoteContractor[rowIndex]['ClientRate']>0 && this.priceQuoteContractor[rowIndex]['TotalCost']>0 ){
    this.priceQuoteContractor[rowIndex]['ClientRate'] = Number(this.priceQuoteContractor[rowIndex]['ClientRate']);
    this.priceQuoteContractor[rowIndex]['TotalCost'] = Number(this.priceQuoteContractor[rowIndex]['TotalCost']);
    //console.log(clientRate);
  
  }

  if(this.priceQuoteContractor[rowIndex]['StartDate']!="" && this.priceQuoteContractor[rowIndex]['EndDate']!=""){
    this.CalculateContractorWorkingDays(rowIndex);
  }


   //DaysPerWeek & RatePerWeek Calculation
  //Subtotal,Delivery Cost & Total Discout Calculation
  //Cost to Sell & Gross Profit Calculation
  if(cell == 'EndDate'){
    this.CalculateContractorRatePerWeek(100,rowIndex);
    this.priceQuoteContractor[rowIndex]['ActualWorkingDays'] = this.priceQuoteContractor[rowIndex]['WorkingDays'];
  }
  else{
    this.CalculateContractorPerWeekActualWorkingDay(100,rowIndex);
  }

  if(this.priceQuoteContractor[rowIndex]['TotalCost'] > 0 && this.priceQuoteContractor[rowIndex]['ClientRate'] > 0){
    var val1 = Number(this.priceQuoteContractor[rowIndex]['TotalCost']) * 1.1;
    var val2 = Number(this.priceQuoteContractor[rowIndex]['ClientRate']) - val1;
    var val3 = val2 / Number(this.priceQuoteContractor[rowIndex]['ClientRate']);
    this.priceQuoteContractor[rowIndex]['ContractPercent'] = val3 * 100;
  }

  this.calculateTotalRevenue();
  this.calculateTotalCostRevenue();
  this.calculateTotalExpense();
  this.calculateTotalProfitability();



  this.priceQuoteContractor = [...this.priceQuoteContractor];
  console.log(this.priceQuoteContractor);
}

validateFields(projectDetails : ProjectDetails){
  
  if(this.projectDetails.ProjectName == ''){
    this.validationFailedMessages.push("Project Name can't be empty");
  }
  if(this.projectDetails.ClientName == ''){
    this.validationFailedMessages.push("Client Name can't be empty");
  }
  if(this.projectDetails.Location == ''){
    this.validationFailedMessages.push("Location can't be empty");
  }
  if(this.projectDetails.Stage == ''){
    this.validationFailedMessages.push("Stage can't be empty");
  }
  if(this.projectDetails.StartDate == ''){
    this.validationFailedMessages.push("Start date can't be empty");
  }
  if(this.projectDetails.EndDate == ''){
    this.validationFailedMessages.push("End date can't be empty");
  }
  if(this.projectDetails.EngagementLead == ''){
    this.validationFailedMessages.push("Engagement Lead can't be empty");
  }
  if(this.projectDetails.SelectedServiceTypes.length < 1){
    this.validationFailedMessages.push("Service type  can't be empty");
  }
  if(this.projectDetails.SalesLead == ''){
    this.validationFailedMessages.push("Sales Lead can't be empty");
  }
}

hasDuplicateResource(resources: PriceQuote[]): boolean {
  const fieldSet = new Set<string>(); // Create a Set to store unique field values

  for (const res of resources) {
    const consultant = res.Consultant; // Specify the field you want to check for duplicates

    if (fieldSet.has(consultant)) {
      return true; // Duplicate field found
    }

    fieldSet.add(consultant);
  }

  return false; // No duplicate fields found
}









updateExpense(event, cell, rowIndex) {
  console.log('inline editing rowIndex', rowIndex);
  this.editing[rowIndex + '-' + cell] = false;
  this.expenseQuote[rowIndex][cell] = event.target.value;
  this.expenseQuote = [...this.expenseQuote];

  if(this.expenseQuote[rowIndex]["UnitCost"]>=0 && this.expenseQuote[rowIndex]["Number"]>=0 && this.expenseQuote[rowIndex]["Billable"]>=0){
    this.expenseQuote[rowIndex]["ClientCost"] = (Number(this.expenseQuote[rowIndex]["UnitCost"]) * Number(this.expenseQuote[rowIndex]["Number"]) * Number(this.expenseQuote[rowIndex]["Billable"]))/100
    this.expenseQuote[rowIndex]["LevantCost"] = (Number(this.expenseQuote[rowIndex]["UnitCost"]) * Number(this.expenseQuote[rowIndex]["Number"])) - (Number(this.expenseQuote[rowIndex]["UnitCost"]) * Number(this.expenseQuote[rowIndex]["Number"]) * Number(this.expenseQuote[rowIndex]["Billable"])/100);
    this.expenseQuote[rowIndex]["Subtotal"] = ((Number(this.expenseQuote[rowIndex]["UnitCost"]) * Number(this.expenseQuote[rowIndex]["Number"])) - this.expenseQuote[rowIndex]["ClientCost"]) + this.expenseQuote[rowIndex]["ClientCost"];
  }

  this.calculateTotalExpense();

  console.log(this.expenseQuote[0]);
}

}
