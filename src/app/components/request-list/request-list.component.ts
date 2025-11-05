// ============================================================================
// UPDATED REQUEST LIST COMPONENT - With Functional Sidebar
// Replace src/app/components/request-list/request-list.component.ts
// ============================================================================

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
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css'],
  imports: [CommonModule,MaterialModule]
})
export class RequestListComponent implements OnInit {
  requests: ServiceRequest[] = [];
  allRequests: ServiceRequest[] = []; // Store all requests for filtering
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

  /**
   * Load all requests from the service
   */
  loadRequests() {
    this.loading = true;
    this.serviceRequestService.getAllRequests().subscribe({
      next: (data) => {
        console.log('All Requests Loaded:', data);
        this.allRequests = data || [];
        this.requests = data || [];
        this.loading = false;
        console.log('Total requests:', this.getTotalRequestCount());
        console.log('Open:', this.getStatusCount('Open'));
        console.log('In Progress:', this.getStatusCount('In Progress'));
        console.log('Closed:', this.getStatusCount('Closed'));
      },
      error: (error) => {
        console.error('Error loading requests:', error);
        this.allRequests = [];
        this.requests = [];
        this.loading = false;
      }
    });
  }

  /**
   * Filter requests by status from sidebar
   * @param status - The status to filter by (empty string for all)
   */
  filterByStatus(status: string) {
    console.log('Filtering by status:', status);
    this.selectedStatus = status;

    if (status === '') {
      // Show all requests
      this.requests = [...this.allRequests];
      console.log('Showing all requests:', this.requests.length);
    } else {
      // Filter by status from already loaded data
      this.requests = this.allRequests.filter(request => request.status === status);
      console.log(`Showing ${status} requests:`, this.requests.length);
    }
  }

  /**
   * Handle status change from filter dropdown
   */
  onStatusChange() {
    if (this.selectedStatus) {
      this.filterByStatus(this.selectedStatus);
    } else {
      this.filterByStatus('');
    }
  }

  /**
   * Get total count of all requests
   * @returns Total number of requests
   */
  getTotalRequestCount(): number {
    const count = this.allRequests ? this.allRequests.length : 0;
    console.log('Total count:', count);
    return count;
  }

  /**
   * Get count of requests by specific status
   * @param status - The status to count
   * @returns Count of requests with given status
   */
  getStatusCount(status: string): number {
    if (!this.allRequests || this.allRequests.length === 0) {
      return 0;
    }
    const count = this.allRequests.filter(request => 
      request.status === status
    ).length;
    console.log(`Count for ${status}:`, count);
    return count;
  }

  /**
   * Open create request dialog
   */
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

  /**
   * View request details in dialog
   * @param request - The request to view
   */
  viewDetails(request: ServiceRequest) {
    this.dialog.open(RequestDetailComponent, {
      width: '600px',
      data: request
    });
  }

  /**
   * Open edit request dialog
   * @param request - The request to edit
   */
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

  /**
   * Delete request after confirmation
   * @param id - The ID of the request to delete
   */
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

  /**
   * Logout user
   */
  logout() {
    // This will be handled by parent component or auth service
    // Placeholder for logout functionality
  }
}