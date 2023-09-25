import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-return-data',
  templateUrl: './return-data.component.html',
  styleUrls: ['./return-data.component.scss']
})
export class ReturnDataComponent implements OnInit {

  sparereturnList: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.sparereturnList=data.data
    console.log(this.sparereturnList);
  }

  ngOnInit() {
  }



}
