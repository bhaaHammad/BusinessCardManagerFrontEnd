import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dropzone',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  template: `
    
  `,
  styles: [`
    
  `],
})
export class DropzoneComponent {
  @Input() acceptedTypes = 'image/*,.csv,.xml';
  @Input() placeholder = 'Select a file';
  @Input() ariaLabel = 'File upload dropzone';
  @Output() fileSelected = new EventEmitter<File>();

  file = signal<File | null>(null);
  isDragging = signal(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    this.file.set(file);
    this.fileSelected.emit(file);
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.file.set(null);
    this.fileSelected.emit(null as unknown as File);
  }
}

