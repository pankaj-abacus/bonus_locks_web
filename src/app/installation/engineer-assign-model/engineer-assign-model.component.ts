import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';

@Component({
  selector: 'app-engineer-assign-model',
  templateUrl: './engineer-assign-model.component.html',
  styleUrls: ['./engineer-assign-model.component.scss']
})
export class EngineerAssignModelComponent implements OnInit {
  data2:any={}
  engineerList: any = [];
  id;
  savingFlag:boolean = false;

  
  
  constructor(@Inject(MAT_DIALOG_DATA) public data,public dialogRef: MatDialogRef<EngineerAssignModelComponent>,public service: DatabaseService,public toast: ToastrManager,public alert:DialogComponent,public dialog:MatDialog) { 
    console.log(this.data.state);
    
  }
  
  ngOnInit() {
    this.assign_engineerget('');
  }
  
  filter: any = {};
  assign_engineerget(searcValue) {
    this.filter.technician_detail = searcValue;
    this.filter.state = this.data.state;
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
  
  getCarpenterInfo(id)
  {
    console.log(id);
    
    if(id){
      let index= this.engineerList.findIndex(d=> d.id==id);
      if(index!=-1){
        this.data2.id= this.engineerList[index].id;
        this.data2.name= this.engineerList[index].name;
        this.data2.mobile_no= this.engineerList[index].mobile_no;
      }
      console.log(this.data2.id);
      console.log(this.data2.mobile_no);
      console.log(this.data2.name);
    }
  }
  
  
  assign_engineer(){   
    console.log(this.id);
    this.savingFlag = true;
    this.service.post_rqst({'complaint_id':this.data.id,'data':this.data2},"ServiceTask/carpenterAssign").subscribe((result)=>{
      if(result['statusCode']==200)
      {
        this.dialogRef.close(true);
        this.toast.successToastr(result['statusMsg']);
      }else{
        this.toast.errorToastr(result['statusMsg']);
    this.savingFlag = false;

      }
    })
  }
  
}
