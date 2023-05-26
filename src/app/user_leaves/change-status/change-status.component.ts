import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DatabaseService } from 'src/_services/DatabaseService';
import {  sessionStorage} from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-change-status',
  templateUrl: './change-status.component.html',
  styleUrls: ['./change-status.component.scss']
})
export class ChangeStatusComponent implements OnInit {
  userData: any;
  userId: any;
  savingFlag:boolean = false;
  userName: any;
  constructor(@Inject(MAT_DIALOG_DATA)public data,public dialog:MatDialog, public session: sessionStorage,public serve:DatabaseService,public toast:ToastrManager)
  {
    console.log(data);
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
  }
  
  ngOnInit()
  {
  }
  
  changeStatus()
  {
    
    this.savingFlag = true;
    this.serve.post_rqst({'reason':this.data.reason,'status':this.data.status,'from':this.data.from,'leaveApprovedCount':this.data.leave_approved_count, 'id':this.data.id,'uid':this.userId,'uname':this.userName},"Leaves/statusChange").subscribe((result=>{
      
      if(result['statusCode']==200)
      {
        this.toast.successToastr(result['statusMsg']);
        this.dialog.closeAll();
        this.savingFlag = false;
      }else{
        this.savingFlag = false;
        this.toast.errorToastr(result['statusMsg']);
        this.dialog.closeAll();
      }
    }))
    this.dialog.closeAll();
    
  }
  
}
