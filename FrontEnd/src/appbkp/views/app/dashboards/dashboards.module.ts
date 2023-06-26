import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboards.component';
import { DashboardRoutingModule } from './dashboards.routing';
import { SharedModule} from '../../../shared/shared.module'
import { LayoutContainersModule} from '../../../containers/layout/layout.containers.module'
import { DatatableComponent, DataTableHeaderCellComponent, DataTableHeaderComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DashboardsContainersModule } from 'src/app/containers/dashboards/dashboards.containers.module';
import { PagesContainersModule } from 'src/app/containers/pages/pages.containers.module'
import { StockAnalysisComponent } from './stockanalysis/stockanalysis.component';
import { ComponentsCardsModule } from 'src/app/components/cards/components.cards.module';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { StockComparisonComponent } from './comparisons/stockcomparison.component';
import { PurchasePremiumComponent } from './purchasepremium/purchasepremium.component';
import { PrivatePageComponent } from './privatepage/privatepage.component';
import { WatchlistComponent} from './watchlist/watchlist.component'
import { GoalsComponent} from './goals/goals.component'
import { NewsWatchlistComponent} from './newswatchlist/newswatchlist.component'
import { FormsModule } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { PaymentsComponent } from './payments/payments.component'
import { LiveChartComponent } from './livechart/livechart.component'
import { AssetsOverviewComponent } from './assets/assets.component'
import { NgxSpinnerModule } from 'ngx-spinner';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { UiSwitchModule } from 'ngx-ui-switch';
import { StatusComponent } from './status/status.component';




@NgModule({
  declarations: [DashboardComponent,StockAnalysisComponent,
    StockComparisonComponent,PurchasePremiumComponent,
    PrivatePageComponent,WatchlistComponent,GoalsComponent,
    NewsWatchlistComponent,PaymentsComponent,LiveChartComponent,
    AssetsOverviewComponent,
    StatusComponent
    ],
  imports: [
    SharedModule,
    LayoutContainersModule,
    DashboardRoutingModule, 
    NgxDatatableModule,
    CollapseModule,
    ComponentsCardsModule,
    RoundProgressModule,
    DashboardsContainersModule,
    FormsModule,
    NgxSpinnerModule,
    ComponentsChartModule
  ],
  exports :[]
})
export class DashboardsModule { }
