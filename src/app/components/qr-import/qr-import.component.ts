import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrApiService } from '@apis/qr.api';
import { CardsApiService } from '@apis/cards.api';
import { CreateBusinessCardRequest } from '@models/dtos/create-business-card.dto';
import { BusinessCard } from '@models/business-card.model';

type LoadState = 'idle' | 'loading' | 'decoding' | 'decoded' | 'saving' | 'saved' | 'error';

@Component({
  selector: 'app-qr-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-import.component.html',
  styleUrl: './qr-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrImportComponent {
  @Output() cardSaved = new EventEmitter<BusinessCard>();

  constructor(
    private qrApi: QrApiService,
    private cardsApi: CardsApiService
  ) {}

  file = signal<File | null>(null);
  dataUrl = signal<string | null>(null);
  decodedData = signal<CreateBusinessCardRequest | null>(null);
  state = signal<LoadState>('idle');
  errorMsg = signal<string | null>(null);
  isOver = signal(false);

  hasFile = computed(() => !!this.file());
  isDecoded = computed(() => this.state() === 'decoded');
  isSaving = computed(() => this.state() === 'saving');
  isSaved = computed(() => this.state() === 'saved');
  showPreview = computed(() => this.isDecoded() || this.isSaving());

  private readonly maxBytes = 10 * 1024 * 1024;

  onFileInput(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
    input.value = '';
  }

  onDragOver(evt: DragEvent) {
    evt.preventDefault();
    this.isOver.set(true);
  }

  onDragLeave(_: DragEvent) {
    this.isOver.set(false);
  }

  onDrop(evt: DragEvent) {
    evt.preventDefault();
    this.isOver.set(false);
    const file = evt.dataTransfer?.files?.[0];
    if (file) this.handleFile(file);
  }

  onPaste(evt: ClipboardEvent) {
    const item = Array.from(evt.clipboardData?.items ?? [])
      .find(i => i.type.startsWith('image/'));
    if (item) {
      const file = item.getAsFile();
      if (file) this.handleFile(file);
    }
  }

  decodeQR() {
    const file = this.file();
    if (!file) return;

    this.state.set('decoding');
    this.errorMsg.set(null);

    this.qrApi.importQr(file).subscribe({
      next: (response: any) => {

        const data = response?.data?.result || response?.result || response;
        this.decodedData.set(data);
        this.state.set('decoded');
      },
      error: (err) => {
        console.error('QR Decode Error:', err);
        this.state.set('error');
        this.errorMsg.set(err.error?.data?.message || err.error?.message || 'Failed to decode QR code');
      }
    });
  }

  saveCard() {
    const data = this.decodedData();
    const imageFile = this.file();

    if (!data || !imageFile) {
      this.errorMsg.set('Missing data or image');
      return;
    }

    this.state.set('saving');
    this.errorMsg.set(null);

    const formData = new FormData();
    formData.append('name', data.name || '');
    formData.append('gender', data.gender || '');
    formData.append('dateOfBirth', data.dateOfBirth || '');
    formData.append('email', data.email || '');
    formData.append('phone', data.phone || '');
    formData.append('address', data.address || '');

    this.cardsApi.create(formData).subscribe({
      next: (card) => {
        this.state.set('saved');
        this.cardSaved.emit(card);
        setTimeout(() => this.reset(), 2500);
      },
      error: (err) => {
        console.error('Save Error:', err);
        this.state.set('error');
        this.errorMsg.set(err.error?.message || 'Failed to save business card');
      }
    });
  }

  reset() {
    this.file.set(null);
    this.dataUrl.set(null);
    this.decodedData.set(null);
    this.state.set('idle');
    this.errorMsg.set(null);
  }

  backToUpload() {
    this.decodedData.set(null);
    this.state.set('idle');
  }

  private async handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.showError('Please select an image file');
      return;
    }

    if (file.size > this.maxBytes) {
      this.showError(`Image is too large (max ${(this.maxBytes/1024/1024)} MB)`);
      return;
    }

    this.state.set('loading');
    this.errorMsg.set(null);

    try {
      const url = await this.readAsDataUrl(file);
      this.file.set(file);
      this.dataUrl.set(url);
      this.state.set('idle');
    } catch (e) {
      this.showError('Could not read the image');
    }
  }

  private readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(file);
    });
  }

  private showError(msg: string) {
    this.state.set('error');
    this.errorMsg.set(msg);
  }

  getFileName(): string {
    return this.file()?.name || '';
  }

  getFileSize(): string {
    const size = this.file()?.size ?? 0;
    if (!size) return '';
    const units = ['B','KB','MB','GB'];
    let n = size, i = 0;
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
    }
    return `${n.toFixed(n < 10 ? 2 : 1)} ${units[i]}`;
  }
}
