import { Component, OnInit, ViewChild } from '@angular/core';
import productItems from 'src/app/data/products';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';
import { BookmarkStock, DashboardService, StockListResponse } from '../dashboards/dashboard.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html'
})

export class DashboardComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  stocksList : StockListResponse[];
  bookmarkStock : BookmarkStock = {UserId:'',ISIN:''};

  columns = [
    { prop: 'StockName', name: 'StockName' },
    { prop: 'ISIN', name: 'ISIN' },
    { prop: 'StockScore', name: 'StockScore' },
    { prop: 'price', name: 'price' },
    { prop: 'changeday', name: 'changeday' },
    { prop: 'Industry', name: 'Industry' },
    { prop: 'MarketCapRounded', name: 'MarketCapRounded' },
    { prop: 'Country', name: 'Country' },
    { prop: 'Action', name: 'Action' },
    { prop: 'Action', name: 'Action' },
    { prop: 'isBookmarked', name: 'isBookmarked' },
    { prop: 'Add to Watchlist', name: 'ID' }
  ];
  ColumnMode = ColumnMode;
  itemsPerPage = 10;
  temp;
  itemOptionsPerPage = [5, 10, 20];
  selected = [];
  bookmarkselected = [];
  SelectionType = SelectionType;
  selectAllState = '';
  bookmarkValue = '';

  constructor(private dashboardService: DashboardService,private SpinnerService: NgxSpinnerService, private router: Router,
     private translate: TranslateService) { }

  ngOnInit() {
    this.SpinnerService.show();
    this.dashboardService.getStocks().subscribe(
      result=>{
        this.stocksList = result;
        this.temp = [...this.stocksList];
        this.SpinnerService.hide();
      }
    );   
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase().trim();
    const count = this.columns.length;
    const keys = Object.keys(this.temp[0]);
    const temp = this.temp.filter(item => {
      for (let i = 0; i < count; i++) {
        if ((item[keys[i]] && item[keys[i]].toString().toLowerCase().indexOf(val) !== -1) || !val) {
          return true;
        }
      }
    });
    this.stocksList = temp;
    this.table.offset = 0;
  }

  
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    // this.selected[this.selected.length-1];
    // console.log(this.selected[this.selected.length-1]["ISIN"]);
    // this.bookmarkStock.ISIN = this.selected[this.selected.length-1]["ISIN"];
    // this.bookmarkStock.UserId = localStorage.getItem("UserId");
    // this.dashboardService.saveBookmark(this.bookmarkStock).subscribe(
    //   result=>{
    //    console.log(result);
    //     });
    // this.setSelectAllState();
    // this.bookmarkselected.push(selected);
  
    //this.notifications.create(this.translate.instant('alert.success'), this.translate.instant('alert.notification-content'), NotificationType.Success, { timeOut: 3000, showProgressBar: true });
  }

  setSelectAllState() {
    if (this.selected.length === this.stocksList.length) {
      this.selectAllState = 'checked';
    } else if (this.selected.length !== 0) {
      this.selectAllState = 'indeterminate';
    } else {
      this.selectAllState = '';
    }
  }

  selectAllChange($event) {
    if ($event.target.checked) {
      this.selected = [...this.stocksList];
    } else {
      this.selected = [];
    }
    this.setSelectAllState();
  }

  onItemsPerPageChange(itemCount) {
    this.itemsPerPage = itemCount;
}

  openSingleStock(stockName : string) {
    this.router.navigate(['\stockanalysis'])
  }

  onDarkModeChange(event) {
    
    }

    saveToBookmark(ID:number){

      this.bookmarkStock.UserId = localStorage.getItem("UserId");
      this.bookmarkStock.ISIN =  this.stocksList.find(x=>x["ID"]==ID).ISIN;
      this.dashboardService.saveBookmark(this.bookmarkStock).subscribe(
      result=>{
       console.log(result);
        });
    }

    callCheck(ID:number){
     this.bookmarkValue =  this.stocksList.find(x=>x["ID"]==ID).isBookmarked;
     if(this.bookmarkValue == "1"){
      return true;
     }
     else 
     {
       return false;
     }
    }

}
