import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { DatepickerComponent } from '../../../../app/containers/forms/datepicker/datepicker.component';
import { ComponentsStateButtonModule } from '../../../components/state-button/components.state-button.module';
import { MydashboardComponent } from './mydashboard/mydashboard.component';
import { ProjectpricingComponent } from './projectpricing/projectpricing.component';
import { TeamComponent } from './team/team.component';
import { AdminComponent } from './admin/admin.component';
import { PricingToolRoutingModule } from './pricingtool.routing';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DatatableComponent, DataTableHeaderCellComponent, DataTableHeaderComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CreateprojectpricingComponent } from './createprojectpricing/createprojectpricing.component';
import { PagesContainersModule } from '../../../containers/pages/pages.containers.module'
import { LayoutContainersModule } from 'src/app/containers/layout/layout.containers.module';
import { ProfileComponent } from './mydashboard/profile/profile.component';
import { ProjectsComponent } from './mydashboard/projects/projects.component';
import { PricingfilesComponent } from './mydashboard/pricingfiles/pricingfiles.component';
import { MyDashBreadcrumbComponent } from './mydashboard/my-dash-breadcrumb/my-dash-breadcrumb.component';
import { RouterModule } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsContainersModule } from 'src/app/containers/forms/forms.containers.module';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserAdminComponent } from './admin/user-admin/user-admin.component';
import { ProjectsAdminComponent } from './admin/projects-admin/projects-admin.component';
import { SystemAdminComponent } from './admin/system-admin/system-admin.component';
import { SelesforecastComponent } from './selesforecast/selesforecast.component';
import { ComponentsChartModule } from 'src/app/components/charts/components.charts.module';
import { ScheduleComponent } from './mydashboard/schedule/schedule.component';
import { TteamdashboardComponent } from './team/tteamdashboard/tteamdashboard.component';
import { TteamprofilesComponent } from './team/tteamprofiles/tteamprofiles.component';
import { TeamforecastreportComponent } from './team/teamforecastreport/teamforecastreport.component';



@NgModule({
  declarations: [MydashboardComponent,ProjectpricingComponent,TeamComponent,AdminComponent, CreateprojectpricingComponent, ProfileComponent, ProjectsComponent, PricingfilesComponent, MyDashBreadcrumbComponent, UserAdminComponent, ProjectsAdminComponent, SystemAdminComponent, SelesforecastComponent, ScheduleComponent, TteamdashboardComponent, TteamprofilesComponent, TeamforecastreportComponent,
  ],
  imports: [
    CommonModule,
    PricingToolRoutingModule,
    FormsModule,
    SharedModule,
    ComponentsStateButtonModule,
    NgxSpinnerModule,
    PagesContainersModule,
    NgxDatatableModule,
    LayoutContainersModule,
    PaginationModule.forRoot(),
    RouterModule,
    FormsContainersModule,
    ComponentsChartModule,
    NgSelectModule,
    TabsModule.forRoot(),
    NgbModule
    
  ],
  
  providers:[]
})
export class PricingToolModule { }
