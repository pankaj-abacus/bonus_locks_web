import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-spare-outgoing',
  templateUrl: './spare-outgoing.component.html',
  styleUrls: ['./spare-outgoing.component.scss']
})
export class SpareOutgoingComponent implements OnInit {

  spareOutgoingList: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.spareOutgoingList=data.data
    console.log(this.spareOutgoingList);
  }

  ngOnInit() {
  }

}
