import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {Guest} from "../models/Guest";
import {Amount} from "../models/Amount";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
    amount: Observable<Amount>
    guests: Observable<Guest[]>

    constructor(public afs: AngularFirestore) {
        this.amount = this.afs
            .collection('paymentrooms')
            .doc('0f75a7af-7b4d-4ee7-81dd-f95ba1bf461a')
            .valueChanges()
        this.guests = this.afs
            .collection('paymentrooms')
            .doc('0f75a7af-7b4d-4ee7-81dd-f95ba1bf461a') // todo change to id from link path
            .collection('guests')
            .valueChanges()
    }

    getAmount() {
          return this.amount;
    }

    getGuests() {
        return this.guests;
    }
}
