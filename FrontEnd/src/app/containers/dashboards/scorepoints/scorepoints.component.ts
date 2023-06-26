import { Component, Input, OnInit } from '@angular/core';
import { DashboardService, StockListResponse } from '../../../views/app/dashboards/dashboard.service';
import cakes, { ICake } from '../../../data/cakes';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-scorepoints',
  templateUrl: './scorepoints.component.html'
})
export class ScorePointsComponent implements OnInit {

  data: ICake[] = cakes;
  @Input() companyKpi:Subject<StockListResponse>;
  singleStockInfo:StockListResponse;
  subscription:Subscription;

  ngOnInit() {

  }

  constructor(private dashboardService: DashboardService){

    this.subscription = this.dashboardService.getStockResult()
    .subscribe(result=>{
        this.singleStockInfo = result;
    })
   

  }

}
