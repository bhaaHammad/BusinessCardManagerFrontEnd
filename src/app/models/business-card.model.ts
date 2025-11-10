import { Gender } from "app/shared/types";

export interface BusinessCard {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  photoBase64?: string;
}
