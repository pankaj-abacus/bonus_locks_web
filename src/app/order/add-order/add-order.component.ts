import { Component, OnInit } from '@angular/core';
import { slideToTop } from '../../router-animation/router-animation.component';
import { DatabaseService } from 'src/_services/DatabaseService';
import { ActivatedRoute } from '@angular/router';
import { DialogComponent } from '../../dialog.component';
import { Router } from '@angular/router';
// import { $ } from 'protractor';
import * as $ from 'jquery';
import { sessionStorage } from 'src/app/localstorage.service';
import { Toastr, ToastrManager } from 'ng6-toastr-notifications';
// import { QuillEditorComponent } from 'ngx-quill/src/quill-editor.component';



@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  animations: [slideToTop()]

})
export class AddOrderComponent implements OnInit {

  pageType: any = '';
  data: any = {};
  add_list: any = [];
  savingFlag: boolean = false;
  networkType: any = [];
  Dist_state = '';
  SpecialDiscountLable: any = '';
  conditionedItemHeader: any = {};
  product_detail: any = {};
  item_list: any = [];
  brandList: any = [];
  colorList: any = [];
  temp_add_list: any = [];
  total_qty: any = 0;
  netamount: any = 0;
  total_gst_amount: any = 0;
  order_grand_total: any = 0;
  total_discount: any = 0;
  sub_total_before_cd: any = 0;
  total_Order_amount: any = ''
  product_resp: boolean;
  order_total: any = '';
  addToListButton: boolean = true;
  product_list: any = [];
  without_segment: boolean = false;
  cash_discount_percent: any = 0;
  sub_total_after_cd: any = 0;
  grand_total_before_tcs: any = 0;
  drList: any = [];
  cd_value: any = 0;
  ins_value: any = 0;
  tcs_value: any = 0;
  discounted_price: number;
  addTolistDisabled: boolean = true;
  product_name: any;
  product_category: any;
  product_code: any;
  user_data: any={};
  disableSelectFromCheckin: boolean;
  drtype: any;
  type: any;
  navBar: any;
  appCtrl: any;
  order_item: any;
  order_data: any;
  leave: number;
  special_discount: any;
  spcl_dis_amt: any;
  grand_total: number;
  // public navParams: NavParams,
  constructor(public serve: DatabaseService,
    public navparams: ActivatedRoute,
    public alert: DialogComponent,
    public toast: ToastrManager, public route: ActivatedRoute, public rout: Router, public dialog: DialogComponent, public session: sessionStorage) {
   
  }

  ngOnInit() {
    this.data.variableDiscount = 0
  }


  back() {
    window.history.go(-1);
  }

  distributors(data, search: any = '') {
    console.log(data)
    console.log(search);
    if (search != '') {
      search = search.target.value
    }
    // this.data.type_name2 = []
    this.add_list = []
    this.data.segment = {}
    this.serve.post_rqst({ 'dr_type': data, 'search': search }, 'Order/followupCustomer').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.drList = result['result'];
        // console.log(this.drList)
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }



  get_item_list(event: any = '') {
    let search
    if (event != '') {
      search = event.target.value
    }
    this.conditionedItemHeader.filter = {}
    this.conditionedItemHeader.filter.order_type = 'primary';
    this.conditionedItemHeader.filter.search = search;
    if (this.add_list.length > 0) {
      this.conditionedItemHeader.filter.gst = this.product_detail.gst
    }

    // if (this.drList.length > 0) {
    //   let newIndex = this.drList.findIndex(row => row.id == this.data.type_name2.id);
    //   this.conditionedItemHeader.filter.brand = this.drList[newIndex]['brand'] || this.data.type_name2.brand;
    //   this.conditionedItemHeader.filter.dr_id = this.drList[newIndex]['id'];
    // }

    this.serve.post_rqst(this.conditionedItemHeader, "Order/segmentItems")
      .subscribe((resp) => {
        if (resp['statusCode'] == 200) {
          this.item_list = resp['result'];
          for (let index = 0; index < this.item_list.length; index++) {
            this.item_list[index].display_name = this.item_list[index].product_code + " " + this.item_list[index].display_name
          }
        } else {
          this.toast.errorToastr(resp['statusMsg']);
        }

        // this.data.item_type='';
        // this.data.qty='';
        // this.data.subtotal='';

      }, err => {

      })
  }


