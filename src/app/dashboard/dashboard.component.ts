import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/_services/DatabaseService'
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { sessionStorage } from '../localstorage.service';
import { FormControl } from '@angular/forms'
import { Chart } from 'chart.js';
import * as Highcharts from 'highcharts/highmaps';
import { DatePipe } from '@angular/common';
import indiaMap from '../../assets/indiaMap';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})


export class DashboardComponent implements OnInit {

  targetTilesData: any = {}
  targetTilesData1: any = {}
  today_date: any = new Date()
  currentFinancialYearTarget: any = {}
  currentFinancialYearTarget1: any = {}
  currentMonthTarget: any = {}
  currentMonthTarget1: any = {}
  productCategoryReport: any = []
  financialYearSalesReport: any = []
  regionWiseReport: any = []
  salesMeterReport: any = {}
  visitMeterReport: any = {}
  segmentBrandWise: any = [];
  financialYearSalesGrowth: any = [];
  multiStackedConfig: any = [];
  // charts
  vbulletConfig: any;
  vbulletConfig2: any;
  horizontalBarChart: ZingchartAngular.graphset;
  horizontalBarChart2: ZingchartAngular.graphset;
  config: any;
  stateWiseData: any = [];
  today: any = new Date();
  lastDay: any = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0).getDate()
  currentDay: any = this.today.getDate()
  rejectCount: number;
  suspectCount: number;
  NorthScanpercent: number;
  SouthScanpercent: number;
  totalScanPieChart: { type: string; backgroundColor: string; plot: { tooltip: { backgroundColor: string; borderWidth: string; fontSize: string; sticky: boolean; thousandsSeparator: string; }; valueBox: { type: string; text: string; placement: string; fontSize: string; }; animation: { effect: number; sequence: number; speed: number; }; backgroundColor: string; borderWidth: string; slice: number; }; plotarea: { margin: string; backgroundColor: string; borderRadius: string; borderWidth: string; }; series: { text: string; values: number[]; backgroundColor: string; lineColor: string; lineWidth: string; marker: { backgroundColor: string; }; }[]; noData: { text: string; alpha: number; backgroundColor: string; bold: boolean; fontSize: string; textAlpha: number; }; };
  




  ngOnInit() {
    // setTimeout(() => {
    //   this.getindiaMap();
    // }, 700);
  }

  transectionValue: any = [100, 0, 25, 12, 25, 10, 100, 80, 25, 12, 25, 10];
  invoiceValue: any = [40000, 50000, 35000, 21000, 10000, 17000, 80000, 13000, 40000, 50000, 35000, 21000];
  collectionValue: any = [35000, 40000, 35000, 17000, 5000, 12000, 40000, 3000, 35000, 40000, 15000, 17000];

  // generatedCoupon: any = [40000, 50000, 35000, 21000, 10000, 17000, 80000, 13000, 40000, 50000, 35000, 21000];
  // scannedCoupon: any = [35000, 40000, 35000, 17000, 5000, 12000, 40000, 3000, 35000, 40000, 15000, 17000];

  invoiceValue1: any = [40000, 50000, 35000, 60000, 20000, 17000, 30000, 13000, 40000, 50000, 35000, 24000, 40000, 50000, 35000, 21000, 10000, 17000, 13000, 13000, 40000, 50000, 35000, 21000, 40000, 50000, 35000, 21000, 10000, 17000, 10000];
  collectionValue1: any = [35000, 40000, 35000, 17000, 5000, 12000, 25000, 3000, 35000, 40000, 15000, 18000, 35000, 40000, 35000, 17000, 5000, 12000, 10000, 3000, 35000, 40000, 15000, 17000, 35000, 40000, 35000, 17000, 10000, 17000, 10000];

  // items: any = [1000, 2000, 3000, 3400, 3000, 2000, 1000, 900, 1400, 2000, 3000, 4000, 5000, 4700, 3400, 3000, 2000, 1000, 900, 1400, 2000, 3000, 4000, 5000, 5400, 5000, 4800, 4500, 4200, 4000, 3800];
  // boxes: any = [500, 1000, 1500, 1700, 1500, 1000, 500, 600, 700, 1500, 2000, 2500, 2700, 2500, 1700, 1500, 1000, 500, 600, 700, 1500, 2000, 2500, 2700, 2500, 2500, 2000, 1800, 1500, 1200, 1000];
  salesusers: any = []

  productSegments = [
    { name: 'Wall Paint', percent: '80' },
    { name: 'Unico PU', percent: '70' },
    { name: 'Thinner', percent: '60' },
    { name: 'Polyester', percent: '50' },
    { name: 'Others', percent: '40' },
    { name: 'Metal', percent: '30' },
    { name: 'Italian Pu', percent: '20' },
    { name: 'Copper', percent: '10' },
  ]

  bonusScheme = [
    { name: 'Contractor Bonus', percent: '80' },
    { name: 'Bonus Point 1', percent: '70' },
    { name: 'Bonus Point 2', percent: '60' },
    { name: 'Bonus Point 3', percent: '50' },
    { name: 'Bonus Point 4', percent: '40' },
    { name: 'Bonus Point 5', percent: '30' },
    { name: 'Bonus Point 6', percent: '20' },
    { name: 'Bonus Point 7', percent: '10' },
    { name: 'Bonus Point 8', percent: '8' },
  ]
  currentDate = new Date();
  constructor(public toast: ToastrManager, public serve: DatabaseService, public dialog: MatDialog, public route: Router, private renderer: Renderer2, public session: sessionStorage) {
    setTimeout(() => {
      this.get_targetTilesData()
      this.get_secondarytTilesData()
      this.get_productCategoryReport()
      this.get_financialYearSalesReport()
      this.get_regionWiseReport()
      this.get_salesMeter();
      this.getIndiaMapData();
      this.get_visitMeter();
      this.get_segmentByPercent();
      this.get_financialYearSalesGrowth()
    }, 500);

  }

  tabs = ['Sales', 'Enquiry', 'Influencer Reward'];

  segment = [
    { 'state': 'Andhra Pradesh' },
    { 'state': 'Arunachal Pradesh' },
    { 'state': 'Assam' },
    { 'state': 'Bihar' },
    { 'state': 'Chhattisgarh' },
    { 'state': 'Goa' },
    { 'state': 'Gujarat' },
    { 'state': 'Haryana' },
    { 'state': 'Himachal Pradesh' },
    { 'state': 'Jharkhand' },
    { 'state': 'Karnataka' },
    { 'state': 'Kerala' },
    { 'state': 'Madhya Pradesh	' },
    { 'state': 'Maharashtra' },
    { 'state': 'Manipur' },
    { 'state': 'Meghalaya' },
    { 'state': 'Mizoram' },
    { 'state': 'Nagaland' },
    { 'state': 'Odisha' },
    { 'state': 'Punjab' },
    { 'state': 'Rajasthan' },
    { 'state': 'Sikkim' },
    { 'state': 'Tamil Nadu' },
    { 'state': 'Telangana' },
    { 'state': 'Tripura' },
    { 'state': 'Uttar Pradesh' },
    { 'state': 'Uttarakhand' },
    { 'state': 'West Bengal' },
  ]
  tabValue: any = 'Sales';

  getindiaMap() {
    let mapIndiaOpt: any = {
      chart: {
        map: indiaMap
      },
      title: {
        text: ''
      },
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          verticalAlign: 'bottom'
        }
      },
      colorAxis: {
        min: 0
      },
      series: [{
        // data: [
        //   ['madhya pradesh', 10], ['uttar pradesh', 11], ['karnataka', 12],
        //   ['nagaland', 13], ['bihar', 14], ['lakshadweep', 15],
        //   ['andaman and nicobar', 16], ['assam', 17], ['west bengal', 18],
        //   ['puducherry', 19], ['daman and diu', 20], ['gujarat', 21],
        //   ['rajasthan', 22], ['dadara and nagar havelli', 23],
        //   ['chhattisgarh', 24], ['tamil nadu', 25], ['chandigarh', 26],
        //   ['punjab', 27], ['haryana', 28], ['andhra pradesh', 29],
        //   ['maharashtra', 30], ['himachal pradesh', 31], ['meghalaya', 32],
        //   ['kerala', 33], ['telangana', 34], ['mizoram', 35], ['tripura', 36],
        //   ['manipur', 37], ['arunanchal pradesh', 38], ['jharkhand', 39],
        //   ['goa', 40], ['nct of delhi', 41], ['odisha', 42],
        //   ['jammu and kashmir', 43], ['sikkim', 44], ['uttarakhand', 45]
        // ],
        data: this.stateWiseData,
        name: 'State Wise Sales Matrix',
        states: {
          hover: {
            color: '#BADA55'
          }
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        }
      }]
    }
    Highcharts.mapChart('indiaMapBox', mapIndiaOpt);
  }



  totalDays: any;
  dayInMonth: any;

  getTabValue(value) {
    this.tabValue = value.tab.textLabel;
    if (this.tabValue == 'Sales') {
      setTimeout(() => {
        this.getIndiaMapData();
        // this.getindiaMap();
      }, 700);
    }

    if (this.tabValue == 'Influencer Reward') {
      
      this.getInfluencerData();
      this.getThirtyDaysScanningItemBox();

      this.getCouponStatus();
      this.getTopInfluencer();
      this.getRegionInfluencer();
      this.getScanAgeing();
      this.getTopProductCategory();
      this.getInfluencerScanAgeing();
      // this.getTopBonusSchemeScanned();
      this.getScanningMeter();
      this.getTopInflucencerSource();
      // this.getPointReddemMeter();

      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1

      this.totalDays = new Date(year, month, 0).getDate();
      this.dayInMonth = currentDate.getDate();

    }

    // if(this.tabValue == 'Sales'){
    //   setTimeout(() => {
    //   }, 700);
    // }

    if (this.tabValue == 'Enquiry') {
      this.getTotalEnquiry();
      this.getEnquiryScore();
      this.getQualifiedEnquiry();
      this.getSourceWiseEnquiry();
      this.getSourceWiseConversion();
      this.getTopSalesUsers();
      this.getLeastSalesUser();
      this.getDataAccuracyRate();
      this.getcategoryWiseConversion();
      this.getLeadWiseConversion();
      this.getDisqualifiedEnquiry();
      this.get_leadWiseReport();
      this.getStateWiseEnquiry();
      setTimeout(() => {
      }, 700);
    }

  }

  get_targetTilesData() {
    this.serve.post_rqst({}, 'Dashboard/sales').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.targetTilesData = resp['TargetData'];
        this.currentMonthTarget = this.targetTilesData.current_month_target
        this.currentFinancialYearTarget = this.targetTilesData.current_financial_year_target
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }
  get_secondarytTilesData() {
    this.serve.post_rqst({}, 'Dashboard/SecondarySale').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.targetTilesData1 = resp['TargetData'];
        this.currentMonthTarget1 = this.targetTilesData1.current_month_target
        this.currentFinancialYearTarget1 = this.targetTilesData1.current_financial_year_target
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }
  get_productCategoryReport() {
    this.serve.post_rqst({}, 'Dashboard/productCategoryReport').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.productCategoryReport = resp['brandData'];
        let brandList = []
        let achieveList = []
        let targetList = []
        let percentList = []
        this.productCategoryReport.map((row, i) => {
          brandList[i] = row.brand;
          achieveList[i] = row.achieve;
          targetList[i] = row.target;
          percentList[i] = row.percent
        })

        this.vbulletConfig = {
          type: 'bullet',
          title: {
            text: '',
          },
          plot: {
            tooltip: {
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              // short: true,
              text: '%node-goal-value',
              angle: 0,
              color: '#000',
              placement: 'goal',

            },
          },
          backgroundColor: 'transparent',
          plotarea: {
            backgroundColor: 'transparent'
          },
          scaleX: {
            labels: brandList,
          },
          series: [
            {
              values: achieveList,
              dataDragging: true,
              goal: {
                borderWidth: '1px',
                height: 0,
                borderColor: '#000'
              },
              goals: targetList,
              // goals: [20,40,60,],
              rules: [
                {
                  backgroundColor: '#64b5f6',
                  rule: '%v >= %g',
                },
                {
                  backgroundColor: '#bfbfbf',
                  rule: '%v < %g',
                }
              ],
            },
          ],
        };
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  get_financialYearSalesReport() {
    this.serve.post_rqst({}, 'Dashboard/financialYearSalesReport').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.financialYearSalesReport = resp['result'];
        let yearList = []
        let achieveList = []
        let targetList = []
        let monthList = []
        this.financialYearSalesReport.map((row, i) => {
          yearList[i] = row.year;
          achieveList[i] = row.achieve;
          targetList[i] = row.target;
          monthList[i] = row.month;
        })

        this.vbulletConfig2 = {
          type: 'bullet',
          title: {
            text: '',
          },
          plot: {
            tooltip: {
              backgroundColor: 'black',
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              text: '%node-goal-value',
              'font-color': '#000',
              placement: 'goal',
            },
          },
          scaleX: {
            labels: monthList,
          },
          series: [
            {
              values: achieveList,
              dataDragging: true,
              goal: {
                backgroundColor: '#64b5f6',
                borderWidth: '1px',
                height: 0,
                borderColor: '#000'
              },
              goals: targetList,
              rules: [
                {
                  backgroundColor: '#009fb5',
                  rule: '%v >= %g',
                },
                {
                  backgroundColor: '#ef5350',
                  rule: '%v < %g/2',
                },
                {
                  backgroundColor: '#ffca28',
                  rule: '%v >= %g/2 && %v < %g',
                },
              ],
            },
          ],
        };

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  get_regionWiseReport() {
    this.serve.post_rqst({}, 'Dashboard/regionWiseReport').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.regionWiseReport = resp['result'];
        let regionList = []
        let achieveList = []
        let targetList = []
        this.regionWiseReport.map((row, i) => {
          regionList[i] = row.region;
          achieveList[i] = row.achieve;
          targetList[i] = row.target;
        })

        this.horizontalBarChart = {
          type: "hbar",
          scaleX: {
            labels: regionList,
          },
          plot: {
            valueBox: {
              text: '%v',
              placement: "top-in",
              'font-color': "black",
              thousandsSeparator: ',',
            },
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '0',
            marginRight: '15px',
            marginLeft: '80px'
          },
          series: [
            {
              values: achieveList,
              backgroundColor: '#00ccfd'
            },
            {
              values: targetList,
              backgroundColor: '#bac0c3'
            }
          ]
        };

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  leadWiseReport: any = [];
  get_leadWiseReport() {
    this.serve.post_rqst({}, 'Dashboard/leadWiseReport').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.leadWiseReport = resp['result'];
        let regionList = []
        let winList = []
        let totalList = []
        this.leadWiseReport.map((row, i) => {
          regionList[i] = row.region;
          winList[i] = row.Win;
          totalList[i] = row.total;
        })

        this.horizontalBarChart2 = {
          type: "hbar",
          scaleX: {
            labels: regionList,
          },
          plot: {
            valueBox: {
              text: '%v',
              placement: "top-in",
              'font-color': "black",
              thousandsSeparator: ',',
            },
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '0',
            marginRight: '15px',
            marginLeft: '80px'
          },
          series: [
            {
              values: winList,
              backgroundColor: '#00ccfd'
            },
            {
              values: totalList,
              backgroundColor: '#bac0c3'
            }
          ]
        };

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  get_salesMeter() {
    console.log(this.lastDay)
    this.serve.post_rqst({}, 'Dashboard/salesMeter').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.salesMeterReport = resp['result'];

        this.config = {
          type: 'gauge',
          globals: {
            fontSize: '18px',
          },
          plot: {
            tooltip: {
              borderRadius: '5px',
              fontSize: '10px'
            },
            valueBox: {

              text: '%v',
              fontSize: '14px',
              placement: 'center',
              rules: [
                {
                  text: '%v<br>Days',
                  rule: '%v <= 30',
                },
              ],
            },
            size: '100%',
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '40px',
          },
          scaleR: {
            "values": `0:${this.lastDay}:10`,
            aperture: 180,
            center: {
              visible: false,
            },
            item: {
              offsetR: 0,

            },
            labels: ['1', '', '', this.lastDay],
            maxValue: this.lastDay,
            minValue: 0,

            ring: {
              size: 50,
              backgroundColor: '#89b3d6',
              rules: [
                {
                  backgroundColor: '#89b3d6',
                  rule: '%v <= 10',
                },
                {
                  backgroundColor: '#009fb5',
                  rule: '%v >= 10 && %v <= 20',
                },
                {
                  backgroundColor: '#1a4262',
                  rule: '%v >= 20 && %v <= 30',
                },
              ],
            },
            step: 10,
            tick: {
              visible: false,
            },

          },

          refresh: {
            type: 'feed',
            url: 'feed()',
            interval: 1500,
            resetTimeout: 1000,
            transport: 'js',
          },
          series: [
            {
              values: [this.currentDay],
              backgroundColor: 'black',
              indicator: [0.1, 4, 5, 5, 0.3],

            },
          ],

        };

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  getIndiaMapData() {
    this.serve.post_rqst({}, 'Dashboard/stateWiseReport').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.stateWiseData = resp['result'];
        this.getindiaMap();

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  get_visitMeter() {
    this.serve.post_rqst({}, 'Dashboard/visitTargetReport').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.visitMeterReport = resp['result'];

        this.gaugeConfig = {
          type: 'gauge',
          globals: {
            fontSize: '18px',
          },
          plot: {
            tooltip: {
              borderRadius: '5px',
              fontSize: '10px'
            },
            valueBox: {
              text: '%v',
              fontSize: '14px',
              placement: 'center',
              rules: [
                {
                  text: '%v<br>Days',
                  rule: '%v <= 30',
                },
              ],
            },
            size: '100%',
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '40px',
            fontSize: '10px'
          },
          scaleR: {
            "values": `0:${this.lastDay}:10`,
            aperture: 180,
            center: {
              visible: false,
            },
            item: {
              offsetR: 0,

            },
            labels: ['1', '', '', this.lastDay],
            maxValue: this.lastDay,
            minValue: 1,
            ring: {
              rules: [
                {
                  backgroundColor: '#b5a1c8',
                  rule: '%v <= 10',
                },
                {
                  backgroundColor: '#654779',
                  rule: '%v >= 10 && %v <= 20',
                },
                {
                  backgroundColor: '#433051',
                  rule: '%v >= 20 && %v <= 30',
                },
              ],
              size: '50px'
            },
            step: 10,
            tick: {
              visible: true,
            },
          },
          refresh: {
            type: 'feed',
            url: 'feed()',
            interval: 1500,
            resetTimeout: 1000,
            transport: 'js',
          },
          series: [
            {
              values: [this.currentDay],
              animation: {
                delay: 1200,
                effect: 2,
                method: 3,
                speed: 3000,
              },
              backgroundColor: 'black',
              // indicator: [0.1, 4, 5, 5, 0.3],
              indicator: [3, 1, 1, 1, 0.4],
            },
          ],


        };

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  get_segmentByPercent() {
    this.serve.post_rqst({}, 'Dashboard/segmentByPercent').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.segmentBrandWise = resp['brandData']
        this.segmentPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              backgroundColor: 'none',
              borderWidth: '0px',
              fontSize: '10px',

              sticky: true,
              thousandsSeparator: ',',

            },
            valueBox:
            {
              type: 'all',
              text: '%t<br>%npv%',
              placement: 'out',
              fontSize: '10px'
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 30,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },
          series: [
            {
              text: this.segmentBrandWise[0].brand,
              values: [this.segmentBrandWise[0].percent],
              backgroundColor: '#793e74',
              lineColor: '#00889f',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#00889f',
              },
            },
            {
              text: this.segmentBrandWise[1].brand,
              values: [this.segmentBrandWise[1].percent],
              backgroundColor: '#cca79d',
              lineColor: '#00889f',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#00889f',
              },
            },
            {
              text: this.segmentBrandWise[2].brand,
              values: [this.segmentBrandWise[2].percent],
              backgroundColor: '#cca79d',
              lineColor: '#00889f',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#00889f',
              },
            },
            {
              text: this.segmentBrandWise[3].brand,
              values: [this.segmentBrandWise[3].percent],
              backgroundColor: '#cca79d',
              lineColor: '#00889f',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#00889f',
              },
            },
            {
              text: this.segmentBrandWise[4].brand,
              values: [this.segmentBrandWise[4].percent],
              backgroundColor: '#cca79d',
              lineColor: '#00889f',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#00889f',
              },
            },
            {
              text: this.segmentBrandWise[5].brand,
              values: [this.segmentBrandWise[5].percent],
              backgroundColor: '#cca79d',
              lineColor: '#00889f',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#00889f',
              },
            },
            {
              text: this.segmentBrandWise[6].brand,
              values: [this.segmentBrandWise[6].percent],
              backgroundColor: '#cca79d',
              lineColor: '#00889f',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#00889f',
              },
            },
            {
              text: this.segmentBrandWise[7].brand,
              values: [this.segmentBrandWise[7].percent],
              backgroundColor: '#cca79d',
              lineColor: '#00889f',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#00889f',
              },
            },

          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };


      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }



  get_financialYearSalesGrowth() {
    console.log(this.lastDay)
    this.serve.post_rqst({}, 'Dashboard/financialYearSalesGrowth').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.financialYearSalesGrowth = resp['result'];

        let yearList = []
        let achieveList = []
        let percentList = []
        let monthList = []
        this.financialYearSalesGrowth.map((row, i) => {
          yearList[i] = row.year;
          achieveList[i] = row.achieve;
          percentList[i] = row.percent;
          monthList[i] = row.month;
        })

        this.multiStackedConfig = {
          type: 'bar',
          stacked: true,
          title: {
            text: '',
            adjustLayout: true,
          },

          plot: {
            tooltip: {
              text: '%v%',
              borderRadius: '3px',
              fontColor: '#ffffff',

            },
            animation: {
              effect: 12,
              method: 0,
              speed: 1600,
            },


            valueBox: {
              text: '%total%',
              placement: "top-in",
              'font-color': "white",
              thousandsSeparator: ',',
              rules: [
                {
                  rule: '%stack-top == 0',
                  visible: false,
                },
              ],
            },
            offsetY: '-1px',
            rules: [
              {
                offsetY: '1px',
                rule: '%v <= 0',
              },
            ],
          },
          plotarea: {
            backgroundColor: 'transparent',
            margin: 'dynamic',
          },
          scaleX: {
            labels: monthList,
          },
          scaleY: {
            format: '%v',
            guide: {
              items: [
                {
                  backgroundColor: '#fff',
                }
              ],
            },
            multiplier: true,
            negation: 'currency',
            refLine: {
              lineColor: '#212121',
              lineWidth: '1px',
            },
          },
          series: [
            {
              text: 'Distributed Product',
              values: percentList,
              rules: [
                {
                  rule: '%v >= 0',
                  backgroundColor: '#00889f',
                },
                {
                  backgroundColor: '#ff4f3f',
                  rule: '%v < 0'
                }
              ],
              stack: 1,
            },
          ],

        };

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }





  totalEnquiry: any = {};
  getTotalEnquiry() {
    this.serve.post_rqst({}, 'Dashboard/totalEnquiry').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.totalEnquiry = resp['result'];

        this.totalEnquiryPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              backgroundColor: '#000',
              borderWidth: '0px',
              fontSize: '10px',
              sticky: true,
              thousandsSeparator: ',',
            },
            valueBox:
            {
              type: 'all',
              text: '%npv%',
              placement: 'in',
              fontSize: '8px'
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 40,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },

          series: [
            {
              text: 'Review Pending',
              values: [this.totalEnquiry.Pending],
              backgroundColor: '#ffc300',
              lineColor: '#ffc300',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ffc300',
              },
            },
            {
              text: 'Qualified',
              values: [this.totalEnquiry.Qualified],
              backgroundColor: '#00a54d',
              lineColor: '#009fb5',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#009fb5',
              },
            },
            {
              text: 'Disqualified',
              values: [this.totalEnquiry.Disqualified],
              backgroundColor: '#ff4b4a',
              lineColor: '#ff4b4a',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ff4b4a',
              },
            }

          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };


      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  enquiryScoreData: any = {};
  getEnquiryScore() {
    this.serve.post_rqst({}, 'Dashboard/enquiryScore').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.enquiryScoreData = resp['result'];
        this.enquiryScore = {
          type: 'gauge',
          globals: {
            fontSize: '18px',
          },
          plot: {
            tooltip: {
              borderRadius: '5px',
              fontSize: '10px'
            },
            valueBox: {
              text: '%v%',
              // text: '%v',
              fontSize: '18px',
              placement: 'center',
              rules: [
                {
                  text: '%v',
                  rule: '%v <= 30',
                },
              ],
            },
            size: '100%',
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '40px',
          },
          scaleR: {
            aperture: 240,
            center: {
              visible: false,
            },
            item: {
              offsetR: 0,

            },
            labels: ['0', '', '', '', '100'],
            maxValue: 100,
            minValue: 0,
            ring: {
              rules: [
                {
                  backgroundColor: '#ea4335',
                  rule: '%v <= 25',
                },
                {
                  backgroundColor: '#ffc300',
                  rule: '%v >= 25 && %v <= 50',
                },
                {
                  backgroundColor: '#2e7d32',
                  rule: '%v > 50 && %v <= 100',
                },
              ],
              size: '20px',
            },
            step: 25,
            tick: {
              visible: false,
            },
          },
          refresh: {
            type: 'feed',
            url: 'feed()',
            interval: 1500,
            resetTimeout: 1000,
            transport: 'js',
          },
          series: [
            {
              values: [this.enquiryScoreData.Qualified],
              animation: {
                delay: 1200,
                effect: 2,
                method: 3,
                speed: 3000,
              },
              backgroundColor: 'black',
              indicator: [0.1, 4, 5, 5, 0.3],
            },
          ],

        };


      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  qualifiedEnquiry: any = {};
  getQualifiedEnquiry() {
    this.serve.post_rqst({}, 'Dashboard/qualifiedEnquiry').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.qualifiedEnquiry = resp['result'];
        this.qualifiedEnquiryPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              backgroundColor: 'black',
              borderWidth: '0px',
              fontSize: '10px',

              sticky: true,

            },
            valueBox:
            {
              type: 'all',
              text: '%npv%',
              placement: 'in',
              fontSize: '8px'
            },

            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 40,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },

          series: [
            {
              text: 'Win',
              values: [this.qualifiedEnquiry.Win],
              backgroundColor: '#46a345',
              lineColor: '#46a345',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#46a345',
              },
            },
            {
              text: 'Lost',
              values: [this.qualifiedEnquiry.Lost],
              backgroundColor: '#ff4b4a',
              lineColor: '#ff4b4a',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ff4b4a',
              },
            },
            {
              text: 'In Process',
              values: [this.qualifiedEnquiry.Inprocess],
              backgroundColor: '#ffc300',
              lineColor: '#ffc300',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ffc300',
              },
            },
          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };



      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  disqualifiedEnquiry: any = {};
  getDisqualifiedEnquiry() {
    this.serve.post_rqst({}, 'Dashboard/disqualifiedEnquiry').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.disqualifiedEnquiry = resp['result'];
        this.disqualifiedMeter = {
          type: 'ring',
          backgroundColor: '#fff',
          plot: {
            tooltip: {

              backgroundColor: 'none',
              borderWidth: '0px',
              fontSize: '0px',
              visible: false,
              sticky: true,
            },
            valueBox:
            {
              type: 'min',
              text: '%v%',
              // text: `${parseInt(data[0]/(data[0]+data[1])*100)}%`,
              fontColor: '#718096',
              fontSize: '20px',
              placement: 'center',
              visible: true,
              offsetY: '25px',
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',

            slice: 50,
          },

          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },
          scaleR: {
            refAngle: 130,
            aperture: 280,
          },
          series: [
            {
              text: 'total',
              values: [this.disqualifiedEnquiry.Disqualified],
              // values: [20],
              backgroundColor: '#ff4b4a',
              lineColor: '#ff4b4a',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ff4b4a',
              },
            },
            // {
            //   text: 'total',
            //   values: [this.disqualifiedEnquiry.Total],
            //   backgroundColor: '#009fb5',
            //   lineColor: '#009fb5',
            //   lineWidth: '1px',
            //   marker: {
            //     backgroundColor: '#009fb5',
            //   },
            // },

          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };



      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  stateWiseEnquiry: any = {};
  getStateWiseEnquiry() {
    this.serve.post_rqst({}, 'Dashboard/stateWiseEnquiry').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.stateWiseEnquiry = resp['result'];

      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  sourceWiseEnquiry: any = {};
  getSourceWiseEnquiry() {
    this.serve.post_rqst({}, 'Dashboard/sourceWiseEnquiry').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.sourceWiseEnquiry = resp['result'];
        let total = Math.ceil(this.sourceWiseEnquiry.Facebook + this.sourceWiseEnquiry.Website + this.sourceWiseEnquiry.Call + this.sourceWiseEnquiry.Walk + this.sourceWiseEnquiry.SMS + this.sourceWiseEnquiry['Toll Free'] + this.sourceWiseEnquiry.Others + this.sourceWiseEnquiry.Instagram + this.sourceWiseEnquiry['Linked-in'] + this.sourceWiseEnquiry.Facebook + this.sourceWiseEnquiry.Whatsapp + this.sourceWiseEnquiry.Mail + this.sourceWiseEnquiry.IndiaMart + this.sourceWiseEnquiry.JustDial)
        this.sourceEnquiryPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {

              backgroundColor: '#000',
              borderWidth: '0px',
              fontSize: '10px',
              sticky: true,
              thousandsSeparator: ',',
            },
            valueBox:
            {
              type: 'all',
              text: '%v%',
              placement: 'in',
              fontSize: '8px'
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',

            slice: 40,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },

          series: [
            {
              text: 'Facebook',
              values: [Math.ceil((this.sourceWiseEnquiry.Facebook / total) * 100)],
              backgroundColor: '#95ce50',
              lineColor: '#95ce50',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#95ce50',
              },
            },
            {
              text: 'Website',
              values: [Math.ceil((this.sourceWiseEnquiry.Website / total) * 100)],
              backgroundColor: '##ff6f00',
              lineColor: '#ffb300',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ffb300',
              },
            },
            {
              text: 'Call',
              values: [Math.ceil((this.sourceWiseEnquiry.Call / total) * 100)],
              backgroundColor: '#ff6f00',
              lineColor: '#ff6f00',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ff6f00',
              },
            },
            {
              text: 'Walk',
              values: [Math.ceil((this.sourceWiseEnquiry.Walk / total) * 100)],
              backgroundColor: '#00897b',
              lineColor: '#00897b',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#00897b',
              },
            },
            {
              text: 'SMS',
              values: [Math.ceil((this.sourceWiseEnquiry.SMS / total) * 100)],
              backgroundColor: '#43a047',
              lineColor: '#43a047',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#43a047',
              },
            },
            {
              text: 'Toll-Free',
              values: [Math.ceil((this.sourceWiseEnquiry['Toll Free'] / total) * 100)],
              backgroundColor: '#2e7d32',
              lineColor: '#2e7d32',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#2e7d32',
              },
            },
            {
              text: 'Others',
              values: [Math.ceil((this.sourceWiseEnquiry.Others / total) * 100)],
              backgroundColor: '#989c25',
              lineColor: '#989c25',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#989c25',
              },
            },
            {
              text: 'Instagram',
              values: [Math.ceil((this.sourceWiseEnquiry.Instagram / total) * 100)],
              backgroundColor: '#f70474',
              lineColor: '#f70474',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#f70474',
              },
            },
            {
              text: 'Linked-in',
              values: [Math.ceil((this.sourceWiseEnquiry['Linked-in'] / total) * 100)],
              backgroundColor: '#0077b5',
              lineColor: '#0077b5',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#0077b5',
              },
            },
            {
              text: 'Reference',
              values: [Math.ceil((this.sourceWiseEnquiry.Reference / total) * 100)],
              backgroundColor: '#d778b3',
              lineColor: '#d778b3',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#d778b3',
              },
            },
            {
              text: 'Whatsapp',
              values: [Math.ceil((this.sourceWiseEnquiry.Whatsapp / total) * 100)],
              backgroundColor: '#1bd741',
              lineColor: '#1bd741',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#1bd741',
              },
            },
            {
              text: 'Mail',
              values: [Math.ceil((this.sourceWiseEnquiry.Mail / total) * 100)],
              backgroundColor: '#ea4335',
              lineColor: '#ea4335',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ea4335',
              },
            },
            {
              text: 'IndiaMart',
              values: [Math.ceil((this.sourceWiseEnquiry.IndiaMart / total) * 100)],
              backgroundColor: '#1c124f',
              lineColor: '#1c124f',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#1c124f',
              },
            },
            {
              text: 'JustDial',
              values: [Math.ceil((this.sourceWiseEnquiry.JustDial / total) * 100)],
              backgroundColor: '#fc6904',
              lineColor: '#fc6904',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#fc6904',
              },
            },
          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };


      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }
  sourceWiseConversion: any = {};
  getSourceWiseConversion() {
    this.serve.post_rqst({}, 'Dashboard/sourceWiseConversion').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.sourceWiseConversion = resp['result'];

        this.sourceleadConfig = {
          type: 'bar',
          plot: {
            barWidth: '25px',
            tooltip: {
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              placement: "top-in",
              text: '%v%',
              // text: '%v',
              angle: 0,
              fontSize: '10px',
              fontWeight: '100',
              "font-color": "white",

            },
          },
          scaleX: {
            labels: ['Facebook', 'Website', 'Call', 'Walk', 'SMS', 'Toll Free', 'Others', 'Instagram', 'Linked-in', 'Reference', 'Whatsapp', 'Mail', 'IndiaMart', 'JustDial'],

          },
          series: [
            {
              values: [this.sourceWiseConversion.Facebook, this.sourceWiseConversion.Website, this.sourceWiseConversion.Call, this.sourceWiseConversion.Walk, this.sourceWiseConversion.SMS, this.sourceWiseConversion['Toll Free'], this.sourceWiseConversion.Others, this.sourceWiseConversion.Instagram, this.sourceWiseConversion['Linked-in'], this.sourceWiseConversion.Reference, this.sourceWiseConversion.Whatsapp, this.sourceWiseConversion.Mail, this.sourceWiseConversion.IndiaMart, this.sourceWiseConversion.JustDial],
              styles: [
                { backgroundColor: '#95ce50' },
                { backgroundColor: '#ffb300' },
                { backgroundColor: '#ff6f00' },
                { backgroundColor: '#00897b' },
                { backgroundColor: '#43a047' },
                { backgroundColor: '#2e7d32' },
                { backgroundColor: '#989c25' },
                { backgroundColor: '#f70474' },
                { backgroundColor: '#0077b5' },
                { backgroundColor: '#d778b3' },
                { backgroundColor: '#1bd741' },
                { backgroundColor: '#ea4335' },
                { backgroundColor: '#1c124f' },
                { backgroundColor: '#fc6904' },
              ],
            },

          ],

        };


      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }
  getTopSalesUsers() {
    this.serve.post_rqst({}, 'Dashboard/topSalesUser').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.salesusers = resp['result'];
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  leastSalesUsers: any = [];
  getLeastSalesUser() {
    this.serve.post_rqst({}, 'Dashboard/leastSalesUser').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.leastSalesUsers = resp['result'];
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }

  dataAccuracy: any = {};
  getDataAccuracyRate() {
    this.serve.post_rqst({}, 'Dashboard/dataAccuracyRate').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.dataAccuracy = resp['result'];
        let totalPercent = this.dataAccuracy.accurate;

        this.accuracyLead = {
          type: 'gauge',
          globals: {
            fontSize: '20px',
          },
          plot: {
            tooltip: {
              borderRadius: '5px',
              fontSize: '10px'
            },
            valueBox: {
              text: '%v%',
              fontSize: '20px',
              placement: 'center',
              rules: [
                {
                  text: '%v',
                  rule: '%v <= 30',
                },
              ],
            },
            size: '100%',
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '40px',
          },
          scaleR: {
            aperture: 240,
            center: {
              visible: false,
            },
            item: {
              offsetR: 0,

            },
            labels: ['0', '', '', '', '100'],
            maxValue: 100,
            minValue: 0,
            ring: {
              rules: [
                {
                  backgroundColor: '#ea4335',
                  rule: '%v <= 25',
                },
                {
                  backgroundColor: '#ffc300',
                  rule: '%v >= 25 && %v <= 50',
                },
                {
                  backgroundColor: '#2e7d32',
                  rule: '%v > 50 && %v <= 100',
                },
              ],
              size: '25px',
            },
            step: 25,
            tick: {
              visible: false,
            },
          },
          refresh: {
            type: 'feed',
            url: 'feed()',
            interval: 1500,
            resetTimeout: 1000,
            transport: 'js',
          },
          series: [
            {
              values: [totalPercent],
              animation: {
                delay: 1200,
                effect: 2,
                method: 3,
                speed: 3000,
              },
              backgroundColor: 'black',
              indicator: [0.1, 4, 5, 5, 0.3],
            },
          ],

        };
      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }


  categoryWise: any = {};
  getcategoryWiseConversion() {
    this.serve.post_rqst({}, 'Dashboard/categoryWiseEnquiry').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.categoryWise = resp['result'];
        let categoryHeader = ['Direct Dealers', 'Distributor', 'Plumber', 'Project', 'Retailer'];
        let categoryData = [this.categoryWise['Direct Dealers'], this.categoryWise.Distributor, this.categoryWise.Plumber, this.categoryWise.Project, this.categoryWise.Retailer];

        this.categoryleadConfig = {
          type: 'bar',
          title: {
            text: '',
          },
          plot: {
            tooltip: {
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              placement: "top-in",
              // text: '%v%',
              text: '%v',
              angle: 0,
              fontSize: '10px',
              fontWeight: '100',
              "font-color": "white"
            },
          },
          scaleX: {
            labels: categoryHeader,
          },
          series: [
            {
              // values: [this.categoryWise['Direct Dealers'], this.categoryWise.Distributor, this.categoryWise.Plumber, this.categoryWise.Project, this.categoryWise.Retailer],
              values: categoryData,
              dataDragging: true,
              goal: {
                borderWidth: '1px',
                height: 0,
                borderColor: '#000'
              },
              goals: [25, 30, 30],
              styles: [
                { backgroundColor: '#989c25' },
                { backgroundColor: '#1d9379' },
                { backgroundColor: '#5df1cc' },
                { backgroundColor: '#7fceb7' },
                { backgroundColor: '#872a93' },
                { backgroundColor: '#a81ac6' },
                { backgroundColor: '#f70474' },
                { backgroundColor: '#0077b5' },
              ],
            },
          ],
        };


      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }



  leadWiseCatgory: any = {};
  getLeadWiseConversion() {
    this.serve.post_rqst({}, 'Dashboard/categoryWiseConversion').subscribe((resp) => {
      if (resp['statusCode'] == 200) {
        this.leadWiseCatgory = resp['result'];
        this.leadPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              backgroundColor: 'black',
              borderWidth: '0px',
              fontSize: '10px',

              sticky: true,
              thousandsSeparator: ',',
            },
            valueBox:
            {
              type: 'all',
              text: '%t<br>%npv%',
              placement: 'out',
              fontSize: '10px'
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 40,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },
          series: [
            {
              text: 'Direct Dealers',
              values: [this.leadWiseCatgory['Direct Dealers']],
              backgroundColor: '#26a0fc',
              lineColor: '#26a0fc',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#26a0fc',
              },
            },
            {
              text: 'Distributor',
              values: [this.leadWiseCatgory.Distributor],
              backgroundColor: '#68d4cd',
              lineColor: '#68d4cd',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#68d4cd',
              },
            },
            {
              text: 'Plumber',
              values: [this.leadWiseCatgory.Plumber],
              backgroundColor: '#ffc000',
              lineColor: '#ffc000',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ffc000',
              },
            },
            {
              text: 'Project',
              values: [this.leadWiseCatgory.Project],
              backgroundColor: '#ffc000',
              lineColor: '#ffc000',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ffc000',
              },
            },
            {
              text: 'Retailer',
              values: [this.leadWiseCatgory.Retailer],
              backgroundColor: '#ffc000',
              lineColor: '#ffc000',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ffc000',
              },
            },

          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };
        this.categoryleadConfig = {
          type: 'bar',
          title: {
            text: '',
          },
          plot: {
            tooltip: {
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              placement: "top-in",
              // text: '%v%',
              text: '%v',
              angle: 0,
              fontSize: '10px',
              fontWeight: '100',
              "font-color": "white"
            },
          },
          scaleX: {
            labels: ['Direct Dealers', 'Distributor', 'Plumber', 'Project', 'Retailer'],
          },
          series: [
            {
              values: [this.categoryWise['Direct Dealers'], this.categoryWise.Distributor, this.categoryWise.Plumber, this.categoryWise.Project, this.categoryWise.Retailer],
              dataDragging: true,
              goal: {
                borderWidth: '1px',
                height: 0,
                borderColor: '#000'
              },
              goals: [25, 30, 30],
              styles: [
                { backgroundColor: '#989c25' },
                { backgroundColor: '#1d9379' },
                { backgroundColor: '#5df1cc' },
                { backgroundColor: '#7fceb7' },
                { backgroundColor: '#872a93' },
                { backgroundColor: '#a81ac6' },
                { backgroundColor: '#f70474' },
                { backgroundColor: '#0077b5' },
              ],
            },
          ],
        };


      }
      else {
        this.toast.errorToastr(resp['statusMsg']);
      }
    }, err => {
      this.toast.errorToastr('Something went wrong');
    })
  }
  /////////////////////////////influencers rewards/////////////


  // totalInfluencerPieChart: any;
  influencerStatusPieChart: any;
  kycStatusPieChart: any;
  ScanGenratePieChart: any;
  influencerWiseCount: any = [];
  influencerStatusWiseCount: any = [];
  redeemKycCount: any = [];
  KycStatusCount: any = [];
  couponCount: any = {};
  couponScanCount: any = [];
  statusCount: any = [];
  totalInfluencer:any;
  getInfluencerData() {
    this.serve.post_rqst({}, "LoyaltyDashboard/dashboard_count")
      .subscribe((result => {
        // this.influencerWiseCount = result['influencer_wise_count'];
        // let customerCount = parseInt(this.influencerWiseCount[0]['influencer_count']);
        // let plumberCount = parseInt(this.influencerWiseCount[0]['influencer_count']);
        // let totalInfluencer = parseInt(this.influencerWiseCount[1]['influencer_count']);
        this.influencerStatusWiseCount = result['influencer']['influencer_status_wise_count'];
        this.totalInfluencer = result['influencer']['total_influencer'];

        // for (let i=0;i < this.influencerStatusWiseCount.length; i++)
        // {
        //      this.statusCount = this.influencerStatusWiseCount[i].influencer_count;
        // }
        // if (this.influencerStatusWiseCount[2]) {
        //   this.rejectCount = parseInt(this.influencerStatusWiseCount[2]['influencer_count']);
        // }
        let approvedCount = parseInt(this.influencerStatusWiseCount[0]['influencer_count']);
        let PendingCount = parseInt(this.influencerStatusWiseCount[1]['influencer_count']);
        this.rejectCount = parseInt(this.influencerStatusWiseCount[2]['influencer_count']);
        this.suspectCount = parseInt(this.influencerStatusWiseCount[3]['influencer_count']);
        let activeUserCount = parseInt(this.influencerStatusWiseCount[4]['influencer_count']);
        

      
        this.influencerStatusPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {

              backgroundColor: '#000',
              borderWidth: '0px',
              fontSize: '10px',
              sticky: true,
              thousandsSeparator: ',',
            },
            valueBox:
            {
              type: 'all',
              text: '%npv%',
              placement: 'in',
              fontSize: '8px'
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 0,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },

          series: [
            {
              text: 'Pending',
              values: [PendingCount],
              backgroundColor: '#ffc300',
              lineColor: '#ffc300',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ffc300',
              },
            },
            {
              text: 'Approved',
              values: [approvedCount],
              backgroundColor: '#00a54d',
              lineColor: '#009fb5',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#009fb5',
              },
            },
            {
              text: 'Reject',
              values: [this.rejectCount],
              backgroundColor: '#ff4b4a',
              lineColor: '#ff4b4a',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#ff4b4a',
              },
            },
            {
              text: 'Suspect',
              values: [this.suspectCount],
              backgroundColor: '#1bb3e8',
              lineColor: '#1bb3e8',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#1bb3e8',
              },
            },

            {
              text: 'Active User',
              values: [this.totalInfluencer - activeUserCount],
              backgroundColor: '#172b4d',
              lineColor: '#172b4d',
              lineWidth: '1px',
              marker: {
                backgroundColor: '#172b4d',
              },
            }

           
          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };
        this.redeemKycCount = result['redeem_kyc']['redeem_kyc_count'];
        this.KycStatusCount = result['redeem_kyc']['influencer_kyc_status_count'];
        let kycPendingCount = parseInt(this.KycStatusCount[0]['kyc_status_count']);
        let kycApprovedCount = parseInt(this.KycStatusCount[1]['kyc_status_count']);
        let kycRejectCount = parseInt(this.KycStatusCount[2]['kyc_status_count']);
       
        // let reddemReqCount = parseInt(this.redeemKycCount[3]['redeem_kyc_count']);
        this.couponCount = result['coupon_count'];
        let itemPercentageCount = this.couponCount.item_box_wise_count_percentage;
        let scanPercentageCount = this.couponCount.scan_item_box_wise_count_percentage;
        
        // this.couponScanCount = result['scan_coupon_count'];

        // this.totalInfluencerPieChart = {
        //   type: 'ring',
        //   backgroundColor: '#fff',

        //   plot: {
        //     tooltip: {

        //       backgroundColor: '#000',
        //       borderWidth: '0px',
        //       fontSize: '10px',
        //       sticky: true,
        //       thousandsSeparator: ',',
        //     },
        //     valueBox:
        //     {
        //       type: 'all',
        //       text: '%npv%',
        //       "offset-r": "-4%",
        //       fontSize: '8px',

        //     },
        //     animation: {
        //       effect: 2,
        //       sequence: 3,
        //       speed: 1000
        //     },
        //     backgroundColor: '#FBFCFE',
        //     borderWidth: '0px',
        //     slice: 0,
        //   },
        //   plotarea: {
        //     margin: '0px',
        //     backgroundColor: 'transparent',
        //     borderRadius: '10px',
        //     borderWidth: '0px',
        //   },

        //   series: [

        //     // {
        //     //   text: 'Customer',
        //     //   values: [customerCount],
        //     //   backgroundColor: '#ffc409',
        //     //   lineColor: '#009fb5',
        //     //   lineWidth: '1px',
        //     //   marker: {
        //     //     backgroundColor: '#009fb5',
        //     //   },
        //     // },
        //     {
        //       text: 'Plumber',
        //       values: [plumberCount],
        //       backgroundColor: '#007f39',
        //       lineColor: 'var(--warning)',
        //       lineWidth: '1px',
        //       marker: {
        //         backgroundColor: 'var(--warning)',
        //       },
        //     },
        //     // {
        //     //   text: 'Total',
        //     //   values: [totalInfluencer],
        //     //   backgroundColor: '#02abe5',
        //     //   lineColor: 'var(--primary-tint)',
        //     //   lineWidth: '1px',
        //     //   marker: {
        //     //     backgroundColor: 'var(--primary-tint)',
        //     //   },
        //     // },

        //   ],
        //   noData: {
        //     text: 'No Selection',
        //     alpha: 0.6,
        //     backgroundColor: '#20b2db',
        //     bold: true,
        //     fontSize: '10px',
        //     textAlpha: 0.9,
        //   },
        // };
        this.kycStatusPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {

              backgroundColor: '#000',
              borderWidth: '0px',
              fontSize: '10px',
              sticky: true,
              thousandsSeparator: ',',
            },
            valueBox:
            {
              type: 'all',
              text: '%npv%',
              placement: 'in',
              fontSize: '8px'
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 0,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },

          series: [
            {
              text: 'kYC Status',
              values: [kycPendingCount],
              backgroundColor: 'var(--warning)',
              lineColor: 'var(--warning)',
              lineWidth: '1px',
              marker: {
                backgroundColor: 'var(--warning)',
              },
            },
            {
              text: 'Redeem Request',
              values: [kycApprovedCount],
              backgroundColor: 'var(--success)',
              lineColor: 'var(--success)',
              lineWidth: '1px',
              marker: {
                backgroundColor: 'var(--success)',
              },
            },
            {
              text: 'Redeem Request',
              values: [kycRejectCount],
              backgroundColor: 'var(--danger)',
              lineColor: 'var(--danger)',
              lineWidth: '1px',
              marker: {
                backgroundColor: 'var(--danger)',
              },
            },
          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };


        // Coupon pie chart

        this.ScanGenratePieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {

              backgroundColor: '#000',
              borderWidth: '0px',
              fontSize: '10px',
              sticky: true,
              thousandsSeparator: ',',
            },
            valueBox:
            {
              type: 'all',
              text: '%npv%',
              placement: 'in',
              fontSize: '8px'
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 0,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },

          series: [
            {
              text: 'Not Scan Coupon',
              values: [itemPercentageCount],
              backgroundColor: 'var(--primary-tint)',
              lineColor: 'var(--primary-tint)',
              lineWidth: '1px',
              marker: {
                backgroundColor: 'var(--primary-tint)',
              },
            },
            {
              text: 'Scanned Coupon',
              values: [scanPercentageCount],
              backgroundColor: 'var(--warning)',
              lineColor: 'var(--warning)',
              lineWidth: '1px',
              marker: {
                backgroundColor: 'var(--warning)',
              },
            },
           
           
          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };

        this.totalScanPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {

              backgroundColor: '#000',
              borderWidth: '0px',
              fontSize: '10px',
              sticky: true,
              thousandsSeparator: ',',
            },
            valueBox:
            {
              type: 'all',
              text: '%npv%',
              placement: 'in',
              fontSize: '8px'
            },
            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',
            slice: 0,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },

          series: [
            {
              text: 'Redeem Request',
              values: [this.couponCount.scan_master_box_wise_count_percentage],
              backgroundColor: 'var(--primary-green)',
              lineColor: 'var(--primary-green)',
              lineWidth: '1px',
              marker: {
                backgroundColor: 'var(--primary-green)',
              },
            },
            {
              text: 'Redeem Request',
              values: [this.couponCount.scan_item_box_wise_count_percentage
              ],
              backgroundColor: 'var(--primary-pul)',
              lineColor: 'var(--primary-pul)',
              lineWidth: '1px',
              marker: {
                backgroundColor: 'var(--primary-pul)',
              },
            },
          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };

      


      }))
  }



  bottom: any = []
  items: any = [];
  boxes: any = [];
  lastMonthDaysCouponScanCount: any = [];
  scanningInDaysChart: any;
  getThirtyDaysScanningItemBox() {
    this.bottom = [];
    this.items = [];
    this.boxes = [];
    this.serve.post_rqst({}, "LoyaltyDashboard/dashboard_graph").subscribe((result => {
      this.lastMonthDaysCouponScanCount = result['last_month_days_coupon_scan_count']



      for (let i = 0; i < this.lastMonthDaysCouponScanCount.scanned_date.length; i++) {
        this.bottom.push(this.lastMonthDaysCouponScanCount.scanned_date[i].lable)
      }

      for (let i = 0; i < this.lastMonthDaysCouponScanCount.item_box_count.length; i++) {
        this.items.push(parseInt(this.lastMonthDaysCouponScanCount.item_box_count[i].value))
      }

      // for (let i = 0; i < this.lastMonthDaysCouponScanCount.master_box_count.length; i++) {
      //   this.boxes.push(parseInt(this.lastMonthDaysCouponScanCount.master_box_count[i].value))
      // }


      this.scanningInDaysChart = {
        type: "line",
        scaleX: {
          labels: this.bottom,
          "step": "86400000",
          "transform": {
            // "type": "date",
            "type": "number",
            // "all": "%d<br/>day"
          },
          "item": {
            "font-size": 9
          },
        },

        "tooltip": {
          "visible": false
        },
        plot: {
          aspect: "spline",
          "tooltip-text": "%t views: %v<br>%k",
          "shadow": 0,
          "line-width": "2px",
          "marker": {
            "type": "circle",
            "size": 3
          }
        },
        plotarea: {
          backgroundColor: 'transparent',
          marginTop: '20px',
        },
        "crosshair-x": {
          "line-color": "#efefef",
          "plot-label": {
            "border-radius": "5px",
            "border-width": "1px",
            "border-color": "#f6f7f8",
            "padding": "10px",
            "font-weight": "bold"
          },
          "scale-label": {
            "font-color": "#000",
            "background-color": "#f6f7f8",
            "border-radius": "5px"
          }
        },
        series: [{
          values: this.items,
          monotone: true,
          text: "Coupon",
          lineColor: 'var(--primary-tint)',
          "marker": {
            "background-color": "var(--primary-tint)",
          },

        },
        // {
        //   values: this.boxes,
        //   monotone: true,
        //   text: "Boxes",
        //   lineColor: 'var(--text)',
        //   "marker": {
        //     "background-color": "var(--text)",
        //   },
        //   "highlight-state": {
        //     "line-width": 3
        //   },
        // },

        ]
      }




    }))

  }


  lastCouponCount: any = [];
  lastYearCouponScanCount: any = [];
  couponStatusBarChart: any;
  lables: any = [];
  scannedCoupon: any = [];
  generatedCoupon: any = [];
  getCouponStatus() {
    this.lables = [];
    this.generatedCoupon = [];
    this.scannedCoupon = [];
    this.serve.post_rqst({}, "LoyaltyDashboard/last_year_coupon_count").subscribe((result => {
      this.lastYearCouponScanCount = result['last_year_coupon_count'];
      this.lastCouponCount = result['last_year_coupon_count']['total_coupon'];


      for (let i = 0; i < this.lastYearCouponScanCount.scanned_date.length; i++) {
        this.lables.push(this.lastYearCouponScanCount.scanned_date[i].lable)
      }



      for (let i = 0; i < this.lastYearCouponScanCount.scanned_coupon.length; i++) {
        this.scannedCoupon.push(parseInt(this.lastYearCouponScanCount.scanned_coupon[i].value))

      }




      for (let i = 0; i < this.lastCouponCount.length; i++) {
        this.generatedCoupon.push(parseInt(this.lastCouponCount[i].value))
      }

      this.couponStatusBarChart = {
        type: "bar",
        scaleX: {
          labels: this.lables,
        },
        plot: {
          valueBox: {
            text: '%v',
            short: true,
            placement: "top-out",
            'font-color': "black",
            'font-weight': 'normal',
            'font-size': '10px',
            thousandsSeparator: ',',
          },
          animation: {
            effect: 11,
            speed: 3000,
          }
        },
        plotarea: {
          backgroundColor: 'transparent',
          marginTop: '60px',
          marginRight: '15px',
          marginLeft: '80px'
        },
        series: [
          {
            text: 'Collection',
            values: this.generatedCoupon,
            backgroundColor: '#6ec44d'
          },
          {
            text: 'Invoice',
            values: this.scannedCoupon,
            backgroundColor: '#0071bd'

          }
         
        ]
      };
    }))
  }

  topInfluencer: any = [];
  getTopInfluencer() {
    this.serve.post_rqst({}, "LoyaltyDashboard/top_ten_influencer_list").subscribe((result => {
      this.topInfluencer = result['top_ten_influencer']

    }))

  }

  regionScanningBarChart: any;
  RegionWise: any = [];
  RegionScanningWise: any = [];
  getRegionInfluencer() {

    this.serve.post_rqst({}, "LoyaltyDashboard/regionWiseData").subscribe((result => {


      this.RegionWise = result['region_wise_percentage_influencer'];
      this.RegionScanningWise = result['region_wise_percentage_scan'];

      if (this.RegionWise.length && this.RegionScanningWise.length) {

        let East = this.RegionWise[0]['region'];
        let West = this.RegionWise[1]['region'];
        let North = this.RegionWise[2]['region'];
        let South = this.RegionWise[3]['region'];

        let Eastpercent = parseInt(this.RegionWise[0]['region_wise_influencer']);
        let Westpercent = parseInt(this.RegionWise[1]['region_wise_influencer']);
        let Northpercent = parseInt(this.RegionWise[2]['region_wise_influencer']);
        let Southpercent = parseInt(this.RegionWise[3]['region_wise_influencer']);

        let EastScanpercent = parseInt(this.RegionScanningWise[0]['region_wise_scan']);
        let WestScanpercent = parseInt(this.RegionScanningWise[1]['region_wise_scan']);
        if (this.RegionScanningWise[2]) {

          this.NorthScanpercent = parseInt(this.RegionScanningWise[2]['region_wise_scan']);
        }
        if (this.RegionScanningWise[3]) {

          this.SouthScanpercent = parseInt(this.RegionScanningWise[3]['region_wise_scan']);
        }


        this.regionScanningBarChart = {
          type: "hbar",
          scaleX: {
            labels: [East, West, North, South],
          },
          scaleY: {
            visible: false
          },
          plot: {
            valueBox: {
              // text: '%v%',
              placement: "top-in",
              'font-color': "#fff",
              'font-weight': '400',
              thousandsSeparator: ',',
            },
            animation: {
              effect: 11,
              speed: 3000,
            }
          },
          plotarea: {
            backgroundColor: 'transparent',
            marginTop: '0',
            marginRight: '15px',
            marginLeft: '80px'
          },
          series: [
            {
              values: [Eastpercent, Westpercent, Northpercent, Southpercent],
              backgroundColor: 'var(--primary-tint)'
            },
            {
              values: [EastScanpercent, WestScanpercent, this.NorthScanpercent, this.SouthScanpercent],
              backgroundColor: 'var(--text)'
            }
          ]
        };
      }


    }))

  }


  scanningAgeChart: any;
  ScanAgeing: any = {};
  NotScannedAgeing: any = {};
  getScanAgeing() {
    this.serve.post_rqst({}, "LoyaltyDashboard/coupon_scan_ageing").subscribe((result => {
      this.ScanAgeing = result['coupon_scan_ageing']
      if (this.ScanAgeing != null) {

        let lastSevenDaysCount = this.ScanAgeing.seven_days_count;
        let lastOneMonthCount = this.ScanAgeing.one_month_count;
        let lastSixMonthCount = this.ScanAgeing.six_month_count;
        let lastOneYearCount = this.ScanAgeing.one_year_count;
        let NotScannedCount = this.ScanAgeing.not_scanned_count;


        // this.serve.get_rqst2({}, "LoyaltyDashboard/coupon_not_scan_ageing").subscribe((result => {
        //   this.NotScannedAgeing = result['coupon_not_scan_ageing'];
        //   let NotScannedCount = this.NotScannedAgeing.not_scanned_count;

        this.scanningAgeChart = {
          type: 'bar',
          plot: {
            barWidth: '25px',
            tooltip: {
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              placement: "top-out",
              short: true,
              // text: '%v%',
              // text: `${parseInt(data[0]/(data[0]+data[1])*100)}%`,
              angle: 0,
              fontSize: '10px',
              fontWeight: '100',
              "font-color": "black",

            },
          },
          scaleX: {
            "transform": {
              "type": "text",

            },
            "item": {
              "font-size": 9
            },
            wrapText: true,
            labels: ['0-7<br/>Days', 'Last 30<br/>Days', 'Last 06<br/>Months', 'Last<br/>01 Year', 'Not<br/>Scanning'],
          },
          scaleY: {
            visible: false
          },
          series: [
            {
              values: [lastSevenDaysCount, lastOneMonthCount, lastSixMonthCount, lastOneYearCount, NotScannedCount],
              styles: [
                { 'background-color': 'var(--success)' },
                { 'background-color': 'var(--primary-tint)' },
                { 'background-color': 'var(--primary-tint)' },
                { 'background-color': 'var(--primary-tint)' },
                { 'background-color': '#ea4335' },
              ]
            },

          ],

        };

      }



      // }))










    }))

  }




  influScanningAgeChart: any;
  influScanAgeing: any = {};
  getInfluencerScanAgeing() {
    this.serve.post_rqst({}, "LoyaltyDashboard/influencer_scan_ageing").subscribe((result => {
      this.influScanAgeing = result['influencer_scan_ageing']
      if (this.influScanAgeing != null) {

        let lastSevenDaysCount = this.influScanAgeing.seven_days_count;
        let lastOneMonthCount = this.influScanAgeing.one_month_count;
        let lastThreeMonthCount = this.influScanAgeing.three_month_count;
        let lastSixMonthCount = this.influScanAgeing.six_month_count;
       
        this.influScanningAgeChart = {
          type: 'bar',
          plot: {
            barWidth: '25px',
            tooltip: {
              borderRadius: '3px',
              borderWidth: '1px',
              fontSize: '14px',
              shadow: true,
            },
            animation: {
              effect: 4,
              method: 0,
              speed: 1600,
            },
            valueBox:
            {
              type: 'all',
              placement: "top-out",
              short: true,
              // text: '%v%',
              // text: `${parseInt(data[0]/(data[0]+data[1])*100)}%`,
              angle: 0,
              fontSize: '10px',
              fontWeight: '100',
              "font-color": "black",

            },
          },
          scaleX: {
            "transform": {
              "type": "text",

            },
            "item": {
              "font-size": 9
            },
            wrapText: true,
            labels: ['0-7<br/>Days', 'Last 30<br/>Days', 'Last 03<br/>Months', 'Last<br/>06 Months'],
          },
          scaleY: {
            visible: false
          },
          series: [
            {
              values: [lastSevenDaysCount, lastOneMonthCount,lastThreeMonthCount, lastSixMonthCount],
              styles: [
                { 'background-color': 'var(--success)' },
                { 'background-color': 'var(--primary-tint)' },
                { 'background-color': 'var(--primary-tint)' },
                { 'background-color': 'var(--primary-tint)' },
                { 'background-color': '#ea4335' },
              ]
            },

          ],

        };

      }



      // }))










    }))

  }

  TopProductCategory: any = [];
  getTopProductCategory() {
    this.serve.post_rqst({}, "LoyaltyDashboard/top_product_category").subscribe((result => {
      this.TopProductCategory = result['top_product'];

    }))

  }

  BonusSchemeScanned: any = [];
  getTopBonusSchemeScanned() {
    this.serve.post_rqst({}, "LoyaltyDashboard/top_product_scheme").subscribe((result => {
      this.BonusSchemeScanned = result['top_product_scheme'];

    }))

  }

  ScanMeter: any = []
  scanningMeter: any;
  getScanningMeter() {
    this.serve.post_rqst({}, "LoyaltyDashboard/redeem_scanning_meter").subscribe((result => {
      if (result != null) {

        this.ScanMeter = result['redeem_scanning_meter']
      }
      this.scanningMeter = {
        type: 'gauge',
        globals: {
          fontSize: '18px',
        },
        plot: {
          tooltip: {
            borderRadius: '5px',
            fontSize: '10px'
          },
          valueBox: {

            text: '%v',
            fontSize: '14px',
            placement: 'center',
            rules: [
              {
                text: '%v<br>Days',
                rule: '%v <= 30',
              },
            ],
          },
          size: '100%',
          animation: {
            effect: 11,
            speed: 3000,
          }
        },
        plotarea: {
          backgroundColor: 'transparent',
          marginTop: '40px',
        },
        scaleR: {

          aperture: 180,
          center: {
            visible: false,
          },
          item: {
            offsetR: 0,

          },
          labels: ['0', '', '', '', this.totalDays],
          maxValue: 31,
          minValue: 1,
          ring: {
            rules: [
              {
                backgroundColor: '#b5a1c8',
                rule: '%v <= 8',
              },
              {
                backgroundColor: '#654779',
                rule: '%v >= 8 && %v <= 16',
              },
              {
                backgroundColor: '#433051',
                rule: '%v >= 18 && %v <= 31',
              },
            ],
            size: '50px'
          },
          step: 10,
          tick: {
            visible: false,
          },

        },

        refresh: {
          type: 'feed',
          url: 'feed()',
          interval: 1500,
          resetTimeout: 1000,
          transport: 'js',
        },
        series: [
          {
            values: [this.dayInMonth],
            backgroundColor: 'black',
            indicator: [0.1, 4, 5, 5, 0.3],

          },
        ],

      };

      this.pointRedeemMeter = {
        type: 'gauge',
        globals: {
          fontSize: '18px',
        },
        plot: {
          tooltip: {
            borderRadius: '5px',
            fontSize: '10px'
          },
          valueBox: {
            text: '%v',
            fontSize: '14px',
            placement: 'center',
            rules: [
              {
                text: '%v<br>Days',
                rule: '%v <= 30',
              },
            ],
          },
          size: '100%',
        },
        plotarea: {
          backgroundColor: 'transparent',
          marginTop: '40px',
          fontSize: '10px'
        },
        scaleR: {
          aperture: 180,
          center: {
            visible: false,
          },
          item: {
            offsetR: 0,

          },
          labels: ['0', '', '', '', this.totalDays],
          maxValue: 31,
          minValue: 1,
          ring: {
            rules: [
              {
                backgroundColor: '#b5a1c8',
                rule: '%v <= 8',
              },
              {
                backgroundColor: '#654779',
                rule: '%v >= 8 && %v <= 16',
              },
              {
                backgroundColor: '#433051',
                rule: '%v >= 18 && %v <= 31',
              },
            ],
            size: '50px'
          },
          step: 7.75,
          tick: {
            visible: false,
          },
        },
        refresh: {
          type: 'feed',
          url: 'feed()',
          interval: 1500,
          resetTimeout: 1000,
          transport: 'js',
        },
        series: [
          {
            values: [this.dayInMonth],
            animation: {
              delay: 1200,
              effect: 2,
              method: 3,
              speed: 3000,
            },
            backgroundColor: 'black',
            indicator: [0.1, 4, 5, 5, 0.3],
          },
        ],

      };

    }))

  }


  ReddemMeter: any = []
  pointRedeemMeter: any;
  getPointReddemMeter() {
    this.serve.get_rqst2({}, "LoyaltyDashboard/last_month_redeem_meter").subscribe((result => {
      this.ReddemMeter = result['redeem_meter']

      this.pointRedeemMeter = {
        type: 'gauge',
        globals: {
          fontSize: '18px',
        },
        plot: {
          tooltip: {
            borderRadius: '5px',
            fontSize: '10px'
          },
          valueBox: {
            text: '%v',
            fontSize: '14px',
            placement: 'center',
            rules: [
              {
                text: '%v<br>Days',
                rule: '%v <= 30',
              },
            ],
          },
          size: '100%',
        },
        plotarea: {
          backgroundColor: 'transparent',
          marginTop: '40px',
          fontSize: '10px'
        },
        scaleR: {
          aperture: 180,
          center: {
            visible: false,
          },
          item: {
            offsetR: 0,

          },
          labels: ['0', '', '', '', this.totalDays],
          maxValue: 31,
          minValue: 1,
          ring: {
            rules: [
              {
                backgroundColor: '#b5a1c8',
                rule: '%v <= 8',
              },
              {
                backgroundColor: '#654779',
                rule: '%v >= 8 && %v <= 16',
              },
              {
                backgroundColor: '#433051',
                rule: '%v >= 18 && %v <= 31',
              },
            ],
            size: '50px'
          },
          step: 7.75,
          tick: {
            visible: false,
          },
        },
        refresh: {
          type: 'feed',
          url: 'feed()',
          interval: 1500,
          resetTimeout: 1000,
          transport: 'js',
        },
        series: [
          {
            values: [this.dayInMonth],
            animation: {
              delay: 1200,
              effect: 2,
              method: 3,
              speed: 3000,
            },
            backgroundColor: 'black',
            indicator: [0.1, 4, 5, 5, 0.3],
          },
        ],

      };


    }))

  }




  InflunecerSource: any = [];
  influencerConversionPieChart: any;
  getTopInflucencerSource() {
    this.serve.post_rqst({}, "LoyaltyDashboard/top_influencer_source").subscribe((result => {


      this.InflunecerSource = result['top_influencer_source'];
      if (this.InflunecerSource != null) {
        let selfRegisteredInfluencerCount = parseInt(this.InflunecerSource.self_registered_percentage);
        let salesUserInfluencerCount = parseInt(this.InflunecerSource.sales_user_percentage);
        let referredInfluencerCount = parseInt(this.InflunecerSource.referred_registered_percentage);
        let adminInfluencerCount = parseInt(this.InflunecerSource.admin_registered_percentage);


        this.influencerConversionPieChart = {
          type: 'ring',
          backgroundColor: '#fff',

          plot: {
            tooltip: {
              backgroundColor: 'black',
              borderWidth: '0px',
              fontSize: '10px',
              sticky: true,
              thousandsSeparator: ',',
              text: '%t<br/>%npv%'
            },
            valueBox:
            {
              type: 'all',
              text: '%npv%',
              placement: 'out',
              fontSize: '10px'
            },

            animation: {
              effect: 2,
              sequence: 3,
              speed: 1000
            },
            backgroundColor: '#FBFCFE',
            borderWidth: '0px',

            slice: 60,
          },
          plotarea: {
            margin: '0px',
            backgroundColor: 'transparent',
            borderRadius: '10px',
            borderWidth: '0px',
          },
          series: [
            {
              text: 'Self Registration',
              values: [selfRegisteredInfluencerCount],
              backgroundColor: 'var(--success)',
              lineColor: 'var(--success)',
              lineWidth: '1px',
              marker: {
                backgroundColor: 'var(--success)',
              },
            },

            {
              text: 'Register By Sales Executive',
              values: [salesUserInfluencerCount],
              backgroundColor: 'var(--warning)',
              lineColor: 'var(--warning)',
              lineWidth: '1px',
              marker: {
                backgroundColor: 'var(--warning)',
              },
            },
            {
              text: 'Referral By Influencer',
              values: [referredInfluencerCount],
              backgroundColor: 'var(--danger)',
              lineColor: 'var(--danger)',
              lineWidth: '1px',
              marker: {
                backgroundColor: 'var(--danger)',
              },
            },
            {
              text: 'Register By Admin',
              values: [adminInfluencerCount],
              backgroundColor: 'var(--primary-shade)',
              lineColor: 'var(--primary-shade)',
              lineWidth: '1px',
              marker: {
                backgroundColor: 'var(--primary-shade)',
              },
            },
          ],
          noData: {
            text: 'No Selection',
            alpha: 0.6,
            backgroundColor: '#20b2db',
            bold: true,
            fontSize: '10px',
            textAlpha: 0.9,
          },
        };
      }


    }))

  }




  /////////////////////////////////////////CHARTS/////////////////////////////////////
  segmentPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {
        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '10px',

        sticky: true,
        thousandsSeparator: ',',

      },
      valueBox:
      {
        type: 'all',
        text: '%t<br>%npv%',
        placement: 'out',
        fontSize: '10px'
      },
      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 30,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    series: [
      {
        text: 'Segment 1',
        values: [16541],
        backgroundColor: '#00889f',
        lineColor: '#00889f',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#00889f',
        },
      },
      {
        text: 'Segment 2',
        values: [36711],
        backgroundColor: '#3691d6',
        lineColor: '#3691d6',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#3691d6',
        },
      },
      {
        text: 'Segment 3',
        values: [50011],
        backgroundColor: '#b5a1c8',
        lineColor: '#b5a1c8',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#b5a1c8',
        },
      },
      {
        text: 'Segment 4',
        values: [20711],
        backgroundColor: '#ffbd00',
        lineColor: '#ffbd00',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffbd00',
        },
      },
      {
        text: 'Segment 5',
        values: [16711],
        backgroundColor: '#7f7f7f',
        lineColor: '#7f7f7f',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#7f7f7f',
        },
      },
      {
        text: 'Segment 6',
        values: [26711],
        backgroundColor: '#9B26AF',
        lineColor: '#9B26AF',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#9B26AF',
        },
      },
      {
        text: 'Segment 7',
        values: [10711],
        backgroundColor: '#e3c889',
        lineColor: '#e3c889',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#e3c889',
        },
      },

    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  leadPieChart: ZingchartAngular.graphset = {
    // type: 'ring',
    // backgroundColor: '#fff',

    // plot: {
    //   tooltip: {
    //     backgroundColor: 'none',
    //     borderWidth: '0px',
    //     fontSize: '10px',

    //     sticky: true,
    //     thousandsSeparator: ',',
    //   },
    //   valueBox:
    //   {
    //     type: 'all',
    //     text: '%t<br>%npv%',
    //     placement: 'out',
    //     fontSize: '10px'
    //   },
    //   animation: {
    //     effect: 2,
    //     sequence: 3,
    //     speed: 1000
    //   },
    //   backgroundColor: '#FBFCFE',
    //   borderWidth: '0px',
    //   slice: 40,
    // },
    // plotarea: {
    //   margin: '0px',
    //   backgroundColor: 'transparent',
    //   borderRadius: '10px',
    //   borderWidth: '0px',
    // },
    // series: [
    //   {
    //     text: 'Contractor',
    //     values: [16541],
    //     backgroundColor: '#26a0fc',
    //     lineColor: '#26a0fc',
    //     lineWidth: '1px',
    //     marker: {
    //       backgroundColor: '#26a0fc',
    //     },
    //   },
    //   {
    //     text: 'Architect',
    //     values: [36711],
    //     backgroundColor: '#68d4cd',
    //     lineColor: '#68d4cd',
    //     lineWidth: '1px',
    //     marker: {
    //       backgroundColor: '#68d4cd',
    //     },
    //   },
    //   {
    //     text: 'Site',
    //     values: [50011],
    //     backgroundColor: '#ffc000',
    //     lineColor: '#ffc000',
    //     lineWidth: '1px',
    //     marker: {
    //       backgroundColor: '#ffc000',
    //     },
    //   },

    // ],
    // noData: {
    //   text: 'No Selection',
    //   alpha: 0.6,
    //   backgroundColor: '#20b2db',
    //   bold: true,
    //   fontSize: '10px',
    //   textAlpha: 0.9,
    // },
  };

  totalEnquiryPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {

        backgroundColor: '#000',
        borderWidth: '0px',
        fontSize: '10px',
        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
      {
        type: 'all',
        text: '%npv%',
        placement: 'in',
        fontSize: '8px'
      },
      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },

    series: [
      {
        text: 'Review Pending',
        values: [20],
        backgroundColor: '#ffc300',
        lineColor: '#ffc300',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffc300',
        },
      },
      {
        text: 'Qualified',
        values: [60],
        backgroundColor: '#00a54d',
        lineColor: '#009fb5',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#009fb5',
        },
      },
      {
        text: 'Disqualified',
        values: [20],
        backgroundColor: '#ff4b4a',
        lineColor: '#ff4b4a',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff4b4a',
        },
      }

    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  qualifiedEnquiryPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {
        backgroundColor: 'black',
        borderWidth: '0px',
        fontSize: '10px',

        sticky: true,

      },
      valueBox:
      {
        type: 'all',
        text: '%npv%',
        placement: 'in',
        fontSize: '8px'
      },

      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },

    series: [
      {
        text: 'Win',
        values: [200],
        backgroundColor: '#46a345',
        lineColor: '#46a345',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#46a345',
        },
      },
      {
        text: 'Lost',
        values: [200],
        backgroundColor: '#ff4b4a',
        lineColor: '#ff4b4a',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff4b4a',
        },
      },
      {
        text: 'In Process',
        values: [200],
        backgroundColor: '#ffc300',
        lineColor: '#ffc300',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffc300',
        },
      },
    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  sourceEnquiryPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {

        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '10px',
        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
      {
        type: 'all',
        text: '%v%',
        placement: 'in',
        fontSize: '8px'
      },
      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',

      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },

    series: [
      {
        text: 'Facebook',
        values: [20],
        backgroundColor: '#95ce50',
        lineColor: '#95ce50',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#95ce50',
        },
      },
      {
        text: 'Website',
        values: [17],
        backgroundColor: '#ffb300',
        lineColor: '#ffb300',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffb300',
        },
      },
      {
        text: 'Call',
        values: [14],
        backgroundColor: '#ff6f00',
        lineColor: '#ff6f00',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff6f00',
        },
      },
      {
        text: 'Walk',
        values: [18],
        backgroundColor: '#00897b',
        lineColor: '#00897b',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#00897b',
        },
      },
      {
        text: 'SMS',
        values: [12],
        backgroundColor: '#43a047',
        lineColor: '#43a047',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#43a047',
        },
      },
      {
        text: 'Toll-Free',
        values: [5],
        backgroundColor: '#2e7d32',
        lineColor: '#2e7d32',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#2e7d32',
        },
      },
      {
        text: 'Others',
        values: [5],
        backgroundColor: '#989c25',
        lineColor: '#989c25',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#989c25',
        },
      },
      {
        text: 'Instagram',
        values: [9],
        backgroundColor: '#f70474',
        lineColor: '#f70474',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#f70474',
        },
      },
      {
        text: 'Linked-in',
        values: [9],
        backgroundColor: '#0077b5',
        lineColor: '#0077b5',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#0077b5',
        },
      },
      {
        text: 'Reference',
        values: [9],
        backgroundColor: '#d778b3',
        lineColor: '#d778b3',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#d778b3',
        },
      },
      {
        text: 'Whatsapp',
        values: [9],
        backgroundColor: '#1bd741',
        lineColor: '#1bd741',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#1bd741',
        },
      },
      {
        text: 'Mail',
        values: [9],
        backgroundColor: '#ea4335',
        lineColor: '#ea4335',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ea4335',
        },
      },
      {
        text: 'IndiaMart',
        values: [9],
        backgroundColor: '#1c124f',
        lineColor: '#1c124f',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#1c124f',
        },
      },
      {
        text: 'JustDial',
        values: [9],
        backgroundColor: '#fc6904',
        lineColor: '#fc6904',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#fc6904',
        },
      },
    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };




  invoiceCollectionBarChart: any = {
    type: "bar",
    scaleX: {
      labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    },
    plot: {
      valueBox: {
        text: '%v',
        short: true,
        placement: "top-out",
        'font-color': "black",
        'font-weight': 'normal',
        'font-size': '10px',
        thousandsSeparator: ',',
      },
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '60px',
      marginRight: '15px',
      marginLeft: '80px'
    },
    series: [
      {
        text: 'Invoice',
        values: this.invoiceValue,
        backgroundColor: '#0071bd'
      },
      {
        text: 'Collection',
        values: this.collectionValue,
        backgroundColor: '#6ec44d'
      }
    ]
  };

  accountBarChart: ZingchartAngular.graphset = {
    type: "bar",
    scaleX: {
      labels: ['0 or less', '1 ~ 30', '31 ~ 60', '61 ~ 90', 'Over 90'],
    },
    plot: {
      valueBox: {
        text: '%v',
        placement: "top-in",
        'font-color': "black",
        thousandsSeparator: ',',
      },
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '0',
      marginRight: '15px',
      marginLeft: '80px'
    },
    series: [
      {
        values: [2012, 4220, 2445, 5000, 2500],
        backgroundColor: '#00ccfd'
      },
      {
        values: [5233, 3000, 2123, 3875, 3000],
        backgroundColor: '#bac0c3'
      }
    ]
  };



  enquiryScore: any = {
    type: 'gauge',
    globals: {
      fontSize: '18px',
    },
    plot: {
      tooltip: {
        borderRadius: '5px',
        fontSize: '10px'
      },
      valueBox: {
        text: '%v%',
        fontSize: '18px',
        placement: 'center',
        rules: [
          {
            text: '%v',
            rule: '%v <= 30',
          },
        ],
      },
      size: '100%',
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '40px',
    },
    scaleR: {
      aperture: 240,
      center: {
        visible: false,
      },
      item: {
        offsetR: 0,

      },
      labels: ['0', '', '', '', '100'],
      maxValue: 100,
      minValue: 0,
      ring: {
        rules: [
          {
            backgroundColor: '#ea4335',
            rule: '%v <= 25',
          },
          {
            backgroundColor: '#ffc300',
            rule: '%v >= 25 && %v <= 50',
          },
          {
            backgroundColor: '#2e7d32',
            rule: '%v > 50 && %v <= 100',
          },
        ],
        size: '20px',
      },
      step: 25,
      tick: {
        visible: false,
      },
    },
    refresh: {
      type: 'feed',
      url: 'feed()',
      interval: 1500,
      resetTimeout: 1000,
      transport: 'js',
    },
    series: [
      {
        values: [74],
        animation: {
          delay: 1200,
          effect: 2,
          method: 3,
          speed: 3000,
        },
        backgroundColor: 'black',
        indicator: [0.1, 4, 5, 5, 0.3],
      },
    ],

  };

  accuracyLead: any = {
    type: 'gauge',
    globals: {
      fontSize: '18px',
    },
    plot: {
      tooltip: {
        borderRadius: '5px',
        fontSize: '10px'
      },
      valueBox: {
        text: '%v%',
        fontSize: '18px',
        placement: 'center',
        rules: [
          {
            text: '%v',
            rule: '%v <= 30',
          },
        ],
      },
      size: '100%',
      animation: {
        effect: 11,
        speed: 3000,
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '40px',
    },
    scaleR: {
      aperture: 240,
      center: {
        visible: false,
      },
      item: {
        offsetR: 0,

      },
      labels: ['0', '', '', '', '100'],
      maxValue: 100,
      minValue: 0,
      ring: {
        rules: [
          {
            backgroundColor: '#ea4335',
            rule: '%v <= 25',
          },
          {
            backgroundColor: '#ffc300',
            rule: '%v >= 25 && %v <= 50',
          },
          {
            backgroundColor: '#2e7d32',
            rule: '%v > 50 && %v <= 100',
          },
        ],
        size: '20px',
      },
      step: 25,
      tick: {
        visible: false,
      },
    },
    refresh: {
      type: 'feed',
      url: 'feed()',
      interval: 1500,
      resetTimeout: 1000,
      transport: 'js',
    },
    series: [
      {
        values: [74],
        animation: {
          delay: 1200,
          effect: 2,
          method: 3,
          speed: 3000,
        },
        backgroundColor: 'black',
        indicator: [0.1, 4, 5, 5, 0.3],
      },
    ],

  };

  disqualifiedMeter: any = {
    type: 'ring',
    backgroundColor: '#fff',
    plot: {
      tooltip: {

        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '0px',
        visible: false,
        sticky: true,
      },
      valueBox:
      {
        type: 'min',
        text: '%v%',
        // text: `${parseInt(data[0]/(data[0]+data[1])*100)}%`,
        fontColor: '#718096',
        fontSize: '20px',
        placement: 'center',
        visible: true,
        offsetY: '25px',
      },
      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',

      slice: 50,
    },

    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    scaleR: {
      refAngle: 130,
      aperture: 280,
    },
    series: [
      {
        text: 'Disqualified',
        values: [50],
        backgroundColor: '#ff4b4a',
        lineColor: '#ff4b4a',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff4b4a',
        },
      },
      {
        text: 'total',
        values: [50],
        backgroundColor: '#009fb5',
        lineColor: '#009fb5',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#009fb5',
        },
      },

    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  gaugeConfig: any = {
    type: 'gauge',
    globals: {
      fontSize: '18px',
    },
    plot: {
      tooltip: {
        borderRadius: '5px',
        fontSize: '10px'
      },
      valueBox: {
        text: '%v',
        fontSize: '14px',
        placement: 'center',
        rules: [
          {
            text: '%v<br>Days',
            rule: '%v <= 30',
          },
        ],
      },
      size: '100%',
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '40px',
      fontSize: '10px'
    },
    scaleR: {
      "values": `0:${this.lastDay}:10`,
      aperture: 180,
      center: {
        visible: false,
      },
      item: {
        offsetR: 0,

      },
      labels: ['1', '', '', this.lastDay],
      maxValue: this.lastDay,
      minValue: 1,
      ring: {
        rules: [
          {
            backgroundColor: '#b5a1c8',
            rule: '%v <= 10',
          },
          {
            backgroundColor: '#654779',
            rule: '%v >= 10 && %v <= 20',
          },
          {
            backgroundColor: '#433051',
            rule: '%v >= 20 && %v <= 30',
          },
        ],
        size: '50px'
      },
      step: 10,
      tick: {
        visible: false,
      },
    },
    refresh: {
      type: 'feed',
      url: 'feed()',
      interval: 1500,
      resetTimeout: 1000,
      transport: 'js',
    },
    series: [
      {
        values: [this.currentDay],
        animation: {
          delay: 1200,
          effect: 2,
          method: 3,
          speed: 3000,
        },
        backgroundColor: 'black',
        indicator: [0.1, 4, 5, 5, 0.3],
      },
    ],

  };





  sourceleadConfig: any = {
    type: 'bar',
    plot: {
      barWidth: '25px',
      tooltip: {
        borderRadius: '3px',
        borderWidth: '1px',
        fontSize: '14px',
        shadow: true,
      },
      animation: {
        effect: 4,
        method: 0,
        speed: 1600,
      },
      valueBox:
      {
        type: 'all',
        placement: "top-in",
        text: '%v%',
        angle: 0,
        fontSize: '10px',
        fontWeight: '100',
        "font-color": "white",

      },
    },
    scaleX: {
      labels: ['Facebook', 'Website', 'Call', 'Walk', 'SMS', 'Toll Free', 'Others', 'Instagram', 'Linked-in', 'Reference', 'Whatsapp', 'Mail', 'IndiaMart', 'JustDial'],

    },
    series: [
      {
        values: [2, 40, 14, 50, 15, 35, 45, 20, 40, 14, 50, 15, 35, 35],
        styles: [
          { backgroundColor: '#95ce50' },
          { backgroundColor: '#ffb300' },
          { backgroundColor: '#ff6f00' },
          { backgroundColor: '#00897b' },
          { backgroundColor: '#43a047' },
          { backgroundColor: '#2e7d32' },
          { backgroundColor: '#989c25' },
          { backgroundColor: '#f70474' },
          { backgroundColor: '#0077b5' },
          { backgroundColor: '#d778b3' },
          { backgroundColor: '#1bd741' },
          { backgroundColor: '#ea4335' },
          { backgroundColor: '#1c124f' },
          { backgroundColor: '#fc6904' },
        ],
      },

    ],

  };

  duBalanceAgeChart: any = {
    type: 'bar',
    plot: {
      barWidth: '25px',
      tooltip: {
        borderRadius: '3px',
        borderWidth: '1px',
        fontSize: '14px',
        shadow: true,
      },
      animation: {
        effect: 4,
        method: 0,
        speed: 1600,
      },
      valueBox:
      {
        type: 'all',
        placement: "top-out",
        short: true,
        text: '%v',
        angle: 0,
        fontSize: '10px',
        fontWeight: '100',
        "font-color": "black",

      },
    },
    scaleX: {
      "transform": {
        "type": "text",

      },
      "item": {
        "font-size": 9
      },
      wrapText: true,
      labels: ['Within<br/>Due Days', 'Over Due<br/>0-30<br/>Days', 'Over Due<br/>31-60<br/>Days', 'Over Due<br/>61-90<br/>Days', 'Due Over<br/>90 Days'],
    },
    scaleY: {
      visible: false
    },
    series: [
      {
        values: [40000, 10000, 14000, 50000, 15000],
        styles: [
          { 'background-color': '#00ff00' },
          { 'background-color': '#0073bd' },
          { 'background-color': '#0073bd' },
          { 'background-color': '#0073bd' },
          { 'background-color': '#ea4335' },
        ]
      },

    ],

  };

  categoryleadConfig: any = {
    type: 'bar',
    title: {
      text: '',
    },
    plot: {
      tooltip: {
        borderRadius: '3px',
        borderWidth: '1px',
        fontSize: '14px',
        shadow: true,
      },
      animation: {
        effect: 4,
        method: 0,
        speed: 1600,
      },
      valueBox:
      {
        type: 'all',
        placement: "top-in",
        text: '%v%',
        angle: 0,
        fontSize: '10px',
        fontWeight: '100',
        "font-color": "white"
      },
    },
    scaleX: {
      labels: ['Contractor', 'Architect', 'Site'],
    },
    series: [
      {
        values: [20, 13, 14],
        dataDragging: true,
        goal: {
          borderWidth: '1px',
          height: 0,
          borderColor: '#000'
        },
        goals: [25, 30, 30],
        styles: [
          { backgroundColor: '#989c25' },
          { backgroundColor: '#f70474' },
          { backgroundColor: '#0077b5' },
        ],
      },
    ],
  };



  invoicePieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {

        backgroundColor: 'none',
        borderWidth: '0px',
        fontSize: '10px',
        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
      {
        type: 'all',
        text: '%t<br>%npv%',
        placement: 'out',
        fontSize: '10px'
      },

      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',

      slice: 40,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    series: [
      {
        text: 'Invoice 1',
        values: [16541],
        backgroundColor: '#00889f',
        lineColor: '#00889f',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#00889f',
        },
      },
      {
        text: 'Invoice 2',
        values: [36711],
        backgroundColor: '#3691d6',
        lineColor: '#3691d6',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#3691d6',
        },
      },
      {
        text: 'Invoice 3',
        values: [50011],
        backgroundColor: '#b5a1c8',
        lineColor: '#b5a1c8',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#b5a1c8',
        },
      },

    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  overdueByRegionPieChart: ZingchartAngular.graphset = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {
        backgroundColor: 'black',
        borderWidth: '0px',
        fontSize: '10px',
        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
      {
        type: 'all',
        text: '%t<br>%npv%',
        placement: 'out',
        fontSize: '10px'
      },

      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',

      slice: 60,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },
    series: [
      {
        text: 'East',
        values: [16541],
        backgroundColor: '#95ce50',
        lineColor: '#95ce50',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#95ce50',
        },
      },
      {
        text: 'West',
        values: [36711],
        backgroundColor: '#ffb300',
        lineColor: '#ffb300',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ffb300',
        },
      },
      {
        text: 'North',
        values: [50011],
        backgroundColor: '#ff6f00',
        lineColor: '#ff6f00',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#ff6f00',
        },
      },
      {
        text: 'South',
        values: [50011],
        backgroundColor: '#0071bd',
        lineColor: '#0071bd',
        lineWidth: '1px',
        marker: {
          backgroundColor: '#0071bd',
        },
      },

    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };

  transectionChart: ZingchartAngular.graphset = {
    type: "line",
    scaleX: {
      // labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      visible: false
    },
    scaleY: {
      visible: false
    },
    plot: {
      aspect: "spline",
    },
    series: [{
      values: this.transectionValue,
      monotone: true,
      text: "monotone: true"
    },

    ]
  }

  invoiceCollectionChart: any = {
    type: "line",
    scaleX: {
      // labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      "step": "86400000",
      "transform": {
        "type": "date",
        "all": "%d<br/>day"
      },
      "item": {
        "font-size": 9
      },
    },
    "tooltip": {
      "visible": false
    },
    plot: {
      aspect: "spline",
      "tooltip-text": "%t views: %v<br>%k",
      "shadow": 0,
      "line-width": "2px",
      "marker": {
        "type": "circle",
        "size": 3
      }
    },
    plotarea: {
      backgroundColor: 'transparent',
      marginTop: '20px',
    },
    "crosshair-x": {
      "line-color": "#efefef",
      "plot-label": {
        "border-radius": "5px",
        "border-width": "1px",
        "border-color": "#f6f7f8",
        "padding": "10px",
        "font-weight": "bold"
      },
      "scale-label": {
        "font-color": "#000",
        "background-color": "#f6f7f8",
        "border-radius": "5px"
      }
    },
    series: [{
      values: this.invoiceValue1,
      monotone: true,
      text: "Invoice",
      lineColor: '#0071bd',
      "marker": {
        "background-color": "#0071bd",
      },

    },
    {
      values: this.collectionValue1,
      monotone: true,
      text: "Collection",
      lineColor: '#6ec44d',
      "marker": {
        "background-color": "#6ec44d",
      },
      "highlight-state": {
        "line-width": 3
      },
    },

    ]
  }







  totalCouponPieChart: any = {
    type: 'ring',
    backgroundColor: '#fff',

    plot: {
      tooltip: {

        backgroundColor: '#000',
        borderWidth: '0px',
        fontSize: '10px',
        sticky: true,
        thousandsSeparator: ',',
      },
      valueBox:
      {
        type: 'all',
        text: '%npv%',
        placement: 'in',
        fontSize: '8px'
      },
      animation: {
        effect: 2,
        sequence: 3,
        speed: 1000
      },
      backgroundColor: '#FBFCFE',
      borderWidth: '0px',
      slice: 0,
    },
    plotarea: {
      margin: '0px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      borderWidth: '0px',
    },

    series: [
      {
        text: 'Item Count',
        values: [1000],
        backgroundColor: 'var(--primary-tint)',
        lineColor: 'var(--primary-tint)',
        lineWidth: '1px',
        marker: {
          backgroundColor: 'var(--primary-tint)',
        },
      },
      {
        text: 'Box Count',
        values: [50],
        backgroundColor: 'var(--primary-tint)',
        lineColor: 'var(--primary-tint)',
        lineWidth: '1px',
        marker: {
          backgroundColor: 'var(--primary-tint)',
        },
      },
    ],
    noData: {
      text: 'No Selection',
      alpha: 0.6,
      backgroundColor: '#20b2db',
      bold: true,
      fontSize: '10px',
      textAlpha: 0.9,
    },
  };













}
