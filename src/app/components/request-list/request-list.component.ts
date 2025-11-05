import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ServiceRequestService } from '../../services/service-request.service';
import { ServiceRequest } from '../../models/service-request.model';
import { RequestFormComponent } from '../request-form/request-form.component';
import { RequestDetailComponent } from '../request-detail/request-detail.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
@Component({
  selector: 'app-request-list',
  imports: [CommonModule, MaterialModule],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
  requests: ServiceRequest[] = [];
  displayedColumns: string[] = ['id', 'title', 'status', 'createdBy', 'createdDate', 'actions'];
  loading = false;
  selectedStatus = '';
  statusOptions = ['Open', 'In Progress', 'Closed'];

  constructor(
    private serviceRequestService: ServiceRequestService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    if (this.selectedStatus) {
      this.serviceRequestService.getRequestsByStatus(this.selectedStatus).subscribe({
        next: (data) => {
          this.requests = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading requests:', error);
          this.loading = false;
        }
      });
    } else {
      this.serviceRequestService.getAllRequests().subscribe({
        next: (data) => {
          this.requests = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading requests:', error);
          this.loading = false;
        }
      });
    }
  }

  onStatusChange() {
    this.loadRequests();
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(RequestFormComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRequests();
      }
    });
  }

  viewDetails(request: ServiceRequest) {
    this.dialog.open(RequestDetailComponent, {
      width: '600px',
      data: request
    });
  }

  openEditDialog(request: ServiceRequest) {
    const dialogRef = this.dialog.open(RequestFormComponent, {
      width: '600px',
      data: { isEdit: true, request }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRequests();
      }
    });
  }

  deleteRequest(id: number) {
    if (confirm('Are you sure you want to delete this request?')) {
      this.serviceRequestService.deleteRequest(id).subscribe({
        next: () => {
          this.loadRequests();
        },
        error: (error) => {
          console.error('Error deleting request:', error);
        }
      });
    }
  }
}