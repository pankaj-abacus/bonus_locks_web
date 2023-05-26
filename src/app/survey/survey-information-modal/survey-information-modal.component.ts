import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-survey-information-modal',
  templateUrl: './survey-information-modal.component.html',
  styleUrls: ['./survey-information-modal.component.scss']
})
export class SurveyInformationModalComponent implements OnInit {

  skLoading: boolean = false;
  savingFlag: boolean = false;
  surveyId: any = '';
  surveyAnswerList: any = [];
  surveyResult: any = [];
  surveyResultQuestions: any = [];
  pagelimit: any = 50;
  comes_from: any = '';
  assign_login_data2: any;
  downurl: any
  constructor(@Inject(MAT_DIALOG_DATA) public modelData, public dialog: MatDialog, public serve: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<SurveyInformationModalComponent>) {
    console.log(modelData);

    this.assign_login_data2 = this.session.getSession();
    this.assign_login_data2 = this.assign_login_data2.value;
    this.assign_login_data2 = this.assign_login_data2.data;
    this.downurl = serve.downloadUrl

    this.surveyId = modelData.rowData.id;
    this.comes_from = modelData.from;
    if (this.comes_from == "survey_result") {
      this.getSurveyResult();
    } else {
      this.getSurveyDetail();
    }
  }

  ngOnInit() {
  }

  getSurveyDetail() {
    this.skLoading = true;
    this.serve.post_rqst({ 'id': this.surveyId, 'start': this.surveyAnswerList.length, 'pagelimit': this.pagelimit }, "Survey/answerList").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        this.surveyAnswerList = this.surveyAnswerList.concat(result['result']);
      } else {
        this.skLoading = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.skLoading = false;
      this.toast.errorToastr('Something went wrong');
    });
  }

  getSurveyResult() {
    this.skLoading = true;
    this.serve.post_rqst({ 'id': this.surveyId, 'start': this.surveyResult.length, 'pagelimit': this.pagelimit }, "Survey/surveyReport").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        this.surveyResult = this.surveyAnswerList.concat(result['result']['Answers']);
        this.surveyResultQuestions = result['result']['questions']

      } else {
        this.skLoading = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.skLoading = false;
      this.toast.errorToastr('Something went wrong');
    });
  }

  downloadExcel() {
    this.skLoading = true;
    this.serve.post_rqst({ 'id': this.surveyId }, "Excel/allownceCsv").subscribe((result) => {
      if (result['msg'] == true) {
        window.open(this.downurl + result['filename'])
        this.dialog.closeAll();
      }
    });
  }

}
