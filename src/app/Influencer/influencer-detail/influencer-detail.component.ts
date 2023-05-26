import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ChartType, ChartDataSets, ChartOptions, Chart } from 'chart.js';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AdvanceAddGiftComponent } from '../advance-add-gift/advance-add-gift.component';
import { Location } from '@angular/common'
import { RedeemStatusModalComponent } from 'src/app/redeem-status-modal/redeem-status-modal.component';
import { DialogComponent } from 'src/app/dialog.component';



@Component({
  selector: 'app-influencer-detail',
  templateUrl: './influencer-detail.component.html'
})
export class InfluencerDetailComponent implements OnInit {
  @ViewChild('pieCanvas') private pieCanvas: ElementRef;
  pieChart: Chart;

  tabType: any = 'Profile';
  filter: any = {}
  Influencer_Detail: any = {};
  wallet_Detail: any = {}
  id: any = ''
  wallet_history_type: any = 'ledger'
  pageCount: any;
  pagenumber: any = '';
  start: any = 0;
  total_page: any;
  page_limit: any;
  sr_no: any;
  skLoading: boolean = false;
  checkinLoader: boolean = false;
  loader: boolean = false;
  type_id: any;
  login_data: any = {};
  login_data5: any = {};
  url: any;
  user_assign_name: any = '';
  savingFlag: boolean = false;



  constructor(public dialogs: MatDialog, public toast: ToastrManager, public dialog: MatDialog, public ActivatedRoute: ActivatedRoute, public service: DatabaseService, public route: Router, public session: sessionStorage, public location: Location,public alert:DialogComponent) {
    this.page_limit = service.pageLimit;
    this.url = this.service.uploadUrl + 'influencer_doc/'
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data5 = this.login_data.data;
    this.ActivatedRoute.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      this.type_id = params.type_id;

      if (this.id) {
        this.getRights();
        this.InfluencerDetail();
      }
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
  }
  InfluencerDetail() {
    this.skLoading = true;
    this.filter.status = this.tabType
    this.service.post_rqst({ 'id': this.id, 'filter': this.filter }, 'Influencer/influencerCustomerDetail').subscribe((resp) => {

      if (resp['statusCode'] == 200) {
        this.Influencer_Detail = resp['result'];
        this.wallet_Detail = this.Influencer_Detail['influencer_data'];

        this.skLoading = false;
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }



  checkinData: any = [];

  clearFilter() {
    if (this.start < 0) {
      this.start = 0;
    }
  }


  pervious(type) {
    this.start = this.start - this.page_limit;
    if (type == 'advanceGIft') {
      this.getGift();
    }
    else {

      if (this.wallet_history_type == 'ledger') {
        this.getLedger();
      }
      if (this.wallet_history_type == 'scan_history') {
        this.scan_history_data();
      }
      if(this.wallet_history_type == 'redeem_history'){
          this.redeem_history_data();
      }
    }
  }
  nextPage(type) {


    this.start = this.start + this.page_limit;
    if (type == 'advanceGIft') {
      this.getGift();
    }
    else {

      if (this.wallet_history_type == 'ledger') {
        console.log(this.wallet_history_type)

        this.getLedger();
      }
      if (this.wallet_history_type == 'scan_history') {
        this.scan_history_data();
      }

      if (this.wallet_history_type == 'redeem_history') {
        this.redeem_history_data();
      }
      // else {
      //   this.redeem_history_data();
      // }
    }
  }

  ledgerData: any = [];

  date_format(): void {
    this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    this.getLedger();
  }

  refresh() {
    if (this.start < 0) {
      this.start = 0;
    }
    this.filter = {};
    this.getLedger();
  }



  checkRight: any = {};
  getRights() {
    this.service.post_rqst({ 'type_id': this.type_id }, 'Influencer/scanningRightsCheck').subscribe((resp) => {
      this.checkRight = resp['result'];
    })
  }

  getLedger() {
    this.filter.status = this.tabType;
    this.loader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }

    this.service.post_rqst({ 'id': this.id, 'type': 'influencer', 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/influencerLedger').subscribe((resp) => {

      if (resp['statusCode'] == 200) {
        this.ledgerData = resp['influencer_ledger'];
        this.loader = false;
        this.pageCount = resp['count'];
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
        }, 700)
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    })
  }




  giftData: any = [];
  getGift() {
    this.checkinLoader = true;
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }

    if (this.start < 0) {
      this.start = 0;
    }
    let payLoad = { "filter": this.filter, "id": this.id, 'start': this.start, 'pagelimit': this.page_limit }
    this.service.post_rqst(payLoad, "GiftGallery/manualGiftGalleryList").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.giftData = result['gift_master_manual_list'];
        this.checkinLoader = false;
        this.pageCount = result['count'];
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
        this.checkinLoader = false;
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    });
  }


  redeemHistory: any = [];
  noResult: boolean = false;

  redeem_history_data() {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    this.loader = true;

    if (this.filter.date_created) {
      this.filter.date_created = moment(this.filter.date_created).format('YYYY-MM-DD');
    }
    this.filter.id = this.Influencer_Detail.id;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/redeemHistory').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.redeemHistory = resp['result']
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
          if (this.redeemHistory.length == 0) {
            this.noResult = true;
          }
        }, 500);
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }

    })
  }

  couponData: any = [];

  scan_history_data() {
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
    this.loader = true;
    this.filter.id = this.Influencer_Detail.id;
    this.service.post_rqst({ 'filter': this.filter, 'start': this.start, 'pagelimit': this.page_limit }, 'Influencer/scanHistory').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.couponData = resp['result']
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

  goToImage(image) {
    const dialogRef = this.dialogs.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
        'image': image,
        'type': 'base64'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }







  pie_chart() {
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: ['Scan', 'Referral Incentive', 'Redeem'],
        datasets: [{
          label: '#',
          data: [this.wallet_Detail.scan_sum, this.wallet_Detail.referral_sum, this.wallet_Detail.redeem_sum],
          backgroundColor: [
            'rgba(131, 183, 53, 0.9)',
            'rgba(73, 212, 224, 0.9)',
            'rgba(255, 0, 0, 0.9)',
          ]
        }]
      }
    });
  }



  openDialog(type): void {
    const dialogRef = this.dialog.open(AdvanceAddGiftComponent, {
      width: '600px',
      panelClass: 'cs-modal',
      data: {
        'id': this.Influencer_Detail.id,
        'name': this.Influencer_Detail.name,
        'type': type
      }

    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true || result == undefined) {
        if (type == 'advance_gift') {
          this.getGift();
        }
        else {
          this.getLedger();
        }
      }
    });
  }

  changeStatusDialog(id, status, type, referred_by, Name, influencer_type, scanning_rights, welcome_bonus_flag): void {
    const dialogRef = this.dialog.open(RedeemStatusModalComponent, {
      width: '400px', data: {
        order_status: status,
        id: id,
        delivery_from: type,
        referred_by_id: referred_by,
        name: Name,
        influencer_type: influencer_type,
        scanning_rights: scanning_rights,
        welcome_bonus_flag: welcome_bonus_flag,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.InfluencerDetail();
      }
    });
  }

  back(): void {
    this.location.back()
  }

  reset_status(){
    this.alert.confirm('Reset KYC status').then((result)=>{
      if(result){

        this.service.post_rqst({'id':this.id}, "Influencer/resetKyc").subscribe((result => {
          if (result['statusCode'] == 200) {
            this.InfluencerDetail();
            this.toast.successToastr('Status Changed Successfully');
          }
          else {
            this.toast.errorToastr(result['statusMsg']);
          }

        }))
      }
    })
  }
}
