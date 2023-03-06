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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { AppRoutingModule } from './app-routing.module';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { GooglePayButtonModule } from '@google-pay/button-angular';
import { ProcessingComponent } from './components/processing/processing/processing.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './components/confirmationdialog/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    FinishComponent,
    ProcessingComponent,
    ConfirmationDialogComponent
  ],
    imports: [
        BrowserModule,
        MatProgressSpinnerModule,
        AngularFirestoreModule,
        AngularFireModule.initializeApp(environment.firebase),
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        BrowserAnimationsModule,
        AppRoutingModule,
        RouterLink,
        RouterLinkActive,
        RouterOutlet,
        MatInputModule,
        MatButtonModule,
        GooglePayButtonModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule
    ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
