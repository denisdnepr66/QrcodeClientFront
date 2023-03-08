import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../../services/firebase.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Guest} from "../../../models/Guest";
import {Amount} from "../../../models/Amount";
import {MatDialog} from '@angular/material/dialog';
import {Observable} from "rxjs";
import {ConfirmationDialogComponent} from "../../confirmationdialog/confirmation-dialog/confirmation-dialog.component";

@Component({
    selector: 'app-processing',
    templateUrl: './processing.component.html',
    styleUrls: ['./processing.component.css']
})
export class ProcessingComponent implements OnInit {

    guest: Guest
    paymentroom: string
    guestId: string
    amount: Amount
    private dialogRef: any;

    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit() {
        this.paymentroom = this.route.snapshot.paramMap.get('paymentroom');
        this.guestId = this.route.snapshot.paramMap.get('guestId');
        this.firebaseService.getGuest(this.paymentroom, this.guestId).subscribe(guest => {
            this.guest = guest
            if (this.guest.accepted) {
                let leftToPay = +this.amount.leftToPay * 100
                let formattedamount = +this.guest.amount * 100
                let newLeftToPayAmount = ((leftToPay - formattedamount) / 100).toFixed(2)
                let newTipAmount = (parseFloat(this.amount.totalTip) + parseFloat(this.guest.guestTip)).toFixed(2)

                this.firebaseService.updateLeftToPayAndTotalTip(this.paymentroom, newLeftToPayAmount.toString(), newTipAmount)
                this.router.navigateByUrl('/finish/' + this.paymentroom + '/' + this.guest.amount)
                this.dialogRef.close();
            }
        })
        this.firebaseService.getAmount(this.paymentroom).subscribe(amount => {
                this.amount = amount
            }
        )
    }

    confirmDialog(): Observable<boolean> {
        this.dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '300px',
            data: {
                message: 'Are you sure you want to cancel payment',
                options: 'This action cannot be undone.'
            },
            disableClose: true,
            autoFocus: false,
            panelClass: 'confirmation-dialog'
        });

        return this.dialogRef.afterClosed();
    }

    cancelPayment() {

        this.confirmDialog().subscribe(result => {
            if (result) {
                this.firebaseService.deleteGuest(this.paymentroom, this.guestId, this.amount.blockedAmount, this.guest.amount)
                this.router.navigateByUrl('/start/' + this.paymentroom)
            }
        });
    }
}
