import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { sessionStorage } from 'src/app/localstorage.service';

@Component({
  selector: 'app-dist-primary-order-add',
  templateUrl: './dist-primary-order-add.component.html',
  styleUrls: ['./dist-primary-order-add.component.scss']
})
export class DistPrimaryOrderAddComponent implements OnInit {
  data:any={}
  dr_id:any;
  dr_detail: any;
  items:any=[];
  product_list:any=[];
  add_list:any=[]
  product_resp: boolean;
  special_discount: any = 0;
  nexturl:any;
  product_detail: any = {};
  brandList: any = [];
  colorList: any = [];
  temp_add_list: any = [];
  total_qty: any = 0;
  netamount: any = 0;
  total_gst_amount: any = 0;
  order_grand_total: any = 0;
  sub_total: any = 0;
  dis_amt: any = 0;
  gst_amount: any = 0;
  net_total: any = 0;
  spcl_dis_amt: any = 0
  grand_total: any = 0;
 order_discount: any = 0;
 sub_total_before_cd: any = 0;
 sub_total_after_cd: any = 0;
 grand_total_before_tcs: any = 0;
 order_total: any = 0;
 cash_discount_percent: any = 0;
 total_Order_amount: any = ''
 cd_value: any = 0;
 ins_value: any = 0;
 tcs_value: any = 0;
 addToListButton: boolean = true;
 savingFlag: boolean = false;
 user_data:any={};
 SpecialDiscountLable:any=''
 login_data: any = {};
 loader:boolean=false;
  constructor(public serve: DatabaseService,public route: ActivatedRoute, public toast: ToastrManager,public dialog: DialogComponent,private router: Router,public session: sessionStorage, ) {
    this.login_data = this.session.getSession();
    this.login_data = this.login_data.value;
    this.login_data = this.login_data.data;
    console.log(`this.login_data`, this.login_data);
   }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
      this.dr_id = params.id;
      console.log(this.dr_id);
      this.distributorDetail()
      this.data.total_coupon='Abcd qwwewe wewe'
    })
  }
  distributorDetail() {

    this.loader=true
    let id = { "id": this.dr_id }
    this.serve.post_rqst(id, "CustomerNetwork/distributorDetail").subscribe((result) => {
        if (result['statusCode'] == 200) {
            this.loader=false
            this.dr_detail = result['distributor_detail'];
            this.getitem('',this.dr_detail.brand)
        } else {
            this.loader=true
            this.toast.errorToastr(result['statusMsg'])
        }
        
    })
}

