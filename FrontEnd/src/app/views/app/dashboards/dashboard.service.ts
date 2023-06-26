import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from "rxjs/Subject";
import { AppConstants } from '../../../shared/app.constants';
import { catchError, map } from 'rxjs/operators';
import { HttpRequestHelper } from '../../../shared/http-request-helper'
import { stringify } from '@angular/compiler/src/util';

export class RssNews {
    Title : string;
    NewsLink : string;
    Time : string;
}



export class UserGoal {
  userId : number;
  userGoalAnnualAsset : string;
  userGoalLongTerm : string;
  userGoalMotivation : string;
  userGoalSavingsRate : string;
  userGoalSavingsVolume : string;
}

export class StockListResponse {
    isBookmarked:string;
    StockName : string;
    ISIN : string;
    StockScore : number;
    Industry : string;
    Marketcap : number;
    Currency : string;
    Country : string;
    Ticker : string;
    Exchange : string;
    SearchUrl : string;

    WKN : string;
    Size : string;
    LastAnnualReport : number;
    StockQuantity : string;
    LastDividend : number;
    PerfOneMonth : number;
    PerfOneYear : number;

    AboutCompany : string;
    CompanyUrl : string;
    KpiRolLy : string;
    KpiEBITLy : string;
    KpiEquityRation : string;
    KpiPE5Y : string;
    KpiPELY : string;

    KpiAnalyst : string;
    KpiAnalystRating : string;
    KpiBenchmark : string;
    KpiPerf6Month : string;
    KpiPerf1Year : string;
    KpiAvgEPS : string;
    KpiEPSPerf : string;

    ScoreRolLy : string;
    ScoreEBITLy : string;
    ScoreEquityRation : string;
    ScorePE5Y : string;

    ScoreAnalyst : string;
    ScoreAnalystRating : string;
    ScoreBenchmark : string;
    ScorePerf6Month : string;
    ScorePerf1Year : string;
    ScoreAvgEPS : string;
    ScoreEPSPerf : string;
    RssNews: RssNews;
    followedSince : Date;

    
  }

  export class AssetsOverview {

      
    userId : number;
    month : string;
    bankAccount : number;
    stocksEtf : number;
    crypto : number;
    preciousMetals : number;
    realState : number;
    otherAssets : number;
    loans : number;
    mortgage : number;
    creditCards : number;
    otherLiablities : number;
    networth : number;
    monthlyDifference : number;
    fluctuation : number;
    

  }

  

  export class Assets {
    month : string;
    bankAccount : number;
    stocksEtf : number;
    crypto : number;
    preciousMetals : number;
    realState : number;
    others : number;
  }

  export class Liabilities {
    loans : number;
    mortgage : number;
    creditCards : number;
    Others : number;
  }

  export class Networth {
    networth : number;
    monthlyDifference : number;
    fluctuation : number;
  }

  export class AssetAllocation {
    labels : string [];
    datasets: dataset[]

  }

  export class dataset {
    borderColor : [];
    backgroundColor: [];
    borderWidth: number;
    data: number[]
  }

  export class BookmarkStock {
    UserId : string;
    ISIN : string;
  }




@Injectable({ providedIn: 'root' })
export class DashboardService {

  
  
    private subject = new Subject<StockListResponse>();
    private goalSubject = new Subject<UserGoal>();
    private privatesubject = new Subject<StockListResponse[]>();
    userId  = localStorage.getItem("UserId");

    singleStockInfo:StockListResponse;

    constructor(private httpClient: HttpClient
        ) {

        }

    getStocks() : Observable<StockListResponse[]> {
        return this.httpClient.get(AppConstants.stockListUrl + this.userId ) 
            .pipe(map(response => <StockListResponse[]>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<StockListResponse[]>;   
      }

      getPrivateStock(userId:string) : Observable<StockListResponse[]> {
        return this.httpClient.get(AppConstants.privateStockUrl + "/" +userId) 
            .pipe(map(response => <StockListResponse[]>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<StockListResponse[]>;   
      }

      SearchStockByTickerOrISIN(TickerOrISIN:string,NewsRequired:boolean) : Observable<StockListResponse> {
        return this.httpClient.get(AppConstants.searchStockByTickerOrISINUrl + TickerOrISIN + "/" + NewsRequired ) 
            .pipe(map(response => <StockListResponse>response),
                   catchError(HttpRequestHelper.handleError)
                   ) as Observable<StockListResponse>;   
      }

      SendStockResult(stockInfo:StockListResponse){
        this.subject.next(stockInfo);
      }

      SendMultipleResult(stockInfo:StockListResponse[]){
        this.privatesubject.next(stockInfo);
      }

      getStockResult():Observable<StockListResponse>{
          return this.subject.asObservable();
      }

      getMultipleStockResult():Observable<StockListResponse[]>{
        return this.privatesubject.asObservable();
    }

    SendUserGoal(userGoal:UserGoal){
      this.goalSubject.next(userGoal);
    }

    GetUserGoal():Observable<UserGoal>{
      return this.goalSubject.asObservable();
    }

    saveUserGoal(userGoal: UserGoal): Observable<string>{
      return this.httpClient.post(AppConstants.userGoalUrl,userGoal)
      .pipe(map(response => response),
      catchError(HttpRequestHelper.handleError)
      ) as Observable<string>;
    }

    saveBookmark(bookmarkStock: BookmarkStock): Observable<string>{
      return this.httpClient.post(AppConstants.bookmarkUrl,bookmarkStock)
      .pipe(map(response => response),
      catchError(HttpRequestHelper.handleError)
      ) as Observable<string>;
    }

    

}