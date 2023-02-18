import { Component } from '@angular/core';
import { FirebaseService } from "../../services/firebase.service";
import {Amount} from "../../models/Amount";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent {

    amount: Amount
    paymentroom: string
    constructor(private firebaseService: FirebaseService) { }

    ngOnInit() {
        this.paymentroom = new URLSearchParams(window.location.search).get('paymentroom');
        this.firebaseService.getAmount(this.paymentroom).subscribe(amount => {
            console.log(amount)
            this.amount = amount
        })
    }
}
