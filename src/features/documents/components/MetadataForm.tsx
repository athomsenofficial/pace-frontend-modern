import React from 'react';
import type { DocumentMetadata } from '../../../types/document.types';
import { Input } from '../../../shared/components/ui/Input';
import { Card } from '../../../shared/components/ui/Card';

interface MetadataFormProps {
  metadata: DocumentMetadata;
  onChange: (metadata: DocumentMetadata) => void;
}

export const MetadataForm: React.FC<MetadataFormProps> = ({ metadata, onChange }) => {
  const handleChange = (field: keyof DocumentMetadata, value: string) => {
    onChange({
      ...metadata,
      [field]: value,
    });
  };

  return (
    <Card>
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Office Symbol"
            placeholder="e.g., 51 FSS/CC"
            value={metadata.office_symbol}
            onChange={(e) => handleChange('office_symbol', e.target.value)}
            required
          />

          <Input
            label="Organization"
            placeholder="e.g., 51st Force Support Squadron"
            value={metadata.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
            required
          />

          <Input
            label="Author Name"
            placeholder="e.g., John A. Doe"
            value={metadata.author_name}
            onChange={(e) => handleChange('author_name', e.target.value)}
            required
          />

          <Input
            label="Author Rank"
            placeholder="e.g., Capt, SSgt, etc."
            value={metadata.author_rank}
            onChange={(e) => handleChange('author_rank', e.target.value)}
            required
          />

          <Input
            label="Author Title"
            placeholder="e.g., Commander, Superintendent"
            value={metadata.author_title}
            onChange={(e) => handleChange('author_title', e.target.value)}
            required
          />

          <Input
            label="Date"
            type="date"
            value={metadata.date || new Date().toISOString().split('T')[0]}
            onChange={(e) => handleChange('date', e.target.value)}
          />

          <Input
            label="Phone (Optional)"
            placeholder="e.g., DSN 315-784-1234"
            value={metadata.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />

          <Input
            label="Email (Optional)"
            type="email"
            placeholder="e.g., john.doe@us.af.mil"
            value={metadata.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};
