import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import { CouponDetailModalComponent } from '../coupon-detail-modal/coupon-detail-modal.component';
import { GatepassAddComponent } from 'src/app/company-dispatch/gatepass-add/gatepass-add.component';
import { ViewMasterBoxDispatchDetailComponent } from 'src/app/company-dispatch/view-master-box-dispatch-detail/view-master-box-dispatch-detail.component';



@Component({
  selector: 'app-coupon-code-list',
  templateUrl: './coupon-code-list.component.html'
})
export class CouponCodeListComponent implements OnInit {
  fabBtnValue: any = 'add';
  active_tab: any = 'item_box'
  filter: any = {};
  couponData: any = [];
  scanData: any = [];
  scanDataSales: any = [];
  pageCount: any;
  total_page: any;
  page_limit: any = 500;
  pagenumber: any = 1;
  start: any = 0;
  sr_no: number;
  loader: boolean = false;
  noResult: boolean = false;
  assign_login_data: any = [];
  assign_login_data2: any = {};
  today_date: any;
  tabCount: any = {}
  downurl: any;
  data: any = {};
  mastercouponData: any = [];
  scanLimit: any = {};




  constructor(public service: DatabaseService, public toast: ToastrManager, public session: sessionStorage, public alertDialog: DialogComponent, public dialog: MatDialog) {

    this.today_date = new Date();
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.downurl = service.downloadUrl;
    this.couponCodeList();
    this.getScanLimitCount();


  }

  ngOnInit() {
  }

  pervious(type) {
    this.start = this.start - this.page_limit;
    if (type == 'scan_item') {
      this.scanCouponList();
    }
    if (type == 'master_grand_box') {
      this.getGrandMaster();
    }
    else {
      this.couponCodeList();
    }
  }

  nextPage(type) {
    this.start = this.start + this.page_limit;
    if (type == 'scan_item') {
      this.scanCouponList();
    }
    if (type == 'master_grand_box') {
      this.getGrandMaster();
    }
    else {
      this.couponCodeList();
    }
  }

