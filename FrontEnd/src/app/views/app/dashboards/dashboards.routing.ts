import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboards.component';
import { StockAnalysisComponent } from '../dashboards/stockanalysis/stockanalysis.component';
import { StockComparisonComponent } from '../dashboards/comparisons/stockcomparison.component';
import { PurchasePremiumComponent } from './purchasepremium/purchasepremium.component';
import { PrivatePageComponent } from './privatepage/privatepage.component';
import { NotificationsService } from 'angular2-notifications';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentSummaryComponent} from './paymentsummary/paymentsummary.component'
import { LiveChartComponent } from './livechart/livechart.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent,
        children: [
            { path: '', component: DashboardComponent, pathMatch: 'full' },
            { path: 'stockanalysis', component: StockAnalysisComponent },
            { path: 'stockanalysis/:stock', component: StockAnalysisComponent },
            { path: 'stockcomparison', component: StockComparisonComponent },
            { path: 'purchasepremium', component: PurchasePremiumComponent },
            { path: 'privatepage', component: PrivatePageComponent },
            { path: 'payments', component: PaymentsComponent },
            { path: 'paymentsummary', component: PaymentSummaryComponent },
            { path: 'livechart', component: LiveChartComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
