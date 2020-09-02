import { AlertService } from './../alerts/alert.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  options = {
    autoClose: false,
    keepAfterRouteChange: false
  }

  constructor(public alertService: AlertService) { }

  ngOnInit(): void {
  }

}
