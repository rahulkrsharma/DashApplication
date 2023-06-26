import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DashboardService, StockListResponse } from '../dashboard.service';
import { Subject } from 'rxjs/Subject';
import { createChart } from 'lightweight-charts';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { Subscription } from 'rxjs';

declare const TradingView: any;
@Component({
  selector: 'app-livechart',
  templateUrl: './livechart.component.html',
  styleUrls:['./livechart.component.css']
})


export class LiveChartComponent implements AfterViewInit   {
    symbol:string="CLIQ";
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
            'popup_width': '1000',
            'popup_height': '1500'
          });
        }
    }
