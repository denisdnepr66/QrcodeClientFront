import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import firebase from 'firebase/compat/app';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    constructor(
        public afs: AngularFirestore,
        private router: Router) {
    }

    setShouldSplitFalse(paymentroom: string) {
        const paymentRoomRef = this.afs.collection("paymentrooms").doc(paymentroom).ref;

        this.afs.firestore.runTransaction(async (transaction) => {
            const paymentRoomDoc = await transaction.get(paymentRoomRef);

            if (!paymentRoomDoc.exists) {
                throw new Error("Payment Room does not exist!");
            }

            const newShouldSplit = false;

            transaction.update(paymentRoomRef, { shouldSplit: newShouldSplit });

            return newShouldSplit;
        }).then((newShouldSplit) => {
            console.log(`Transaction successfully committed. New shouldSplit value: ${newShouldSplit}`);
        }).catch((error) => {
            console.error(`Transaction failed: ${error}`);
        });


    }

    setNumberOfGuestsToBeSplitted(paymentroom: string, numberOfGuests: number) {
        this.afs.firestore.runTransaction(transaction => {
            const paymentroomRef = this.afs.collection('paymentrooms').doc(paymentroom).ref;
            return transaction.get(paymentroomRef).then(doc => {
                if (!doc.exists) {
                    throw "Document does not exist!";
                }

                const shouldSplit = true;
                const splitBy = numberOfGuests;
                transaction.update(paymentroomRef, { shouldSplit, splitBy });
            });
        });

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
                paymentMethod: paymentMethod,
                transactionDateTime: firebase.firestore.Timestamp.now()
            });
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
                    this.afs.firestore.runTransaction((transaction) => {
                        const paymentroomDoc = this.afs.collection('paymentrooms').doc(paymentroom).ref;

                        return transaction.get(paymentroomDoc).then((doc) => {
                            if (!doc.exists) {
                                throw new Error('Payment room document does not exist');
                            }
                            const blockedAmount1 = doc.get("blockedAmount")

                            const ga = parseFloat(guestAmount);
                            const ba = parseFloat(blockedAmount1);
                            const newBlockedAmount = (ga + ba).toFixed(2);

                            const updatedData = {
                                blockedAmount: newBlockedAmount,
                            };

                            transaction.update(paymentroomDoc, updatedData);

                            return {
                                paymentroomDoc,
                                docRef: this.afs.collection('paymentrooms').doc(paymentroom).collection('guests').doc(),
                            };
                        });
                    }).then(() => {
                        this.router.navigateByUrl('/processing/' + paymentroom + '/' + docRef.id)
                    }).catch((error) => {
                        console.error('Transaction failed: ', error);
                    });

                }
            )
    }

    updateLeftToPayAndTotalTip(paymentroom: string, newLeftToPayAmount: string, newTipAmount: string) {
        this.afs.firestore.runTransaction(transaction => {
            const paymentroomDoc = this.afs.collection('paymentrooms').doc(paymentroom).ref;

            return transaction.get(paymentroomDoc).then(doc => {
                if (!doc.exists) {
                    throw new Error('Payment room document does not exist!');
                }

                transaction.update(paymentroomDoc, {
                    leftToPay: newLeftToPayAmount,
                    totalTip: newTipAmount
                });
            });
        }).then(() => {
            console.log('Transaction completed successfully!');
        }).catch(error => {
            console.error('Transaction failed: ', error);
        });
    }

    deleteGuest(paymentroom: string, documentId: string, blockedAmount: string, guestAmount: string): void {
        const ga = parseFloat(blockedAmount);
        const ba = parseFloat(guestAmount);

        const newBlockedAmount = (ga - ba).toFixed(2);
        this.afs
            .collection('paymentrooms')
            .doc(paymentroom)
            .collection('guests')
            .doc(documentId)
            .delete()
            .then(() => {
                this.afs
                    .collection('paymentrooms')
                    .doc(paymentroom)
                    .update({
                        blockedAmount: newBlockedAmount
                    })
            })
            .catch((error) => {
                console.error('Error deleting document: ', error);
            });
    }
}
