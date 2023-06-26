import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DashboardService, StockListResponse } from '../dashboard.service';
import { Subject } from 'rxjs/Subject';
import { createChart } from 'lightweight-charts';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-purchase-premium',
  templateUrl: './purchasepremium.component.html',
  styleUrls:['./purchasepremium.component.css']
})
export class PurchasePremiumComponent implements OnInit {
  singleStockInfo = new Subject<StockListResponse>();
  stockResult: StockListResponse;
  searchKey = "";
  url ="";



  constructor(private dashboardService: DashboardService,
              private route: ActivatedRoute,
              private router: Router) { 

    this.dashboardService.SearchStockByTickerOrISIN("DE000A0HHJR3",false).subscribe(
      result=>{
        this.singleStockInfo.next(result);
        this.stockResult = result;
        this.dashboardService.SendStockResult(this.stockResult);
        this.stockResult.RssNews = result.RssNews;


      }
    );   
  }


  ngOnInit() {

  }
  search(){
    console.log("Searching");
  }

  buyNow(amount : string){
    console.log(amount);
    this.url = "app/payments?amount="+amount;
    this.router.navigateByUrl(this.url);
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
