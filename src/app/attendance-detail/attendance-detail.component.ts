import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { ImageModuleComponent } from '../image-module/image-module.component';
import { sessionStorage } from '../localstorage.service';

@Component({
  selector: 'app-attendance-detail',
  templateUrl: './attendance-detail.component.html'
})
export class AttendanceDetailComponent implements OnInit {
  skLoading: boolean = false;
  attendance_data: any = {};
  checkin_data: any = [];
  url: any;
  assign_login_data2: any = {};
  editStartTime: boolean = false;
  editStopTime: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogs: MatDialog, public toast: ToastrManager, public service: DatabaseService, public session: sessionStorage, public dialog: DialogComponent, public dialogRef: MatDialogRef<AttendanceDetailComponent>) {
    this.getDetails();
    this.url = this.service.uploadUrl + 'attendence/';
    this.assign_login_data2 = this.session.getSession();
    this.assign_login_data2 = this.assign_login_data2.value;
    this.assign_login_data2 = this.assign_login_data2.data;
  }

  ngOnInit() {
    this.service.currentUserID = this.data.attendance_id
  }

  close() {
    this.dialogRef.close();
  }

  getDetails() {
    this.skLoading = true;
    this.service.post_rqst({ 'attendance_id': this.data.attendance_id, 'user_id': this.data.user_id, 'date': this.data.date }, "Attendance/attendenceForTravelDetail")
      .subscribe((result => {
        if (result['statusCode'] == 200) {
          this.attendance_data = result['result'];
          this.checkin_data = this.attendance_data['check_in_data'];
          this.skLoading = false;
        } else {
          this.toast.errorToastr(result['statusMsg'])
          this.skLoading = false;
        }
      }))
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

  markAbsent(attenData) {
    this.dialog.confirm("You Want To  Mark Absent !").then((result) => {
      if (result) {
        this.service.post_rqst({ 'id': attenData.id, 'manual_absent': attenData.manual_absent }, "Attendance/markAbsent")
          .subscribe(resp => {
            if (resp['statusCode'] == 200) {
              this.toast.successToastr(resp['statusMsg']);
              this.getDetails()
            }
            else {
              this.toast.errorToastr(resp['statusMsg']);
            }
          });
      }
    })
  }

  saveNewStartTime(action) {
    let attendanceData = {}
    let msg = '';
    if (action == 'editStartTime') {
      attendanceData = {
        'type': 'start_time',
        'start_time': this.attendance_data.start_time,
        'updated_by_id': this.assign_login_data2.id,
        'updated_by_name': this.assign_login_data2.name
      }
      msg = "You Want To  Start Attendence !"
    } else {
      attendanceData = {
        'type': 'stop_time',
        'stop_time': this.attendance_data.stop_time,
        'updated_by_id': this.assign_login_data2.id,
        'updated_by_name': this.assign_login_data2.name
      }
      msg = "You Want To  Stop Attendence !"
    }

    this.dialog.confirm(msg).then((result) => {
      if (result) {
        this.service.post_rqst({ 'id': this.attendance_data.id, attendanceData }, "Attendance/editAttendenceTime")
          .subscribe(resp => {
            if (resp['statusCode'] == 200) {
              this.toast.successToastr(resp['statusMsg']);
              this.getDetails()
            }
            else {
              this.toast.errorToastr(resp['statusMsg']);
            }
          });
      }
    });
    this.editStartTime = false;
    this.editStopTime = false;
  }

}
