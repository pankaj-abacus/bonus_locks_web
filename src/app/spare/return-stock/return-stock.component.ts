import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/dialog.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-return-stock',
  templateUrl: './return-stock.component.html',
  styleUrls: ['./return-stock.component.scss']
})
export class ReturnStockComponent implements OnInit {

  add_list: any = [];
  formData: any = {}
  row: any = {}
  max_qty: any = [];
  asgn_qty: any;
  engineerList: any = [];
  savingFlag: boolean = false;
  showSavebtn: boolean = true;

  constructor(public service: DatabaseService, public rout: Router, public toast: ToastrManager, private route: ActivatedRoute, public dialog: DialogComponent, public dialog2: MatDialog) { }

  ngOnInit() {
    this.assign_engineerget('');
  }

  filter: any = {};
  assign_engineerget(searcValue) {
    this.filter.technician_detail = searcValue;
    this.service.post_rqst({ 'filter': this.filter, }, 'ServiceTask/plumberList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.engineerList = resp.data;
      }
      else {
        this.toast.errorToastr(resp['statusMsg'])
      }
    }, error => {
    })
  }

  getCarpenterInfo(id) {
    if (id) {
      let index = this.engineerList.findIndex(d => d.id == id);
      if (index != -1) {
        this.formData.assign_to = this.engineerList[index].id;
        this.getWarrantyDetail();
      }
    }
  }

  getWarrantyDetail() {
    this.service.post_rqst({ "data": this.formData }, "ServiceSparePart/getAssignedParts").subscribe((result => {
      this.add_list = result['assign_part']
    }
    ));

  }
  max(qty,index,assign_qty) {
    if (parseInt(qty) > parseInt(assign_qty)) {
      this.toast.errorToastr('Qty Should Be Less Then Assign Qty');
      this.add_list[index].qty=0
      this.showSavebtn=true
      return

    }


    if (qty==0 || qty=='' ||  qty==null){
      // console.log('in if');

      this.showSavebtn=true
    }
    else{
      // console.log('in else');

      this.showSavebtn=false

    }
  }


  submit() {
  //   for (let i = 0; i < this.add_list.length; i++) {
  //    if (this.add_list[i].qty) {


  //    }
  //   else{
  //     this.toast.errorToastr('Please Insert Qty!...');
  //     return
  //   }
  // }

  this.formData = this.formData
  this.savingFlag = true;
  this.service.post_rqst({ "add_list": this.add_list,"data":this.formData }, "ServiceSparePart/submitReturnStock").subscribe((result => {
    if (result['statusCode'] == 200) {
      this.toast.successToastr(result['statusMsg']);
      this.dialog2.closeAll();
      setTimeout(() => {
        this.savingFlag = false;
      }, 700);
    }
    else {
      this.toast.errorToastr(result['statusMsg']);
    }
  }))
  }


}
