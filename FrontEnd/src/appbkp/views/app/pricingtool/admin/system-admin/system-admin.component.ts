import { Component, OnInit } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExpenseTypesResponse, PriceQuote, ProjectPricingService, RatesResponse, ServiceTypesResponse } from '../../projectpricing.service';

@Component({
  selector: 'app-system-admin',
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.scss']
})
export class SystemAdminComponent implements OnInit {
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  itemsPerPage = 10;
  selected = [];
  serviceTypesList:ServiceTypesResponse[] = [{
    ServiceType:'',
    ServiceDescription:''
  }];

  expenseTypesList:ExpenseTypesResponse[] = [{
    ExpenseType :'',
    ExpenseDescription :''
  }];

  rateManagement:RatesResponse[] = [{
    LevelId :'',
    Level :'',
    RackRate:0,
    CostRate:0
  }];
  editing = {};
  rows = [];
  data = [];
  newAttribute:any ={};

  ratesColumns = [       
    { prop: 'LevelId', name: 'LevelId' },
    { prop: 'Level', name: 'Level' },
    { prop: 'RackRate', name: 'RackRate' },
    { prop: 'CostRate', name: 'CostRate' }  
  ];

  expenseColumns = [       
    { prop: 'ExpenseType', name: 'LevelIExpenseTyped' }
  ];

  serviceTypeColumns = [       
    { prop: 'ServiceType', name: 'ServiceType' }
  ];


  constructor(private projectPricingService: ProjectPricingService,private SpinnerService: NgxSpinnerService) { 

    this.projectPricingService.getRates().subscribe(
      result=>{
        this.rateManagement = result["Item1"];
        this.expenseTypesList = result["Item3"];
        this.serviceTypesList = result["Item4"];

      }
    )

  }

  ngOnInit(): void {
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    //this.setSelectAllState();
  }
  
  updateRate(event, cell, rowIndex){

    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rateManagement[rowIndex][cell] = event.target.value;

  }

  addRateRow(){
    this.rateManagement.push(this.newAttribute);
    this.rateManagement = [...this.rateManagement];
    this.newAttribute = {};
}


deleteRateRow(index:number){
  this.rateManagement.splice(index,1);
  this.rateManagement = [...this.rateManagement];
  }

  addExpenseRow(){
    this.expenseTypesList.push(this.newAttribute);
    this.expenseTypesList = [...this.expenseTypesList];
    this.newAttribute = {};
}


deleteExpenseRow(index:number){
  this.expenseTypesList.splice(index,1);
  this.expenseTypesList = [...this.expenseTypesList];
  }

  addServiceRow(){
    this.serviceTypesList.push(this.newAttribute);
    this.serviceTypesList = [...this.serviceTypesList];
    this.newAttribute = {};
}


deleteServiceRow(index:number){
  this.serviceTypesList.splice(index,1);
  this.serviceTypesList = [...this.serviceTypesList];
  }

  saveRate(){
    this.SpinnerService.show();
    console.log(this.rateManagement);
    this.projectPricingService.saveRate(this.rateManagement).subscribe(
      result=>{
      
        this.SpinnerService.hide();
        if(result == "Saved")
        {
          //this.OnSuccess('Project Details successfully saved');
        }
      }
    ); 
  }

  saveExpenseTypes(){
    this.SpinnerService.show();
    console.log(this.expenseTypesList);
    this.projectPricingService.saveExpenseTypes(this.expenseTypesList).subscribe(
      result=>{
      
        this.SpinnerService.hide();
        if(result == "Saved")
        {
          //this.OnSuccess('Project Details successfully saved');
        }
      }
    ); 
  }

  saveServiceTypes(){
    this.SpinnerService.show();
    console.log(this.serviceTypesList);
    this.projectPricingService.saveServiceTypes(this.serviceTypesList).subscribe(
      result=>{
      
        this.SpinnerService.hide();
        if(result == "Saved")
        {
          //this.OnSuccess('Project Details successfully saved');
        }
      }
    ); 
  }

  
}
