import {Component, OnInit} from '@angular/core';
import { FirebaseService } from "../../services/firebase.service";
import {Amount} from "../../models/Amount";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
declare var require: any

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

    amount: Amount
    paymentroom: string

    formGroup: FormGroup;

    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) { }

    ngOnInit() {

        this.paymentroom = this.route.snapshot.paramMap.get('paymentroom');
        this.firebaseService.getAmount(this.paymentroom).subscribe(amount => {
            console.log(amount)
            this.amount = amount

            this.formGroup = this.fb.group({
                nameForm: ['', [
                    Validators.required
                ]],
                amountForm: ['', [
                    Validators.required,
                    Validators.pattern('^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1,2})?\\s*$'),
                    Validators.max(parseFloat(this.amount.leftToPay))
                ]]
            })
        })

    }

    onPay() {
        let guestName = this.formGroup.get('nameForm').value.toString()
        let guestAmount = this.formGroup.get('amountForm').value.toString()

        for (let i = 0; i < guestAmount.length; i++) {
            if (guestAmount.charAt(i) === '.') {
                if (guestAmount.length - i === 3) {
                    break
                } else if (guestAmount.length - i === 2) {
                    guestAmount = guestAmount + "0"
                    break
                }
            } else {
                if (i === guestAmount.length - 1) {
                    guestAmount = guestAmount + ".00"
                    break
                }
            }
        }

        let leftToPay = +this.amount.leftToPay * 100
        let formattedamount = +guestAmount * 100

        let newLeftToPayAmount = (leftToPay - formattedamount) / 100


        let guestCurrency = this.amount.currencyName.toString()

        this.firebaseService.saveGuest(this.paymentroom, guestName, guestAmount, guestCurrency)

        this.firebaseService.updateLeftToPayAmount(this.paymentroom, newLeftToPayAmount.toString())
        this.router.navigateByUrl('/finish/' + this.paymentroom + '/' + guestAmount)
    }

    get nameForm() {
        return this.formGroup.get('nameForm')
    }

    get amountForm() {
        return this.formGroup.get('amountForm')
    }
}
