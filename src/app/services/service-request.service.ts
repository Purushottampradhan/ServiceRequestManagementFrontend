import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceRequest, ServiceRequestFilter } from '../models/service-request.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {
  private apiUrl = 'https://servicerequestbackend-1.onrender.com/api/servicerequests';

  constructor(private http: HttpClient) { }

  getAllRequests(): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(this.apiUrl);
  }

  getRequestById(id: number): Observable<ServiceRequest> {
    return this.http.get<ServiceRequest>(`${this.apiUrl}/${id}`);
  }

  createRequest(request: ServiceRequest): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.apiUrl, request);
  }

  updateRequest(id: number, request: ServiceRequest): Observable<ServiceRequest> {
    return this.http.put<ServiceRequest>(`${this.apiUrl}/${id}`, request);
  }

  deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getRequestsByStatus(status: string): Observable<ServiceRequest[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<ServiceRequest[]>(`${this.apiUrl}/filter/status`, { params });
  }
}