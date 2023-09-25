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

  technicianData:any={}
  formData:any={}
  engineerList: any = [];
  add_list: any = [];
  spareList: any = [];
  savingFlag:boolean = false;
  constructor(public service: DatabaseService,public rout: Router,public toast: ToastrManager,private route: ActivatedRoute,public dialog: DialogComponent,public dialog2: MatDialog) { }

  ngOnInit() {
    this.assign_engineerget('');
    this.getSparePartList('');
  }

  filter: any = {};
  assign_engineerget(searcValue) {
    this.filter.technician_detail = searcValue;
    this.service.post_rqst({ 'filter': this.filter, }, 'ServiceTask/plumberList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.engineerList = resp.data;
      }
      else {
        this.toast.errorToastr(resp['statusMsg'])
      }
    }, error => {
    })
  }
  
  getCarpenterInfo(id)
  { 
    if(id){
      let index= this.engineerList.findIndex(d=> d.id==id);
      if(index!=-1){
        this.technicianData.assign_to= this.engineerList[index].id;
        this.technicianData.assign_to_name= this.engineerList[index].name;
      }
    }
  }


  getSparePartList(search) {
    this.service.post_rqst({ 'search': search }, "ServiceSparePart/getSparePartName").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.spareList = result['result'];
      }
    }))
  }
  get_spare_detail(id) {
    if (id) {
      let index = this.spareList.findIndex(d => d.id == id);
      if (index != -1) {
        this.formData.part_id = this.spareList[index].id;
        this.formData.part_no = this.spareList[index].part_no;
        this.formData.part_name = this.spareList[index].part_name;
        this.formData.current_stock = this.spareList[index].current_stock;
      }
    }
  }

  max() {
    if (parseInt(this.formData.qty) > parseInt(this.formData.current_stock)) {
      this.toast.errorToastr('Qty Should Be Less Then Current Stock');
      this.formData.qty=0
    }
  }

  addSpare() {

    if (this.formData.qty == 0 || this.formData.qty == undefined || this.formData.qty == null || !this.formData.qty) {
      this.toast.errorToastr("QTY Should Be More Then Zero");
      return;
    }

    if (this.formData.id) {
      let index = this.spareList.findIndex(d => d.id == this.formData.id);
      if (index != -1) {
        this.formData.part_name = this.spareList[index].part_name;
        this.formData.part_no = this.spareList[index].part_no;
      }
    }
    if (this.formData.id) {
      let index = this.spareList.findIndex(d => d.id == this.formData.id);
      if (index != -1) {
        this.formData.category_name = this.spareList[index].category;
      }
    }
    if (this.add_list.length == 0) {
      this.add_list.push(JSON.parse(JSON.stringify(this.formData)))
      this.formData = {}
    }
    else {
      let isExistIndex: any;
      isExistIndex = this.add_list.findIndex(row => row.id == this.formData.id);
      if (isExistIndex == -1) {
        this.add_list.push(JSON.parse(JSON.stringify(this.formData)))
        this.formData = {}

      }
      else {
        this.add_list[isExistIndex].qty = parseInt(this.formData.qty)
        this.formData = {}

      }
    }
  }

  delete(i) {
    this.add_list.splice(i, 1)
  }


  submit() {
    this.technicianData = this.technicianData
    this.savingFlag = true;
    this.service.post_rqst({ "add_list": this.add_list,"data":this.technicianData }, "ServiceSparePart/submitAssignStock").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.toast.successToastr(result['statusMsg']);
        this.dialog2.closeAll();
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))

  }

}
