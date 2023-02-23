import {Component, OnInit} from '@angular/core';
import {FirebaseService} from "../../../services/firebase.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {Guest} from "../../../models/Guest";

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.css']
})
export class ProcessingComponent implements OnInit  {

    guest: Guest
    paymentroom: string
    guestId: string

    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.paymentroom = this.route.snapshot.paramMap.get('paymentroom');
        this.guestId = this.route.snapshot.paramMap.get('guestId');
        this.firebaseService.getGuest(this.paymentroom, this.guestId).subscribe(guest => {
            this.guest = guest
        })
    }


}
