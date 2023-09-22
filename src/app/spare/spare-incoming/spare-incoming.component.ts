import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-spare-incoming',
  templateUrl: './spare-incoming.component.html',
  styleUrls: ['./spare-incoming.component.scss']
})
export class SpareIncomingComponent implements OnInit {

  spareIncomingList: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data) {

    this.spareIncomingList=data.data
    console.log(this.spareIncomingList);
   }

  ngOnInit() {
  }

}
