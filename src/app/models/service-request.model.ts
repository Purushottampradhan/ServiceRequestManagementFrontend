export interface ServiceRequest {
  id?: number;
  title: string;
  description: string;
  createdDate?: Date;
  status: string;
  createdBy: string;
  updatedDate?: Date;
  updatedBy?: string;
}

export interface ServiceRequestFilter {
  status?: string;
  search?: string;
}