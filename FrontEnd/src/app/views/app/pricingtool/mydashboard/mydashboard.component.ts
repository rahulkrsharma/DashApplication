import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mydashboard',
  templateUrl: './mydashboard.component.html',
  styleUrls: ['./mydashboard.component.scss']
})
export class MydashboardComponent {

  userId = 0;

  isPricingAccess: boolean = false;
  


  constructor(private route: ActivatedRoute) { 

    this.route.params.subscribe(params => {
          this.userId = params['userId'];
          // Now you can use the `userId` parameter in your component
        });
    
    var Level = localStorage.getItem("Level");
    if(Level =='Principal' || Level =='Director' || Level == 'Manager'){
      this.isPricingAccess = true;
    }
  }

}
