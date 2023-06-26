import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricingtoolComponent } from '../pricingtool/pricingtool.component'
import { MydashboardComponent } from '../pricingtool/mydashboard/mydashboard.component';
import { ProjectpricingComponent } from '../pricingtool/projectpricing/projectpricing.component';
import { TeamComponent } from '../pricingtool/team/team.component';
import { AdminComponent } from '../pricingtool/admin/admin.component';
import { CreateprojectpricingComponent} from '../pricingtool/createprojectpricing/createprojectpricing.component'
import { ProfileComponent } from './mydashboard/profile/profile.component';
import { ProjectsComponent } from './mydashboard/projects/projects.component';
import { PricingfilesComponent } from './mydashboard/pricingfiles/pricingfiles.component';
import { SelesforecastComponent } from './selesforecast/selesforecast.component';
import { AuthGuard } from 'src/app/shared/auth.guard';
const routes: Routes = [
    {
        path: '', component: PricingtoolComponent,
        children: [
            { path: '', redirectTo: 'mydashboard', pathMatch: 'full' },
            { path: 'mydashboard/:userId', component: MydashboardComponent,canActivate: [AuthGuard] },
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
export class PricingToolRoutingModule { }
