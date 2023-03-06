import {Component, EventEmitter, Inject, Output} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
    message: string;
    options: string;

    @Output() confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if (data) {
            this.message = data.message;
            this.options = data.options;
        }
    }

    onOkClick(): void {
        // Perform an action when the user clicks "OK"
        this.dialogRef.close(true);
    }

    onCancelClick(): void {
        // Perform an action when the user clicks "Cancel" or closes the dialog
        this.dialogRef.close(false);
    }

    closeDialog(): void {
        // Programmatically close the dialog
        this.dialogRef.close();
    }
}
