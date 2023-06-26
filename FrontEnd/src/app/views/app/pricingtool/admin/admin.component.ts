import { Component, OnInit } from '@angular/core';
import { ProjectPricingService } from '../projectpricing.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private projectPricingService: ProjectPricingService,private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.SpinnerService.show();
// Delay in milliseconds
const delayInMs = 10000; // 2 seconds

// Execute code after the delay
setTimeout(() => {
  this.SpinnerService.hide();
  // Code to be executed after the delay
  // Write your logic here
}, delayInMs);
    
  }

}
