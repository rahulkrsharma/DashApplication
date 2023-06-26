import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { StockComparisonComponent } from './dashboards/comparisons/stockcomparison.component';
import { StockAnalysisComponent } from './dashboards/stockanalysis/stockanalysis.component';
import { PurchasePremiumComponent } from './dashboards/purchasepremium/purchasepremium.component';
import { PrivatePageComponent } from './dashboards/privatepage/privatepage.component';
import { NotificationsService } from 'angular2-notifications';
import { PaymentsComponent } from './dashboards/payments/payments.component';
import { PaymentSummaryComponent } from './dashboards/paymentsummary/paymentsummary.component';
import { LiveChartComponent } from './dashboards/livechart/livechart.component';
import { AssetsOverviewComponent } from './dashboards/assets/assets.component';
import { StatusComponent } from './dashboards/status/status.component';
import { MydashboardComponent } from './pricingtool/mydashboard/mydashboard.component';
import { ProjectpricingComponent } from './pricingtool/projectpricing/projectpricing.component';
import { TeamComponent } from './pricingtool/team/team.component';
import { AdminComponent } from './pricingtool/admin/admin.component';
import { CreateprojectpricingComponent } from './pricingtool/createprojectpricing/createprojectpricing.component';
import { ProfileComponent } from './pricingtool/mydashboard/profile/profile.component';
import { ProjectsComponent } from './pricingtool/mydashboard/projects/projects.component';
import { PricingfilesComponent } from './pricingtool/mydashboard/pricingfiles/pricingfiles.component';
import { SelesforecastComponent } from './pricingtool/selesforecast/selesforecast.component';



const routes: Routes = [
    {
        path: '', component: AppComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'pricingtool' },
            { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
            { path: 'pricingtool', loadChildren: () => import('./pricingtool/pricingtool.module').then(m => m.PricingToolModule) },
            { path: 'second-menu', loadChildren: () => import('./second-menu/second-menu.module').then(m => m.SecondMenuModule) },
            { path: 'stockanalysis', component: StockAnalysisComponent  },
            { path: 'stockcomparison', component: StockComparisonComponent  },
            { path: 'purchasepremium', component: PurchasePremiumComponent  },
            { path: 'privatepage', component: PrivatePageComponent  },
            { path: 'payments', component: PaymentsComponent  },
            { path: 'paymentsummary', component: PaymentSummaryComponent },
            { path: 'livechart', component: LiveChartComponent },
            { path: 'assets', component: AssetsOverviewComponent },
            { path: 'status', component: StatusComponent },
            { path: 'paymentsummary', component: PaymentSummaryComponent },
            { path: 'livechart', component: LiveChartComponent },
            { path: 'assets', component: AssetsOverviewComponent },
            { path: 'status', component: StatusComponent },
            { path: 'mydashboard', component: MydashboardComponent },
            { path: 'projectpricing', component: ProjectpricingComponent },
            { path: 'team', component: TeamComponent },
            { path: 'Admin', component: AdminComponent },
            { path: 'newprojectpricing', component: CreateprojectpricingComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'projects', component: ProjectsComponent },
            { path: 'pricingfiles', component: PricingfilesComponent },
            { path: 'salesforecast', component: SelesforecastComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
