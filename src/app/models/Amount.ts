import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

export class Amount {
    amount?:string = "0.00";
    currencyName?:string = "0.00";
    currencyCode?:string = "0.00";
    exponent?:string = "0.00";
    leftToPay?:string = "0.00";
    totalTip?:string = "0.00";
    splitBy?:number = 0;
    shouldSplit?:boolean = false;
    blockedAmount?:string="0.00";
    receiptClosedTimestamp?:Timestamp
}
