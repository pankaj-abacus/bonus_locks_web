import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { DialogService } from 'src/app/dialog.service';
import { sessionStorage } from 'src/app/localstorage.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';
import { SpareAssignQtyComponent } from '../spare-assign-qty/spare-assign-qty.component';
import { SpareOutgoingComponent } from '../spare-outgoing/spare-outgoing.component';
import { SpareIncomingComponent } from '../spare-incoming/spare-incoming.component';
import { AddSpareComponent } from '../add-spare/add-spare.component';
@Component({
  selector: 'app-spare-list',
  templateUrl: './spare-list.component.html',
  styleUrls: ['./spare-list.component.scss']
})

export class SpareListComponent implements OnInit {
  fabBtnValue: any = 'add';
  customerList: any = [];
  filter: any = false;
  data: any = [];
  page_limit: any;
  start: any = 0;
  count: any;
  total_page: any = 0;
  pagenumber: any = 0;
  loader: boolean = false;
  tab_active = 'all';
  scheme_active_count: any;
  filter_data: any = {};
  today_date: Date;
  excelLoader: boolean = false;
  pageCount: any;
  sr_no: number;
  datanotofound: boolean = false;
  downurl: any = ''
  
  
  constructor(public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) { 
    this.downurl = service.downloadUrl
    this.page_limit = service.pageLimit;
  }
  ngOnInit() {
    this.filter_data = this.service.getData()
    this.getCumtomerList('');
  }
  
  pervious() {
    this.start = this.start - this.page_limit;
    this.getCumtomerList('');
  }
  
  nextPage() {
    this.start = this.start + this.page_limit;
    this.getCumtomerList('');
  }
  
  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.getCumtomerList('');
  }
  
  clear() {
    this.refresh();
  }
  
  goToDetailHandler(id) {
    window.open(`/customer-detail/` + id);
  }
  date_format(): void {
    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    this.getCumtomerList('');
  }
  
  getCumtomerList(data) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    let header = this.service.post_rqst({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }, "ServiceCustomer/serviceCustomerList")
    
    this.loader = true;
    header.subscribe((result) => {
      if (result['statusCode'] == 200) {
        
        console.log('result',result);
        
        
        this.customerList = result['result'];
        console.log(this.customerList);
        
        this.pageCount = result['count'];
        this.scheme_active_count = result['scheme_active_count'];
        this.loader = false;
        if (this.customerList.length == 0) {
          this.datanotofound = false;
        } else {
          this.datanotofound = true;
          this.loader = false;
        }
        
        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }
        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit
        
        
        for (let i = 0; i < this.customerList.length; i++) {
          if (this.customerList[i].status == '1') {
            this.customerList[i].newStatus = true
          }
          else if (this.customerList[i].status == '0') {
            this.customerList[i].newStatus = false;
          }
        }
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
        this.datanotofound = true;
        this.loader = false;
      }
      
    })
  }
  lastBtnValue(value) {
    this.fabBtnValue = value;
  }

  downloadExcel() {
    this.service.post_rqst({ 'filter': this.filter_data }, "Excel/service_customer_list").subscribe((result => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.getCumtomerList('');
      } else {
      }
    }));
  }
  deleteProduct(){

  }
  stockIncoming(){

  }
  stockOutgoing(){

  }

  addSpare() {
    const dialogRef = this.dialog.open(AddSpareComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(SpareIncomingComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  openDialog2() {
    const dialogRef = this.dialog.open(SpareOutgoingComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  openDialog3() {
    const dialogRef = this.dialog.open(SpareAssignQtyComponent, {
      width: '600px',
      panelClass: 'cs-modal',
      data: {
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}

