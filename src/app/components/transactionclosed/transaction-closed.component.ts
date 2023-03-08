import {Component, OnInit} from '@angular/core';
import {Guest} from "../../models/Guest";
import {Amount} from "../../models/Amount";
import {FirebaseService} from "../../services/firebase.service";
import {ActivatedRoute, Router} from "@angular/router";
import {fadeInAnimation} from "../../animations";

@Component({
    selector: 'app-transactionclosed',
    templateUrl: './transaction-closed.component.html',
    styleUrls: ['./transaction-closed.component.css'],
    animations: [fadeInAnimation]

})
export class TransactionClosedComponent implements OnInit {

    guests: Guest[];
    paymentroom: string
    amount: Amount
    amountLoaded: boolean = false

    guestsLoaded: boolean = false

    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.paymentroom = this.route.snapshot.paramMap.get('paymentroom');
        this.firebaseService.getGuests(this.paymentroom).subscribe(guests => {
            this.guests = guests
            this.guestsLoaded = true
        })
        this.firebaseService.getAmount(this.paymentroom).subscribe(amount => {
            this.amount = amount
            this.amountLoaded = true;

        })
    }

}