  get_product_details() {

    this.data.brand = '';
    this.data.color = '';
    console.log(this.data.product_id);
    // this.product_id='';
    this.serve.post_rqst({ 'product_id': this.data.product_id, 'order_type': 'primary', 'brand': this.drList.brand }, "Order/segmentItemsDetails")
      .subscribe(resp => {
        if (resp['statusCode'] == 200) {
          this.product_detail = resp['result'];
          // this.product_name=resp['result']['product_name']
          // this.product_code=resp['result']['product_code']
          // this.product_category=resp['result']['category']


          // this.brandList = this.product_detail['brand'];
          // this.colorList = this.product_detail['color'];
          // if (this.brandList.length == 1) {
          //   this.data.brand = this.brandList[0];
          // }
          if (this.colorList.length == 1) {
            this.data.color = this.colorList[0];
          }

          this.get_product_Size(this.drList.id, this.data.product_id)

        } else {
          this.toast.errorToastr(resp['statusMsg'])
        }



      })
  }

  gettypeName(fulldata) {
    console.log(fulldata);
    this.data.type_name2 = fulldata
    // this.data.type_name2=this.data.type_name22
    this.Dist_state = fulldata.state

  }

  get_state_list(type) {
    console.log("object" + type)
    this.Dist_state = this.drList.state
  }
  get_product_Size(dr_id, product_id) {
    console.log(this.data.type_name2)
    let Feature_Api = ""
    let Index = this.item_list.findIndex(row => row.id == this.data.product_id.id)
    if (Index != -1) {
      this.data.product_name = this.item_list[Index].product_name
      this.data.feature_apply = this.item_list[Index].feature_apply
      this.data.product_code = this.item_list[Index].product_code
    }
    this.serve.post_rqst({ 'state_name': this.Dist_state, 'dr_id': this.data.type_name2.id, 'category_id': this.product_detail.category_id, 'gst_percent': this.product_detail.gst, 'product_id': this.data.product_id }, "Order/segmentItemPriceWithoutFeatures")
      .subscribe(resp => {
        if (resp['statusCode'] == 200) {
          this.product_resp = true
          this.product_list = resp['result'];
          this.data.price = this.product_list[0].product_price
          this.data.total_discount = this.product_list[0].total_discount
          console.log(this.data.total_discount)
          console.log(this.product_list)
          if (this.product_list.length > 0) {
            for (let i = 0; i < this.product_list.length; i++) {
              this.product_list[i].edit_true = false;
            }
          }
        } else {
          this.toast.errorToastr(resp['statusMsg'])
          this.product_resp = false
        }
      },
        err => {
        })
  }





