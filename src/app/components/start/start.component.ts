import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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

    paymentRequest: google.payments.api.PaymentDataRequest

    userAgent: string = navigator.userAgent.toLowerCase();

    isAndroid: boolean = this.userAgent.indexOf('android') > -1 && this.userAgent.indexOf('mobile') > -1;

    amountLoaded: boolean = false

    numOfGuests:number

    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.paymentroom = this.route.snapshot.paramMap.get('paymentroom');
        this.firebaseService.getAmount(this.paymentroom).subscribe(amount => {
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
            this.setSplittedAmountIfNeeded()
            this.amountLoaded = true;
            console.log('amountLoaded:', this.amountLoaded);
            this.cdRef.detectChanges();
        })


        this.setTipEventListeners()
        this.paymentRequest = {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
                {
                    type: 'CARD',
                    parameters: {
                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                        allowedCardNetworks: ['AMEX', 'DISCOVER', 'JCB', 'MASTERCARD', 'VISA']
                    },
                    tokenizationSpecification: {
                        type: 'PAYMENT_GATEWAY',
                        parameters: {
                            gateway: 'example',
                            gatewayMerchantId: 'exampleGatewayMerchantId'
                        }
                    }
                }
            ],
            merchantInfo: {
                merchantId: '12345678901234567890',
                merchantName: 'Example Merchant'
            },
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPriceLabel: 'Total',
                totalPrice: this.totalAmountWithTip,
                currencyCode: 'PLN',
                countryCode: 'PL'
            }
        };
    }

    private setSplittedAmountIfNeeded() {
        if (this.amount.shouldSplit && this.amount.splitBy != 0) {
            let dividedAmount = (parseFloat(this.amount.amount) / this.amount.splitBy).toFixed(2)
            this.formGroup.get('amountForm').setValue(dividedAmount);
        }
    }

    private setTipEventListeners() {
        const tenPercentTip = document.getElementById('tenPercentTip');
        if (tenPercentTip) {
            tenPercentTip.addEventListener('focusout', (event) => {
                this.totalAmountWithTip = this.formGroup.get('amountForm').value.toFixed(2).toString();
            });
        }

        const fifteenPercentTip = document.getElementById('fifteenPercentTip');
        if (fifteenPercentTip) {
            fifteenPercentTip.addEventListener('focusout', (event) => {
                this.totalAmountWithTip = this.formGroup.get('amountForm').value.toFixed(2).toString();
            });
        }

        const twentyPercentTip = document.getElementById('twentyPercentTip');
        if (twentyPercentTip) {
            twentyPercentTip.addEventListener('focusout', (event) => {
                this.totalAmountWithTip = this.formGroup.get('amountForm').value.toFixed(2).toString();
            });
        }
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
            this.paymentRequest.transactionInfo.totalPrice = this.totalAmountWithTip;
            this.tenPercentTip = (parseFloat(this.formGroup.get('amountForm').value) / 10).toFixed(2).toString()
            this.fifteenPercentTip = (parseFloat(this.formGroup.get('amountForm').value) * 15 / 100).toFixed(2).toString()
            this.twentyPercentTip = (parseFloat(this.formGroup.get('amountForm').value) / 5).toFixed(2).toString()

            if (this.selectedOption == "undefined") {
                this.totalAmountWithTip = parseFloat(this.formGroup.get('amountForm').value).toFixed(2).toString()
            } else {
                this.totalAmountWithTip = (parseFloat(this.formGroup.get('amountForm').value) + parseFloat(this.chosenTipAmount))
                    .toFixed(2).toString()
            }
        }

        return this.formGroup.get('amountForm')
    }

    setAmountWithTip(amount: string) {
        if (this.selectedOnce && this.chosenTipAmount == amount) {
            this.selectedOption = null;
            this.chosenTipAmount = "0.00"
            this.selectedOnce = false;
        } else {
            this.chosenTipAmount = amount
            this.selectedOnce = true;
        }
    }

    disableRadioButtons: boolean = false // todo implement. set to true by defalult and change to false when there is an amount provided

    selectedOption: string;

    selectedOnce = false;

    onSkip() {
        this.firebaseService.setShouldSplitFalse(this.paymentroom)
    }

    onSubmit() {
        this.firebaseService.setNumberOfGuestsToBeSplitted(this.paymentroom, this.numOfGuests)
    }


}
