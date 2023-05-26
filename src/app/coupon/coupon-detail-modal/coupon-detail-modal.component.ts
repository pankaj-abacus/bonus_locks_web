import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-coupon-detail-modal',
  templateUrl: './coupon-detail-modal.component.html',
  styleUrls: ['./coupon-detail-modal.component.scss']
})
export class CouponDetailModalComponent implements OnInit {
  couponList:any =[];
  userData
  savingFlag:boolean=false;
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog,public service:DatabaseService, public session: sessionStorage,public toast:ToastrManager, public dialogRef: MatDialogRef<CouponDetailModalComponent>) { 
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    if(this.data.id){
      this.getCouponList();
    }
  }
  
  ngOnInit() {
  }

  getCouponList() 
  {
    this.service.post_rqst({'id':this.data.id},"CouponCode/checkCouponCodeDetailForSubCoupon").subscribe((result=>
      {

        if (result['statusCode'] == 200){
          this.couponList=result['result'];
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }
      ));
      
    }
    
    submit() {
      this.savingFlag = true;
      this.data.create_by_id=this.userData.data.id;
      this.data.created_by_name=this.userData.data.name;
      this.service.post_rqst({ 'data': this.data  }, "CouponCode/updateScanLimit").subscribe((response) => {
        if (response['statusCode'] == "200") {
          this.toast.successToastr(response['statusMsg']);
          this.dialogRef.close(true);
          this.savingFlag = false;
        }
        else {
          this.toast.errorToastr(response['statusMsg']);
          this.savingFlag = false;

        }
      },err=>{
        this.savingFlag = false;
      });
    }
  
}
