import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DashboardService, StockListResponse } from '../dashboard.service';
import { Subject } from 'rxjs/Subject';
import { createChart } from 'lightweight-charts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-newswatchlist',
  templateUrl: './newswatchlist.component.html',
  styleUrls:['./newswatchlist.component.css']
})
export class NewsWatchlistComponent  {

    @Input() title:string;
    subscription:Subscription;
    stockResult : StockListResponse[];

    constructor(private dashboardService: DashboardService){
    this.subscription = this.dashboardService.getMultipleStockResult()
    .subscribe(result=>{
        this.stockResult = result["Item1"];
    
    })
}
    

}