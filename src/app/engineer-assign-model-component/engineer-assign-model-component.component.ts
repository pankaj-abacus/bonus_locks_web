import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from '../dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-engineer-assign-model-component',
  templateUrl: './engineer-assign-model-component.component.html',
  styleUrls: ['./engineer-assign-model-component.component.scss']
})
export class EngineerAssignModelComponentComponent implements OnInit {
  
  data:any={}
  engineerList: any = [];
  
  
  constructor(public service: DatabaseService,public toast: ToastrManager,public alert:DialogComponent,public dialog:MatDialog) { }

  
  ngOnInit() {
    this.assign_engineerget('');
  }
  
  filter: any = {};
  assign_engineerget(searcValue) {
    this.filter.engineer_name = searcValue;
    this.service.post_rqst({ 'filter': this.filter, }, 'ServiceTask/plumberList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.engineerList = resp.data;
        console.log(this.engineerList);
      }
      else {
        this.toast.errorToastr(resp['statusMsg'])
      }
    }, error => {
    })
  }
  
  assign_engineer(){ 
    this.service.post_rqst(this.data,"Expense/updateStatus").subscribe((result)=>{
      
      if(result['statusCode']==200)
      {
        this.toast.successToastr(result['statusMsg']);
        this.dialog.closeAll();
      }else{
        this.toast.errorToastr(result['statusMsg']);
      }
    })
  }
  
}
