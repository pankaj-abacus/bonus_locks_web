import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-assign-qty',
  templateUrl: './assign-qty.component.html',
  styleUrls: ['./assign-qty.component.scss']
})
export class AssignQtyComponent implements OnInit {

  qtyList: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.qtyList=data.data
   }

  ngOnInit() {
  }
  

}
