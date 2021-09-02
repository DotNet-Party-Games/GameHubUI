import { Component, OnInit } from '@angular/core';
import { AppToastService } from 'projects/hubservices/src/public-api';

@Component({
  selector: 'app-toasts',
  templateUrl: './toasts.component.html',
  styleUrls: ['./toasts.component.scss']
})
export class ToastsComponent implements OnInit {

  constructor(public toastService: AppToastService) {}

  ngOnInit(): void {
    //empty
  }

}
