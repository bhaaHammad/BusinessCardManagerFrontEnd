import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { environment } from '@env/environment';
import { MOCK_BUSINESS_CARDS } from '@mocks/mock-data';
import { BusinessCard, ApiResponse } from '@models/business-card.model';

export const mockHttpInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.useMocks) {
    return next(req);
  }

  if (req.method === 'GET' && (req.url.includes('/api/business-cards') || req.url.includes('/api/cards')) && !req.url.includes('/export')) {
    const url = new URL(req.url, 'http://localhost');
    const params: Record<string, string> = {};
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    let filteredCards = [...MOCK_BUSINESS_CARDS];
    
    if (params['name']) {
      filteredCards = filteredCards.filter((c) =>
        c.name.toLowerCase().includes(params['name'].toLowerCase())
      );
    }
    if (params['email']) {
      filteredCards = filteredCards.filter((c) =>
        c.email.toLowerCase().includes(params['email'].toLowerCase())
      );
    }
    if (params['phone']) {
      filteredCards = filteredCards.filter((c) => c.phone.includes(params['phone']));
    }
    if (params['gender']) {
      filteredCards = filteredCards.filter((c) => c.gender === params['gender']);
    }
    if (params['dob']) {
      filteredCards = filteredCards.filter((c) => c.dateOfBirth === params['dob']);
    }

    const response: ApiResponse<BusinessCard[]> = {
      status: 'success',
      message: null,
      data: {
        result: filteredCards,
        success: true,
        message: `Successfully retrieved ${filteredCards.length} business card(s).`,
        errorList: [],
      },
      errors: [],
      timeGenerated: new Date().toISOString(),
    };

    return of(new HttpResponse({ status: 200, body: response })).pipe(delay(300));
  }

  if (req.method === 'POST' && (req.url.includes('/api/business-cards') || req.url.includes('/api/cards')) && !req.url.includes('/import') && !req.url.includes('/export')) {
    const body = req.body as any;
    const newCard: BusinessCard = {
      id: Date.now(),
      name: body.name || '',
      gender: body.gender || null,
      dateOfBirth: body.dateOfBirth || null,
      email: body.email || '',
      phone: body.phone || '',
      address: body.address || '',
      photo: body.photoBase64 || null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    MOCK_BUSINESS_CARDS.push(newCard);
    
    const response: ApiResponse<BusinessCard> = {
      status: 'success',
      message: null,
      data: {
        result: newCard,
        success: true,
        message: 'Business card created successfully',
        errorList: [],
      },
      errors: [],
      timeGenerated: new Date().toISOString(),
    };
    
    return of(new HttpResponse({ status: 201, body: response })).pipe(delay(300));
  }

  if (req.method === 'DELETE' && (req.url.includes('/api/business-cards/') || req.url.includes('/api/cards/'))) {
    const idStr = req.url.split('/').pop();
    const id = idStr ? Number(idStr) : null;
    if (id !== null) {
      const index = MOCK_BUSINESS_CARDS.findIndex((c) => c.id === id);
      if (index > -1) {
        MOCK_BUSINESS_CARDS.splice(index, 1);
      }
    }
    
    const response: ApiResponse<void> = {
      status: 'success',
      message: null,
      data: {
        result: undefined as any,
        success: true,
        message: 'Business card deleted successfully',
        errorList: [],
      },
      errors: [],
      timeGenerated: new Date().toISOString(),
    };
    
    return of(new HttpResponse({ status: 200, body: response })).pipe(delay(300));
  }

  if (req.method === 'POST' && req.url.includes('/api/cards/export')) {
    const url = new URL(req.url, 'http://localhost');
    const format = url.searchParams.get('format') || 'csv';
    const body = req.body as { cards?: BusinessCard[] };
    const cards = body?.cards || MOCK_BUSINESS_CARDS;
    
    let content = '';
    if (format === 'csv') {
      content = 'Name,Gender,DateOfBirth,Email,Phone,Address\n';
      cards.forEach((card) => {
        content += `${card.name},${card.gender},${card.dateOfBirth},${card.email},${card.phone},${card.address}\n`;
      });
    } else {
      content = '<?xml version="1.0"?><BusinessCards>\n';
      cards.forEach((card) => {
        content += `  <BusinessCard><Name>${card.name}</Name><Gender>${card.gender}</Gender><DateOfBirth>${card.dateOfBirth}</DateOfBirth><Email>${card.email}</Email><Phone>${card.phone}</Phone><Address>${card.address}</Address></BusinessCard>\n`;
      });
      content += '</BusinessCards>';
    }
    
    const blob = new Blob([content], {
      type: format === 'csv' ? 'text/csv' : 'application/xml',
    });
    return of(new HttpResponse({ status: 200, body: blob })).pipe(delay(300));
  }

  if (req.method === 'POST' && req.url.includes('/api/cards/import/preview')) {
    const mockPreview = {
      cards: MOCK_BUSINESS_CARDS.slice(0, 2),
      errors: [],
      totalRows: 2,
      validRows: 2,
      invalidRows: 0,
    };
    return of(new HttpResponse({ status: 200, body: mockPreview })).pipe(delay(500));
  }

  if (req.method === 'POST' && req.url.includes('/api/cards/import/commit')) {
    const cards = (req.body as { cards: Array<Omit<BusinessCard, 'id'>> }).cards;
    cards.forEach((card) => {
      const newCard: BusinessCard = {
        ...card,
        id: Date.now() + Math.floor(Math.random() * 1000),
        photo: card.photo || null,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      MOCK_BUSINESS_CARDS.push(newCard);
    });
    return of(new HttpResponse({ status: 200, body: null })).pipe(delay(500));
  }

  if (req.method === 'POST' && req.url.includes('/api/cards/import/qr')) {
    const payload = (req.body as { payload: string }).payload;
    const newCard: BusinessCard = {
      id: Date.now(),
      name: 'QR Imported Card',
      gender: 'Other',
      dateOfBirth: new Date().toISOString().split('T')[0],
      email: 'qr@example.com',
      phone: '555-000-0000',
      address: '',
      photo: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    };
    MOCK_BUSINESS_CARDS.push(newCard);
    return of(new HttpResponse({ status: 200, body: newCard })).pipe(delay(500));
  }

  if (req.method === 'POST' && req.url.includes('/api/cards/import/csv/preview')) {
    const mockPreviewCards = [
      {
        name: 'John Doe',
        gender: 'Male' as const,
        dateOfBirth: '1990-01-15',
        email: 'john.doe@example.com',
        phone: '555-0100',
        address: '123 Main Street',
      },
      {
        name: 'Jane Smith',
        gender: 'Female' as const,
        dateOfBirth: '1992-05-20',
        email: 'jane.smith@example.com',
        phone: '555-0200',
        address: '456 Oak Avenue',
      },
      {
        name: 'Bob Johnson',
        gender: 'Male' as const,
        dateOfBirth: '1988-11-10',
        email: 'bob.johnson@example.com',
        phone: '555-0300',
        address: '789 Pine Road',
      },
    ];

    const response = {
      cards: mockPreviewCards,
      errors: ['Row 5: Invalid email format', 'Row 7: Missing required field: name'],
      totalRows: 5,
      validRows: 3,
      invalidRows: 2,
    };
    
    return of(new HttpResponse({ status: 200, body: response })).pipe(delay(800));
  }

  if (req.method === 'POST' && req.url.includes('/api/cards/import/csv/commit')) {
    const body = req.body as { cards: Array<Omit<BusinessCard, 'id'>> };
    const cardsToImport = body.cards || [];
    
    cardsToImport.forEach((card) => {
      const newCard: BusinessCard = {
        ...card,
        id: Date.now() + Math.floor(Math.random() * 1000),
        photo: card.photo || null,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      MOCK_BUSINESS_CARDS.push(newCard);
    });

    const response = {
      message: 'CSV file imported successfully',
      importedCount: cardsToImport.length,
    };
    
    return of(new HttpResponse({ status: 200, body: response })).pipe(delay(1000));
  }

  return next(req);
};
