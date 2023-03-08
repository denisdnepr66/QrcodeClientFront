import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {StartComponent} from "./components/start/start.component";
import {FinishComponent} from "./components/finish/finish.component";
import {ProcessingComponent} from "./components/processing/processing/processing.component";
import {TransactionClosedComponent} from "./components/transactionclosed/transaction-closed.component";


export const routes: Routes = [
    { path: 'start/:paymentroom', component: StartComponent },
    { path: 'finish/:paymentroom/:youPaid', component: FinishComponent },
    { path: 'processing/:paymentroom/:guestId', component: ProcessingComponent },
    { path: 'transactionclosed/:paymentroom', component: TransactionClosedComponent }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
