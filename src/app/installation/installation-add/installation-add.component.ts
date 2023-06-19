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
  selector: 'app-installation-add',
  templateUrl: './installation-add.component.html',
  styleUrls: ['./installation-add.component.scss']
})
export class InstallationAddComponent implements OnInit {
  
  data: any = {};
  product_data: any = {};
  states:any =[];
  dr_type: any;
  district_list: any = [];
  savingFlag:boolean = false;
  params_id: any;
  image_id: any;
  errorMsg: boolean = false;
  segmentList: any = [];
  productList: any = [];
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
  add_list: any = [];
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
  bill_img :any;
  warranty_img :any;
  
  constructor(private renderer: Renderer2,
    public location: Location,
    public service: DatabaseService,
    public rout: Router,
    public toast: ToastrManager,
    private route: ActivatedRoute,
    public dialog: DialogComponent,
    public dialog2: MatDialog) {
      
      this.getStateList();
      this.route.params.subscribe(params => {
        this.id =  params.id;
        console.log(this.id);
        if (this.id) {
          this.getInstallationDetail(this.id);
        }
        
        this.getSegment();
        
        
      });
    }
    
    ngOnInit() {
    }
    submitDetail()
    {
      this.data.add_list=this.add_list
      this.savingFlag = true;
      let header
      if(this.id){
        header =this.service.post_rqst({"data":this.data,'type': 'Edit','id':this.id},"ServiceTask/serviceInstallationAdd") 
      }
      else
      {
        header =this.service.post_rqst({"data":this.data,'type': 'Add',},"ServiceTask/serviceInstallationAdd") 
      }
      header.subscribe((result=>
        {
          if (result['statusCode'] == 200) {
            this.rout.navigate(['/installation-list']);
            
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
      
      getSegment() {
        this.service.post_rqst({}, "Master/getProductCategoryList").subscribe((result => {
          if (result['category_list']['statusCode'] == 200) {
            this.segmentList = result['category_list']['segment_list'];
          }
        }))
      }
      
      getSubCatgory(id) {
        console.log(id);
        
        
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
          }
          console.log(this.data.product_name);
          console.log(this.data.product_code);
        }
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
      
      AddProduct(){
        console.log(this.product_data.product_id);
        
        if(this.product_data.product_id){
          let index= this.productList.findIndex(d=> d.id==this.product_data.product_id);
          if(index!=-1){
            this.product_data.product_name= this.productList[index].product_name;
            this.product_data.product_code= this.productList[index].product_code;
          }
          console.log(this.product_data.product_name);
          console.log(this.product_data.product_code);
        }
        if(this.product_data.segment_id){
          let index= this.segmentList.findIndex(d=> d.id==this.product_data.segment_id);
          if(index!=-1){
            this.product_data.category_name= this.segmentList[index].category;
          }
          console.log(this.product_data.category_name);
        }
        if(this.product_data.sub_segment_id){
          let index= this.SubcategoryList.findIndex(d=> d.id==this.product_data.sub_segment_id);
          if(index!=-1){
            this.product_data.subcat_name= this.SubcategoryList[index].sub_category_name;
          }
          console.log(this.product_data.subcat_name);
        }
        console.log(this.product_data);
        
        if(this.add_list.length ==0){
          this.add_list.push(JSON.parse(JSON.stringify(this.product_data)))
          console.log(this.add_list)
          this.product_data={}
        }
        else{
          let isExistIndex:any;
          isExistIndex=this.add_list.findIndex(row=>row.product_id==this.product_data.product_id);
          console.log(isExistIndex)
          if(isExistIndex == -1){
            this.add_list.push(JSON.parse(JSON.stringify(this.product_data)))
            
            console.log(this.add_list)
            this.product_data={}
            
          }
          else{
            this.add_list[isExistIndex].qty= parseInt(this.add_list[isExistIndex].qty)+parseInt(this.product_data.qty)
            this.product_data={}
            
          }
        }
      }
      
      
      delete(i){
        this.add_list.splice(i,1)
        
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
      getInstallationDetail(id)
      {
        this.service.post_rqst({'complaint_id':id},"ServiceTask/serviceInstallationDetail").subscribe((result=>
          {
            this.getData = result['result'];
            console.log('getData',this.getData);
            this.data = this.getData;
            this.add_list = this.getData['add_list'];
            // console.log(this.product_data);
            this.getDistrict(1)
            
          }
          ));
          
        }
      }
      
      