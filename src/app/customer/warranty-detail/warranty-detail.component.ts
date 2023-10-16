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
import { WarrantyUpdateModelComponent } from 'src/app/warranty/warranty-update-model/warranty-update-model.component';


@Component({
  selector: 'app-warranty-detail',
  templateUrl: './warranty-detail.component.html',
  styleUrls: ['./warranty-detail.component.scss']
})
export class WarrantyDetailComponent implements OnInit {
  
  id;
  getData:any ={};
  skLoading:boolean = false;
  url:any;
  assign_login_data:any={};
  logined_user_data:any={};
  stateDetail:any =[];
  product_size:any =[];
  featureFlag :boolean = false;
  allMrpFlag :boolean = false;
  warrantyImg:any =[];
  
  constructor(public location: Location, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) { 
    
    
    this.url = this.service.uploadUrl + 'service_task/'
    
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      if(this.id){
        this.getWarrantyDetail();
      }
    });
  }
  
  ngOnInit() {
  }
  
  getWarrantyDetail()
  {
    this.skLoading = true;
    this.service.post_rqst({'warranty_id':this.id},"ServiceTask/serviceWarrantyDetail").subscribe((result=>
      {
        this.getData = result['result'];
        
        this.warrantyImg = this.getData['image'];
        
        this.skLoading = false;
      }
      ));
      
    }
    back(): void {
      this.location.back()
    }
    
    imageModel(image){
      const dialogRef = this.dialog.open( ImageModuleComponent, {
        panelClass:'Image-modal',
        data:{
          image,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    
    
    updateWarrantyStataus(row,warranty_period,date_of_purchase)
    {
      const dialogRef = this.dialog.open(WarrantyUpdateModelComponent, {
        width: '400px',
        panelClass: 'cs-model',
        data: {
          id: row,
          period: warranty_period,
          date_of_purchase: date_of_purchase,
          
        }
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result != false) {
          this.getWarrantyDetail();
        }
      });
    }
  }
  