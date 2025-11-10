import { Gender } from "app/shared/types";

export interface BusinessCard {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth: string; // ISO string (yyyy-MM-dd)
  email: string;
  phone: string;
  address: string;
  photoBase64?: string; // <= 1MB base64 payload
}


