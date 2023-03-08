import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {Guest} from "../../models/Guest";
import {ActivatedRoute, Router} from "@angular/router";
import {Amount} from "../../models/Amount";
import {fadeInAnimation} from "../../animations";

@Component({
    selector: 'app-finish',
    templateUrl: './finish.component.html',
    styleUrls: ['./finish.component.css'],
    animations: [fadeInAnimation]
})
export class FinishComponent implements OnInit{

    guests: Guest[];
    paymentroom: string
    amount: Amount
    leftToPayRatio: number
    youPaidAmount: string
    youPaidRation: number
    amountLoaded: boolean = false
    guestsLoaded: boolean = false


    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.paymentroom = this.route.snapshot.paramMap.get('paymentroom');
        this.youPaidAmount = this.route.snapshot.paramMap.get('youPaid')
        this.firebaseService.getGuests(this.paymentroom).subscribe(guests => {
            this.guests = guests
            this.guestsLoaded = true
        })
        this.firebaseService.getAmount(this.paymentroom).subscribe(amount => {
            this.amount = amount
            this.leftToPayRatio = parseFloat(this.amount.leftToPay) / parseFloat(this.amount.amount) * 100
            this.youPaidRation = parseFloat(this.youPaidAmount) / parseFloat(this.amount.amount) * 100
            this.amountLoaded = true
        })

    }

    onPayAgain() {
        this.router.navigateByUrl('/start/' + this.paymentroom)
    }
}
