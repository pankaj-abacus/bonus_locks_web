import { Component, OnInit } from '@angular/core';
import { BottomSheetComponent } from 'src/app/bottom-sheet/bottom-sheet.component';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';


@Component({
  selector: 'app-primary-target-report',
  templateUrl: './primary-target-report.component.html',
  styleUrls: ['./primary-target-report.component.scss']
})
export class PrimaryTargetReportComponent implements OnInit {
  skelation: any = new Array(10);
  assign_login_data2: any;
  downurl: any;
  data: any;
  search: any;
  primaryTargetReport: any = [];
  loader: boolean = false;
  get12MonthArray: any = [];
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
    this.getPrimartTargetReport();

  }

  getPrimartTargetReport() {
    this.loader = true;
    this.service.post_rqst({ 'search': this.search }, 'Reports/primaryTargetReport').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.loader = false;
        this.primaryTargetReport = resp['result'];

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
    this.service.post_rqst({'search': this.search}, "Excel/primaryTargetReport").subscribe(((result) => {
      if (result['msg'] == true) {
        this.loader = false;
        window.open(this.service.downloadUrl+result['filename']);

      } else {
        this.loader = false;

      }

    }));
  }




}

