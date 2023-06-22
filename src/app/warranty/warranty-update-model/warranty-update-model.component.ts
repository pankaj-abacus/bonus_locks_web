import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';


@Component({
  selector: 'app-warranty-update-model',
  templateUrl: './warranty-update-model.component.html',
  styleUrls: ['./warranty-update-model.component.scss']
})
export class WarrantyUpdateModelComponent implements OnInit {

  formData:any={}
  savingFlag: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, public serve: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<WarrantyUpdateModelComponent>) { }

  ngOnInit() {
  }

  update() {
    this.savingFlag = true;
    this.serve.post_rqst({ 'id': this.data.id, 'data': this.formData }, "Travel/drChange").subscribe((result => {
      if (result['statusCode'] == 200) {

        this.dialogRef.close(true);
        this.savingFlag = false;
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg'])
      }
    }))
  }

}
