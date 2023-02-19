import {Component, OnInit} from '@angular/core';
import { FirebaseService } from "../../services/firebase.service";
import {Amount} from "../../models/Amount";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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
                    Validators.max(parseFloat(this.amount.amount))
                ]]
            })
        })

    }

    onPay() {
        let guestName = this.formGroup.get('nameForm').value
        let guestAmount = this.formGroup.get('amountForm').value

        this.firebaseService.saveGuest(this.paymentroom, guestName, guestAmount)
        this.router.navigateByUrl('/finish/' + this.paymentroom)
    }

    get nameForm() {
        return this.formGroup.get('nameForm')
    }

    get amountForm() {
        return this.formGroup.get('amountForm')
    }
}
