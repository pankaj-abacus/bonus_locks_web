import { Component, OnInit, Renderer2,ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-complaint-add',
  templateUrl: './complaint-add.component.html',
  styleUrls: ['./complaint-add.component.scss']
})
export class ComplaintAddComponent implements OnInit {
  
  data: any = {};
  @ViewChild('fileInput') fileInput: any;
  states:any =[];
  dr_type: any;
  district_list: any = [];
  savingFlag:boolean = false;
  params_id: any;
  image_id: any;
  errorMsg: boolean = false;
  segmentList: any = [];
  SubcategoryList: any = [];
  category_list: any = [];
  brandList: any = [];
  colorList: any = [];
  feature: any = {};
  value: any = [];
  formData = new FormData();
  loader: boolean = false;
  showMRP = false;
  showSize = false;
  userData: any;
  userId: any;
  id: any;
  userName: any;
  image = new FormData();
  product_id: any;
  url: any;
  selected_image: any = [];
  state: any = [];
  exist:boolean=false;
  pointCategories_data: any = []
  getData:any ={};  
  params_network:any;
  params_type:any;
  constructor(
    private renderer: Renderer2,
    public location: Location,
    public service: DatabaseService,
    public rout: Router,
    public toast: ToastrManager,
    private route: ActivatedRoute,
    public dialog: DialogComponent,
    public dialog2: MatDialog
    ) { 
      this.data.country = 'india';
      this.getStateList();
      this.route.params.subscribe(params => {
        this.id =  params.id;
        console.log(this.id);
        if (this.id) {
          this.getComplaintDetail(this.id);
        }
        
        
      });
      
    }
    
    ngOnInit() {
      
    }
    getStateList() {
      this.service.post_rqst(0, "Influencer/getAllState").subscribe((result => {
        if (result['statusCode'] == 200) {
          this.states = result['all_state'];
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }));
    }
    getDistrict(val) {
      let st_name;
      if(val == 1)
      {
        st_name = this.data.state;
      }
      this.service.post_rqst({'state_name':st_name}, "Influencer/getAllDistrict").subscribe((result => {
        
        if (result['statusCode'] == 200) {
          this.district_list = result['all_district'];
        }
        else{
          this.toast.errorToastr(result['statusMsg']);
        }
      }));
      
    }
    checkMobile() {      
      if (this.data.customer_mobile.length == 10) {
        this.service.post_rqst({ 'customer_mobile':this.data.customer_mobile },"ServiceTask/customerCheck").subscribe((d) => {
          console.log(d);
          if (d.statusMsg == "Exist") {
            // this.toast.errorToastr("This Mobile No. alresdy exist in Complaint!");
            this.data=d.data
            this.getDistrict(1)
            // console.log(this.data,'this.data');
          }
        });
      }
    }
    submitDetail()
    {
      this.data.image = this.selected_image ? this.selected_image : []; 
      this.savingFlag = true;
      let header
      if(this.id){
        header =this.service.post_rqst({"data":this.data,'type': 'Edit','id':this.id},"ServiceTask/serviceComplaintAdd") 
      }
      else
      {
        header =this.service.post_rqst({"data":this.data,'type': 'Add',},"ServiceTask/serviceComplaintAdd") 
      }
      header.subscribe((result=>
        {
          if (result['statusCode'] == 200) {
            this.rout.navigate(['/complaint-list']);
            
            this.toast.successToastr(result['statusMsg']);
            this.savingFlag = false;
          }
          else{
            this.toast.errorToastr(result['statusMsg']);
            this.savingFlag = false;
          }
          
        }));
      }
      back(): void {
        this.location.back()
      }
      
      // deleteProductImage(arrayIndex, id, name) {
      
      //   if (id) {
      //     this.service.post_rqst({ 'image_id': id, 'image': name }, "Master/productImageDeleted").subscribe((result => {
      //       if (result['statusCode'] == '200') {
      //         this.toast.successToastr(result['statusMsg']);
      //         this.selected_image.splice(arrayIndex, 1);
      
      //       } else {
      //         this.toast.errorToastr(result['statusMsg']);
      //       }
      //     }
      //     ))
      //   }
      //   else {
      //     this.selected_image.splice(arrayIndex, 1);
      //   }
      // }
      
      // onUploadChange(data: any) {
      //   this.errorMsg = false;
      //   this.image_id = '';
      //   for (let i = 0; i < data.target.files.length; i++) {
      //     let files = data.target.files[i];
      //     if (files) {
      //       let reader = new FileReader();
      //       reader.onload = (e: any) => {
      //         this.selected_image.push({ "image": e.target.result });
      //       }
      //       reader.readAsDataURL(files);
      //     }
      //     this.image.append("" + i, data.target.files[i], data.target.files[i].name);
      //   }
      // }
      
      onUploadChange(data: any) {
        for (let i = 0; i < data.target.files.length; i++) {
          let files = data.target.files[i];
          if (files.size > 2028812) {
            this.dialog.error('Image size more than 2 Mb is not allowed.');
            return;
          }
          if (files) {
            let reader = new FileReader();
            reader.onload = (e: any) => {
              this.selected_image.push(e.target.result);
            }
            reader.readAsDataURL(files);
          }
          // this.image.append(""+i,data.target.files[i],data.target.files[i].name);
        }
        this.fileInput.nativeElement.value = '';
      }
      
      remove_image(i: any) {
        this.selected_image.splice(i, 1);
      }
      
      getComplaintDetail(id)
      {
        this.service.post_rqst({'complaint_id':id},"ServiceTask/serviceComplaintDetail").subscribe((result=>
          {
            this.getData = result['result'];
            this.data.image=this.getData['image'];
            console.log('image',this.image);
            console.log('getData',this.getData);
            this.data = this.getData;
            this.getDistrict(1)
            
          }
          ));
          
        }
        
      }
      