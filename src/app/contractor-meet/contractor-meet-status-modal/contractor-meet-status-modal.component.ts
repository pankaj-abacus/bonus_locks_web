import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import { Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-contractor-meet-status-modal',
  templateUrl: './contractor-meet-status-modal.component.html'
})
export class ContractorMeetStatusModalComponent implements OnInit {
  savingFlag: boolean = false;
  statusdata: any = {};
  data1: any;
  login_data: any = {};
  selectedStatus: any = {};
  from: any = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data, public session: sessionStorage, public serve: DatabaseService, public dialog: MatDialog, public rout: Router, public alert: DialogComponent, public toast: ToastrManager, public dialogRef: MatDialogRef<ContractorMeetStatusModalComponent>) {
    console.log(data);
    this.data1 = data;
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    this.from = data.from;

  }

  ngOnInit() {
  }
  updateDetails() {
    this.savingFlag = true;
    this.statusdata.status_changed_by = this.login_data.id;
    this.statusdata.id = this.data1.id;
    this.serve.post_rqst(this.statusdata, "Event/statusChange").subscribe((result => {
      this.dialog.closeAll();
      this.savingFlag = false;
    }))
  }

  updatePerBudget() {
    this.savingFlag = true;
    this.statusdata.status_changed_by = this.login_data.id;
    this.statusdata.id = this.data1.id;
    this.statusdata.per_plumber_budget = this.data.per_plumber_budget;
    this.serve.post_rqst(this.statusdata, "Event/perPlumberBudgets").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dialogRef.close(true);
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      } else {
        this.toast.errorToastr(result['statusMsg']);

      }

    }))
  }
}
