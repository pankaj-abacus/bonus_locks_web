import { Component, OnInit } from '@angular/core';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-c-p-sales-report',
  templateUrl: './c-p-sales-report.component.html',
  styleUrls: ['./c-p-sales-report.component.scss']
})
export class CPSalesReportComponent implements OnInit {

  skelation: any = new Array(10);
  assign_login_data2: any;
  data: any;
  search: any = {};
  cpTargetReport: any = [];
  cpTargetReport2: any = [];
  loader: boolean = false;
  get12MonthArray: any = [];
  pagenumber: any = 0;
  total_page: any = 0;
  start: any = 0;
  page_limit: any = 50;
  pagination_count: any = 0
  assign_login_data:any={};
  logined_user_data:any={};
  // bottomSheet: any;
  constructor(private bottomSheet: MatBottomSheet, public service: DatabaseService, public toast: ToastrManager , public session:sessionStorage) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;
    let monthsRequired = 11
    for (let i = 0; i <= monthsRequired; i++) {
      this.get12MonthArray.push(moment().add(i, 'months').format('MMMM YYYY'))
    }
    this.getPrimartTargetReport();
  }

  ngOnInit() {
  }
  refresh() {
    this.search = {};
    this.start = 0;
    this.getPrimartTargetReport();
  }

  getPrimartTargetReport() {
    this.loader = true;
    this.service.post_rqst({ 'search': this.search, 'start': this.start, 'pagelimit': this.page_limit }, 'Reports/cpSalesReports').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.loader = false;
        this.cpTargetReport = resp['result'];
        this.pagination_count = resp['cp_sales_count'];
        this.total_page = Math.ceil(this.pagination_count / this.page_limit);
        this.pagenumber = Math.ceil(this.start / this.page_limit) + 1;
      }
      else {
        this.loader = false;
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr(err);
    })
  }

  searchCompany(company_name) {
    company_name = company_name.toLowerCase();
    let tempSearch = '';
    this.cpTargetReport = [];

    for (let i = 0; i < this.cpTargetReport2.length; i++) {
      tempSearch = this.cpTargetReport2[i].company_name.toLowerCase();

      if (tempSearch.includes(company_name)) {
        this.cpTargetReport.push(this.cpTargetReport2[i])
      }

    }

  }


  downloadExcel() {
    this.loader = true;
    this.service.post_rqst({ 'search': this.search, 'start': this.start, 'pagelimit': this.page_limit }, "Excel/cpSalesReports")
      .subscribe(((result: any) => {
        if (result['msg'] == true) {
          this.loader = false;
          window.open(this.service.downloadUrl+result['filename']);
        } else {
          this.loader = false;
        }
      }));
  }




}

