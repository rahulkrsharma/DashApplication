import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mydashboard',
  templateUrl: './mydashboard.component.html',
  styleUrls: ['./mydashboard.component.scss']
})
export class MydashboardComponent implements OnInit {



  isPricingAccess: boolean = false;
  


  constructor() { 
    
    var Level = localStorage.getItem("Level");
    if(Level =='Principal' || Level =='Director' || Level == 'Manager'){
      this.isPricingAccess = true;
    }
  }

  ngOnInit(): void {
  }

}
