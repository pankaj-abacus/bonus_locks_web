import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { Location } from '@angular/common';


@Component({
  selector: 'app-service-invoice-add',
  templateUrl: './service-invoice-add.component.html',
  styleUrls: ['./service-invoice-add.component.scss']
})
export class ServiceInvoiceAddComponent implements OnInit {
  
  technicianData:any={}
  formData:any={}
  loader: boolean = false;
  engineerList: any = [];
  complaintList: any = [];
  add_list: any = [];
  spareList: any = [];
  savingFlag:boolean = false;
  filter: any = {};
  addToListButton: boolean = true;
  
  
  constructor(public service: DatabaseService,public rout: Router,public toast: ToastrManager,private route: ActivatedRoute,public dialog: DialogComponent,public dialog2: MatDialog,public location: Location) {
    this.technicianData.discount=0;
    this.formData.discount=0;
  }
  
  ngOnInit() {
    this.assign_engineerget('');
    this.getSparePartList('');
  }
  
  back(): void {
    this.location.back();
  }
  
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
      this.getComplantList('',id);
      let index= this.engineerList.findIndex(d=> d.id==id);
      if(index!=-1){
        this.technicianData.technician_id= this.engineerList[index].id;
        this.technicianData.technician_name= this.engineerList[index].name;
      }
    }
  }
  
  getComplantList(searcValue,id) {
    this.filter.technician_detail = searcValue;
    this.filter.technician_id = id;
    this.service.post_rqst({ 'filter': this.filter, }, 'ServiceInvoice/assignComplaintList').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.complaintList = resp.data;
      }
      else {
        this.toast.errorToastr(resp['statusMsg'])
      }
    }, error => {
    })
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
        this.formData.mrp = this.spareList[index].mrp;
      }
    }
  }
  
  
  
  delete(i) {
    
    this.technicianData.sub_total -= (parseFloat(this.add_list[i].mrp)*parseFloat(this.add_list[i].qty));
    this.technicianData.discount += (parseFloat(this.add_list[i].qty) * parseFloat(this.add_list[i].mrp)) * (parseFloat(this.add_list[i].discount) / 100);
    
    this.technicianData.gst_amount = (parseFloat(this.technicianData.sub_total) - parseFloat(this.technicianData.discount)) * (parseFloat('18') / 100);
    
    this.technicianData.total = (parseFloat(this.technicianData.sub_total) - parseFloat(this.technicianData.discount)) + (parseFloat(this.technicianData.gst_amount));
    
    this.add_list.splice(i, 1)
  }
  
  
  addInvoice() {
    this.technicianData = this.technicianData
    this.savingFlag = true;
    this.service.post_rqst({ "add_list": this.add_list,"data":this.technicianData }, "ServiceInvoice/serviceInvoiceAdd").subscribe((result => {
      if (result['statusCode'] == 200) {
        this.savingFlag = false;
        this.rout.navigate(['/service-invoice-list']);
        this.toast.successToastr(result['statusMsg']);
        setTimeout(() => {
          this.savingFlag = false;
        }, 700);
      }
      else {
        this.toast.errorToastr(result['statusMsg']);
      }
    }))
  }
  
  calculationOfTotalService(){
    if (this.technicianData.discount=='') {
      this.technicianData.discount=0;
    }
    if (this.technicianData.type && parseInt(this.technicianData.amount) <= this.technicianData.discount) {
      this.technicianData.discount=0;
      this.toast.errorToastr('Discount Should Be Less Then Amount');
    }
    this.technicianData.gstPercentage = 18.00;
    this.technicianData.gst_amount = ((parseFloat(this.technicianData.amount)-parseFloat(this.technicianData.discount))/100)*this.technicianData.gstPercentage;
    this.technicianData.sub_total = parseFloat(this.technicianData.amount);
    this.technicianData.disc=0.00;
    if(this.technicianData.discount!=0)
    {
      this.technicianData.total=(parseFloat(this.technicianData.amount)-parseFloat(this.technicianData.discount))+parseFloat(this.technicianData.gst_amount);
    }else
    {
      this.technicianData.total=parseFloat(this.technicianData.amount)+parseFloat(this.technicianData.gst_amount);
      
    }
  }
  
  calculation(){
    if (this.formData.discount=='') {
      this.formData.discount=0;
    }

    this.formData.amount = (parseFloat(this.formData.mrp)*parseInt(this.formData.qty));

    this.formData.total = (parseFloat(this.formData.mrp)*parseInt(this.formData.qty))-(((parseFloat(this.formData.mrp)*parseInt(this.formData.qty))/100)*this.formData.discount);
    
    this.formData.discount_amount = (parseFloat(this.formData.mrp)*parseInt(this.formData.qty))* (parseFloat(this.formData.discount) / 100);
    
    this.formData.final_amount = (parseFloat(this.formData.mrp)*parseInt(this.formData.qty)) - (parseFloat(this.formData.discount_amount));
    
  }
  
  addSpare() {
    this.technicianData.sub_total=0;
    this.technicianData.disc=0;
    this.technicianData.discount=0;
    this.technicianData.gst=0;
    this.technicianData.total=0;
    
    if (this.formData.id) {
      let index = this.spareList.findIndex(d => d.id == this.formData.id);
      if (index != -1) {
        this.formData.part_name = this.spareList[index].part_name;
      }
    }
    if (this.add_list.length == 0) {
      this.add_list.push(JSON.parse(JSON.stringify(this.formData)))
      this.formData = {}
      this.formData.discount=0;
      
    }
    else {
      let isExistIndex: any;
      isExistIndex = this.add_list.findIndex(row => row.id == this.formData.id);
      if (isExistIndex == -1) {
        this.add_list.push(JSON.parse(JSON.stringify(this.formData)))
        this.formData = {} 
        this.formData.discount=0;
        
      }
      else {
        this.add_list[isExistIndex].qty = parseInt(this.formData.qty)
        this.formData = {} 
        this.formData.discount=0;
        this.addToListButton = true;
      }
    }
    for (let index = 0; index < this.add_list.length; index++) {
      this.technicianData.sub_total += (parseFloat(this.add_list[index].mrp)*parseFloat(this.add_list[index].qty));

      this.technicianData.discount += (parseFloat(this.add_list[index].qty) * parseFloat(this.add_list[index].mrp)) * (parseFloat(this.add_list[index].discount) / 100);
      
      this.technicianData.gst_amount = (parseFloat(this.technicianData.sub_total) - parseFloat(this.technicianData.discount)) * (parseFloat('18') / 100);
    
      this.technicianData.total = (parseFloat(this.technicianData.sub_total) - parseFloat(this.technicianData.discount)) + (parseFloat(this.technicianData.gst_amount));
      
    }
    
  }
  
}
