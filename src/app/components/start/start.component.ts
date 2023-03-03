import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {Amount} from "../../models/Amount";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Guest} from "../../models/Guest";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

    amount: Amount
    paymentroom: string

    formGroup: FormGroup;
    tenPercentTip: string = "0.00"
    fifteenPercentTip: string = "0.00"
    twentyPercentTip: string = "0.00"

    chosenTipAmount: string = "0.00"

    totalAmountWithTip: string = "0.00"

    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder
    ) { }

    ngOnInit() {

        this.setTipEventListeners()

        this.paymentroom = this.route.snapshot.paramMap.get('paymentroom');
        this.firebaseService.getAmount(this.paymentroom).subscribe(amount => {
            console.log(amount)
            this.amount = amount
            let maxAmount = parseFloat(this.amount.leftToPay) + 0.01

            this.formGroup = this.fb.group({
                nameForm: ['', [
                    Validators.required
                ]],
                amountForm: ['', [
                    Validators.required,
                    Validators.pattern('^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1,2})?\\s*$'),
                    Validators.max(parseFloat(maxAmount.toString()))
                ]]
            })
        })
    }

    private setTipEventListeners() {
        const tenPercentTip = document.getElementById('tenPercentTip');
        tenPercentTip.addEventListener('focusout', (event) => {
            console.log("BLYAT")
            this.totalAmountWithTip = this.formGroup.get('amountForm').value.toFixed(2).toString()
        });

        const fifteenPercentTip = document.getElementById('fifteenPercentTip');
        fifteenPercentTip.addEventListener('focusout', (event) => {
            this.totalAmountWithTip = this.formGroup.get('amountForm').value.toFixed(2).toString()
        });

        const twentyPercentTip = document.getElementById('twentyPercentTip');
        twentyPercentTip.addEventListener('focusout', (event) => {
            this.totalAmountWithTip = this.formGroup.get('amountForm').value.toFixed(2).toString()
        });

    }

    onPay(paymentMethod: string) {
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

        let newLeftToPayAmount = ((leftToPay - formattedamount) / 100).toFixed(2)
        let newTipAmount = (parseFloat(this.amount.totalTip) + parseFloat(this.chosenTipAmount)).toFixed(2)


        let guestCurrency = this.amount.currencyName.toString()
        let guestTip = this.chosenTipAmount

        this.firebaseService.saveGuest(this.paymentroom, guestName, guestAmount, guestCurrency, guestTip, paymentMethod)

        this.firebaseService.updateLeftToPayAndTotalTip(this.paymentroom, newLeftToPayAmount.toString(), newTipAmount.toString())
        this.router.navigateByUrl('/finish/' + this.paymentroom + '/' + guestAmount)
    }

    onPayOnTerminal(paymentMethod: string) {
        let guestName

        if (this.formGroup.get('nameForm').value == "" || this.formGroup.get('nameForm').value == null) {
            guestName = "Guest"
        } else {
            guestName = this.formGroup.get('nameForm').value.toString()
        }

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
        let guestCurrency = this.amount.currencyName.toString()
        let guestTip = this.chosenTipAmount
        this.firebaseService.saveGuestToPayOnTerminalAndRedirect(this.paymentroom, guestName, guestAmount, guestCurrency, guestTip, paymentMethod)
    }

    get nameForm() {
        return this.formGroup.get('nameForm')
    }

    get amountForm() {

        if (this.formGroup.get('amountForm').value == "" || this.formGroup.get('amountForm').value == null) {
            this.tenPercentTip = "0.00"
            this.fifteenPercentTip = "0.00"
            this.twentyPercentTip = "0.00"
            this.chosenTipAmount = "0.00"
            this.totalAmountWithTip = "0.00"
        } else {
            this.tenPercentTip = (parseFloat(this.formGroup.get('amountForm').value) / 10).toFixed(2).toString()
            this.fifteenPercentTip = (parseFloat(this.formGroup.get('amountForm').value) * 15 / 100).toFixed(2).toString()
            this.twentyPercentTip = (parseFloat(this.formGroup.get('amountForm').value) / 5).toFixed(2).toString()
            if (document.activeElement.id == "tenPercentTip" ||
                document.activeElement.id == "fifteenPercentTip" ||
                document.activeElement.id == "twentyPercentTip") {
                this.totalAmountWithTip = (parseFloat(this.formGroup.get('amountForm').value) + parseFloat(this.chosenTipAmount))
                    .toFixed(2).toString()
            } else {
                this.totalAmountWithTip = parseFloat(this.formGroup.get('amountForm').value).toFixed(2).toString()
            }

        }

        return this.formGroup.get('amountForm')
    }

    setAmountWithTip(amount: string) {
        this.chosenTipAmount = amount
    }
}
