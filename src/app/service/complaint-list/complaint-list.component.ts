import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.scss']
})
export class ComplaintListComponent implements OnInit {
  fabBtnValue: any = 'add';
  segmentList: any = [];
  SubcategoryList: any = [];
  complaintList: any = [];
  filter: any = false;
  data: any = [];
  page_limit: any;
  start: any = 0;
  count: any;
  total_page: any = 0;
  pagenumber: any = 0;
  loader: boolean = false;
  active_tab: any = 'all';
  sub_active_tab: any = '';
  tab_count: any;
  scheme_active_count: any;
  filter_data: any = {};
  today_date: Date;
  excelLoader: boolean = false;
  pageCount: any;
  sr_no: number;
  datanotofound: boolean = false;
  downurl: any = ''


  constructor(public dialog: DialogComponent, public dialogs: MatDialog, public alert: DialogComponent, public service: DatabaseService, public rout: Router, public toast: ToastrManager, public session: sessionStorage) { 
    this.downurl = service.downloadUrl
    this.page_limit = service.pageLimit;
    this.getComplantList('');


  }

  ngOnInit() {
    this.filter_data = this.service.getData()
    this.getComplantList('');

    if (this.filter_data.status) {
      this.active_tab = this.filter_data.status
    }

    if (this.filter_data.status) {
      this.sub_active_tab = this.filter_data.status
    }
  }
  
  pervious() {
    this.start = this.start - this.page_limit;
    this.getComplantList('');
  }
  
  nextPage() {
    this.start = this.start + this.page_limit;
    this.getComplantList('');
  }
  
  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.getComplantList('');
  }
  
  clear() {
    this.refresh();
  }
  
  goToDetailHandler(id) {
    window.open(`/complaint-detail/` + id);
  }
  date_format(): void {
    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    this.getComplantList('');
  }
  
  getComplantList(data) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }


    if (this.active_tab == 'All') {
      this.filter_data.status = this.active_tab;
      }
      if (this.active_tab == 'Pending') {
        this.filter_data.status = this.active_tab;
      }

      if (this.active_tab == 'Cancel') {
        this.filter_data.status = this.active_tab;
      }
  
      if (this.active_tab == 'Close') {
        this.filter_data.status = this.active_tab;
      }

      if (this.sub_active_tab == 'Carpenter_Not_Assigned') {
        this.filter_data.status = this.sub_active_tab;
      }

      if (this.sub_active_tab == 'Carpenter_Assigned') {
        this.filter_data.status = this.sub_active_tab;
      }

      if (this.sub_active_tab == 'Inspection_Complete') {
        this.filter_data.status = this.sub_active_tab;
      }
      if (this.sub_active_tab == 'Replacement_Pending') {
        this.filter_data.status = this.sub_active_tab;
      }
      if (this.sub_active_tab == 'Sparepart_Pending') {
        this.filter_data.status = this.sub_active_tab;
      }

      if (this.sub_active_tab == 'Closed_By_Service') {
        this.filter_data.status = this.sub_active_tab;
      }

      if (this.sub_active_tab == 'Closed_By_Replacement') {
        this.filter_data.status = this.sub_active_tab;
      }

      if (this.sub_active_tab == 'Return_Pending') {
        this.filter_data.status = this.sub_active_tab;
      }
      if (this.sub_active_tab == 'Feedback_Complete') {
        this.filter_data.status = this.sub_active_tab;
      }

    let header = this.service.post_rqst({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }, "ServiceTask/serviceComplaintList")
    
    this.loader = true;
    header.subscribe((result) => {
      if (result['statusCode'] == 200) {
        
        console.log('result',result);
        
        
        this.complaintList = result['result'];
        console.log(this.complaintList);
        
        this.pageCount = result['count'];
        this.tab_count = result['tab_count'];
        this.scheme_active_count = result['scheme_active_count'];
        this.loader = false;
        if (this.complaintList.length == 0) {
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
        
        
        for (let i = 0; i < this.complaintList.length; i++) {
          if (this.complaintList[i].status == '1') {
            this.complaintList[i].newStatus = true
          }
          else if (this.complaintList[i].status == '0') {
            this.complaintList[i].newStatus = false;
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
    this.service.post_rqst({ 'filter': this.filter_data }, "Excel/service_complaint_list").subscribe((result => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.getComplantList('');
      } else {
      }
    }));
  }

  rejectComplaint(){
    
  }
}
