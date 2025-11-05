/**
 * API client for Air Force Document Generator
 * Connects to backend /api/documents endpoints
 */

import axios from 'axios';
import type {
  DocumentGenerationRequest,
  DocumentResponse,
  DocumentTemplate,
} from '../types/document.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const documentApi = {
  /**
   * Generate a document from a prompt
   */
  async generateDocument(request: DocumentGenerationRequest): Promise<DocumentResponse> {
    const response = await axios.post<DocumentResponse>(
      `${API_URL}/api/documents/generate`,
      request
    );
    return response.data;
  },

  /**
   * Generate and download PDF for a document
   */
  async generatePDF(documentId: string): Promise<Blob> {
    const response = await axios.post(
      `${API_URL}/api/documents/${documentId}/generate-pdf`,
      {},
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  /**
   * Get available document templates with examples
   */
  async getTemplates(): Promise<DocumentTemplate[]> {
    const response = await axios.get<DocumentTemplate[]>(
      `${API_URL}/api/documents/templates`
    );
    return response.data;
  },

  /**
   * Download PDF file
   */
  downloadPDF(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
