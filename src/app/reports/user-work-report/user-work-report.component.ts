import { Component, OnInit } from '@angular/core';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-user-work-report',
  templateUrl: './user-work-report.component.html',
  styleUrls: ['./user-work-report.component.scss']
})
export class UserWorkReportComponent implements OnInit {
  skelation: any = new Array(10);
  assign_login_data2: any;
  data: any;
  userWorkReport: any = [];
  loader: boolean = false;
  get12MonthArray: any = [];
  datanotfound: boolean = false;
  filter: any = {}
  today_date: any = new Date()
  assign_login_data:any={};
  logined_user_data:any={};
  activeTab: any = 'daily'
  // bottomSheet: any;
  constructor(private bottomSheet: MatBottomSheet, public service: DatabaseService, public toast: ToastrManager , public session:sessionStorage) {
    this.assign_login_data = this.session.getSession();
    this.logined_user_data = this.assign_login_data.value.data;

    let monthsRequired = 11
    for (let i = 0; i <= monthsRequired; i++) {
      this.get12MonthArray.push(moment().add(i, 'months').format('MMMM YYYY'))
    }
    this.getPrimartTargetReport(this.activeTab);
  }

  ngOnInit() {
  }

  refresh() {
    this.getPrimartTargetReport(this.activeTab);
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomSheetComponent, {
      data: {
        'filterPage': 'userWorkReport',
      }
    });
    this.bottomSheet._openedBottomSheetRef.afterDismissed().subscribe((data) => {
      console.log(data);
      this.filter.date_to = data.date_to;
      this.filter.date_from = data.date_from;
      this.getPrimartTargetReport(this.activeTab)
    })
  }

  getCurrentMonth(activeTab) {
    let date = new Date();
    this.filter.date_from = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
    this.filter.date_to = moment(date).format('YYYY-MM-DD');
    this.getPrimartTargetReport(activeTab);
  }

  getPrimartTargetReport(activeTab) {
    this.loader = true;
    this.service.post_rqst({ 'reportType': activeTab, 'filter': this.filter }, 'Reports/userWorkReport').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.loader = false;
        this.userWorkReport = resp['result'];
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
  downloadExcel() {
    this.loader = true;
    this.service.post_rqst({ 'reportType': this.activeTab, 'filter': this.filter }, "Excel/userWorkReport")
      .subscribe(((result: any) => {
        if (result['msg'] == true) {
          this.loader = false;
          window.open(this.service.downloadUrl+ result['filename']);
        } else {
          this.loader = false;
        }
      }));
  }




}


