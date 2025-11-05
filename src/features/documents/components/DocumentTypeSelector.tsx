import React from 'react';
import type { DocumentType } from '../../../types/document.types';
import { Card } from '../../../shared/components/ui/Card';

interface DocumentTypeSelectorProps {
  selectedType: DocumentType | null;
  onSelect: (type: DocumentType) => void;
}

const documentTypes = [
  {
    type: 'mfr' as DocumentType,
    name: 'Memorandum For Record',
    description: 'Internal documentation of events, decisions, or phone calls',
    icon: '📝',
  },
  {
    type: 'memo' as DocumentType,
    name: 'Official Memorandum',
    description: 'Formal communication between organizations',
    icon: '📄',
  },
  {
    type: 'appointment' as DocumentType,
    name: 'Appointment Letter',
    description: 'Assign duties, responsibilities, and authorities',
    icon: '✓',
  },
  {
    type: 'loc' as DocumentType,
    name: 'Letter of Counseling',
    description: 'Initial corrective action for minor infractions',
    icon: '⚠️',
  },
  {
    type: 'loa' as DocumentType,
    name: 'Letter of Admonishment',
    description: 'Mid-level corrective action',
    icon: '🔶',
  },
  {
    type: 'lor' as DocumentType,
    name: 'Letter of Reprimand',
    description: 'Serious corrective action filed in PIF/UPRG',
    icon: '🔴',
  },
];

export const DocumentTypeSelector: React.FC<DocumentTypeSelectorProps> = ({
  selectedType,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Select Document Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documentTypes.map((docType) => (
          <Card
            key={docType.type}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedType === docType.type
                ? 'ring-2 ring-indigo-500 bg-indigo-50'
                : 'hover:ring-1 hover:ring-gray-300'
            }`}
            onClick={() => onSelect(docType.type)}
          >
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{docType.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {docType.name}
                  </h3>
                  <p className="text-sm text-gray-600">{docType.description}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
