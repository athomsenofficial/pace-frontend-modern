import React from 'react';
import type { DocumentType } from '../../../types/document.types';
import { Card } from '../../../shared/components/ui/Card';

interface PromptInputProps {
  prompt: string;
  documentType: DocumentType;
  onChange: (prompt: string) => void;
}

const examplePrompts: Record<DocumentType, string> = {
  mfr: 'Create a memorandum for record documenting a phone conversation with TSgt Smith on 15 Jan 2025 regarding the updated PT testing schedule. Discussed implementation timeline and unit POC assignments.',
  memo: 'Create an official memorandum from 51 FSS/CC to 51 MDG/CC requesting additional personnel support for the upcoming change of command ceremony on 1 Feb 2025.',
  appointment: 'Appoint SSgt John A. Smith as Squadron Safety Representative effective 1 Feb 2025. Authority: AFI 91-202. Duties include conducting monthly safety inspections and maintaining safety records.',
  loc: 'Create a letter of counseling for Amn Jane Doe who was late to duty on 10 Jan 2025. Arrived at 0815 instead of required 0730. Violated AFI 36-2618, para 2.4 on punctuality standards.',
  loa: 'Create a letter of admonishment for SrA Michael Johnson for failure to maintain proper uniform standards during the Unit Commanders Call on 5 Jan 2025. Violated AFI 36-2903, para 3.1.',
  lor: 'Create a letter of reprimand for SSgt Robert Lee for unauthorized absence from 8-10 Jan 2025. Member failed to report for duty without authorization, violating AFI 36-2618, para 4.3. File in PIF.',
};

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  documentType,
  onChange,
}) => {
  const handleUseExample = () => {
    onChange(examplePrompts[documentType]);
  };

  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Document Description</h3>
          <button
            onClick={handleUseExample}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Use Example
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe the document you want to generate
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={8}
            placeholder={`Example: ${examplePrompts[documentType]}`}
            value={prompt}
            onChange={(e) => onChange(e.target.value)}
          />
          <p className="mt-2 text-sm text-gray-500">
            Provide details about the situation, dates, people involved, and any relevant AFI citations.
          </p>
        </div>
      </div>
    </Card>
  );
};
