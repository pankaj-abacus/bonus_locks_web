import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ChartType, ChartDataSets, ChartOptions, Chart } from 'chart.js';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common'
import { DialogComponent } from 'src/app/dialog.component';
import { DialogService } from 'src/app/dialog.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';
// import { type } from 'os';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  
  id;
  tabType: any = 'Profile';
  filter: any = {}
  getData:any ={};
  skLoading:boolean = false;
  url:any;
  assign_login_data:any={};
  logined_user_data:any={};
  stateDetail:any =[];
  warrantyList:any =[];
  complaintList:any =[];
  installationList:any =[];
  product_size:any =[];
  featureFlag :boolean = false;
  allMrpFlag :boolean = false;
  productImg:any =[];
  total_page: any;
  pagenumber: any = 0;
  Influencer_Detail: any = {};
  pageCount: any;
  start: any = 0;
  page_limit: any;
  sr_no: any;
  checkinLoader: boolean = false;
  loader: boolean = false;
  type_id: any;
  login_data: any = {};
  login_data5: any = {};
  user_assign_name: any = '';
  savingFlag: boolean = false;
  filter_data: any = {};
  fabBtnValue: any = 'excel';
  
  
  constructor(public location: Location, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {
    this.page_limit = service.pageLimit;
    // this.page_limit = 1;
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      if(this.id){
        this.getCustomerDetail();
      }
    });
  }
  
  ngOnInit() {
  }
  
  getCustomerDetail()
  {
    this.skLoading = true;
    this.filter.status = this.tabType
    this.service.post_rqst({'customer_id':this.id,},"ServiceCustomer/serviceCustomerDetail").subscribe((result=>
      {
        this.getData = result['result'];
        console.log('getData',this.getData);
        
        this.productImg = this.getData['img'];
        
        this.skLoading = false;
      }
      ));
      
    }
    
    
    pervious(type) {
      this.start = this.start - this.page_limit;
      if (type == 'warranty') {
        this.getWarrantyDetail();
      }
      else if  (type == 'installation') {
        this.getInstallationDetail();
      }
      else{
        this.getComplaintDetail();
      }
    }
    nextPage(type) {
      this.start = this.start + this.page_limit;
      if (type == 'warranty') {
        this.getWarrantyDetail();
      }
      else if  (type == 'installation') {
        this.getInstallationDetail();
      }
      else{
        this.getComplaintDetail();
      }
    }

    date_format(): void {
      this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
      this.getWarrantyDetail();
    }
    
    getWarrantyDetail() {
      this.filter.status = this.tabType;
      this.loader = true;
      if (this.pagenumber > this.total_page) {
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      if (this.start < 0) {
        this.start = 0;
      }
      
      this.service.post_rqst({'customer_id':this.id,'pagelimit': this.page_limit,'start': this.start,'filter': this.filter_data}, 'ServiceTask/serviceWarrantyList').subscribe((result) => {
        
        if (result['statusCode'] == 200) {
          this.warrantyList = result['result'];
          this.loader = false;
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
          setTimeout(() => {
          }, 700)
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }
    
    // getWarrantyDetail(){
    //   console.log(this.tabType);
    
    //   this.skLoading = true;
    //   this.filter.status = this.tabType
    //   this.service.post_rqst({'customer_id':this.id},"ServiceTask/serviceWarrantyList").subscribe((result=>
    //     {
    //       this.warrantyList = result['result'];
    //       console.log('warrantyList',this.warrantyList);
    //       this.skLoading = false;
    //     }
    //     ));
    //   }


    getInstallationDetail() {
      this.filter.status = this.tabType;
      this.loader = true;
      if (this.pagenumber > this.total_page) {
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      if (this.start < 0) {
        this.start = 0;
      }
      
      this.service.post_rqst({'customer_id':this.id,'pagelimit': this.page_limit,'start': this.start,'filter': this.filter_data}, 'ServiceTask/serviceInstallationList').subscribe((result) => {
        
        if (result['statusCode'] == 200) {
          this.installationList = result['result'];
          this.loader = false;
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
          setTimeout(() => {
          }, 700)
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }
    
    // getInstallationDetail(){
    //   console.log(this.tabType);
    //   this.skLoading = true;
    //   this.filter.status = this.tabType
    //   this.service.post_rqst({'customer_id':this.id},"ServiceTask/serviceInstallationList").subscribe((result=>
    //     {
    //       this.installationList = result['result'];
    //       this.skLoading = false;
    //     }
    //     ));
    //   }

    getComplaintDetail() {
      this.filter.status = this.tabType;
      this.loader = true;
      if (this.pagenumber > this.total_page) {
        this.pagenumber = this.total_page;
        this.start = this.pageCount - this.page_limit;
      }
      if (this.start < 0) {
        this.start = 0;
      }
      
      this.service.post_rqst({'customer_id':this.id,'pagelimit': this.page_limit,'start': this.start,'filter': this.filter_data}, 'ServiceTask/serviceComplaintList').subscribe((result) => {
        
        if (result['statusCode'] == 200) {
          this.complaintList = result['result'];
          this.loader = false;
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
          setTimeout(() => {
          }, 700)
        }
        else {
          this.toast.errorToastr(result['statusMsg']);
        }
      })
    }
      
      // getComplaintDetail(){
      //   console.log(this.tabType);
      //   this.skLoading = true;
      //   this.filter.status = this.tabType
      //   this.service.post_rqst({'customer_id':this.id},"ServiceTask/serviceComplaintList").subscribe((result=>
      //     {
      //       this.complaintList = result['result'];
      //       console.log('complaintList',this.complaintList);
      //       this.skLoading = false;
      //     }
      //     ));
      //   }
        back(): void {
          this.location.back()
        }
        editCustomer(){
          this.router.navigate(['add-customer/' +this.id]);
        }
        
        
      }
      