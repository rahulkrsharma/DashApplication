import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  StatusConfirmation ='';
  constructor(private route:ActivatedRoute,private router:Router, private authService: AuthService) { 
      this.route.queryParams.subscribe(params=>{
        console.log(params.emailId);
        console.log(params.verificationCode);
        this.authService.fetchStatus(params.emailId,params.verificationCode).
        subscribe( status => 
          { 
            console.log("Status is:"+ status);
            this.StatusConfirmation = status;
          });

      });

  }

  ngOnInit(): void {
  }

}
