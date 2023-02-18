import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import {AngularFireModule} from "@angular/fire/compat";
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { StartComponent } from './components/start/start.component';
import { FirebaseService } from "./services/firebase.service";
import { FinishComponent } from './components/finish/finish.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    FinishComponent
  ],
  imports: [
    BrowserModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
