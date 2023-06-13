import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockListComponent } from '../stock-list/stock-list.component';
import { AuthComponentGuard } from 'src/app/auth-component.guard';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatFormFieldModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppUtilityModule } from 'src/app/app-utility.module';



const stockRoutes = [
  { path: "", children:[
    { path: "", component: StockListComponent,canActivate:[AuthComponentGuard], data:{ expectedRole: ['1']}}
  ]},
  
]

@NgModule({
  declarations: [
    StockListComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    RouterModule.forChild(stockRoutes),
    FormsModule,
    AppUtilityModule,
    ReactiveFormsModule,
    CommonModule,
    MatDialogModule,

  ]
})
export class StockmoduleModule { }
