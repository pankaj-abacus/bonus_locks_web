import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import { RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';

@Component({
  selector: 'app-redeem-request-list',
  templateUrl: './redeem-request-list.component.html'
})
export class RedeemRequestListComponent implements OnInit {

  fabBtnValue: any = 'add';
  active_tab: any = 'Pending'
  filter: any = {};
  redeemRequestList_data: any = []
  today_date: Date;
  pageCount: any;
  total_page: any;
  page_limit: any = 50;
  pagenumber: any = 1;
  start: any = 0;
  sr_no: number;
  loader: boolean = false;
  datanotfound: boolean = false;
  redeemType: any = '';
  redeem_count: any = {}
  data: any = {}
  assign_login_data: any = [];
  assign_login_data2: any = [];
  downurl: any = '';
  savingFlag: boolean = false;
  states: boolean = false;

  constructor(public service: DatabaseService, public rout: ActivatedRoute, public alert: DialogComponent, public toast: ToastrManager, public dialog: MatDialog, public route: Router, public session: sessionStorage) {
    this.downurl = service.downloadUrl;
    this.assign_login_data = this.session.getSession();
    this.assign_login_data = this.assign_login_data.value;
    this.assign_login_data2 = this.assign_login_data.data;
    this.today_date = new Date();

    this.rout.params.subscribe(param => {
      console.log(param);
      this.redeemType = param.redeemType;
      this.redeemRequestList();
      this.getStateList();
    })
  }

  ngOnInit() {
    this.filter = this.service.getData()
    if (this.filter.status) {
      this.active_tab = this.filter.status
    }

  }

  pervious() {
    this.start = this.start - this.page_limit;
    this.redeemRequestList();
  }

  nextPage() {
    this.start = this.start + this.page_limit;
    this.redeemRequestList();
  }

  refresh() {
    this.filter = {}
    this.service.setData(this.filter)
    this.service.currentUserID = '';
    this.active_tab = 'Pending';
    this.redeemRequestList()
  }
  redeemRequestList() {
    this.filter.status = this.active_tab;
    this.filter.paymentMode = this.redeemType;
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'RedeemRequest/redeemGiftRequestList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {

        this.redeemRequestList_data = resp['gift_master_list']
        this.redeem_count = resp['tabCount'];
        if(this.filter.status  == 'Pending'){
          this.pageCount = resp['tabCount']['Pending'];
        }
        if(this.filter.status  == 'Approved'){
          this.pageCount = resp['tabCount']['Approved'];
        }
        if(this.filter.status  == 'Reject'){
          this.pageCount = resp['tabCount']['Reject'];
        }
        if(this.filter.status  == 'Failed'){
          this.pageCount =  resp['tabCount']['Failed'];
        }


        if (this.redeemRequestList_data.length == 0) {
          this.datanotfound = true
        } else {
          this.datanotfound = false
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
        this.sr_no = this.sr_no * this.page_limit;
        this.loader = false;

        setTimeout(() => {
          this.loader = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }


  public onDate(event): void {
    if (this.filter.last_status_updated_on) {
      this.filter.last_status_updated_on = moment(event.value).format('YYYY-MM-DD');
    } else {
      this.filter.date_created = moment(event.value).format('YYYY-MM-DD');
    }
    this.redeemRequestList();

  }
  openDialog(id, type, redeem_type, gift_status, amount): void {
    this.service.currentUserID = id
    if (gift_status == 'Approved') {
      this.alert.confirm('You want to transfer ₹' + amount + '?').then((result) => {
        if (result) {
          this.savingFlag = true;
          this.service.post_rqst({ 'status': gift_status, 'id': id, 'created_by_id': this.assign_login_data2.created_by, 'created_by_name': this.assign_login_data2.created_by_name }, 'RedeemRequest/redeemRequestStatusChange').subscribe((result) => {
            if (result['statusCode'] == 200) {
              this.savingFlag = false;
              this.toast.successToastr(result['statusMsg']);
              this.redeemRequestList();
              this.savingFlag = false;
            }
            else {
              this.toast.errorToastr(result['statusMsg']);
            }
          })
        }
        else {
          this.savingFlag = false
        }
      });
    }
    else {
      const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
        width: '400px', data: {
          'id': id,
          'delivery_from': type,
          'redeem_type': redeem_type,
          'gift_status': gift_status,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.redeemRequestList();
        }
      });
    }
  }
  gotoRedeemDetail(id,) {
    this.route.navigate(["/redeem-detail/" + id], { queryParams: { id } });
  }


  updateNumber(id, wallet, number): void {
    const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
      width: '400px', data: {
        'id': id,
        'delivery_from': wallet,
        'wallet_number': number,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.redeemRequestList();
      }
    });
  }

  lastBtnValue(value) {
    this.fabBtnValue = value;
  }

  exportAsXLSX(status) {
    this.loader = true;
    this.filter.status = status;
    this.service.post_rqst(
      { 'filter': this.filter, 'active_tab': this.active_tab }, "Excel/redeem_gift_request_list"
    ).subscribe((result => {

      if (result['msg'] == true) {
        this.loader = false;
        window.open(this.downurl + result['filename'])
        this.redeemRequestList();
      } else {
        this.loader = false;
      }

    }));

  }


  getStateList() {
    this.service.post_rqst(0, "Master/getAllState").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.states = result['all_state'];
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }));
  }


}
