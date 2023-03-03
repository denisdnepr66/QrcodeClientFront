import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {Guest} from "../models/Guest";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
    // amount: Observable<Amount>

    constructor(
        public afs: AngularFirestore,
        private router: Router) { }

    getAmount(paymentroom: string) {
          return this.afs
              .collection('paymentrooms')
              .doc(paymentroom)
              .valueChanges();
    }

    getGuest(paymentroom: string, guestId: string) {
        return this.afs
            .collection('paymentrooms')
            .doc(paymentroom)
            .collection('guests')
            .doc(guestId)
            .valueChanges();
    }

    getGuests(paymentroom: string) {
        return this.afs
            .collection('paymentrooms')
            .doc(paymentroom)
            .collection('guests')
            .valueChanges()
    }

    saveGuest(paymentroom: string, guestName: string, guestAmount: string, guestCurrency: string, guestTip: string, paymentMethod: string) {
        this.afs
            .collection('paymentrooms')
            .doc(paymentroom)
            .collection('guests')
            .add({
                name: guestName,
                amount: guestAmount,
                currency: guestCurrency,
                guestTip: guestTip,
                wantToPayByCard: false,
                accepted: true,
                paymentMethod: paymentMethod
            })
    }

    saveGuestToPayOnTerminalAndRedirect(paymentroom: string, guestName:string, guestAmount: string, guestCurrency: string, guestTip: string) {
        this.afs
            .collection('paymentrooms')
            .doc(paymentroom)
            .collection('guests')
            .add({
                name: guestName,
                amount: guestAmount,
                currency: guestCurrency,
                guestTip: guestTip,
                wantToPayByCard: true,
                accepted: false,
                paymentMethod: 'CARD_ON_TERMINAL'
            })
            .then(docRef => {
                    this.router.navigateByUrl('/processing/' + paymentroom + '/' + docRef.id)
                }
            )
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
