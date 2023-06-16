import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ImageModuleComponent } from 'src/app/image-module/image-module.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ChartType, ChartDataSets, ChartOptions, Chart } from 'chart.js';
import * as moment from 'moment';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Location } from '@angular/common'
import { DialogComponent } from 'src/app/dialog.component';
import { DialogService } from 'src/app/dialog.service';
import { ExportexcelService } from 'src/app/service/exportexcel.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {

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
  productImg:any =[];
  
  constructor(public location: Location, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      if(this.id){
        this.getCustomerDetail();
      }
    });
   }
  
  ngOnInit() {
  }
  
  getCustomerDetail()
  {
    this.skLoading = true;
    this.service.post_rqst({'customer_id':this.id},"ServiceCustomer/serviceCustomerDetail").subscribe((result=>
      {
        this.getData = result['result'];
        console.log('getData',this.getData);
        
        this.productImg = this.getData['img'];
        
        this.skLoading = false;
      }
      ));
      
    }
  back(): void {
    this.location.back()
  }
  editCustomer(){
    this.router.navigate(['add-customer/' +this.id]);
  }
}
  