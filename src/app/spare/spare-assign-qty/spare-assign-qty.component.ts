import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';

@Component({
  selector: 'app-spare-assign-qty',
  templateUrl: './spare-assign-qty.component.html',
  styleUrls: ['./spare-assign-qty.component.scss']
})
export class SpareAssignQtyComponent implements OnInit {

  formData:any={}
  engineerList: any = [];
  savingFlag:boolean = false;
  constructor(public service: DatabaseService,public rout: Router,public toast: ToastrManager,private route: ActivatedRoute,public dialog: DialogComponent,public dialog2: MatDialog) { }

  ngOnInit() {
    this.assign_engineerget('');
  }

  filter: any = {};
  assign_engineerget(searcValue) {
    this.filter.technician_detail = searcValue;
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
        this.formData.id= this.engineerList[index].id;
        this.formData.name= this.engineerList[index].name;
        this.formData.mobile_no= this.engineerList[index].mobile_no;
      }
      console.log(this.formData.id);
      console.log(this.formData.mobile_no);
      console.log(this.formData.name);
    }
  }

}