getitem(search,brand){
  this.loader=true
  this.serve.post_rqst({ 'data':{ 'dr_id':this.dr_id,'brand': brand},'filter':{'search':search}}, "Order/segmentItems")
        .subscribe(resp => {
          console.log(resp);
          
          if (resp['statusCode'] == 200) {
            this.loader=false
            this.items = resp['result'];
            console.log(this.items);
            
        } else {
            this.loader=false
            this.toast.errorToastr(resp['statusMsg'])
        }
        })
}

  get_product_details(id) {
    this.data.brand = '';
    this.data.color = '';
    this.loader=true
    this.serve.post_rqst({ 'product_id': id, 'order_type': 'primary', 'brand': this.dr_detail.brand }, "Order/segmentItemsDetails")
        .subscribe(resp => {

            if (resp['statusCode'] == 200) {
                this.loader=false
                this.product_detail = resp['result'];
                this.brandList = this.product_detail['brand'];
                this.colorList = this.product_detail['color'];
                if (this.brandList.length == 1) {
                    this.data.brand = this.brandList[0];
                }
                if (this.colorList.length == 1) {
                    this.data.color = this.colorList[0];
                }

            } else {
                this.toast.errorToastr(resp['statusMsg'])
                this.loader=false
            }
        })
}
gst:any;
get_product_Size(dr_id, product_id) {
  let Feature_Api = ""
  let Index = this.items.findIndex(row => row.id == product_id)
  if (Index != -1) {
      this.data.product_name = this.items[Index].product_name
      this.data.feature_apply = this.items[Index].feature_apply
      this.data.product_code = this.items[Index].product_code
      this.gst=this.items[Index].gst
  }
  this.loader=true
  console.log(this.product_detail.category_id)
  console.log(this.product_detail)
  setTimeout(() => {
      this.serve.post_rqst({ 'state_name': this.dr_detail.state, 'dr_id': dr_id, 'category_id': this.product_detail.category_id, 'gst_percent': this.gst, 'product_id':product_id }, "Order/segmentItemPriceWithoutFeatures")
          .subscribe(resp => {
              if (resp['statusCode'] == 200) {
                this.loader=false
                  this.product_resp = true
                  this.product_list = resp['result'];

                  if (this.product_list.length > 0) {
                      for (let i = 0; i < this.product_list.length; i++) {
                          this.product_list[i].edit_true = false;
                      }
                  }
              } else {
                this.toast.errorToastr(resp['statusMsg'])
                  this.product_resp = false
                  this.loader=false
              }
          },
              err => {
              })
  }, 200);
}
addToList() {
  for (let i = 0; i < this.product_list.length; i++) {
      if (this.product_list[i]['qty']) {
          let existIndex
          existIndex = this.add_list.findIndex(row => row.product_id == this.product_list[i]['product_id'] && row.brand == this.data.brand && row.color == this.data.color);
          if (existIndex == -1) {
              this.product_list[i]['product_name'] = this.data.product_name;
              // this.product_list[i]['segment_id'] = this.data.segment.id;
              this.product_list[i]['brand'] = this.data.brand;
              this.product_list[i]['color'] = this.data.color;
              this.product_list[i]['segment_id'] = this.product_detail.category_id;
              this.product_list[i]['segment_name'] = this.product_detail.category;
              this.product_list[i]['product_code'] = this.data.product_code;
              this.product_list[i]['amount'] = parseFloat(this.product_list[i]['qty']) * (this.product_list[i]['net_price']);
              this.product_list[i]['gst_amount'] = (((this.product_list[i]['amount']) * (this.product_detail.gst)) / 100);
              this.product_list[i]['gst_percent'] = (this.product_detail.gst);
              this.product_list[i]['total_amount'] = parseFloat(this.product_list[i].gst_amount) + parseFloat(this.product_list[i].amount);
              this.add_list.push(this.product_list[i]);
              this.temp_add_list.push(this.product_list[i])
          }
          else {
              this.product_list[i]['product_name'] = this.data.product_name;
              // this.product_list[i]['segment_id'] = this.data.segment.id;
              this.product_list[i]['segment_id'] = this.product_detail.category_id;
              this.product_list[i]['segment_name'] = this.product_detail.category;
              this.product_list[i]['product_code'] = this.data.product_code;
              this.product_list[i]['brand'] = this.data.brand;
              this.product_list[i]['color'] = this.data.color;
              this.add_list[existIndex]['qty'] = parseInt(this.add_list[existIndex]['qty']) + parseInt(this.product_list[i]['qty']);
              this.add_list[existIndex]['amount'] = parseFloat(this.add_list[existIndex]['amount']) + parseInt(this.product_list[i]['qty']) * parseFloat(this.product_list[i]['net_price']);
              this.add_list[existIndex]['gst_amount'] = ((this.add_list[existIndex]['amount']) * (this.product_detail.gst)) / 100;

              // this.add_list[existIndex].total_item_discount = parseInt(this.product_list[i].discounted_price) * parseInt(this.product_list[i]['qty'])
              this.add_list[existIndex].gst_percent = (this.product_detail.gst);
              this.add_list[existIndex].total_amount = parseFloat(this.add_list[existIndex].gst_amount) + parseFloat(this.add_list[existIndex].amount);

          }
      }

  }

  this.total_qty = 0;
  this.netamount = 0;
  this.total_gst_amount = 0;
  this.order_discount = 0;
  this.total_Order_amount = 0;
  this.order_total = 0;

  for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
      this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['product_price']) * this.add_list[i]['qty']);
      this.order_discount = parseFloat(this.add_list[i].discounted_price) * parseFloat(this.add_list[i]['qty']) + parseFloat(this.order_discount);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
      this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
      this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
  }

  this.total_Order_amount = parseFloat(this.total_Order_amount);
  this.order_discount = parseFloat(this.order_discount);
  this.sub_total_before_cd = parseFloat(this.order_total);
  this.cash_discount_percent = parseFloat(this.dr_detail.cash_discount_percentage);
  this.cd_value = parseFloat(this.sub_total_before_cd) * this.cash_discount_percent / 100;
  this.sub_total_after_cd = parseFloat(this.sub_total_before_cd) - parseFloat(this.cd_value);
  this.ins_value = parseFloat(this.sub_total_after_cd) * 0.06 / 100;
  this.order_total = parseFloat(this.sub_total_after_cd) + parseFloat(this.ins_value)
  this.total_gst_amount = parseFloat(this.order_total) * parseFloat(this.product_detail.gst) / 100;
  this.grand_total_before_tcs = (parseFloat(this.order_total) + parseFloat(this.total_gst_amount));
  this.tcs_value = parseFloat(this.grand_total_before_tcs) * parseFloat(this.dr_detail.tcs_percentage) / 100;
  this.order_grand_total = (parseFloat(this.grand_total_before_tcs) + (this.tcs_value));

  this.product_list = [];
  this.data.brand = '';
  this.data.color = '';
  this.data.product_id = '';
  this.addToListButton = true;
}


