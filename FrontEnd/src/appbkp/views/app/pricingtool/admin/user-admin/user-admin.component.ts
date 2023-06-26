import { Component, OnInit } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { IProduct } from 'src/app/data/api.service';
import { ExpenseTypesResponse, PriceQuote, ProjectPricingService, RatesResponse, ServiceTypesResponse, UsersResponse } from '../../projectpricing.service';

@Component({
  selector: 'app-user-admin',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.scss']
})
export class UserAdminComponent implements OnInit {
  displayMode = 'list';
  selectAllState = '';
  orderBy = '';
  data: IProduct[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  search = '';
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  selected = [];
  ratesList : RatesResponse[];
  serviceTypesList:ServiceTypesResponse[] = [{
    ServiceType:'',
    ServiceDescription:''
  }];

  expenseTypesList:ExpenseTypesResponse[] = [{
    ExpenseType :'',
    ExpenseDescription :''
  }];

  usersList:UsersResponse[] = [{
    UserId:0,
  UserName:'',
  UserEmail:'',
  UserRegDate:'',
  Level:'',
  Location:'',
  RackRate:0,
  CostRate:0,
  IsActivated:'false',
  IsAdmin:'false',
  ToDelete:'false',
  FromAdmin:''
  }];
  editing = {};
  rows = [];

  newAttribute:any ={};

  public adminType : any [] = [
    { code: "True", name: "True" },
    { code: "False", name: "False" }
  ];

  usersColumns = [     
    { prop: 'UserId', name: 'UserId' },  
    { prop: 'UserName', name: 'UserName' },
    { prop: 'UserEmail', name: 'UserEmail' },
    { prop: 'UserRegDate', name: 'UserRegDate' },
    { prop: 'Level', name: 'Level' },
    { prop: 'IsAdmin', name: 'IsAdmin' },
    { prop: 'IsActivated', name: 'IsActivated' },
    { prop: 'Location', name: 'Location' },
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

    this.projectPricingService.fetchUsers().subscribe(
      userDetails=>{
        this.usersList =userDetails;

      }
    )

    this.projectPricingService.getRates().subscribe(
      result=>{
        this.ratesList = result["Item1"];
      }
    )

  }

  ngOnInit(): void {
  }

  CalculateFteRates(level:string,rowIndex){
    this.usersList[rowIndex]['RackRate'] = this.ratesList.filter(x=>x.Level==level)[0].RackRate;
    this.usersList[rowIndex]['CostRate'] = this.ratesList.filter(x=>x.Level==level)[0].CostRate;
    
  }

  
  
  updateUser(event, cell, rowIndex){

    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.usersList[rowIndex][cell] = event.target.value;

    //Level Logic
  if(this.usersList[rowIndex]['Level']!=""){
    this.CalculateFteRates(this.usersList[rowIndex]['Level'],rowIndex);
  }


  }

  


deleteRateRow(index:number){
  this.usersList.splice(index,1);
  this.usersList = [...this.usersList];
  }

  
  updateUserDetails(index:number){
    this.SpinnerService.show();
    console.log(this.usersList);
    // this.projectPricingService.saveRate(this.rateManagement).subscribe(
    //   result=>{
      
    //     this.SpinnerService.hide();
    //     if(result == "Saved")
    //     {
    //       //this.OnSuccess('Project Details successfully saved');
    //     }
    //   }
    // ); 
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

  isSelected(p: IProduct) {
    return this.selected.findIndex(x => x.id === p.id) > -1;
  }

  onSelect(item: IProduct) {
    if (this.isSelected(item)) {
      this.selected = this.selected.filter(x => x.id !== item.id);
    } else {
      this.selected.push(item);
    }
    this.setSelectAllState();
  }

  setSelectAllState() {
    if (this.selected.length === this.data.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event) {
    if ($event.target.checked) {
      this.selected = [...this.data];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  pageChanged(event: any): void {
    this.loadData(this.itemsPerPage, event.page, this.search, this.orderBy);
  }

  itemsPerPageChange(perPage: number) {
    this.loadData(perPage, 1, this.search, this.orderBy);
  }

  changeOrderBy(item: any) {
    this.loadData(this.itemsPerPage, 1, this.search, item.value);
  }

  loadData(pageSize: number = 10, currentPage: number = 1, search: string = '', orderBy: string = '') {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.search = search;
    //this.orderBy = orderBy;

    this.SpinnerService.show();
    this.projectPricingService.getProjects("CreatedDate",search).subscribe(
      result=>{
        //this.projectsList = result;
        //this.temp = [...this.projectsList];
        this.SpinnerService.hide();
      }
    );  
  }

  saveUserDetails(index:number){
    this.SpinnerService.show();
    this.usersList[index].FromAdmin = 'true';
    this.projectPricingService.saveUserDetails(this.usersList[index]).subscribe(
      result=>{
      
        this.SpinnerService.hide();
        this.usersList = result['userDetails'];
      }
    ); 
  }

  deleteUserDetails(index:number){
    this.usersList[index].ToDelete = "true";
    this.SpinnerService.show();
    this.projectPricingService.saveUserDetails(this.usersList[index]).subscribe(
      result=>{
        this.SpinnerService.hide();
        this.usersList = result;
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
