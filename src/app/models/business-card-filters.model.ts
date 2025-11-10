import { Gender } from "../shared/types";

export interface BusinessCardFilters {
    name?: string;
    dateOfBirth?: string;
    phone?: string;
    gender?: Gender;
    email?: string;
  }