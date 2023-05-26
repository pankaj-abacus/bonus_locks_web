import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DatabaseService } from 'src/_services/DatabaseService';
import { DialogComponent } from 'src/app/dialog.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { ActivatedRoute, Router } from '@angular/router';
import { slideToTop } from '../../router-animation/router-animation.component';


@Component({
  selector: 'app-secondary-order-add',
  templateUrl: './secondary-order-add.component.html',
  styleUrls: ['./secondary-order-add.component.scss']
})
export class SecondaryOrderAddComponent implements OnInit {
  data: any = {};
  savingFlag: boolean = false;
  user_data: any = {};
  secondaryOrder_list = [];
  networkType: any = [];
  quotation_list = [];
  dealerNetwork = [];
  userNameList: any = [];
  categoryList = []
  subCategoryList: any = [];
  itemNameList: any = [];
  loader: boolean;
  q_req_arr: any = []
  drList: any = [];
  Distributor_list: any = [];
  minDate: any;
  search: any;
  order_total: any = ''
  addTolistDisabled: boolean = true;
  item_list: any = [];
  distributorsList = []
  add_list: any[];
  Dr_Data: any;
  product_detail: any = {};
  Dist_state = '';
  addToListButton: boolean = true;
  colorList: any = [];
  product_list: any = [];
  gstPercent: any = '';
  total_qty: any = 0;
  netamount: any = 0;
  total_gst_amount: any = 0;
  order_discount: any = 0;
  new_grand_total: any = 0;
  total_Order_amount: any = '';
  type: any = '';
  SpecialDiscountLable: any = ''
  dis_amt: any = 0;


  constructor(public location: Location, public router: Router, public rout: Router, public serve: DatabaseService, public dialog: DialogComponent, public toast: ToastrManager) {

    this.minDate = new Date();
    // this.getCustomerTypeValue();
    // this.getDealerName();
    this.data.gst_type = 'Gst Paid';

  }

  ngOnInit() {
    this.distributors(this.data.type_name);
    console.log(this.data.type_name)
  }

  save_order() {
    this.user_data.order_status = 'Pending';
    this.savingFlag = true;
    this.user_data.type = this.data.networkType;
    if (this.data['type_name2'].lead_type == "Lead" && this.data['type_name2'].type == "3") {
      this.data.delivery_from = this.data.delivery_from.assign_distributor_id;
    } else {
      this.data.delivery_from = this.data['type_name2'].assign_distributor_id;
    }
    this.user_data.Disctype = this.type;
    this.user_data.order_discount = this.order_discount;
    this.user_data.gst_type = this.data.gst_type;
    this.user_data.SpecialDiscountLable = this.SpecialDiscountLable
    this.user_data.dr_id = this.data.type_name
    this.user_data.distributor_id = this.data.distributor_id
    this.user_data.remark = this.data.remark
    if (this.data.distributor_id && this.data.delivery_from) this.user_data.distributor_id = this.data.delivery_from;

    var orderData = { 'sub_total': this.netamount, 'dis_amt': this.dis_amt, 'grand_total': this.new_grand_total, 'total_gst_amount': this.total_gst_amount, 'total_qty': this.total_qty, 'net_total': this.netamount };
    this.serve.post_rqst({ "cart_data": this.add_list, "user_data": this.user_data, }, "Order/secondaryOrdersAdd").subscribe(resp => {

      if (resp['statusCode'] == 200) {
        this.toast.successToastr(resp['statusMsg'])
        this.savingFlag = false;
        this.rout.navigate(['/secondary-order-list'])
      } else {
        this.toast.errorToastr(resp['statusMsg'])
      }
    }, error => {
      this.savingFlag = false;
      this.toast.errorToastr(error);
    });
  }


  back(): void {
    this.location.back()
  }






