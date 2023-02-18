import {Component} from '@angular/core';
import {FirebaseService} from "../../services/firebase.service";
import {Guest} from "../../models/Guest";

@Component({
    selector: 'app-finish',
    templateUrl: './finish.component.html',
    styleUrls: ['./finish.component.css']
})
export class FinishComponent {

    guests: Guest[];

    constructor(private firebaseService: FirebaseService) {
    }

    ngOnInit() {
        this.firebaseService.getGuests().subscribe(guests => {
            this.guests = guests
        })
    }
}
