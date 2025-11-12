import { BusinessCard } from '@models/business-card.model';
import { CreateBusinessCardRequest } from '@models/dtos/create-business-card.dto';
import { Gender } from '@shared/types';

export function mapToCreateRequest(
  card: Partial<BusinessCard>
): CreateBusinessCardRequest {
  let gender: Gender = 'Male';
  if (card.gender === 'Male' || card.gender === 'Female') {
    gender = card.gender;
  }

  return {
    name: card.name || '',
    gender: gender,
    dateOfBirth: card.dateOfBirth || '',
    email: card.email || '',
    phone: card.phone || '',
    address: card.address || '',
    photo: card.photo || undefined,
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
    photo: data.photo,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
