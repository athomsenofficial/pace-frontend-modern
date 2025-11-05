import React, { useState } from 'react';
import { DocumentTypeSelector } from '../features/documents/components/DocumentTypeSelector';
import { MetadataForm } from '../features/documents/components/MetadataForm';
import { PromptInput } from '../features/documents/components/PromptInput';
import { Button } from '../shared/components/ui/Button';
import { documentApi } from '../api/documentApi';
import type { DocumentType, DocumentMetadata, DocumentResponse } from '../types/document.types';

const initialMetadata: DocumentMetadata = {
  office_symbol: '',
  author_name: '',
  author_rank: '',
  author_title: '',
  organization: '',
  date: new Date().toISOString().split('T')[0],
};

export const DocumentGenerator: React.FC = () => {
  const [step, setStep] = useState<'select' | 'details' | 'preview'>(
    'select'
  );
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [metadata, setMetadata] = useState<DocumentMetadata>(initialMetadata);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<DocumentResponse | null>(null);

  const handleSelectType = (type: DocumentType) => {
    setDocumentType(type);
    setStep('details');
  };

  const handleGenerateDocument = async () => {
    if (!documentType) return;

    setLoading(true);
    setError(null);

    try {
      const result = await documentApi.generateDocument({
        document_type: documentType,
        prompt,
        metadata,
      });

      setResponse(result);
      setStep('preview');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate document');
      console.error('Document generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!response?.document_id) return;

    setLoading(true);
    setError(null);

    try {
      const pdfBlob = await documentApi.generatePDF(response.document_id);
      documentApi.downloadPDF(
        pdfBlob,
        `${documentType}_${new Date().toISOString().split('T')[0]}.pdf`
      );
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download PDF');
      console.error('PDF download error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep('select');
    setDocumentType(null);
    setMetadata(initialMetadata);
    setPrompt('');
    setResponse(null);
    setError(null);
  };

  const canGenerate =
    metadata.office_symbol &&
    metadata.author_name &&
    metadata.author_rank &&
    metadata.author_title &&
    metadata.organization &&
    prompt.length >= 10;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Air Force Document Generator
          </h1>
          <p className="mt-2 text-gray-600">
            Generate properly formatted Air Force administrative documents using natural language
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Step 1: Select Document Type */}
        {step === 'select' && (
          <DocumentTypeSelector
            selectedType={documentType}
            onSelect={handleSelectType}
          />
        )}

        {/* Step 2: Enter Details */}
        {step === 'details' && documentType && (
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setStep('select')}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                ← Change Document Type
              </button>
            </div>

            {/* Metadata Form */}
            <MetadataForm metadata={metadata} onChange={setMetadata} />

            {/* Prompt Input */}
            <PromptInput
              prompt={prompt}
              documentType={documentType}
              onChange={setPrompt}
            />

            {/* Generate Button */}
            <div className="flex justify-end space-x-4">
              <Button variant="secondary" onClick={handleReset}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleGenerateDocument}
                disabled={!canGenerate || loading}
              >
                {loading ? 'Generating...' : 'Generate Document'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Download */}
        {step === 'preview' && response && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Document Generated Successfully
                </h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {response.status}
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  Your {documentType?.toUpperCase()} document has been generated and is ready for download.
                </p>

                <div className="flex space-x-4">
                  <Button
                    variant="primary"
                    onClick={handleDownloadPDF}
                    disabled={loading || !response.pdf_available}
                  >
                    {loading ? 'Downloading...' : 'Download PDF'}
                  </Button>
                  <Button variant="secondary" onClick={handleReset}>
                    Generate Another Document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
