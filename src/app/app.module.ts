import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { sessionStorage } from './localstorage.service';
import { AppComponent } from './app.component';
import { MaterialModule } from './material';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { DatabaseService } from 'src/_services/DatabaseService'
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { AuthGuardLog } from './AuthGuardLog';
import { NgxPaginationModule } from 'ngx-pagination';
import { AuthComponentGuard } from './auth-component.guard';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AddDiscountComponent } from './discount/add-discount/add-discount.component';
import { DiscountListComponent } from './discount/discount-list/discount-list.component';
import { MatDialogModule, MatIconModule, MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, MatSelectModule, MatInputModule, MatFormFieldModule } from '@angular/material';
import { NgxEditorModule } from 'ngx-editor';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { DialogComponent } from './dialog.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ChartsModule } from 'ng2-charts';
import { CurrencywordsPipe } from './currencywords.pipe';
import { NumericWordsPipe } from './numeric-words.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { ExportexcelService } from './service/exportexcel.service';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { from } from 'rxjs';
import { AgmCoreModule } from '@agm/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import * as $ from "jquery";
import { MatTimepickerModule } from 'mat-timepicker';
import { UploadFileModalComponent } from './upload-file-modal/upload-file-modal.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { AppUtilityModule } from './app-utility.module';
import { ConvertArray } from 'src/_Pipes/ConvertArray.pipe';
import { DatePikerFormat } from 'src/_Pipes/DatePikerFormat.pipe';
import { StrReplace } from 'src/_Pipes/StrReplace.pipe';
import { Crypto } from 'src/_Pipes/Crypto.pipe';
import { NumericWords } from 'src/_Pipes/NumericWords.pipe';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { ZingchartAngularModule } from 'zingchart-angular';
import { ServiceModuleModule } from './service/service-module/service-module.module';
import { CustomerModuleModule } from './customer/customer-module/customer-module.module';
import { WarrantyModuleModule } from './warranty/warranty-module/warranty-module.module';
import { InstallationModuleModule } from './installation/installation-module/installation-module.module';
import { EngineerAssignModelComponent } from './installation/engineer-assign-model/engineer-assign-model.component';
import { WarrantyUpdateModelComponent } from './warranty/warranty-update-model/warranty-update-model.component';
import { AddComplaintRemarkComponent } from './add-complaint-remark/add-complaint-remark.component';
import { AddInstallationRemarkComponent } from './installation/add-installation-remark/add-installation-remark.component';
import { ProductDetailModelComponent } from './installation/product-detail-model/product-detail-model.component';
import { InstallationUpdateModelComponent } from './installation/installation-update-model/installation-update-model.component';
import { ComplaintUpdateModelComponent } from './service/complaint-update-model/complaint-update-model.component';
import { GatepassAddComponent } from './company-dispatch/gatepass-add/gatepass-add.component';
import { SapreModuleModule } from './spare/sapre-module/sapre-module.module';
import { AddSpareComponent } from './spare/add-spare/add-spare.component';
import { AssignQtyComponent } from './spare/assign-qty/assign-qty.component';
import { ProductUploadComponent } from './product-upload/product-upload.component';
import { ComplanitVisitModuleModule } from './complaint-visit/complanit-visit-module/complanit-visit-module.module';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        DashboardComponent,
        HeaderComponent,
        FooterComponent,
        NavigationComponent,
        AddDiscountComponent,
        DiscountListComponent,
        UploadFileModalComponent,
        CurrencywordsPipe,
        NumericWordsPipe,
        ConvertArray,
        DatePikerFormat,
        StrReplace,
        Crypto,
        NumericWords,

    ],
    imports: [
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAZ-kqYo3DslRI2VIuvP5GIK7OK-U9n3AQ'
            /* apiKey is required, unless you are a
            premium customer, in which case you can
            use clientId
            */
        }),
        ZingchartAngularModule,
        BrowserModule,
        FormsModule,
        ChartsModule,
        HttpClientModule,
        MatSelectModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        NgxPaginationModule,
        NoopAnimationsModule,
        MatDialogModule,
        FilterPipeModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        MatButtonToggleModule,
        NgxEditorModule,
        AngularFontAwesomeModule,
        InfiniteScrollModule,
        AutocompleteLibModule,
        RichTextEditorAllModule,
        MatTimepickerModule,
        MatIconModule,
        NgxQRCodeModule,
        NgxBarcodeModule,
        NgxMatSelectSearchModule,
        NgMultiSelectDropDownModule.forRoot(),
        AppUtilityModule,
        ServiceModuleModule,
        SapreModuleModule,
        ComplanitVisitModuleModule,
        CustomerModuleModule,
        WarrantyModuleModule,
        InstallationModuleModule,
        // FusionChartsModule
        MatFormFieldModule,
        MatInputModule,
    ],
    providers: [
        DatabaseService,
        AuthGuard,
        AuthGuardLog,
        AuthComponentGuard,
        sessionStorage,
        DialogComponent,
        BnNgIdleService,
        ExportexcelService,
        NgxImageCompressService,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],

    entryComponents: [
        UploadFileModalComponent,
        EngineerAssignModelComponent,
        WarrantyUpdateModelComponent,
        AddComplaintRemarkComponent,
        AddInstallationRemarkComponent,
        ProductDetailModelComponent,
        InstallationUpdateModelComponent,
        ComplaintUpdateModelComponent,
        GatepassAddComponent,
        AddSpareComponent,
        AssignQtyComponent,
        ProductUploadComponent,
    ],

    exports: [RouterModule],
    bootstrap: [AppComponent]
})
export class AppModule { }
