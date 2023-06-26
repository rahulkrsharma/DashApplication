import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DashboardService, StockListResponse, UserGoal } from '../dashboard.service';
import { Subject } from 'rxjs/Subject';
import { createChart } from 'lightweight-charts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';


@Component({
  selector: 'app-private-page',
  templateUrl: './privatepage.component.html',
  styleUrls:['./privatepage.component.css']
})
export class PrivatePageComponent implements OnInit {
  singleStockInfo = new Subject<StockListResponse>();
  watchListStock = new Subject<StockListResponse[]>();
  stockResult: StockListResponse;
  scoreTitle ="SCORE";
  progressValue = "8.7/10";
  scorePercent: number = 0;
  scoreText = "";
  newswatchlisttitle = "NEWS WATCHLIST";
  costincometitle = "COST - INCOME - CALCULATION";
  watchlisttitle = "WATCHLIST";
  goalstitle : string = "GOALS";
  salescharttitle = "Asset Portfolio Value";
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
  userId : string;
  watchListData : StockListResponse[];
  usergoals : UserGoal;




 




  constructor(private dashboardService: DashboardService) { 

    this.dashboardService.SearchStockByTickerOrISIN("DE000A0HHJR3",false).subscribe(
      result=>{
        this.singleStockInfo.next(result);
        this.stockResult = result;
        this.scorePercent = (this.stockResult.StockScore * 100) / 10;
        this.scoreText = this.stockResult.StockScore.toString();
        this.dashboardService.SendStockResult(this.stockResult);
        this.stockResult.RssNews = result.RssNews;


      }
    );   
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    
  }



  ngOnInit() {
    this.userId=localStorage.getItem("UserId");
    this.dashboardService.getPrivateStock(this.userId).subscribe(
        result=>{
          this.watchListData = result;
          this.usergoals = this.watchListData['Item2'];
          this.dashboardService.SendMultipleResult(this.watchListData);
          this.dashboardService.SendUserGoal(this.usergoals);
        }
      );   

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
