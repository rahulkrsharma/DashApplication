import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DashboardService, StockListResponse } from '../dashboard.service';
import { Subject } from 'rxjs/Subject';
import { createChart } from 'lightweight-charts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls:['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit,AfterViewInit {

    watchListData:StockListResponse[];
    subscription:Subscription;
    columns = [
        { prop: 'StockName', name: 'StockName' },
        { prop: 'ISIN', name: 'ISIN' },
        { prop: 'StockScore', name: 'StockScore' },
        { prop: 'price', name: 'price' },
        { prop: 'changeday', name: 'changeday' },
        { prop: 'Industry', name: 'Industry' },
        { prop: 'MarketCapRounded', name: 'MarketCapRounded' },
        { prop: 'Country', name: 'Country' },
        { prop: 'Action', name: 'Action' }
      ];
      ColumnMode = ColumnMode;
      itemsPerPage = 10;
      temp;
      itemOptionsPerPage = [5, 10, 20];
      selected = [];
      SelectionType = SelectionType;
      selectAllState = '';

    @Input() watchlists : StockListResponse[];


    ngOnInit() {

    }

    constructor(private readonly dashboardService:DashboardService,
      private SpinnerService: NgxSpinnerService){
        this.SpinnerService.show();
        this.subscription = this.dashboardService.getMultipleStockResult()
    .subscribe(result=>{
        this.watchListData = result["Item1"];
        this.SpinnerService.hide();
    })
    }
    ngAfterViewInit(): void {
       
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
        this.watchListData = temp;
        
      }
    
      onSelect({ selected }) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        this.setSelectAllState();
      }
    
      setSelectAllState() {
        if (this.selected.length === this.watchListData.length) {
          this.selectAllState = 'checked';
        } else if (this.selected.length !== 0) {
          this.selectAllState = 'indeterminate';
        } else {
          this.selectAllState = '';
        }
      }
    
      selectAllChange($event) {
        if ($event.target.checked) {
          this.selected = [...this.watchListData];
        } else {
          this.selected = [];
        }
        this.setSelectAllState();
      }
    
      onItemsPerPageChange(itemCount) {
        this.itemsPerPage = itemCount;
      }
    

}