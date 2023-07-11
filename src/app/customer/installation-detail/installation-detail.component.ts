import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common'
import { DialogComponent } from 'src/app/dialog.component';
import { DialogService } from 'src/app/dialog.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';

@Component({
  selector: 'app-installation-detail',
  templateUrl: './installation-detail.component.html',
  styleUrls: ['./installation-detail.component.scss']
})
export class InstallationDetailComponent implements OnInit {
  id;
  getData:any ={};
  add_list:any ={};
  skLoading:boolean = false;
  url:any;
  assign_login_data:any={};
  logined_user_data:any={};
  stateDetail:any =[];
  product_size:any =[];
  featureFlag :boolean = false;
  allMrpFlag :boolean = false;
  complaintImg:any =[];
  fabBtnValue: any = 'excel';
  loader: boolean = false;


  
  
  constructor(public location: Location, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {

    this.url = this.service.uploadUrl + 'service_task/'
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      if(this.id){
        this.getInstallationDetail();
      }
    });
  }
  
  ngOnInit() {
  }
  
  getInstallationDetail()
  {
    this.skLoading = true;
    this.service.post_rqst({'complaint_id':this.id},"ServiceTask/serviceInstallationDetail").subscribe((result=>
      {
        this.getData = result['result'];
        console.log('getData',this.getData);
        this.add_list = this.getData['add_list'];
        console.log('add_list',this.add_list);
        this.skLoading = false;
      }
      ));
      
    }
    
    imageModel(image){
      const dialogRef = this.dialog.open( ImageModuleComponent, {
        panelClass:'Image-modal',
        data:{
          image,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    }


    back(): void {
      this.location.back()
    }
    
  }
  
