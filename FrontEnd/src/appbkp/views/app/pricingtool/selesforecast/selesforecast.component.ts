import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { ChartService } from 'src/app/components/charts/chart.service';
import { Colors } from 'src/app/constants/colors.service';
//import { barChartData } from 'src/app/data/charts';
import { ProjectPricingService, SalesChart, SalesForecastResponse } from '../projectpricing.service';

@Component({
  selector: 'app-selesforecast',
  templateUrl: './selesforecast.component.html',
  styleUrls: ['./selesforecast.component.scss']
})
export class SelesforecastComponent implements OnInit,AfterViewInit  {

  dataLoaded = false;
  salesForecastData : SalesForecastResponse[] = [{
    MonthName :'',
    ProjectStage :'',
    TotalMonthlyRevenue :0
  }];

  

  saleData:SalesChart;
  chartDataConfig: ChartService;
  //barChartData = barChartData;
  //salesData: any;
  public constructor(private chartService: ChartService, private projectPricingService : ProjectPricingService) { 
    this.chartDataConfig = this.chartService;
    //this.saleData = this.projectPricingService.fetchSalesForecastOnInit();
    // this.projectPricingService.fetchSalesForecast().subscribe(
    //   result=> {
    //     //this.projectPricingService.barChData = result;
    //     this.saleData = result;
    //     //this.projectPricingService.setSalesForecastData(result);
        
    // })

        this.saleData = this.projectPricingService.getSalesForecastData();
        if(this.saleData!=null){
          this.dataLoaded = true;
        this.chartDataConfig.barChartOptions.scales.yAxes[0].ticks.min=0;
        this.chartDataConfig.barChartOptions.scales.yAxes[0].ticks.max=Math.ceil(this.saleData['MaxValue'] / 10000) * 10000;
        this.chartDataConfig.barChartOptions.scales.yAxes[0].ticks.stepSize=Number(this.chartDataConfig.barChartOptions.scales.yAxes[0].ticks.max / 10);
        } else{
          this.projectPricingService.fetchSalesForecast().subscribe(
            result=> {
              //this.projectPricingService.barChData = result;
              this.saleData = result;
              this.chartDataConfig.barChartOptions.scales.yAxes[0].ticks.min=0;
        this.chartDataConfig.barChartOptions.scales.yAxes[0].ticks.max=Math.ceil(this.saleData['MaxValue'] / 10000) * 10000;
        this.chartDataConfig.barChartOptions.scales.yAxes[0].ticks.stepSize=Number(this.chartDataConfig.barChartOptions.scales.yAxes[0].ticks.max / 10);
              this.dataLoaded = true;
              //this.projectPricingService.setSalesForecastData(result);
              
          })
            //this.dataLoaded = false;
        }
  }
  ngAfterViewInit(): void {
    this.projectPricingService.fetchSalesForecast().subscribe(
        result=> {
          //this.projectPricingService.barChData = result;
          this.saleData = result;
          //this.projectPricingService.setSalesForecastData(result);
          
      })
  }

  ngOnInit() {
    
    
    
  }
  

}
