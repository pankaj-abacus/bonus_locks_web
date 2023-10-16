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
import { EngineerAssignModelComponentComponent } from 'src/app/engineer-assign-model-component/engineer-assign-model-component.component';
import { AddComplaintRemarkComponent } from 'src/app/add-complaint-remark/add-complaint-remark.component';
import { EngineerAssignModelComponent } from 'src/app/installation/engineer-assign-model/engineer-assign-model.component';
import { ComplaintUpdateModelComponent } from '../complaint-update-model/complaint-update-model.component';

@Component({
  selector: 'app-complaint-detail',
  templateUrl: './complaint-detail.component.html',
  styleUrls: ['./complaint-detail.component.scss']
})
export class ComplaintDetailComponent implements OnInit {
  id;
  getData: any = {};
  loader: any;
  skLoading: boolean = false;
  url: any;
  assign_login_data: any = {};
  logined_user_data: any = {};
  stateDetail: any = [];
  product_size: any = [];
  spare_list: any = [];
  complaint_visit: any = [];
  featureFlag: boolean = false;
  allMrpFlag: boolean = false;
  complaintImg: any = [];
  inspectionImg: any = [];
  closeImg: any = [];
  fabBtnValue: any = 'excel';

  constructor(public location: Location, public session: sessionStorage, private router: Router, public alert: DialogComponent, public service: DatabaseService, public editdialog: DialogService, public dialog: MatDialog, public route: ActivatedRoute, public toast: ToastrManager, public excelservice: ExportexcelService, public dialog1: DialogComponent) {


    this.url = this.service.uploadUrl + 'service_task/'
    this.route.params.subscribe(params => {
      this.id = params.id;
      this.service.currentUserID = params.id
      if (this.id) {
        this.getComplaintDetail();
      }
    });
  }

  ngOnInit() {
  }

  getComplaintDetail() {
    this.loader = 1;
    this.skLoading = true;
    this.service.post_rqst({ 'complaint_id': this.id }, "ServiceTask/serviceComplaintDetail").subscribe(result => {
      if (result['statusCode'] == 200) {
        this.skLoading = false;
        this.getData = result['result'];
        // console.log('getData',this.getData);
        this.complaintImg = this.getData['image'];
        this.inspectionImg = this.getData['inspection_image'];
        this.closeImg = this.getData['closing_image'];
        this.spare_list = this.getData['spare_list'];
        this.complaint_visit = this.getData['complaint_visit'];

      } else {
        this.skLoading = false;
        this.toast.errorToastr(result['statusMsg']);
      }
    }, err => {
      this.skLoading = false;
      this.toast.errorToastr('Something went wrong');
    })
  }


  imageModel(image) {
    const dialogRef = this.dialog.open(ImageModuleComponent, {
      panelClass: 'Image-modal',
      data: {
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
  openDialog(row, state): void {
    console.log(row);
    const dialogRef = this.dialog.open(EngineerAssignModelComponentComponent, {
      width: '400px',
      panelClass: 'cs-model',
      data: {
        id: row,
        state: state,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.getComplaintDetail();
      }
    });
  }

  openDialog2(id) {
    const dialogRef = this.dialog.open(AddComplaintRemarkComponent, {
      width: '500px',
      panelClass: 'cs-modal',
      data: {
        id: id,
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  updateComplaintStataus(id) {
    const dialogRef = this.dialog.open(ComplaintUpdateModelComponent, {
      width: '400px',
      panelClass: 'cs-model',
      data: {
        id: id,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != false) {
        this.getComplaintDetail();
      }
    });
  }
}
