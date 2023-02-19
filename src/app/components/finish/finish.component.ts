import {Component} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {Guest} from "../../models/Guest";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-finish',
    templateUrl: './finish.component.html',
    styleUrls: ['./finish.component.css']
})
export class FinishComponent {

    guests: Guest[];
    paymentroom: string

    constructor(
        private firebaseService: FirebaseService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.paymentroom = this.route.snapshot.paramMap.get('paymentroom');
        this.firebaseService.getGuests(this.paymentroom).subscribe(guests => {
            this.guests = guests
        })
    }
}
