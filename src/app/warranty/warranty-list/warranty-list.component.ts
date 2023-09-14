import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';
import { WarrantyUpdateModelComponent } from '../warranty-update-model/warranty-update-model.component';

@Component({
  selector: 'app-warranty-list',
  templateUrl: './warranty-list.component.html',
  styleUrls: ['./warranty-list.component.scss']
})
export class WarrantyListComponent implements OnInit {
  
  fabBtnValue: any = 'add';
  warrantyList: any = [];
  active_tab: any = 'Pending';
  filter: any ={};
  data: any = [];
  page_limit: any;
  start: any = 0;
  count: any;
  tab_count: any;
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
  
  constructor(public dialog: DialogComponent, public dialogs: MatDialog, public alert: DialogComponent, public service: DatabaseService, public rout: Router, public toast: ToastrManager, public session: sessionStorage) {
    this.downurl = service.downloadUrl
    this.page_limit = service.pageLimit;
    this.getWarrantyList('');
    console.log(this.service.pageLimit);
    console.log(this.page_limit);
    
    
    
  }
  
  ngOnInit() {
    this.filter_data = this.service.getData()

    if (this.filter_data.status) {
      this.active_tab = this.filter_data.status
    }
    
  }
  
  pervious() {
    this.start = this.start - this.page_limit;
    this.getWarrantyList('');
  }
  
  nextPage() {
    this.start = this.start + this.page_limit;
    this.getWarrantyList('');
  }
  
  refresh() {
    this.start = 0;
    this.filter_data = {};
    this.getWarrantyList('');
  }
  
  clear() {
    this.refresh();
  }
  
  goToDetailHandler(id) {
    window.open(`/customer-detail/` + id);
  }
  date_format(): void {
    this.filter_data.date_created = moment(this.filter_data.date_created).format('YYYY-MM-DD');
    this.getWarrantyList('');
  }
  
  date_format2(): void {
    this.filter_data.date_of_purchase = moment(this.filter_data.date_of_purchase).format('YYYY-MM-DD');
    this.getWarrantyList('');
  }
  
  date_format3(): void {
    this.filter_data.warranty_end_date = moment(this.filter_data.warranty_end_date).format('YYYY-MM-DD');
    this.getWarrantyList('');
  }

  date_format4(): void {
    this.filter_data.verification_on = moment(this.filter_data.verification_on).format('YYYY-MM-DD');
    this.getWarrantyList('');
  }
  
  getWarrantyList(data) {
    if (this.pagenumber > this.total_page) {
      this.pagenumber = this.total_page;
      this.start = this.pageCount - this.page_limit;
    }
    if (this.start < 0) {
      this.start = 0;
    }
    
    

    // if (this.active_tab == 'All') {
    // this.filter_data.status = this.active_tab;
    // }
    // if (this.active_tab == 'Pending') {
    //   this.filter_data.status = this.active_tab;
    // }

    // if (this.active_tab == 'Verified') {
    //   this.filter_data.status = this.active_tab;
    // }

    // if (this.active_tab == 'Reject') {
    //   this.filter_data.status = this.active_tab;
    // }
    console.log(this.page_limit);
    
    let header = this.service.post_rqst({ 'filter': this.filter_data, 'start': this.start, 'pagelimit': this.page_limit }, "ServiceTask/serviceWarrantyList")
    
    this.loader = true;
    header.subscribe((result) => {
      if (result['statusCode'] == 200) {
        
        console.log('result',result);
        
        
        this.warrantyList = result['result'];
        console.log(this.warrantyList);
        
        this.pageCount = result['count'];
        console.log(this.pageCount);
        
        this.tab_count = result['tab_count'];
        console.log(this.tab_count);

        this.loader = false;
        if (this.warrantyList.length == 0) {
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
        
        
        for (let i = 0; i < this.warrantyList.length; i++) {
          if (this.warrantyList[i].status == '1') {
            this.warrantyList[i].newStatus = true
          }
          else if (this.warrantyList[i].status == '0') {
            this.warrantyList[i].newStatus = false;
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

  // updateWarrantyStataus(row)
  // {
  //   const dialogRef = this.dialogs.open(WarrantyUpdateModelComponent, {
  //       width: '400px',
  //       panelClass: 'cs-model',
  //       data: {
  //         id: row,
  //       }
  //     });
      
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result != false) {
  //         // this.getComplaintDetail();
  //       }
  //     });
  //   }
  
  
  downloadExcel() {
    this.service.post_rqst({ 'filter': this.filter_data }, "Excel/service_warranty_list").subscribe((result => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.getWarrantyList('');
      } else {
      }
    }));
  }
  
}
