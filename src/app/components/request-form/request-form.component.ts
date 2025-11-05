import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceRequestService } from '../../services/service-request.service';
import { AuthService } from '../../services/auth.service';
import { ServiceRequest } from '../../models/service-request.model';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-request-form',
  imports: [CommonModule,MaterialModule],
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css']
})
export class RequestFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  loading = false;
  statusOptions = ['Open', 'In Progress', 'Closed'];

  constructor(
    private formBuilder: FormBuilder,
    private serviceRequestService: ServiceRequestService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<RequestFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.isEdit = this.data.isEdit;
    this.initializeForm();
  }

  initializeForm() {
    if (this.isEdit) {
      const request = this.data.request;
      this.form = this.formBuilder.group({
        title: [request.title, Validators.required],
        description: [request.description],
        status: [request.status, Validators.required]
      });
    } else {
      this.form = this.formBuilder.group({
        title: ['', Validators.required],
        description: [''],
        status: ['Open']
      });
    }
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const currentUser = this.authService.currentUserValue;

    if (this.isEdit) {
      const updatedRequest: ServiceRequest = {
        ...this.data.request,
        ...this.form.value
      };
      this.serviceRequestService.updateRequest(this.data.request.id, updatedRequest).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error updating request:', error);
          this.loading = false;
        }
      });
    } else {
      const newRequest: ServiceRequest = {
        ...this.form.value,
        createdBy: currentUser?.username || 'Unknown'
      };
      this.serviceRequestService.createRequest(newRequest).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error creating request:', error);
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}