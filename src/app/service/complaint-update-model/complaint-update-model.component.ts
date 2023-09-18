import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { sessionStorage } from 'src/app/localstorage.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';

@Component({
  selector: 'app-complaint-update-model',
  templateUrl: './complaint-update-model.component.html',
  styleUrls: ['./complaint-update-model.component.scss']
})
export class ComplaintUpdateModelComponent implements OnInit {

  formData: any = {}
  savingFlag: boolean = false;
  currentDate: Date;
  warranty_period: any;
  date_of_purchase: any;
  url: any;
  image = new FormData();
  image_id: any;
  delaerId: any;
  errorMsg: boolean = false;
  selected_image: any = [];
  dealerList: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog, public serve: DatabaseService, public session: sessionStorage, public toast: ToastrManager, public dialogRef: MatDialogRef<ComplaintUpdateModelComponent>) {

    this.url = this.serve.uploadUrl + 'product_image/';
    console.log(data);
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.getDealerList('');
  }


  getDealerList(search) {
    console.log(search);
    
    this.serve.post_rqst({ 'search': search }, "ServiceTask/dealerList").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.dealerList = result['dealer'];
        console.log(this.dealerList);

      }
    }))

  
  }
  get_dealer_detail(id){
    if (id) {
      let index = this.dealerList.findIndex(d => d.id == id);
      if (index != -1) {
        this.formData.dealer_name = this.dealerList[index].name;
        this.formData.dealer_company_name = this.dealerList[index].company_name;
        this.formData.dealer_mobile = this.dealerList[index].mobile;
      }
    }
  }


  deleteProductImage(arrayIndex, id, name) {

    if (id) {
      this.serve.post_rqst({ 'image_id': id, 'image': name }, "Master/productImageDeleted").subscribe((result => {
        if (result['statusCode'] == '200') {
          this.toast.successToastr(result['statusMsg']);
          this.selected_image.splice(arrayIndex, 1);

        } else {
          this.toast.errorToastr(result['statusMsg']);
        }
      }
      ))
    }
    else {
      this.selected_image.splice(arrayIndex, 1);
    }
    // this.selected_image.splice(arrayIndex, 1);


  }

  // add image 
  onUploadChange(data: any) {
    this.errorMsg = false;
    this.image_id = '';
    for (let i = 0; i < data.target.files.length; i++) {
      let files = data.target.files[i];
      if (files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.selected_image.push({ "image": e.target.result });
        }
        reader.readAsDataURL(files);
      }
      this.image.append("" + i, data.target.files[i], data.target.files[i].name);
    }
  }


  update() {
    this.formData.image = this.selected_image ? this.selected_image : [];

    this.formData.complaint_id = this.data.id
    this.savingFlag = true;
    this.serve.post_rqst({ 'data': this.formData }, "ServiceTask/complaintStatus").subscribe((result => {
      if (result['statusCode'] == 200) {

        this.dialogRef.close(true);
        this.toast.successToastr(result['statusMsg']);
      }
      else {
        this.toast.errorToastr(result['statusMsg'])
        this.savingFlag = false;
      }
    }))
  }


}
