import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DashboardService, StockListResponse } from '../dashboard.service';
import { Subject } from 'rxjs/Subject';
import { createChart } from 'lightweight-charts';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';

declare const TradingView: any;
@Component({
  selector: 'app-stock-analysis',
  templateUrl: './stockanalysis.component.html',
  styleUrls:['./stockanalysis.component.css']
})
export class StockAnalysisComponent implements OnInit,AfterViewInit {
  symbol:string="";
  singleStockInfo = new Subject<StockListResponse>();
  stockResult: StockListResponse;
  scoreTitle ="SCORE";
  progressValue = "8.7/10";
  scorePercent: number = 0;
  scoreText = "";
  scorehistorycharttitle = "Score History";
  companykpititle = "Company KPIs";
  stock = "DE000A2GS5D8";




  constructor(private dashboardService: DashboardService,
    private SpinnerService: NgxSpinnerService,private route: ActivatedRoute,
    private router: Router) { 

      this.route.queryParams.subscribe(params => {
        console.log(params.stock);
        if(params.stock == undefined) {
          this.stock = "DE000A2GS5D8";
        }
        else {
        this.stock = params.stock;
        }
      });

    this.SpinnerService.show();
    this.dashboardService.SearchStockByTickerOrISIN(this.stock,true).subscribe(
      result=>{
        this.singleStockInfo.next(result);
        this.stockResult = result;
        this.symbol = this.stockResult.Exchange + ":" + this.stockResult.Ticker;
        this.scorePercent = (this.stockResult.StockScore * 100) / 10;
        this.scoreText = this.stockResult.StockScore.toString();
        this.dashboardService.SendStockResult(this.stockResult);
        this.stockResult.RssNews = result.RssNews;
        this.SpinnerService.hide();
      }
    );   
  }
  ngAfterViewInit(): void {
    new TradingView.widget({
      'container_id': 'technical-analysis',
      'autosize': true,
      'symbol': this.symbol,
      'interval': '120',
      'timezone': 'exchange',
      'theme': 'Dark',
      'style': '1',
      'toolbar_bg': '#f1f3f6',
      'withdateranges': true,
      'hide_side_toolbar': false,
      'allow_symbol_change': true,
      'save_image': false,
      'height':'1000',
      'hideideas': true,
      'studies': [ 
      'MASimple@tv-basicstudies' ],
      'show_popup_button': true,
      'popup_width': '900',
      'popup_height': '500'
    });
  }


  ngOnInit() {
    const chart = createChart(document.querySelector('.chart').id, { width: 400, height: 300    });
 const lineSeries = chart.addLineSeries();

 lineSeries.setData([
  { time: '2019-04-11', value: 80.01 },
  { time: '2019-04-12', value: 96.63 },
  { time: '2019-04-13', value: 76.64 },
  { time: '2019-04-14', value: 81.89 },
  { time: '2019-04-15', value: 74.43 },
  { time: '2019-04-16', value: 80.01 },
  { time: '2019-04-17', value: 96.63 },
  { time: '2019-04-18', value: 76.64 },
  { time: '2019-04-19', value: 81.89 },
  { time: '2019-04-20', value: 74.43 },
]);

chart.applyOptions({
layout:{
  
  backgroundColor: '#FAblEBD7',
  
  textColor: 'white',
    fontSize: 12,
    fontFamily: 'Calibri',
},handleScroll: {
  mouseWheel: true,
  pressedMouseMove: true,
},
handleScale: {
  axisPressedMouseMove: true,
  mouseWheel: true,
  pinch: true,
}
})
    
    
   
  }

}
