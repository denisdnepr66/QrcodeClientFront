import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../../services/firebase.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Guest} from "../../../models/Guest";
import {Amount} from "../../../models/Amount";

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.css']
})
export class ProcessingComponent implements OnInit  {

    guest: Guest
    paymentroom: string
    guestId: string
    amount: Amount
    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.paymentroom = this.route.snapshot.paramMap.get('paymentroom');
        this.guestId = this.route.snapshot.paramMap.get('guestId');
        this.firebaseService.getGuest(this.paymentroom, this.guestId).subscribe(guest => {
            this.guest = guest
            if(this.guest.accepted) {
                let leftToPay = +this.amount.leftToPay * 100
                let formattedamount = +this.guest.amount * 100
                let newLeftToPayAmount = ((leftToPay - formattedamount) / 100).toFixed(2)
                let newTipAmount = (parseFloat(this.amount.totalTip) + parseFloat(this.guest.guestTip)).toFixed(2)

                this.firebaseService.updateLeftToPayAndTotalTip(this.paymentroom, newLeftToPayAmount.toString(), newTipAmount)
                this.router.navigateByUrl('/finish/' + this.paymentroom + '/' + this.guest.amount)
            }
        })
        this.firebaseService.getAmount(this.paymentroom).subscribe(amount => {
                this.amount = amount
            }
        )
    }
}
