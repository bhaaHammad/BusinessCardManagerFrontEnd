import { Gender } from 'app/shared/types';

export interface BusinessCard {
  id: number;
  name: string;
  gender: Gender | string | null;
  dateOfBirth: string | null;
  email: string;
  phone: string;
  address: string;
  photo: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}
