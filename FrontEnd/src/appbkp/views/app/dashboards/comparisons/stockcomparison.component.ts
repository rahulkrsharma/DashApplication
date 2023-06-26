import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DashboardService, StockListResponse } from '../dashboard.service';
import { Subject } from 'rxjs/Subject';
import { createChart } from 'lightweight-charts';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-stock-comparison',
  templateUrl: './stockcomparison.component.html',
  styleUrls:['./stockcomparison.component.css']
})
export class StockComparisonComponent implements OnInit {
  singleStockInfo = new Subject<StockListResponse>();
  stockResult: StockListResponse;
  searchKey = "";
  FirstCompVisible = false;
  SecondCompVisible = false;
  ThirdCompVisible = false;
  FirstCompany = "";
  SecondCompany = "";
  ThirdCompany ="";
  FirstCompanyStockData : StockListResponse;
  SecondCompanyStockData : StockListResponse;
  ThirdCompanyStockData : StockListResponse;
  defaultCompanies:string[] = ["DE000A0HHJR3","DE000A2G9LL1","DE000A2GS5D8"];
  j:number;



  constructor(private dashboardService: DashboardService,
    private SpinnerService: NgxSpinnerService) { 
    this.SpinnerService.show();
    for(var company of this.defaultCompanies){
      this.dashboardService.SearchStockByTickerOrISIN(company,false).subscribe(
        result=>{
          this.singleStockInfo.next(result);
          this.stockResult = result;
          if(this.defaultCompanies[0]==this.stockResult.ISIN){
          this.FirstCompanyStockData = this.stockResult;
          this.FirstCompVisible = true;
          }
          else if(this.defaultCompanies[1]==this.stockResult.ISIN){
            this.SecondCompanyStockData = this.stockResult;
            this.SecondCompVisible = true;
          }
          else if(this.defaultCompanies[2]==this.stockResult.ISIN){
            this.ThirdCompanyStockData = this.stockResult;
            this.ThirdCompVisible = true;
          }
        }
      ); 
    }
    this.SpinnerService.hide();
  }


  ngOnInit() {

  }

  checkMargin(){
    if(this.FirstCompVisible && !this.SecondCompVisible)
    {
    console.log("Checking Margin 232");
      return 232;
    }
    else {
      return 0;
    }

  }
  search(criteria:string,index:number){
    this.SpinnerService.show();
    console.log("Searching");
    this.dashboardService.SearchStockByTickerOrISIN(criteria,false).subscribe(
      result=>{
        if(index ==1 && result.ISIN!=null ){
          this.FirstCompanyStockData = result;
          this.FirstCompVisible = true;
          this.SpinnerService.hide();
        } else if(index ==2 && result.ISIN!=null ){
          this.SecondCompanyStockData = result; 
          this.SecondCompVisible = true; 
          this.SpinnerService.hide();
        } if(index ==3 && result.ISIN!=null ){
          this.ThirdCompanyStockData = result;
          this.ThirdCompVisible = true;
          this.SpinnerService.hide();
        }
        this.SpinnerService.hide();
      }
    ); 
  }

  featureHide(compNumber:number){
    if(compNumber == 1){
      this.FirstCompVisible = false;
    } else if(compNumber == 2){
      this.SecondCompVisible = false;
    } else if(compNumber == 3){
      this.ThirdCompVisible = false;
    } 

  }
  searchKeyUp(event: KeyboardEvent) {
    if (event.key === "Enter") {
      //this.search();
    } else if (event.key === "Escape") {
      const input = document.querySelector(".mobile-view");
      if (input && input.classList) {
        input.classList.remove("mobile-view");
      }
      this.searchKey = "";
    }
  }

}
