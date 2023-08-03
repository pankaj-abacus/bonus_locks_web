import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { AddItemComponent } from './add-item/add-item.component';
import { AuthComponentGuard } from './auth-component.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddDiscountComponent } from './discount/add-discount/add-discount.component';
import { DiscountListComponent } from './discount/discount-list/discount-list.component';
import { DealerComponent } from './distribution/dealer/dealer.component';
import { NavigationComponent } from './navigation/navigation.component';

const routes: Routes = [
  {path:'',component:LoginComponent,canActivate:[AuthGuard]},

  {path:'',component:NavigationComponent}, 
   
  { path: "segment-list", loadChildren:'./segment-list/segment-module/segment.module#SegmentModule'},
  { path: "subcategory", loadChildren:'./subcategory/subcategory-module/subcategory.module#SubcategoryModule'},
  { path: "user-designation", loadChildren:'./userdesignation/userdesignation-module/userdesignation.module#UserdesignationModule'},
  { path: "product-list", loadChildren:'./product/product-module/product.module#ProductModule'},
  { path: "catalogue", loadChildren:'./master/pdf-catalogue-module/pdf-catalogue.module#PdfCatalogueModule'},
  { path: "customer-category", loadChildren:'./master/customer-category-module/customer-category.module#CustomerCategoryModule'},
  { path: "sale-user-list", loadChildren:'./user/user-module/user.module#UserModule'},
  { path: "holiday-list", loadChildren:'./leave-and-holiday/holiday-module/holiday.module#HolidayModule'},
  { path: "banner-list", loadChildren:'./banner/banner-module/banner.module#BannerModule'},
  { path: "allowances", loadChildren:'./allowances/allowances-module/allowances.module#AllowancesModule'},
  { path: "userview-target", loadChildren:'./userview-target/userview-target-module/userview-target.module#UserviewTargetModule'},
  {path: 'distributor-target', loadChildren: './distributor-target/distributor-target-module/distributor-target.module#DistributorTargetModule'},
  { path: "support", loadChildren: './support/support-module/support.module#SupportModule'},
  { path: "task-list", loadChildren: './task/task-module/task.module#TaskModule'},
  { path: "survey-list", loadChildren: './survey/survey-module/survey.module#SurveyModule'},
  { path: "pop-gift-list", loadChildren: './pop-gift/pop-gift-module/pop-gift.module#PopGiftModule'},
  { path: "contractor-meet", loadChildren: './contractor-meet/contractor-meet-module/contractor-meet.module#ContractorMeetModule'},
  { path: "expense-list", loadChildren:'./expense/expense-module/expense.module#ExpenseModule'},
  { path: "announcement-list", loadChildren:'./annoucement/announcement-module/announcement.module#AnnouncementModule'},
  { path: "followup-list", loadChildren:'./followup/followup-module/followup.module#FollowupModule'},
  { path: "travel-list", loadChildren:'./travel/travel-module/travel.module#TravelModule'},
  { path: "leave-list", loadChildren:'./user_leaves/user-leave-module/user-leave.module#UserLeaveModule'},
  { path: "checkin", loadChildren:'./checkin/checkin-module/checkin.module#CheckinModule'},
  { path: "attendance", loadChildren:'./attendence/attendence-module/attendence.module#AttendenceModule'},
  {path:'billing',loadChildren:'./billing/billing-module/billing.module#BillingModule'},
  {path:'invoice',loadChildren:'./invoice/invoice-module/invoice.module#InvoiceModule'},
  {path: 'stock-list', loadChildren: './stock/stockmodule/stockmodule.module#StockmoduleModule'},
  {path: 'generate-master-box', loadChildren: './master-box/master-module/master-module.module#MasterModuleModule'},
  {path:'credit-notes',loadChildren:'./credit-notes/credit-notes-module/credit-notes.module#CreditNotesModule'},
  {path:'order-list',loadChildren:'./order/primary-order-module/primary-order.module#PrimaryOrderModule'},
  { path: "secondary-order-list",loadChildren:'./order/secondary-order-module/secondary-order.module#SecondaryOrderModule'},
  { path: "distribution-list/:id/:type",loadChildren:'./distribution/distribution-module/distribution.module#DistributionModule'},
  { path: "lead-list", loadChildren:'./lead/lead-module/lead.module#LeadModule'},
  { path: "influencer/:type/:network", loadChildren:'./Influencer/influencer-module/influencer.module#InfluencerModule'},
  { path: "gift-list", loadChildren:'./gift/gift-gallery-module/gift-gallery.module#GiftGalleryModule'},
  { path: "bonus-list", loadChildren:'./bonus/bonus-module/bonus.module#BonusModule'},
  { path: "coupon-list", loadChildren:'./coupon/coupon-module/coupon.module#CouponModule'},
  { path: "company-dispatch", loadChildren:'./company-dispatch/company-dispatch/company-dispatch.module#CompanyDispatchModule'},
  { path: "manual-dispatch", loadChildren:'./manual-dispatch/manual-dispatch/manual-dispatch.module#ManualDispatchModule'},
  { path: "reprint", loadChildren:'./replacement/replacement/replacement.module#ReplacementModule'},
  { path: "sales-return", loadChildren:'./sales-return/sales-return/sales-return.module#SalesReturnModule'},
  { path: "redeem-request/:redeemType", loadChildren:'./redeem/redeem-request-module/redeem-request.module#RedeemRequestModule'},
  { path: "influencer-user-list", loadChildren:'./master/influencer-user-module/influencer-user.module#InfluencerUserModule'},
  { path: "point-list", loadChildren:'./master/point-category-module/point-category.module#PointCategoryModule'},
  { path: "leave-master-list", loadChildren:'./master/leave-master/leave-master-module/leave-master/leave-master.module#LeaveMasterModule'},
  { path: "report-list", loadChildren:'./reports/reports-module/reports/reports.module#ReportsModule'},
  { path: "complaint-list", loadChildren: './service/service-module/service-module.module#ServiceModuleModule'},
  { path: "customer-list", loadChildren: './customer/customer-module/customer-module.module#CustomerModuleModule'},
  { path: "warranty-list", loadChildren: './warranty/warranty-module/warranty-module.module#WarrantyModuleModule'},
  { path: "installation-list", loadChildren: './installation/installation-module/installation-module.module#InstallationModuleModule'},
  { path: "claimDispatch-list", loadChildren: './claim-dispatch/dispatch-module/dispatch-module.module#DispatchModuleModule'},



  { path: "point-master", loadChildren:'./point-master/point-master/point-master.module#PointMasterModule'},
  {path:'dashboard',component:DashboardComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}},
];

@NgModule({
  
  
  imports: [
    RouterModule.forRoot(routes),  
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
