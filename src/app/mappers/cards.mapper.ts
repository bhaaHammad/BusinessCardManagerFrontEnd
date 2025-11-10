import { BusinessCard } from '@models/business-card.model';
import { CreateBusinessCardRequest } from '@models/dtos/create-business-card.dto';

export function mapToCreateRequest(card: Partial<BusinessCard>): CreateBusinessCardRequest {
  return {
    name: card.name || '',
    gender: card.gender || 'Other',
    dateOfBirth: card.dateOfBirth || '',
    email: card.email || '',
    phone: card.phone || '',
    address: card.address || '',
    photoBase64: card.photoBase64,
  };
}

export function mapFromApiResponse(response: unknown): BusinessCard {
  const data = response as BusinessCard;
  return {
    id: data.id,
    name: data.name,
    gender: data.gender,
    dateOfBirth: data.dateOfBirth,
    email: data.email,
    phone: data.phone,
    address: data.address,
    photoBase64: data.photoBase64,
  };
}

