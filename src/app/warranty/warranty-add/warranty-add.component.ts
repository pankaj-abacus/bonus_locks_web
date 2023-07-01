import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { sessionStorage } from 'src/app/localstorage.service';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { DialogComponent } from 'src/app/dialog.component';
import { MatDialog } from '@angular/material';
import * as moment from 'moment';


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
  productList: any = [];
  category_list: any = [];
  brandList: any = [];
  colorList: any = [];
  feature: any = {};
  exist:boolean=false;
  value: any = [];
  formData = new FormData();
  loader: boolean = false;
  showMRP = false;
  showSize = false;
  userData: any;
  userId: any;
  myDate:any
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
  billBase64:boolean = false;
  bill_img_id:any;
  warrantyBase64:boolean = false;
  warranty_img_id:any;
  bill_copy_img :any;
  warranty_card_copy_img :any;
  warrantyImg:any =[];
  uploadurl:any;
  warranty_period:string;
  selectedWarrantyDate: string;
  warrantyEndDate: string;

  constructor(private renderer: Renderer2,
    public location: Location,
    public service: DatabaseService,
    public rout: Router,
    public toast: ToastrManager,
    private route: ActivatedRoute,
    public dialog: DialogComponent,
    public dialog2: MatDialog) {

    this.uploadurl = this.service.uploadUrl + 'service_task/'

      this.route.params.subscribe(params => {
        this.id =  params.id;
        this.warranty_img_id =  params.id;
        this.bill_img_id =  params.id;

        console.log(this.id);
        if (this.id) {
          this.getWarrantyDetail(this.id);
        }
        
        this.getSegment();
        
        
      });
    }
    
    ngOnInit() {
    }

    
    
    submitDetail()
    {
      this.data.billBase64 = this.billBase64;
      this.data.warrantyBase64 = this.warrantyBase64;

      if(this.data.date_of_purchase){
        this.data.date_of_purchase = moment(this.data.date_of_purchase).format('YYYY-MM-DD');
        this.data.date_of_purchase=this.data.date_of_purchase;
      }
      if(this.data.warranty_end_date){
        this.data.warranty_end_date = moment(this.data.warranty_end_date).format('YYYY-MM-DD');
        this.data.warranty_end_date=this.data.warranty_end_date;
      }
      this.savingFlag = true;
      let header
      if(this.id){
        header =this.service.post_rqst({"data":this.data,'type': 'Edit','id':this.id},"ServiceTask/serviceWarrantyAdd") 
      }
      else
      {
        header =this.service.post_rqst({"data":this.data,'type': 'Add',},"ServiceTask/serviceWarrantyAdd") 
      }
      header.subscribe((result=>
        {
          if (result['statusCode'] == 200) {
            this.rout.navigate(['/warranty-list']);
            
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
      
      bill_Upload(data: any)
      {
        for(let i=0;i<data.target.files.length;i++)
        {
          
          let files = data.target.files[i];
          if (files) 
          {
            this.bill_img_id = '';
            this.billBase64 = true;
            let reader = new FileReader();
            reader.onload = (e: any) => {
              this.data.bill_copy_img = e.target.result
            }
            reader.readAsDataURL(files);
          }
          else{
            this.billBase64 = false;
          }
          this.image.append(""+i,data.target.files[i],data.target.files[i].name);
        }
      }
      
      warrannty_Upload(data: any)
      {
        for(let i=0;i<data.target.files.length;i++)
        {
          
          let files = data.target.files[i];
          if (files) 
          {
            this.warranty_img_id = '';
            this.warrantyBase64 = true;
            let reader = new FileReader();
            reader.onload = (e: any) => {
              this.data.warranty_card_copy_img = e.target.result
            }
            reader.readAsDataURL(files);
          }
          else{
            this.warrantyBase64 = false;
          }
          this.image.append(""+i,data.target.files[i],data.target.files[i].name);
        }
      }
      
      getWarrantyDetail(id)
      {
        this.service.post_rqst({'warranty_id':id},"ServiceTask/serviceWarrantyDetail").subscribe((result=>
          {
            this.getData = result['result'];
            console.log('getData',this.getData);
            this.data = this.getData;
            console.log(this.data);
            this.data.segment_id=this.getData.segment_id.toString()
            // console.log(typeof this.data.segment_id);
            this.getSegment();
            
            setTimeout(() => { 
              
              this.data.sub_segment_id=this.getData.sub_segment_id.toString()
              // console.log(typeof this.data.sub_segment_id);
              this.getSubCatgory(this.data.segment_id);
            }, 200);

            setTimeout(() => { 
              
              this.data.product_id=this.getData.product_id.toString()
              // console.log(typeof this.data.product_id);
              this.getProduct(this.data.product_id);
            }, 200);
            
            
            
          }
          ));
          
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
        
        getProduct(id) {
          this.service.post_rqst({ 'id': id }, "Master/productList").subscribe((result => {
            if (result['statusCode'] == 200) {
              this.productList = result['product_list'];
              console.log(this.productList);
              
            }
          }))
        }
        
        getProductInfo(product_id)
        {
          console.log(product_id);
          
          if(product_id){
            let index= this.productList.findIndex(d=> d.id==product_id);
            if(index!=-1){
              this.data.product_name= this.productList[index].product_name;
              this.data.product_code= this.productList[index].product_code;
              this.warranty_period= this.productList[index].warranty_period;
            }
            console.log(this.data.product_name);
            console.log(this.data.product_code);
            console.log(this.warranty_period);
          }
        }

        calculateWarrantyEnd() {
          const warrantyStartDate = new Date(this.data.date_of_purchase);
          const warrantyEnd = new Date(warrantyStartDate.getFullYear() , warrantyStartDate.getMonth() + parseInt(this.warranty_period), warrantyStartDate.getDate());
          console.log(warrantyEnd);
          this.data.warranty_end_date=warrantyEnd;
        }

        
        
        
      }
      