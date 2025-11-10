import { Gender } from "app/shared/types";

export interface BusinessCard {
  id: number;
  name: string;
  gender: Gender | string | null; // Allow string for backend compatibility
  dateOfBirth: string | null;
  email: string;
  phone: string;
  address: string;
  photo: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

// Backend API Response Structure
export interface ApiResponse<T> {
  status: string;
  message: string | null;
  data: {
    result: T;
    success: boolean;
    message: string;
    errorList: any[];
  };
  errors: any[];
  timeGenerated: string;
}
