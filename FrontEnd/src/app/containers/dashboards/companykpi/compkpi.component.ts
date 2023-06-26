import { Component, Input, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DashboardService, StockListResponse } from 'src/app/views/app/dashboards/dashboard.service';
import cakes, { ICake } from '../../../data/cakes';

@Component({
  selector: 'app-compkpi',
  templateUrl: './compkpi.component.html'
})
export class CompanyKpiComponent implements OnInit {

  data: ICake[] = cakes;
  subscription:Subscription;
  @Input() companyKpi:Subject<StockListResponse>;
  singleStockInfo:StockListResponse;

  @Input() title:string;

  ngOnInit() {
    
  }

  constructor(private dashboardService: DashboardService){

    this.subscription = this.dashboardService.getStockResult()
    .subscribe(result=>{
        this.singleStockInfo = result;
    })
  }

}
