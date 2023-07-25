import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { AddComplaintRemarkComponent } from 'src/app/add-complaint-remark/add-complaint-remark.component';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-add-installation-remark',
  templateUrl: './add-installation-remark.component.html',
  styleUrls: ['./add-installation-remark.component.scss']
})
export class AddInstallationRemarkComponent implements OnInit {
  id;
  savingFlag:boolean = false;

  form_data:any={};

  constructor(@Inject(MAT_DIALOG_DATA) public data,public dialogRef: MatDialogRef<AddComplaintRemarkComponent>,public service: DatabaseService,public toast: ToastrManager,public alert:DialogComponent,public dialog:MatDialog) { }

  ngOnInit() {
  }

  submit() {
    // this.userCheck = false;
    this.savingFlag = true;
    this.service.post_rqst({'complaint_id':this.data.id,'msg':this.form_data.msg}, "ServiceTask/addComplaintRemark").subscribe((result => {
      if(result['statusCode'] == 200){
        this.toast.successToastr(result['statusMsg']);
        this.dialog.closeAll();
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
    
  }

}