  calculate(qty, price, discount) {

    // this.data.subtotal = parseFloat(qty) * parseFloat(price);
    // if (this.pop.qty > 0) {
    //   this.addTolistDisabled = false
    // } else {
    //   this.addTolistDisabled = true;
    // }
  };

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }

  onCloseItemList() {
    this.data.item_type = '';
    this.data.qty = '';
    this.data.subtotal = '';
    this.addTolistDisabled = false
  }


  getTNC() {
    this.serve.post_rqst({}, "Quotation/fetchTermAndConditions").subscribe((result => {
      console.log(result);

      if (result['statusCode'] == 200) {
        this.user_data.tnc = result['result']['tnc'];
        console.log(this.user_data.tnc);
      }
      else {
        this.dialog.error(result['statusMsg']);
      }

      this.user_data.tnc = `1.Total Amount will be paid by CHQ / RTGS /NEFT.<br>
      2.Taxes: GST 18% is including on net billed (as per actual).<br>
      3.100 % amount needs to be paid in advance at the time of Poraise.<br>
      4.Any discount or offers valid till 5 days post final quotation.<br>
      5.Supply of order will depend on the quantity.<br>
      6.TransportationCharges extra.<br>
      7.After the material is ready, the client has to take his material within 30days.<br>
      8.After 30 days Company will charge 2% storage penalty as per actual billed also company will not take any responsibility for any material damages`
    }))
  }


  addToList() {

    for (let i = 0; i < this.product_list.length; i++) {
      if (this.product_list[i]['qty']) {
        let existIndex
        existIndex = this.add_list.findIndex(row => row.product_id == this.product_list[i]['product_id']);


        if (existIndex == -1) {
          this.product_list[i]['discounted_price'] = this.product_list[i]['total_discount'] * this.product_list[i]['qty']
          this.product_list[i]['product_name'] = this.product_detail.product_name;
          this.product_list[i]['item_type'] = this.data.item_type;
          this.product_list[i]['segment_id'] = this.data.segment.id;
          // this.product_list[i]['brand'] = this.data.brand;
          // this.product_list[i]['discounted_price'] = this.data.discounted_price;
          // this.product_list[i]['color'] = this.data.color;
          this.product_list[i]['segment_id'] = this.product_detail.category_id;
          this.product_list[i]['segment_name'] = this.product_detail.category;
          this.product_list[i]['product_code'] = this.product_detail.product_code;
          this.product_list[i]['amount'] = parseFloat(this.product_list[i]['qty']) * (this.product_list[i]['net_price']).toFixed(2);;
          this.product_list[i]['gst_amount'] = (((this.product_list[i]['amount']) * (this.product_detail.gst)) / 100).toFixed(2);
          this.product_list[i]['gst_percent'] = (this.product_detail.gst);
          this.product_list[i]['total_amount'] = (parseFloat(this.product_list[i].gst_amount) + parseFloat(this.product_list[i].amount)).toFixed(2);
          this.add_list.push(this.product_list[i]);
          this.temp_add_list.push(this.product_list[i])

        }
        else {

          this.product_list[i]['product_name'] = this.product_detail.product_name;
          this.product_list[i]['segment_id'] = this.data.segment.id;
          this.product_list[i]['segment_id'] = this.product_detail.category_id;
          this.product_list[i]['segment_name'] = this.product_detail.category;
          this.product_list[i]['product_code'] = this.product_detail.product_code;
          // this.product_list[i]['brand'] = this.data.brand;
          // this.product_list[i]['color'] = this.data.color;
          this.add_list[existIndex]['qty'] = parseInt(this.add_list[existIndex]['qty']) + parseInt(this.product_list[i]['qty']);
          this.add_list[existIndex]['amount'] = parseFloat(this.add_list[existIndex]['amount']) + parseInt(this.product_list[i]['qty']) * parseFloat(this.product_list[i]['net_price']);
          this.add_list[existIndex]['gst_amount'] = ((this.add_list[existIndex]['amount']) * (this.product_detail.gst)) / 100;

          // this.add_list[existIndex].total_item_discount = parseInt(this.product_list[i].total_discount) * parseInt(this.product_list[i]['qty'])
          this.add_list[existIndex].gst_percent = (this.product_detail.gst);
          this.add_list[existIndex].total_amount = parseFloat(this.add_list[existIndex].gst_amount) + parseFloat(this.add_list[existIndex].amount);

        }
        console.log(this.add_list)
        console.log(this.temp_add_list)
      }

    }

    this.total_qty = 0;
    this.netamount = 0;
    this.total_gst_amount = 0;
    this.total_discount = 0;
    this.total_Order_amount = 0;
    this.order_total = 0;

    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
      this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['product_price']) * this.add_list[i]['qty']);
      this.total_discount = parseFloat(this.add_list[i].total_discount) * parseFloat(this.add_list[i]['qty']) + parseFloat(this.total_discount);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
      this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
      this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
      this.discounted_price = parseFloat(this.total_qty) * parseFloat(this.total_discount);
      // this.item_type = parseFloat(this.total_qty)*parseFloat(this.total_discount);
    }

    this.total_Order_amount = parseFloat(this.total_Order_amount);
    this.total_discount = parseFloat(this.total_discount);
    this.sub_total_before_cd = parseFloat(this.order_total);
    this.cash_discount_percent = parseFloat(this.data.type_name2.cash_discount_percentage);
    this.cd_value = parseFloat(this.sub_total_before_cd) * this.cash_discount_percent / 100;
    this.sub_total_after_cd = parseFloat(this.sub_total_before_cd) - parseFloat(this.cd_value);
    // this.ins_value = parseFloat(this.sub_total_after_cd) * 0.06 / 100;
    this.order_total = parseFloat(this.sub_total_after_cd)
    this.total_gst_amount = parseFloat(this.order_total) * parseFloat(this.product_detail.gst) / 100;
    this.grand_total_before_tcs = (parseFloat(this.order_total) + parseFloat(this.total_gst_amount));
    this.tcs_value = parseFloat(this.grand_total_before_tcs) * parseFloat(this.data.type_name2.tcs_percentage) / 100;
    this.order_grand_total = (parseFloat(this.grand_total_before_tcs) + (this.tcs_value));

    this.product_list = [];
    this.data.brand = '';
    this.data.color = '';
    this.data.product_id = '';
    this.addTolistDisabled = true;
  }

 

  DeleteItem(i) {
    let alert = this.alert.confirm({
      title: 'Are You Sure?',
      text: 'Your Want To Delete This Item ',
      type: 'alert-modal',


      buttons: [{
        text: 'No',
        role: 'cancel',
        handler: () => {
        }
      },
      {
        text: 'Yes',
        handler: () => {
          this.listdelete(i)

        }
      }]
    });
    // alert.present();
  }
  listdelete(i) {
    this.add_list.splice(i, 1);
    this.total_qty = 0;
    this.netamount = 0;
    this.total_gst_amount = 0;
    this.total_discount = 0;
    this.total_Order_amount = 0;
    this.order_total = 0;

    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = (parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']));
      this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
      this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
      this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['product_price']) * this.add_list[i]['qty']);
      this.total_gst_amount = parseInt(this.add_list[i].gst_amount) + parseInt(this.total_gst_amount);
      this.total_discount = parseInt(this.add_list[i].total_discount) * parseInt(this.add_list[i]['qty']) + parseInt(this.total_discount);
    }

    this.total_Order_amount = this.total_Order_amount;
    this.total_discount = this.total_discount;
    this.sub_total_before_cd = this.order_total;
    this.cash_discount_percent = this.data.type_name2.cash_discount_percentage;
    console.log(this.cash_discount_percent);
    this.cd_value = this.sub_total_before_cd * this.cash_discount_percent / 100;
    console.log(this.cd_value);
    this.sub_total_after_cd = this.sub_total_before_cd - (this.cd_value);
    console.log(this.sub_total_after_cd);

    // this.ins_value = this.sub_total_after_cd * 0.06 / 100;

    this.order_total = this.sub_total_after_cd

    this.total_gst_amount = this.order_total * this.product_detail.gst / 100;

    this.grand_total_before_tcs = (parseFloat(this.order_total) + parseFloat(this.total_gst_amount));

    this.tcs_value = this.grand_total_before_tcs * this.data.type_name2.tcs_percentage / 100;

    this.order_grand_total = (parseFloat(this.grand_total_before_tcs) + (this.tcs_value));


  }

  save_orderalert(type) {
    var str
    
    if (this.grand_total > 20000000) {
      this.dialog.error("Maximum order value is 2 Cr. !");
      return;
    }
    if (type == 'draft') {
      str = 'You want to save this order as draft ?'
      this.savingFlag = true;
    }
    else {
      str = 'You want to submit this order ?'
    }

    this.dialog.confirm("Are You Sure?").then((result) => {
      if (result) {
        this.user_data.order_status = 'Pending'
        this.submitOrder(type);
      }
    })


  }


  

  submitOrder(type) {
    this.savingFlag = true;

    this.leave = 1
    this.user_data.type = this.data.networkType;

    if (this.data['type_name2'].lead_type == "Lead" && this.data['type_name2'].type == "3") {
      this.data.delivery_from = this.data.delivery_from.id;
      this.savingFlag = false;
    } else {
      this.data.delivery_from = this.data.type_name;
      this.savingFlag = false;
    }

    this.special_discount = this.special_discount;
    this.user_data.special_discount_amount = this.spcl_dis_amt;
    this.user_data.Disctype = this.type;
    this.user_data.SpecialDiscountLable = this.SpecialDiscountLable
    this.user_data.dr_id = this.data.type_name2.id
    this.user_data.remark = this.data.remark;

    console.log(this.data.type_name2);

    this.user_data.total_Order_amount = this.total_Order_amount;
    this.user_data.total_discount = this.total_discount;
    this.user_data.sub_total_before_cd = this.sub_total_before_cd;
    this.user_data.cash_discount_percent = this.cash_discount_percent;
    this.user_data.tcs_percent = this.data.type_name2.tcs_percentage;

    this.user_data.gst_percent = this.product_detail.gst;
    this.user_data.cd_value = this.cd_value;
    this.user_data.sub_total_after_cd = this.sub_total_after_cd;
    // this.user_data.ins_value = this.ins_value;
    this.user_data.order_total = this.order_total;
    this.user_data.total_gst_amount = this.total_gst_amount;
    this.user_data.grand_total_before_tcs = this.grand_total_before_tcs;
    this.user_data.tcs_value = this.tcs_value;
    this.user_data.order_grand_total = this.order_grand_total;


    this.user_data.product_code = this.data.product_code
    if (this.data.distributor_id && this.data.delivery_from) this.user_data.distributor_id = this.data.delivery_from

    this.serve.post_rqst({ "cart_data": this.add_list, "user_data": this.user_data}, "Order/primaryOrdersAdd").subscribe(resp => {
      this.savingFlag = true;

      if (resp['statusCode'] == 200) {
        var toastString = ''
        if (this.user_data.order_status == 'Draft') {
          this.toast.successToastr(resp['statusMsg'])
          this.savingFlag = false;

        }
        else {
          this.toast.successToastr(resp['statusMsg'])
          this.savingFlag = false;

        }

        this.rout.navigate(['/order-list']);

      } else {
        this.toast.errorToastr(resp['statusMsg']);
        this.savingFlag = false;

      }
    },
      error => {
        this.savingFlag = false;
        // this.btnDisableDraft = false;
        // this.btnDisableSave = false;
        // this.toast.errorToastr(resp['statusMsg']);
        // this.service.dismiss();
      })

  }

}