  distributors(data, masterSearch: any = '') {
    console.log(data)
    console.log(masterSearch);
    if (masterSearch != '') {
      masterSearch = masterSearch.target.value
    }
    // this.data.type_name2 = []
    this.add_list = []
    this.data.segment = {}
    this.serve.post_rqst({ 'dr_type': '3', 'master_search': masterSearch }, 'Order/followupCustomer').subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.drList = result['result'];
        console.log(this.drList)
      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    });
  }
  searchDealer(event) {
    if (event.text == '') {
      this.distributors('');
    }
    this.search = event.text;
    let wordSearch = this.search;
    setTimeout(() => {
      if (wordSearch == this.search) {
        if (this.search) {
          this.distributors(this.search);
        }
      }
    }, 500);
  }
  searchDistributor_list(event) {
    let retailer_id

    retailer_id = this.data.type_name.id

    this.serve.post_rqst({ 'dealer_id': retailer_id, 'master_search': event.text }, 'AppOrder/getAssignDistributor').then((result) => {
      if (result['statusCode'] == 200) {
        this.Distributor_list = result['distributor_arr'];

      } else {
        this.toast.errorToastr(result['statusMsg'])
      }
    }, err => {

    });

  }


  get_distributor_list(data) {
    this.serve.post_rqst({ 'dealer_id': data }, "Order/getAssignDistributor")
      .subscribe(resp => {
        if (resp['statusCode'] == 200) {
          this.Distributor_list = resp['distributor_arr'];
        } else {
          this.toast.errorToastr(resp['statusMsg'])
        }
      })
  }
  getDistributors(brand) {
    this.serve.post_rqst({ 'brand': brand }, "Master/distributordata").subscribe((result => {
      console.log(result)
      if (result['result']['statusCode'] == 200) {
        this.distributorsList = result['result']['data'];
        console.log(this.distributorsList)
      }
    }))
  }

  MobileNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) { event.preventDefault(); }
  }
  getItemNameList(search) {
    let header

    if (this.subCategoryList.length == 0) {
      header = { "cat_id": this.data.category, "search": search }
    }
    if (this.subCategoryList.length > 0) {
      header = { "sub_cat_id": this.data.sub_category_id }
    }
    this.serve.post_rqst(header, "Quotation/fetchProduct").subscribe((result) => {
      if (result['statusCode'] == 200) {
        this.itemNameList = result['result'];

        this.loader = false;
        this.savingFlag = false;
      }

      else {
        this.dialog.error(result['statusMsg']);
      }
    }, error => {
    })

  }






  numeric_Number(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  conditionedItemHeader: any = {}

  get_item_list(search, list) {
    // this.itemType = list
    this.conditionedItemHeader.filter = {}
    this.conditionedItemHeader.filter.start = 0
    this.conditionedItemHeader.filter.limit = 20;
    this.conditionedItemHeader.filter.order_type = 'secondary';
    this.conditionedItemHeader.filter.search = search;
    if (this.data.type_name != undefined) {
      this.conditionedItemHeader.filter.dr_id = this.data.type_name;
    }
    if (this.data.distributor_id != undefined) {
      let index = this.Distributor_list.findIndex(r => r.id == this.data.distributor_id);
      console.log(index);
      // this.conditionedItemHeader.filter.brand = this.data.distributor_id.brand;
      this.conditionedItemHeader.filter.brand = this.Distributor_list[index].brand;
    }
    // if (this.add_list.length > 0) {
    //   this.conditionedItemHeader.filter.gst = this.product_detail.gst
    //   this.conditionedItemHeader.filter.fixed_brand = this.brandList;
    // }

    let data = {}
    if (list != 'blank') {
      let Segment = list
      let Index = Segment.findIndex(row => row.id == this.data.segment.id)
      this.data.segmentName = Segment[Index].category
      let GST = Segment[Index].gst
      // this.ItemGST = GST
      this.conditionedItemHeader.cat_id = this.data.segment.id
      // this.without_segment = false
    } else {
      this.conditionedItemHeader.cat_id = ''
      // this.without_segment = true
    }

    this.serve.post_rqst(this.conditionedItemHeader, "Order/segmentItems")
      .subscribe(resp => {
        if (resp['statusCode'] == 200) {
          this.item_list = resp['result'];
          for (let index = 0; index < this.item_list.length; index++) {
            this.item_list[index].display_name = this.item_list[index].product_code + " " + this.item_list[index].display_name
          }
        } else {
          this.toast.errorToastr(resp['statusMsg'])
        }
      },
        err => {
        })
  }

  get_product_details() {
    this.data.brand = '';
    this.data.color = '';

    let index = this.Distributor_list.findIndex(r => r.id == this.data.distributor_id);
    console.log(index);
    this.serve.post_rqst({ 'product_id': this.data.product_id, 'brand': this.Distributor_list[index].brand, 'order_type': 'secondary' }, "Order/segmentItemsDetails")
      .subscribe(resp => {
        if (resp['statusCode'] == 200) {
          this.product_detail = resp['result'];
          // this.brandList = this.product_detail['brand'];
          // this.colorList = this.product_detail['color'];
          // if (this.brandList.length == 1) {
          //   this.data.brand = this.brandList[0];
          // }
          if (this.colorList.length == 1) {
            this.data.color = this.colorList[0];
          }

        } else {
          this.toast.errorToastr(resp['statusMsg'])
        }
      })
  }

  get_state_list(dealerData) {
    console.log(dealerData);
    this.Dist_state = dealerData.state;
    this.data.type_name2 = dealerData

  }


  get_product_Size(dr_id, product_id, type, discountValue) {
    setTimeout(() => {
      let Index = this.item_list.findIndex(row => row.id == this.data.product_id);
      if (Index != -1) {
        this.data.product_name = this.item_list[Index].product_name
        this.data.feature_apply = this.item_list[Index].feature_apply
        this.data.product_code = this.item_list[Index].product_code;
        this.data.gstPercent = this.item_list[Index].gst;
      }

      let header;

      if (type == 'listInput') {
        header = { 'state_name': this.Dist_state, 'order_type': 'secondary', 'dr_id': dr_id, 'input_discount': this.data.dr_disc, 'product_id': this.data.product_id, 'gst_type': this.data.gst_type, 'gst_percent': this.data.gstPercent, 'category_id': this.product_detail.category_id, }
      }
      if (type == 'addPrice') {
        header = { 'state_name': this.Dist_state, 'order_type': 'secondary', 'dr_id': dr_id, 'input_discount': 0, 'input_price': this.data.productPrice, 'product_id': this.data.product_id, 'gst_type': this.data.gst_type, 'gst_percent': this.data.gstPercent, 'category_id': this.product_detail.category_id, }
      }
      if (type == 'addDiscount') {
        header = { 'state_name': this.Dist_state, 'order_type': 'secondary', 'input_discount': this.data.dr_disc, 'dr_id': dr_id, 'product_id': this.data.product_id, 'gst_type': this.data.gst_type, 'gst_percent': this.data.gstPercent, 'category_id': this.product_detail.category_id, }
      }

      this.serve.post_rqst(header, "Order/segmentItemPriceWithoutFeatures")
        .subscribe(resp => {
          if (resp['statusCode'] == 200) {
            this.product_list = resp['result'];
            if (this.product_list.length > 0) {
              for (let i = 0; i < this.product_list.length; i++) {
                this.product_list[i].edit_true = false;
                this.data.dr_disc = this.product_list[i].dr_disc;
                this.data.product_price = this.product_list[i].product_price;
                this.data.gst_percent = this.product_list[i].gst_percent;
                this.data.net_price = this.product_list[i].net_price;
                this.data.qty = 0;
              }
            }

            if (this.product_list.length < 1) {
              this.data.product_id = '';
              this.data.brand = '';
              this.data.color = '';
              this.data.dr_disc = '';
              this.toast.errorToastr(resp['statusMsg']);
            }
            this.addToListButton = true;
          } else {
            this.toast.errorToastr(resp['statusMsg'])
          }
        },
          err => {
          });
    }, 400);

  }


  addToList() {
    for (let i = 0; i < this.product_list.length; i++) {
      this.product_list[i]['qty'] = this.data.qty;
      if (this.product_list[i]['qty'] && this.product_list[i]['product_price']) {
        let existIndex = this.add_list.findIndex(row => (row.product_id == this.product_list[i]['product_id'] && row.brand == this.data.brand && row.color == this.data.color));
        console.log()
        if (existIndex != -1) {
          this.add_list.splice(existIndex, 1)
        }
        this.product_list[i]['product_name'] = this.data.product_name;
        this.product_list[i]['product_code'] = this.data.product_code;
        this.product_list[i]['segment_id'] = this.product_detail.category_id;
        this.product_list[i]['item_type'] = this.data.item_type;
        this.product_list[i]['segment_name'] = this.product_detail.category;
        this.product_list[i]['amount'] = parseFloat(this.product_list[i]['qty']) * parseFloat(this.product_list[i]['net_price']);
        this.product_list[i]['color'] = this.data.color;
        this.product_list[i]['brand'] = this.data.brand;
        this.product_list[i]['discount_amount'] = parseFloat(this.product_list[i]['total_discount']) * parseFloat(this.product_list[i]['qty']);
        this.product_list[i]['discounted_price'] = parseFloat(this.product_list[i]['total_discount']) * parseFloat(this.product_list[i]['qty']);


        if (this.data.gst_type == 'Gst Paid') {
          this.product_list[i]['gst_amount'] = parseFloat(this.product_list[i]['amount']) - ((((this.product_list[i]['amount'] * 100))) / (parseFloat(this.product_list[i]['gst_percent'] + 100)));
          this.product_list[i]['gst_percent'] = this.product_list[i]['gst_percent'];
          this.product_list[i]['total_amount'] = (this.product_list[i]['amount']);
          this.product_list[i]['dr_disc'] = this.product_list[i]['dr_disc'];
          this.add_list.push(this.product_list[i]);
        }
        if (this.data.gst_type == 'Gst Extra') {
          this.product_list[i]['gst_amount'] = (((this.product_list[i]['amount']) * (this.product_list[i]['gst_percent'])) / 100);
          this.product_list[i]['gst_percent'] = this.product_list[i]['gst_percent'];
          this.product_list[i]['total_amount'] = parseFloat(this.product_list[i]['gst_amount']) + (this.product_list[i]['amount']);
          this.product_list[i]['dr_disc'] = this.product_list[i]['dr_disc'];
          this.add_list.push(this.product_list[i]);
        }
      }

    }

    this.total_qty = 0;
    this.netamount = 0;
    this.order_total = 0;
    this.total_gst_amount = 0;
    this.total_Order_amount = 0;
    this.order_discount = 0;

    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty += parseInt(this.add_list[i]['qty']);
      this.total_gst_amount = parseFloat(this.add_list[i].gst_amount) + parseFloat(this.total_gst_amount);
      this.total_Order_amount = parseFloat(this.total_Order_amount) + (parseFloat(this.add_list[i]['product_price']) * this.add_list[i]['qty']);
      this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
      this.order_discount += parseFloat(this.add_list[i].total_discount) * parseInt(this.add_list[i]['qty']);
      this.order_total = parseFloat(this.order_total) + parseFloat(this.add_list[i]['amount']);
    }
    this.total_gst_amount = parseFloat(this.total_gst_amount);
    this.total_gst_amount = this.total_gst_amount;
    this.total_Order_amount = this.total_Order_amount;
    this.order_total = this.order_total;
    this.order_discount = this.order_discount;
    if (this.data.gst_type == 'Gst Extra') {
      this.new_grand_total = parseFloat(this.order_total) + parseFloat(this.total_gst_amount);
    } else {
      this.new_grand_total = parseFloat(this.order_total)
      // this.new_grand_total = parseFloat(this.netamount)
    }
    console.log(this.add_list);


    this.data.brand = '';
    this.data.color = '';
    this.product_list = [];
    this.data.product_id = '';
    this.addToListButton = true;
  }


  listdelete(i) {
    this.add_list.splice(i, 1);
    this.total_qty = 0;
    this.netamount = 0;
    this.total_gst_amount = 0;
    this.order_total = 0;
    this.order_discount = 0;
    this.new_grand_total = 0;
    this.total_Order_amount = 0;
    for (let i = 0; i < this.add_list.length; i++) {
      this.total_qty = parseInt(this.total_qty) + parseInt(this.add_list[i]['qty']);
      this.netamount = parseFloat(this.netamount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['net_price']);
      this.total_Order_amount = parseFloat(this.total_Order_amount) + parseInt(this.add_list[i]['qty']) * parseFloat(this.add_list[i]['product_price']);
      this.order_discount += parseFloat(this.add_list[i].total_discount) * parseInt(this.add_list[i]['qty']);
      this.total_gst_amount = this.add_list[i].gst_amount + this.total_gst_amount;
      this.order_total += parseFloat(this.add_list[i]['amount']);

    }
    if (this.data.gst_type == 'Gst Extra') {
      this.new_grand_total = parseFloat(this.order_total) + parseFloat(this.total_gst_amount);
    } else {
      this.new_grand_total = parseFloat(this.order_total);
      // this.new_grand_total = parseFloat(this.netamount)

    }
    this.total_qty = parseInt(this.total_qty);
    this.netamount = parseFloat(this.netamount);
    this.total_gst_amount = this.total_gst_amount;
    this.total_Order_amount = this.total_Order_amount;

  }


}

