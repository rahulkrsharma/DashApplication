import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Appointment, ProjectPricingService } from '../../projectpricing.service';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})


export class ScheduleComponent implements OnInit {
  appointments: Appointment[];
  constructor(private projectPricingService: ProjectPricingService,private SpinnerService: NgxSpinnerService) { 

  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  
    }
  