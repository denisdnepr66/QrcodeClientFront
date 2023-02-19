import { Component } from '@angular/core';
import { FirebaseService } from "../../services/firebase.service";
import {Amount} from "../../models/Amount";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent {

    amount: Amount
    paymentroom: string

    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        this.paymentroom = this.route.snapshot.paramMap.get('paymentroom');
        this.firebaseService.getAmount(this.paymentroom).subscribe(amount => {
            console.log(amount)
            this.amount = amount
        })
    }

    onPay() {
        let guestName = (<HTMLInputElement>document.getElementById("guestName")).value;
        let guestAmount = (<HTMLInputElement>document.getElementById("guestAmount")).value;

        this.firebaseService.saveGuest(this.paymentroom, guestName, guestAmount)
        this.router.navigateByUrl('/finish/' + this.paymentroom)
    }
}