  couponCodeList() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }



    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.dispatch_date) {
      this.filter.dispatch_date = moment(this.filter.dispatch_date).format('YYYY-MM-DD');
    }

    this.filter.active_tab = this.active_tab;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, '/CouponCode/couponCodeList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.couponData = resp['scanned_coupon_code_list']
        this.pageCount = resp['count'];

        this.loader = false;

        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }

        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;

        setTimeout(() => {
          if (this.couponData.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }

    })
  }



  scanCouponList() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.dispatch_date) {
      this.filter.dispatch_date = moment(this.filter.dispatch_date).format('YYYY-MM-DD');
    }
    if (this.filter.scanned_on) {
      this.filter.scanned_on = moment(this.filter.scanned_on).format('YYYY-MM-DD');
    }

    this.filter.active_tab = this.active_tab;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, '/CouponCode/scannedCouponCodeList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.scanData = resp['scanned_coupon_code_list']
        this.pageCount = resp['count'];

        this.loader = false;

        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }

        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;

        setTimeout(() => {
          if (this.scanData.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }

    })
  }


  scanCouponSalesList() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.dispatch_date) {
      this.filter.dispatch_date = moment(this.filter.dispatch_date).format('YYYY-MM-DD');
    }
    if (this.filter.scanned_on) {
      this.filter.scanned_on = moment(this.filter.scanned_on).format('YYYY-MM-DD');
    }

    this.filter.active_tab = this.active_tab;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, '/CouponCode/scannedCouponCodeList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.scanDataSales = resp['scanned_coupon_code_list']
        this.pageCount = resp['count'];

        this.loader = false;

        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }

        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;

        setTimeout(() => {
          if (this.scanDataSales.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }

    })
  }


  lastBtnValue(value) {
    this.fabBtnValue = value;
  }

  refresh(type) {
    this.filter = {};
    if (this.start < 0) {
      this.start = 0;
    }
    this.getScanLimitCount();

    if (type == 'scan_item') {
      this.scanCouponList();
    }
    else if (type == 'master_grand_box') {
      this.getGrandMaster();
    }
    else if (type == 'scan_item_by_sales') {
      this.scanCouponSalesList();
    }
    else {
      this.couponCodeList();
      this.getScanLimitCount();

    }
  }



  reopenCoupon(couponCode) {
    let alertText
    alertText = "You want to reopen this" + ' ' + couponCode + ' ' + 'code'
    this.alertDialog.confirm(alertText).then((result) => {
      if (result) {
        this.data.created_by_name = this.assign_login_data2.name;
        this.data.created_by_id = this.assign_login_data2.id;
        this.data.coupon_code = couponCode;
        this.service.post_rqst({ 'data': this.data }, "couponCode/CouponReopen").subscribe((response => {
          if (response['statusCode'] == "200") {
            this.toast.successToastr(response['statusMsg']);
            this.scanCouponList();
          }
          else {
            this.toast.errorToastr(response['statusMsg']);
          }
        }));
      }
    });
  }


  exportAsXLSX(status) {
    this.loader = true;
    if(status == 'scan_item'){
      this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, '/Excel/scanned_coupon_code_list').subscribe((result => {
        if (result['msg'] == true) {
          this.loader = false;
          window.open(this.downurl + result['filename']);
          if(status == 'scan_item'){
            this.scanCouponList();
          }
        } else {
          this.loader = false;
        }
      }));
    }
    else{
      this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, '/Excel/coupon_code_all_list').subscribe((result => {
        if (result['msg'] == true) {
          this.loader = false;
          window.open(this.downurl + result['filename']);
          if(status == 'item_box' || status == 'master_box'){
            this.couponCodeList();
          }
        } else {
          this.loader = false;
        }
      }));
    }
  }








  openScanLimitModal() {
    const dialogRef = this.dialog.open(CouponDetailModalComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        'from': 'scan_limit_modal',
        'scan_limit': this.scanLimit.limit
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.getScanLimitCount()
      }
    });
  }

  getScanLimitCount() {
    this.service.post_rqst({}, 'CouponCode/scanLimit').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.scanLimit = resp['result'];
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.loader = false;

    })
  }
  getGrandMaster() {
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    if (this.filter.dispatch_date) {
      this.filter.dispatch_date = moment(this.filter.dispatch_date).format('YYYY-MM-DD');
    }
    if (this.filter.scanned_on) {
      this.filter.scanned_on = moment(this.filter.scanned_on).format('YYYY-MM-DD');
    }

    if (this.active_tab == 'master_grand_box') {
      this.page_limit = this.service.pageLimit;
    }

    this.filter.active_tab = this.active_tab;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Dispatch/fetchGrandMasterList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.mastercouponData = resp['offer_coupon_grand_master']
        this.pageCount = resp['count'];

        this.loader = false;

        if (this.pagenumber > this.total_page) {
          this.pagenumber = this.total_page;
          this.start = this.pageCount - this.page_limit;
        }

        else {
          this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
        }
        this.total_page = Math.ceil(this.pageCount / this.page_limit);
        this.sr_no = this.pagenumber - 1;
        this.sr_no = this.sr_no * this.page_limit;

        setTimeout(() => {
          if (this.mastercouponData.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }

    })
  }
  viewmasterboxdetail(id, type) {
    let data = { 'main_data': { 'id': id }, 'type': type }
    const dialogRef = this.dialog.open(ViewMasterBoxDispatchDetailComponent, {
      width: '1000px',
      data

    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getDetails(id, type): void {
    const dialogRef = this.dialog.open(GatepassAddComponent, {
      width: '1024px',
      panelClass: 'cs-modal',
      disableClose: true,
      data: {
        'model_type': type,
        'gatepass_id': id,
      }

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }



}
