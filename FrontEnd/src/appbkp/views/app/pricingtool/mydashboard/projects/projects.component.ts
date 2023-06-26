import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConsultantResponse, LeavesDetail, ProjectPricingService,ProjectsListResponse, RatesResponse, UsersResponse } from '../../projectpricing.service';
import { ActivatedRoute, Router, RouterModule,Routes} from '@angular/router'
import { AddNewProductModalComponent } from 'src/app/containers/pages/add-new-product-modal/add-new-product-modal.component';
import { IProduct } from 'src/app/data/api.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})

export class ProjectsComponent implements OnInit {
  @Input() showOrderBy = true;
  @Input() showSearch = true;
  @Input() showItemsPerPage = true;
  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewProductModalComponent;
  consultantWorkList : ConsultantResponse[];
  ratesList : RatesResponse[];
  displayMode = 'list';
  selectAllState = '';
  showAddNewButton = false;
  data: IProduct[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  search = '';
  orderBy = '';
  isLoading: boolean;
  endOfTheList = false;
  totalItem = 0;
  newAttribute:any ={};
  totalPage = 0;
  projectId = "/app/newprojectpricing?projectId=34545";

  columns = [
    { prop: 'ClientName', name: 'ClientName' },
    { prop: 'ProjectName', name: 'ProjectName' },
    { prop: 'ProjectURL', name: 'ProjectURL' },
    { prop: 'Status', name: 'Status' },
    { prop: 'ServiceOffering', name: 'ServiceOffering' },
    { prop: 'LevantLead', name: 'LevantLead' },
    { prop: 'TotalRevenue', name: 'TotalRevenue' },
    { prop: 'ProjectStartDate', name: 'ProjectStartDate' },
    { prop: 'ProjectEndDate', name: 'ProjectEndDate' },
    { prop: 'CreatedDate', name: 'CreatedDate'},
    { prop: 'Capacity', name: 'Capacity'},

  ];
  ColumnMode = ColumnMode;

  leavesColumns = [     
    { prop: 'LeaveType', name: 'LeaveType' },  
    { prop: 'StartDate', name: 'StartDate' },
    { prop: 'EndDate', name: 'EndDate' },
    { prop: 'Reason', name: 'Reason' },
    { prop: 'Duration', name: 'Duration' },
    { prop: 'SupportingDocument', name: 'SupportingDocument' }
  ];

  leavesList:LeavesDetail[] = [{
    UserId : 0,
    LeaveType : '',
    StartDate :'',
    EndDate :'',
    Reason :'',
    Duration :0,
    SupportingDocument:''
  }];

  public leaveType: any [] = [
    { code: "Sick", LeaveType: "Sick" },
    { code: "Planned", LeaveType: "Planned" },
    { code: "Maternity", LeaveType: "Maternity" },
    { code: "Paternity", LeaveType: "Paternity" },
    { code: "Relocation", LeaveType: "Relocation" }
  ];

  temp;
  itemOptionsPerPage = [5, 10, 20];
  selected = [];
  SelectionType = SelectionType;
  bookmarkValue = '';

  constructor(private projectPricingService: ProjectPricingService,private SpinnerService: NgxSpinnerService,
    private _router:Router,private route: ActivatedRoute) { 
      

    }

  ngOnInit(): void {
    this.SpinnerService.show();
    
    this.projectPricingService.getUserWork().subscribe(
      result=>{
        this.consultantWorkList = result['Item1'];
        this.temp = [...this.consultantWorkList];
        this.leavesList = result["Item2"];
        this.SpinnerService.hide();
        
      }
    );  

    this.loadData(this.itemsPerPage, this.currentPage, this.search, this.orderBy);
    
  }

  AddNewPricingProject():void{
    this._router.navigate(['\newprojectpricing']);
  }

  loadData(pageSize: number = 10, currentPage: number = 1, search: string = '', orderBy: string = '') {
    this.itemsPerPage = pageSize;
    this.currentPage = currentPage;
    this.search = search;
    this.orderBy = orderBy;

    this.SpinnerService.show();
    this.projectPricingService.getUserWork().subscribe(
      result=>{
        this.consultantWorkList = result['Item1'];
        this.temp = [...this.consultantWorkList];
        this.SpinnerService.hide();
      }
    );  
  }

  changeDisplayMode(mode) {
    this.displayMode = mode;
  }

  showAddNewModal() {
    this._router.navigate(['/app/newprojectpricing'], { relativeTo: this.route });
    //this.addNewModalRef.show();
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

  searchKeyUp(event) {
    const val = event.target.value.toLowerCase().trim();
    this.loadData(this.itemsPerPage, 1, val, this.orderBy);
  }

  onContextMenuClick(action: string, item: IProduct) {
    console.log('onContextMenuClick -> action :  ', action, ', item.title :', item.title);
  }

  addRow(){
    this.leavesList.push(this.newAttribute);
    this.leavesList = [...this.leavesList];
    this.newAttribute = {};
  }

deleteRow(index:number){
  this.leavesList.splice(index,1);
  this.leavesList = [...this.leavesList];
}

manageLeaves(){
  this.SpinnerService.show();
    console.log(this.leavesList);
    this.projectPricingService.manageLeaves(this.leavesList).subscribe(
      result=>{     
        this.SpinnerService.hide();
        if(result == "Saved")
        {
          //this.OnSuccess('Project Details successfully saved');
        }
      }
    ); 
}

  updateUser(event, cell, rowIndex){
    this.leavesList[rowIndex][cell] = event.target.value;

     //Start Date logic
  if(this.leavesList[rowIndex]['StartDate']!="" && this.leavesList[rowIndex]['EndDate']!=""){
    this.CalculateWorkingDays(rowIndex);
  }
    console.log(this.leavesList);
  }

  CalculateWorkingDays(rowIndex){
    if(this.leavesList[rowIndex]['StartDate']!=undefined && this.leavesList[rowIndex]['EndDate']!=undefined){
      var startDate = this.leavesList[rowIndex]['StartDate'];
      var endDate = this.leavesList[rowIndex]['EndDate'];
      var numOfDates =this.getBusinessDatesCount(startDate,endDate);
      this.leavesList[rowIndex]['Duration'] = numOfDates;

    
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
  



}
