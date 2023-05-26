import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-add-grand-master-box',
  templateUrl: './add-grand-master-box.component.html',
  styleUrls: ['./add-grand-master-box.component.scss']
})
export class AddGrandMasterBoxComponent implements OnInit {
  filter: any = {};
  masterboxData:any=[];
  savingFlag:boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA)public data,  public toast:ToastrManager, public serve:DatabaseService,  public dialog:MatDialogRef<AddGrandMasterBoxComponent>,) { }

  ngOnInit() {
    console.log(this.data);
    if (this.data.type=='edit') {
      this.getmasterbox('',this.data.invoice_number)
    }
  }

  SaveMasterboxes(){ 
    this.savingFlag = true;   
      this.serve.post_rqst({'data':this.data},"Dispatch/genrateMasterGrandCoupon").subscribe((result)=>{
        
        if(result['statusCode']==200)
        {
          this.savingFlag = false;
          this.toast.successToastr(result['statusMsg']);
          this.dialog.close(true);
        }else{
          this.savingFlag = false;
          this.toast.errorToastr(result['statusMsg']);
        }
      })
  }
  getmasterbox(searcValue,bill_number) {
    console.log(searcValue,bill_number);
    
    this.filter.coupon_code =searcValue;
    this.serve.post_rqst({ 'data':{'filter': this.filter,'bill_number':bill_number} }, 'Dispatch/fetchMasterGrandCouponDropdown').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.masterboxData = resp['master_grand_coupon'];
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, error => {
    })
  }
  checkqty(qty){
    if (qty>100) {
      this.data.total_coupon='';
      this.toast.errorToastr('Maximum no. of boxes should not be greater than 100');

    }
    else{
      console.log('Valid Qty.');
      
    }
  }
}
