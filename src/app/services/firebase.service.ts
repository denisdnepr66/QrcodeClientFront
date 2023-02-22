import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {Guest} from "../models/Guest";
import {setDoc} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
    // amount: Observable<Amount>
    guests: Observable<Guest[]>

    constructor(public afs: AngularFirestore) { }

    getAmount(paymentroom: string) {
          return this.afs
              .collection('paymentrooms')
              .doc(paymentroom)
              .valueChanges();
    }

    getGuests(paymentroom: string) {
        return this.afs
            .collection('paymentrooms')
            .doc(paymentroom)
            .collection('guests')
            .valueChanges()
    }

    saveGuest(paymentroom: string, guestName: string, guestAmount: string, guestCurrency: string, guestTip: string) {
        this.afs
            .collection('paymentrooms')
            .doc(paymentroom)
            .collection('guests')
            .add({
                name: guestName,
                amount: guestAmount,
                currency: guestCurrency,
                guestTip: guestTip,
                wantToPayByCard: false
            })
    }

    saveGuestToPayOnTerminal(paymentroom: string, guestName:string, guestAmount: string, guestCurrency: string, guestTip: string) {
        this.afs
            .collection('paymentrooms')
            .doc(paymentroom)
            .collection('guests')
            .add({
                name: guestName,
                amount: guestAmount,
                currency: guestCurrency,
                guestTip: guestTip,
                wantToPayByCard: true
            })
    }

    updateLeftToPayAndTotalTip(paymentroom: string, newLeftToPayAmount: string, newTipAmount: string) {
        this.afs
            .collection('paymentrooms')
            .doc(paymentroom)
            .update({
                leftToPay: newLeftToPayAmount,
                totalTip: newTipAmount
            })
    }
}
