import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-attendancemodal',
  templateUrl: './attendancemodal.component.html',
  styleUrls: ['./attendancemodal.component.scss']
})
export class AttendancemodalComponent implements OnInit {
  savingFlag: boolean = false;
  leaveTypeList: any = [];
  constructor(@Inject(MAT_DIALOG_DATA) public modelData: any, public dialog: MatDialogRef<AttendancemodalComponent>, public navparams: ActivatedRoute, public toast: ToastrManager, public serve: DatabaseService) {
    console.log(modelData);

    if (modelData.from == 'attendence_absent') {
      this.getLeaveTypes()
    }

  }


  getLeaveTypes() {
    this.serve.post_rqst({}, 'Attendance/leaveType').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.leaveTypeList = resp['result']
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
    })
  }

  ngOnInit() {
  }

  changeStatus(attendenceStatus) {
    this.savingFlag = true;
    if (attendenceStatus == 'mark_attendance') {
      this.serve.post_rqst({ 'data': this.modelData }, "Attendance/markPresent").subscribe((result) => {
        if (result['statusCode'] == 200) {
          this.toast.successToastr(result['statusMsg']);
          this.dialog.close(true);
          this.savingFlag = false;
        } 
        else if (result['statusCode'] == 400 && result['statusMsg'] == 'Stop Time is Mendatory!') {
          this.toast.errorToastr(result['statusMsg']);
          this.savingFlag = false;
        }
        else {
          this.savingFlag = false;
          this.toast.errorToastr(result['statusMsg']);
          this.dialog.close();
        }
      });
    } else {
      this.serve.post_rqst({ 'data': this.modelData }, "Attendance/markLeave").subscribe((result) => {
        if (result['statusCode'] == 200) {
          this.toast.successToastr(result['statusMsg']);
          this.dialog.close(true);
          this.savingFlag = false;
        } else {
          this.savingFlag = false;
          this.toast.errorToastr(result['statusMsg']);
          this.dialog.close();
        }
      });
    }




  }


}
