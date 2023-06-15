import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-warranty-add',
  templateUrl: './warranty-add.component.html',
  styleUrls: ['./warranty-add.component.scss']
})
export class WarrantyAddComponent implements OnInit {
  data: any = {};
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
  selected_image2: any = [];
  state: any = [];
  pointCategories_data: any = []
  getData:any ={};  
  params_network:any;
  params_type:any;
  
  constructor(private renderer: Renderer2,
    public location: Location,
    public service: DatabaseService,
    public rout: Router,
    public toast: ToastrManager,
    private route: ActivatedRoute,
    public dialog: DialogComponent,
    public dialog2: MatDialog) {
      this.route.params.subscribe(params => {
        this.id =  params.id;
        console.log(this.id);
        if (this.id) {
          this.getComplaintDetail(this.id);
        }

        this.getSegment();
        
        
      });
    }
    
    ngOnInit() {
    }
    
    submitDetail()
    {
      this.data.image = this.selected_image ? this.selected_image : []; 
      this.savingFlag = true;
      let header
      if(this.id){
        header =this.service.post_rqst({"data":this.data,'type': 'Edit','id':this.id},"ServiceCustomer/test") 
      }
      else
      {
        header =this.service.post_rqst({"data":this.data,'type': 'Add',},"ServiceCustomer/test") 
      }
      header.subscribe((result=>
        {
          if (result['statusCode'] == 200) {
            this.rout.navigate(['/customer-list']);
            
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
      
      deleteProductImage(arrayIndex, id, name) {
        
        if (id) {
          this.service.post_rqst({ 'image_id': id, 'image': name }, "Master/productImageDeleted").subscribe((result => {
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
      }
      
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
      
      getComplaintDetail(id)
      {
        this.service.post_rqst({'customer_id':id},"ServiceCustomer/serviceCustomerDetail").subscribe((result=>
          {
            this.getData = result['result'];
            console.log('getData',this.getData);
            this.data = this.getData;
            
          }
          ));
          
        }
        MobileNumber(event: any) {
          const pattern = /[0-9\+\-\ ]/;
          let inputChar = String.fromCharCode(event.charCode);
          if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
          
        }

        getSegment() {
          this.service.post_rqst({}, "Master/getProductCategoryList").subscribe((result => {
            if (result['category_list']['statusCode'] == 200) {
              this.segmentList = result['category_list']['segment_list'];
            }
          }))
        }

        getSubCatgory(id) {
          this.service.post_rqst({ 'id': id }, "Master/subCategoryList").subscribe((result => {
            if (result['statusCode'] == 200) {
              this.SubcategoryList = result['result'];
            }
          }))
        }
        
      }
      