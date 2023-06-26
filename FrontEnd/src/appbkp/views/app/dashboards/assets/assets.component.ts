import { Component, Input } from '@angular/core';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';
import { AssetAllocation, AssetsOverview, DashboardService, StockListResponse } from '../dashboard.service';
import { assets} from 'src/app/data/assetsoverview';
import { ChartService } from 'src/app/components/charts/chart.service';
import { doughnutChartData } from 'src/app/data/charts';
@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls:['./assets.component.css']
})
export class AssetsOverviewComponent {
  i:number =0;
    chartDataConfig: ChartService;
    assetData:AssetAllocation;
   doughnutChartData = doughnutChartData;
    userId : string;
    watchListData:StockListResponse[];
    subscription:Subscription;
    assets:AssetsOverview[];
    newAttribute:any ={};
    columns = [
        { prop: 'month', name: 'Month' },
        { prop: 'bankAccount', name: 'bankAccount' },
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
  
    editing = {};
  rows = [];
  data = []; 

  
  constructor(private readonly dashboardService:DashboardService,private chartService: ChartService) {
    // this.fetch(data => {
    //   this.rows = data;
    // });
    this.data = [
        {'name':'Rahul Sharma','gender':'male','age':'30'},
        {'name':'Priya Sinha','gender':'male','age':'32'},
        {'name':'John Jacobs','gender':'male','age':'28'}
    ];
    this.rows = this.data;
    this.chartDataConfig = this.chartService;
    
  }

  //ColumnMode = ColumnMode;

  ngOnInit() {
    this.userId = "2";
    this.assets = assets;
    this.assetData.labels.push('bankAccount','creditCards','crypto');
    this.assetData.datasets.push()
    // this.dashboardService.getPrivateStock(this.userId).subscribe(
    //     result=>{
    //       this.watchListData = result["Item1"];;
    //     }
    //   );   
    }


  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/data/company.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }

  updateValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.rows[rowIndex][cell] = event.target.value;
    this.rows = [...this.rows];
    console.log('UPDATED!', this.rows[rowIndex][cell]);
  }

  
  updateAssetsValue(event, cell, rowIndex) {
    console.log('inline editing rowIndex', rowIndex);
    this.editing[rowIndex + '-' + cell] = false;
    this.assets[rowIndex][cell] = event.target.value;
    if(this.assets[rowIndex]["bankAccount"]!=undefined ){
    this.assets[rowIndex]["networth"] = + this.assets[rowIndex]["bankAccount"] + + this.assets[rowIndex]["stocksEtf"] + + this.assets[rowIndex]["crypto"] + + 
    this.assets[rowIndex]["preciousMetals"] + + this.assets[rowIndex]["realState"] + +
    this.assets[rowIndex]["otherAssets"] + + this.assets[rowIndex]["loans"] + +
    this.assets[rowIndex]["mortgage"] + + this.assets[rowIndex]["creditCards"] + + this.assets[rowIndex]["otherLiablities"] ;
    }
    if(this.assets.length > 1){
      for(this.i = 0;this.i< this.assets.length;this.i++){
        if(this.assets[this.i]["networth"]!=undefined){
        this.assets[this.i+1]["monthlyDifference"] = this.assets[this.i+1]["networth"] - this.assets[this.i]["networth"];

        this.assets[this.i+1]["fluctuation"] = (this.assets[this.i+1]["monthlyDifference"] / this.assets[this.i+1]["networth"]) * 100;
        }
      }
      
    }
    this.assets = [...this.assets];
    console.log('UPDATED!', this.assets[rowIndex][cell]);
  }

  saveData(){
      console.log("Saving data"+this.rows);
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

  addNewRow(){
      this.assets.push(this.newAttribute);
      this.assets = [...this.assets];
      this.newAttribute = {};

  }

  deleteRow(index:number){
    this.assets.splice(index,1);
    this.assets = [...this.assets];


}
}