import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { sessionStorage } from 'src/app/localstorage.service';
import { DatabaseService } from 'src/_services/DatabaseService';

@Component({
  selector: 'app-product-wise-secondary-report-modal',
  templateUrl: './product-wise-secondary-report-modal.component.html',
  styleUrls: ['./product-wise-secondary-report-modal.component.scss']
})
export class ProductWiseSecondaryReportModalComponent implements OnInit {
  reportSubcategoryData: any = [];
  reportProductCodeData: any = [];
  constructor(public toast: ToastrManager, @Inject(MAT_DIALOG_DATA) public modelData, public rout: Router, public session: sessionStorage, public service: DatabaseService, public dialogRef: MatDialogRef<ProductWiseSecondaryReportModalComponent>) {
    console.log(modelData);
    this.getProductWisePriSecReport();
  }

  ngOnInit() {
  }

  getProductWisePriSecReport() {
    this.service.post_rqst(this.modelData, "Master/getProductWiseSecReportSubcategory").subscribe(resp => {
      console.log(resp);
      if (resp['order_item'].length > 0) this.reportSubcategoryData = resp['order_item'][0]['itemData'];

      console.log(this.reportSubcategoryData);


      for (var i = 0; i < this.reportSubcategoryData.length; i++) {
        this.reportSubcategoryData[i]['total_amount'] = parseInt(this.reportSubcategoryData[i]['total_amount']);
      }
    });
  }

  getProductCodes(subCategory) {
    subCategory = subCategory == null ? '' : subCategory;
    console.log(subCategory);

    this.service.post_rqst({ data: this.modelData, subCategory: subCategory, category: this.modelData.category }, "product/getProductWiseSecReportCatNo").subscribe(resp => {
      console.log(resp);
      if (resp['order_item'].length > 0) this.reportProductCodeData = resp['order_item'][0]['itemData'];

      for (var i = 0; i < this.reportProductCodeData.length; i++) {
        this.reportProductCodeData[i]['total_amount'] = parseInt(this.reportProductCodeData[i]['total_amount']);
      }

      console.log(this.reportProductCodeData);

    });
  }


}
