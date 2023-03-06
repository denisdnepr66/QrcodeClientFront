import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {tap} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    // amount: Observable<Amount>

    constructor(
        public afs: AngularFirestore,
        private router: Router) {
    }

    setShouldSplitFalse(paymentroom: string) {
        this.afs
            .collection("paymentrooms")
            .doc(paymentroom)
            .update({shouldSplit: false})
    }

    setNumberOfGuestsToBeSplitted(paymentroom: string, numberOfGuests: number) {
        this.afs
            .collection("paymentrooms")
            .doc(paymentroom)
            .update({
                shouldSplit: true,
                splitBy: numberOfGuests
            })
    }

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
                accepted: true,
                paymentMethod: paymentMethod
            })
    }

    saveGuestToPayOnTerminalAndRedirect(paymentroom: string, guestName: string, guestAmount: string, guestCurrency: string, guestTip: string, paymentMethod: string) {
        this.afs
            .collection('paymentrooms')
            .doc(paymentroom)
            .collection('guests')
            .add({
                name: guestName,
                amount: guestAmount,
                currency: guestCurrency,
                guestTip: guestTip,
                accepted: false,
                paymentMethod: paymentMethod
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

    deleteGuest(paymentroom: string, documentId: string): void {
        this.afs
            .collection('paymentrooms')
            .doc(paymentroom)
            .collection('guests')
            .doc(documentId)
            .delete()
            .then(() => {
                console.log('Document successfully deleted!');
            })
            .catch((error) => {
                console.error('Error deleting document: ', error);
            });
    }
}
