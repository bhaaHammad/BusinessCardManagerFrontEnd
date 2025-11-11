import { Gender } from "../../shared/types";

export interface CreateBusinessCardRequest {
    name: string;
    gender: Gender;
    dateOfBirth: string;
    email: string;
    phone: string;
    address: string;
    photo?: string;
  }
