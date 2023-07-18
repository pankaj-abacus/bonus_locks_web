import { Component, OnInit } from '@angular/core';

import { DatabaseService } from 'src/_services/DatabaseService';
import {ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';

@Component({
  selector: 'app-gift-add',
  templateUrl: './gift-add.component.html'
})
export class GiftAddComponent implements OnInit {
  
  userData: any;
  userId: any;
  userName: any;
  data:any ={};
  errorMsg: boolean;
  loader:any=false;
  selected_image :any;
  image_id:any;
  image = new FormData();
  savingFlag: boolean=false;
  today_date: Date;
  bonus_schemeList: any = []
  upload_url: any;
  nav_data: any
  gift_id: any;
  gift_type: any;

  
  constructor(public service:DatabaseService, public navparams: ActivatedRoute,public router : Router, private route: ActivatedRoute, public toast:ToastrManager) { 
    this.nav_data = this.navparams['params']['_value']
    this.data.gift_type = 'Gift'
    this.gift_id = this.nav_data.id;
    console.log(this.gift_id,'gift id')
    this.gift_type = this.nav_data.type;
    this.upload_url = this.service.uploadUrl + 'gift_gallery/'
    this.userData = JSON.parse(localStorage.getItem('st_user'));
    this.userId=this.userData['data']['id'];
    this.userName=this.userData['data']['name'];
    this.today_date = new Date();
    if (this.gift_id) {
      this.get_giftDetail(this.gift_id)
    }
    // else if(!this.gift_id){
    //   this.get_bonus_schemeList()
    // }
    
  }
  
  ngOnInit() {
    
  }
  get_giftDetail(gift_id) {
    this.service.post_rqst({ gift_id }, 'GiftGallery/gift_detail').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.data = resp['result']
        this.data.bonus_scheme = this.data.bonus_scheme.toString()
        console.log(this.data.bonus_scheme)
        // if (this.data.bonus_scheme) {
        //   this.get_bonus_schemeList(gift_id)

        // }

        if (this.gift_id&&this.data.gift_img != "") {
          this.selected_image = this.upload_url + this.data.gift_img
        }
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }

    }, error => {
      this.toast.errorToastr(error);
    })
  }
  
  onUploadChange(data: any)
  {
    this.errorMsg = false;
    this.image_id ='';
    for(let i=0;i<data.target.files.length;i++)
    {
      let files = data.target.files[i];
      if (files) 
      {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.selected_image = e.target.result
        }
        reader.readAsDataURL(files);
      }
      this.image.append(""+i,data.target.files[i],data.target.files[i].name);
    }
  }


  resetValue(){
    this.data.range_end = '';
  }
  // get_bonus_schemeList(gift_id:any='') {
  //   this.service.post_rqst({'gift_id':gift_id}, 'GiftGallery/bonusSchemeList').subscribe((resp) => {
  //     if (resp['statusCode'] == 200) {
  //       this.bonus_schemeList = resp['result']
  //     }
  //     else {
  //       this.toast.errorToastr(resp['statusMsg']);
  //     }

  //   }, error => {
  //     this.toast.errorToastr(error);
  //   })
  // }
  
  submitDetail(){
    this.data.date_from ? (this.data.date_from = moment(this.data.date_from).format('YYYY-MM-DD')) : null;
    this.data.date_to ? (this.data.date_to = moment(this.data.date_to).format('YYYY-MM-DD')) : null;
    if(this.data.gift_type == 'Cash'){
      if(parseInt(this.data.range_end) <= parseInt(this.data.range_start) ){
        this.toast.errorToastr('The range end value should be greater than the range start value');
        return;
      }
    }
    // if(this.data.gift_type == 'Gift'){
    //   if(this.selected_image==undefined){
    //     this.toast.errorToastr('Please Upload Image');
    //     return;
    //   }
    // }
    
    this.data.created_by_name=this.userName;
    this.data.created_by_id=this.userId;
    // this.data.gift_img = this.selected_image;
    let header: any;
    if (this.gift_id) {
      this.data.id = this.gift_id
      header = this.service.post_rqst(this.data, 'GiftGallery/updateGiftGallery')
    } else {
      header = this.service.post_rqst(this.data, 'GiftGallery/addGiftGallery')
    }
    header.subscribe((resp)=>
    {
      if (resp['statusCode'] == 200){
        this.toast.successToastr(resp['statusMsg']);
        this.savingFlag = false;
        this.router.navigate(['/gift-list']);
        this.service.count_list();

      }
      else{
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;
      }
      
    }, error => {
      this.toast.errorToastr(error);
    })
    
  }
  
  
}


