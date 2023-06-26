import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { countries } from '../../../../../data/country-data-store';
import { ProjectPricingService, QuarterlyData, RatesResponse, ServiceType, UserDetail } from '../../projectpricing.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  @Input() userId:number;
  fileToUpload: File | null = null;
  selectedImage: string | ArrayBuffer | null;
  ratesList : RatesResponse[];
  public serviceTypes: ServiceType [] = [];
  public levels: any[] = [];
  //public countryList:any = countries; 

  // public levels: any [] = [
  //   { code: "Principal", name: "Principal" },
  //   { code: "Director", name: "Director" },
  //   { code: "Manager", name: "Manager" },
  //   { code: "Senior Associate", name: "Senior Associate" },
  //   { code: "Associate", name: "Associate" }
  
  // ];

  public countryList:any [] = [
    { code: "Sydney", name: "Sydney" },
    { code: "Melbourne", name: "Melbourne" },
    { code: "Canberra", name: "Canberra" }, 
    { code: "Brisbane", name: "Brisbane" },
    { code: "Adelaide", name: "Adelaide" },
    { code: "Perth", name: "Perth" }, 
    { code: "Hobart", name: "Hobart" },
    { code: "Other", name: "Other" }
  ]; 

  public WorkSchedule : ServiceType[] = [
    { code: "0", name: "0" },
    { code: "1", name: "1" },
    { code: "2", name: "2" },
    { code: "3", name: "3" },
    { code: "4", name: "4" },
    { code: "5", name: "5" }
  ];

  // public serviceTypes: ServiceType [] = [
  //   { code: "ChangeManagement", name: "Change Management" },
  //   { code: "OrganistationDesign", name: "Organistation Design" },
  //   { code: "StrategicChange", name: "Strategic Change" },
  //   { code: "OrganistationDevelopment", name: "Organistation Development" },
  //   { code: "HRTransformation", name: "HR Transformation" },
  //   { code: "UXImprovement", name: "UX/Process Improvement" }
  // ];

  userDetails: UserDetail = {
    UserId: 0,
    UserRegDate: '',
    Level: '',
    IsAdmin: '',
    IsActivated: '',
    ToDelete: '',
    Location: '',
    SelectedServiceTypes: [],
    displayName: '',
    email: '',
    MobileNo: '',
    WorkSchedule: 0,
    FromAdmin:'',
    ProfileImage:''
  };

  quarterlyAllocation : QuarterlyData = {
    currentQuarterSum: 0,
    previousQuarterSum: 0,
    nextQuarterSum: 0,
    currentQuarterLeaveSum: 0,
    previousQuarterLeaveSum: 0,
    nextQuarterLeaveSum: 0,
    currentQuarterPercentAllocation: 0,
    previousQuarterPercentAllocation: 0,
    nextQuarterPercentAllocation: 0
  };

 

  constructor(private projectPricingService: ProjectPricingService,private SpinnerService: NgxSpinnerService) { 
    this.SpinnerService.show();
    this.projectPricingService.getRates().subscribe(
      result=>{
        
        this.serviceTypes = result["Item4"];
        this.levels = result["Item1"];
      }
    )
    
    this.projectPricingService.fetchUserInfo().subscribe(
      userDetail=>{
        this.userDetails =userDetail['userDetails'][0];
        this.userDetails.SelectedServiceTypes = userDetail.SelectedServiceTypes;
        if(this.userDetails.ProfileImage!=""){
          localStorage.setItem("UserProfilePicture",this.userDetails.ProfileImage);
        }

      }
    )

    this.projectPricingService.fetchQuarterlyData().subscribe(
      quarterlyData=>{
        this.quarterlyAllocation =quarterlyData;
        this.quarterlyAllocation.previousQuarterPercentAllocation = Math.round (this.quarterlyAllocation.previousQuarterPercentAllocation);
        this.quarterlyAllocation.currentQuarterPercentAllocation = Math.round (this.quarterlyAllocation.currentQuarterPercentAllocation);
        this.quarterlyAllocation.nextQuarterPercentAllocation = Math.round (this.quarterlyAllocation.nextQuarterPercentAllocation);

      }
    )
    this.SpinnerService.hide();

  }

  ngOnInit(): void {

    
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
}
saveProfileDetails(){
  this.SpinnerService.show();
  this.userDetails.FromAdmin = 'false';
  this.projectPricingService.saveProfileDetails(this.userDetails).subscribe(
    result=>{
      this.SpinnerService.hide();
    }
  )
}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.userDetails.ProfileImage = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

}
