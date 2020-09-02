import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from './alert.model';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit, OnDestroy {
  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription: Subscription;
  routeSubscription: Subscription;

  constructor(private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    // subscribe to new alert notifications
    this.alertSubscription = this.alertService.onAlert(this.id)
      .subscribe(alert => {
        // clear alerts when an empty alert is received
        if (!alert.message) {
          // filter out alerts without 'keepAfterRouteChange' flag
          this.alerts = this.alerts.filter(x => x.keepAfterRouteChange);

          // remove 'keepAfterRouteChange' flag on the rest
          this.alerts.forEach(x => delete x.keepAfterRouteChange);
          return;
        }

        // add alert to array
        this.alerts.push(alert);

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => this.removeAlert(alert), 3000);
        }
      });

    // clear alerts on location change
    this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.alertService.clear(this.id);
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    // check if already removed to prevent error on auto close
    if (!this.alerts.includes(alert)) return;

    if (this.fade) {
      // fade out alert
      this.alerts.find(x => x === alert).fade = true;

      // remove alert after faded out
      setTimeout(() => {
        this.alerts = this.alerts.filter(x => x !== alert);
      }, 250);
    } else {
      // remove alert
      this.alerts = this.alerts.filter(x => x !== alert);
    }
  }

  cssClass(alert: Alert) {
    if (!alert) return;

    const classes = ['alert', 'flex flex-row items-center', 'p-5 rounded border-b-2'];
    const titleClasses = ['alert-title', 'font-semibold', 'text-lg'];
    const descriptionClasses = ['alert-description', 'text-sm'];

    const alertTypeClass = {
      [AlertType.Success]: { box: 'bg-green-200 border-green-300', title: 'text-green-800', description: 'text-green-600' },
      [AlertType.Error]: { box: 'bg-red-200 border-red-300', title: 'text-red-800', description: 'text-red-600' },
      [AlertType.Info]: { box: 'bg-blue-200 border-blue-300', title: 'text-blue-800', description: 'text-blue-600' },
      [AlertType.Warning]: { box: 'bg-yellow-200 border-yellow-300', title: 'text-yellow-800', description: 'text-yellow-600' }
    }

    classes.push(alertTypeClass[alert.type].box);
    titleClasses.push(alertTypeClass[alert.type].title);
    descriptionClasses.push(alertTypeClass[alert.type].description);

    if (alert.fade) {
      classes.push('fade');
    }

    return {
      box: classes.join(' '),
      title: titleClasses.join(' '),
      description: descriptionClasses.join(' ')
    };
  }
}
