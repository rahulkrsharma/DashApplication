import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Appointment, ProjectPricingService, ScheduleData } from '../../projectpricing.service';
import { IProduct } from 'src/app/data/api.service';
import { ApiService } from 'src/app/data/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tteamprofiles',
  templateUrl: './tteamprofiles.component.html',
  styleUrls: ['./tteamprofiles.component.scss']
})
export class TteamprofilesComponent implements OnInit {
  items : any [] = [];
  employees:any[] = [];
  utlisationData:any[] = [];
  projectStages:{ ProjectName : string, ProjectStage : string }[] =[];
  constructor(private projectPricingService: ProjectPricingService,private SpinnerService: NgxSpinnerService,private router: Router,
    private route: ActivatedRoute) {
    this.SpinnerService.show();
    this.projectPricingService.UtilisationByLevels().subscribe(
      result=>{
        this.utlisationData = result;
        this.SpinnerService.hide();
      }
    )
  }

  ngOnInit(): void{

  }

  getRowSpan(employee: any, property: string): number {
    
    return employee.RowSpan;
  }

  getRowCount(item: any): number {
    const projName = item.ProjectName;
    let count = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].projName === projName) {
        count++;
      }
    }
    return count;
  }

  openProfile(name:string){
    const userId = 30;
    this.router.navigate(['/app/mydashboard',userId], { relativeTo: this.route,queryParamsHandling: 'merge', skipLocationChange: true });
  }

  getStageClass(projectName: string): string {
    if(projectName!=''){
    let stage = this.projectStages[projectName];
    if(projectName.indexOf('leave')!=-1){
        stage = 'leave';
    }
    if (stage === 'Won') {
      return 'stage-won';
    } else if (stage === 'Proposed') {
      return 'stage-proposed';
    } else if (stage === 'Qualified') {
      return 'stage-qualified';
    } else if (stage === 'leave') {
      return 'stage-leave';
    }else {
      return 'stage-rest';
    }
    }
  }
  

}


