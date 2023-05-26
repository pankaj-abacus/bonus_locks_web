import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DialogComponent } from 'src/app/dialog.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
// import { SupportStatusComponent } from '../support-status/support-status.component';

import { sessionStorage } from 'src/app/localstorage.service';

import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-survey-result',
  templateUrl: './survey-result.component.html',
  styleUrls: ['./survey-result.component.scss']
})
export class SurveyResultComponent implements OnInit {

  surveyId: any = '';
  pagelimit: any = 50;
  surveyResult: any = [];
  surveyAnswerList: any = [];
  loader: boolean = false;
  pageCount: any;
  total_page: any;
  pagenumber: any = 0;
  start: any = 0;
  downurl: any = '';
  surveyResultQuestions: any = [];
  assign_login_data2: any = [];
  id: any;
  downloadingloader: boolean = false;

  constructor(public route: ActivatedRoute, public service: DatabaseService, public toast: ToastrManager, public dialog: MatDialog, public alert: DialogComponent, public session: sessionStorage) {
    this.assign_login_data2 = this.session.getSession();
    this.assign_login_data2 = this.assign_login_data2.value;
    this.assign_login_data2 = this.assign_login_data2.data;
    this.downurl = service.downloadUrl


    this.route.params.subscribe(params => {
      this.id = params.id;
    });
    // this.surveyId = modelData.rowData.id;
    // this.comes_from = modelData.from;
    // if (this.comes_from == "survey_result") {
    this.getSurveyResult();
    // } else {
    // this.getSurveyDetail();

  }

  ngOnInit() {
  }

  pervious() {
    this.start = this.start - this.pagelimit;
    this.getSurveyResult();
  }

  nextPage() {
    this.start = this.start + this.pagelimit;
    this.getSurveyResult();
  }

  back() {
    window.history.back();
  }

  refresh() {
    this.getSurveyResult();
  }


  getSurveyResult() {
    this.loader = true;
    this.service.post_rqst({ 'id': this.id, 'start': this.start, 'pagelimit': this.pagelimit }, "Survey/surveyReport").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.loader = false;
        this.surveyResult = result['result'];
        // this.surveyResultQuestions = result['result']['questions'];
        for (let x = 0; x < this.surveyResult.length; x++) {
          this.surveyResultQuestions = Object.keys(this.surveyResult[x].surveydata);
          this.surveyResult[x].answer = Object.values(this.surveyResult[x].surveydata)
        }


        console.log()
        this.pageCount = result['count'];
        this.pagenumber = Math.ceil(this.start / this.pagelimit) + 1;
        this.total_page = Math.ceil(this.pageCount / this.pagelimit);
      } else {
        this.loader = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.loader = false;
      this.toast.errorToastr('Something went wrong');
    });
  }



  downloadExcel() {
    this.loader = true;
    this.downloadingloader = true;
    this.service.post_rqst({ 'id': this.id }, "Excel/survey_report").subscribe((result) => {
      if (result['msg'] == true) {
        this.downloadingloader = false;
        this.loader = false;
        window.open(this.downurl + result['filename']);
      }
    }, () => { this.downloadingloader = false; });
  }

}
