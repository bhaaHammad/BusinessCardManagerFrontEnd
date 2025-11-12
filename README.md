# Business Card Manager Front-End

A modern **Angular 18** front-end application for managing business
cards with features such as filtering, importing, exporting, QR
processing, and a signals-based global store.

------------------------------------------------------------------------

## 🚀 Features

-   ✅ Angular 18 with **Standalone Components**
-   ✅ **Angular Signals** state management (CardsStore)
-   ✅ Fully Typed API layer (Cards, Import, Export, QR)
-   ✅ Angular Material UI -- responsive & polished
-   ✅ File Import (CSV/Excel) with server preview
-   ✅ QR Import with automatic card creation
-   ✅ Export system (CSV/XML) that respects filters
-   ✅ Mock mode support for offline development
-   ✅ Strong form validation + clean architecture

------------------------------------------------------------------------

## 📁 Project Structure

    src/
      app/
        apis/           # API communication (HTTP facades)
        components/     # Reusable UI components
        pages/          # Route-level views
        routes/         # Application routing
        services/       # Shared services (HTTP, Toast, Export)
        stores/         # Signals-based app state
        models/         # Interfaces/DTOs
        validators/     # Custom validators
        interceptors/   # Error + mock interceptors

------------------------------------------------------------------------

## 🧩 Routing Overview

-   `/cards` → Card list + filters\
-   `/cards/new` → Create new card\
-   `/cards/:id` → Card details page\
-   `/import` → File import preview + submit\
-   `/qr` → QR import page

------------------------------------------------------------------------

## 🛠 Tech Stack

  Layer       Technology
  ----------- ------------------------
  Framework   Angular 18
  UI          Angular Material
  State       Signals Store
  Build       Angular CLI
  Language    TypeScript 5.5
  Styling     SCSS
  Mocking     Local mock interceptor

------------------------------------------------------------------------

## ⚙️ Environment Configuration

Located in:\
`src/environments/environment.ts`\
`src/environments/environment.prod.ts`

    export const environment = {
      baseUrl: 'https://localhost:7060',
      useMocks: false
    };

To enable mock mode:

    useMocks: true

------------------------------------------------------------------------

## 📡 API Structure

### Business Cards API

-   `GET /api/business-cards`
-   `POST /api/business-cards`
-   `DELETE /api/business-cards/:id`
-   `POST /api/business-cards/bulk`

### Import API

-   `POST /api/business-cards/import/preview`

### Export API

-   `GET /api/business-cards/export/csv`
-   `GET /api/business-cards/export/xml`

### QR API

-   `POST /api/qr`

------------------------------------------------------------------------

## 🏗 Development

### Install Dependencies

    npm install

### Run Development Server

    npm start

App will run at:\
➡️ `http://localhost:4200`

### Build for Production

    npm run build

------------------------------------------------------------------------

## 🧱 Architecture Summary

    Components ↔ CardsStore ↔ API Services ↔ HttpService ↔ Backend

### State (Signals Store)

-   Stores cards, filters, loading state, error messages
-   Automatically reloads cards on browser initialization
-   Provides computed selectors (filteredCards, totalCount)

------------------------------------------------------------------------

## 🧪 Validation

- Custom validators: 
    - Email format
    - Phone format
    - Date of birth
    - File size

------------------------------------------------------------------------

## 📤 Export System

The export feature attaches filters directly from the global store, so
the exported file always matches the visible results.

- Export Options: 
    - CSV
    - XML

------------------------------------------------------------------------

## 📥 Import System

- Features: 
    - File upload (CSV/XLSX)
    - Server-side preview
    - Shows ✔ valid rows & ❌ invalid rows
    - Submit via bulk creation endpoint

------------------------------------------------------------------------

## 📱 QR Import

-   Upload QR image
-   Backend decodes the QR → returns card data
-   Card is created directly

------------------------------------------------------------------------

## 🎨 UI / Material Theme

Using prebuilt theme:

    @angular/material/prebuilt-themes/azure-blue.css

------------------------------------------------------------------------

## ✅ Author

*Baha'aldin Hammad - ProgressSoft Task*\
Business Card Manager Front-End\
2025

------------------------------------------------------------------------