listdelete(i) {
  this.add_list.splice(i, 1);
  this.total_qty = 0;
  this.netamount = 0;
  this.total_gst_amount = 0;
  this.order_discount = 0;
  this.total_Order_amount = 0;
  this.order_total = 0;
  console.log(this.add_list);
  
  for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
      this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
      this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
      this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['product_price']) * this.add_list[i]['qty']);
      this.total_gst_amount = parseInt(this.add_list[i].gst_amount) + parseInt(this.total_gst_amount);
      this.order_discount = parseFloat(this.add_list[i].discounted_price) * parseInt(this.add_list[i]['qty']) + parseFloat(this.order_discount);
  }

  this.total_Order_amount = this.total_Order_amount;
  this.order_discount = this.order_discount;
  this.sub_total_before_cd = this.order_total;
  this.cash_discount_percent = this.dr_detail.cash_discount_percentage;
  console.log(this.cash_discount_percent);
  this.cd_value = this.sub_total_before_cd * this.cash_discount_percent / 100;
  console.log(this.cd_value);
  this.sub_total_after_cd = this.sub_total_before_cd - (this.cd_value);
  console.log(this.sub_total_after_cd);

  this.ins_value = this.sub_total_after_cd * 0.06 / 100;

  this.order_total = this.sub_total_after_cd + (this.ins_value)

  this.total_gst_amount = this.order_total * this.product_detail.gst / 100;

  this.grand_total_before_tcs = (parseFloat(this.order_total) + parseFloat(this.total_gst_amount));

  this.tcs_value = this.grand_total_before_tcs * this.dr_detail.tcs_percentage / 100;

  this.order_grand_total = (parseFloat(this.grand_total_before_tcs) + (this.tcs_value));


}
save_orderalert() {
  var str

  if (this.grand_total > 20000000) {
    this.dialog.error("Max order value reached, Maximum order value is 2 Cr. !")
  }
  else{
    this.dialog.confirm("You want to submit this order ?").then((result) => {
      if (result) {
        this.save_order()
      }
  })

}
}
save_order() {
    this.savingFlag = true;
    this.user_data.type = '1';

    // if (this.data['type_name'].lead_type == "Lead" && this.data['type_name'].type == "3") {
    //     this.data.delivery_from = this.data.delivery_from.id;
    // } else {
    //     this.data.delivery_from = this.data['type_name'].id;
    // }

    this.special_discount = this.special_discount;
    this.user_data.special_discount_amount = this.spcl_dis_amt;
    this.user_data.Disctype = '1';
    this.user_data.SpecialDiscountLable = this.SpecialDiscountLable
    this.user_data.dr_id = this.dr_id
    this.user_data.remark = this.data.remark;

    this.user_data.total_Order_amount = this.total_Order_amount;
    this.user_data.order_discount = this.order_discount;
    this.user_data.sub_total_before_cd = this.sub_total_before_cd;
    this.user_data.cash_discount_percent = this.cash_discount_percent;
    this.user_data.tcs_percent = this.dr_detail.tcs_percentage;

    this.user_data.gst_percent = this.product_detail.gst;
    this.user_data.cd_value = this.cd_value;
    this.user_data.sub_total_after_cd = this.sub_total_after_cd;
    this.user_data.ins_value = this.ins_value;
    this.user_data.order_total = this.order_total;
    this.user_data.total_gst_amount = this.total_gst_amount;
    this.user_data.grand_total_before_tcs = this.grand_total_before_tcs;
    this.user_data.tcs_value = this.tcs_value;
    this.user_data.order_grand_total = this.order_grand_total;


    this.user_data.product_code = this.data.product_code
    if (this.data.distributor_id && this.data.delivery_from)
        this.user_data.distributor_id = this.data.delivery_from

    // var orderData = { 'sub_total': this.netamount, 'dis_amt': this.dis_amt, 'grand_total': this.order_grand_total, 'total_gst_amount': this.total_gst_amount, 'total_qty': this.total_qty, 'net_total': this.netamount, 'special_discount': this.special_discount, 'special_discount_amount': this.spcl_dis_amt }

    this.serve.post_rqst({ "cart_data": this.add_list, "user_data": this.user_data,}, "Order/primaryOrdersAdd").subscribe(resp => {
        if (resp['statusCode'] == 200) {
            var toastString = ''
            if (this.user_data.order_status == 'Draft') {
                this.dialog.success('',resp['statusMsg'])
                // this.btnDisableDraft = false;
                // this.btnDisableSave = false;
            }
            else {
              this.dialog.success('',resp['statusMsg'])
                // this.btnDisableDraft = false;
                // this.btnDisableSave = false;
            }

            this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list/1/Channel%20Partner/distribution-detail/'+this.login_data['id']+'/'+'Primary Order';
            // this.router.navigate(['/distribution-list'])
            this.router.navigate([this.nexturl]);

        } else {
          this.dialog.error(resp['statusMsg']);
          
        }
    },
     error => {
          
           
     })



}
back(){
  this.nexturl = this.route.snapshot.queryParams['returnUrl'] || '/distribution-list/1/Channel%20Partner/distribution-detail/'+this.login_data['id']+'/'+'Primary Order';
  // this.router.navigate(['/distribution-list'])
  this.router.navigate([this.nexturl]);

}

}


