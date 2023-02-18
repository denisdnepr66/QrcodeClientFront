import { Component } from '@angular/core';
import { FirebaseService } from "../../services/firebase.service";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent {

    constructor(private firebaseService: FirebaseService) { }
}
