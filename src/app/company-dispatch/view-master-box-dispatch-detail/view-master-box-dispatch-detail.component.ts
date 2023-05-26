import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { AddGrandMasterBoxComponent } from '../add-grand-master-box/add-grand-master-box.component';

@Component({
  selector: 'app-view-master-box-dispatch-detail',
  templateUrl: './view-master-box-dispatch-detail.component.html',
  styleUrls: ['./view-master-box-dispatch-detail.component.scss']
})
export class ViewMasterBoxDispatchDetailComponent implements OnInit {
  loader:boolean=false;
  smallBoxlisting:any=[]
  viewType:any;
  constructor(@Inject(MAT_DIALOG_DATA)public data,  public toast:ToastrManager, public serve:DatabaseService,  public dialog:MatDialog,) { }

  ngOnInit() {
    console.log(this.data);
    this.viewType=this.data.type
    this.getMasterboxdata()
    
  }
  getMasterboxdata(){
    this.loader=true;
    this.serve.post_rqst({'data':{'id':this.data.main_data.id,'type':this.viewType}},"Dispatch/fetchMasterGrandCouponDetail").subscribe((result)=>{
        
      if(result['statusCode']==200)
      {
        this.loader=false
        this.smallBoxlisting=result['master_grand_coupon']
      }else{
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }
  changeMasterbox(data,type){
    const dialogRef = this.dialog.open(AddGrandMasterBoxComponent,{
      width:'500px',
      data:{
        data,
        type
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      // this.billDatadetail();
      this.getMasterboxdata()
      
    }); 
  }

  closeDialog(){
    this.dialog.closeAll()
  }
}
