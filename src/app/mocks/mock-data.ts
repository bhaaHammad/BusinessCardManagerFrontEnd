import { BusinessCard } from '../models/business-card.model';

export const MOCK_BUSINESS_CARDS: BusinessCard[] = [
  {
    id: '1',
    name: 'John Doe',
    gender: 'Male',
    dateOfBirth: '1990-01-15',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    address: '123 Main St, City, State 12345',
    photoBase64: undefined,
  },
  {
    id: '2',
    name: 'Jane Smith',
    gender: 'Female',
    dateOfBirth: '1985-05-20',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    address: '456 Oak Ave, City, State 67890',
    photoBase64: undefined,
  },
  {
    id: '3',
    name: 'Alex Johnson',
    gender: 'Other',
    dateOfBirth: '1992-08-10',
    email: 'alex.johnson@example.com',
    phone: '555-456-7890',
    address: '789 Pine Rd, City, State 11111',
    photoBase64: undefined,
  },
];

