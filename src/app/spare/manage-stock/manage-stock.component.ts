import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-stock',
  templateUrl: './manage-stock.component.html',
  styleUrls: ['./manage-stock.component.scss']
})
export class ManageStockComponent implements OnInit {
  formData:any={}

  constructor() { }

  ngOnInit() {
  }

}
