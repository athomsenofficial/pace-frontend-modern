import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Input, Select, Button, Badge } from '@/shared/components/ui'
import { FileText, Download, Eye, Copy, Save } from 'lucide-react'

export function MemoGenerator() {
  const [memoType, setMemoType] = useState('')
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    classification: 'UNCLASSIFIED',
  })

  const memoTypes = [
    { value: 'award', label: 'Award Recommendation' },
    { value: 'admin', label: 'Administrative Action' },
    { value: 'info', label: 'Informational Memo' },
    { value: 'request', label: 'Request Memo' },
    { value: 'routing', label: 'Routing Memo' },
    { value: 'custom', label: 'Custom Memorandum' },
  ]

  const classificationOptions = [
    { value: 'UNCLASSIFIED', label: 'UNCLASSIFIED' },
    { value: 'CUI', label: 'CUI' },
    { value: 'FOUO', label: 'FOR OFFICIAL USE ONLY' },
  ]

  const [memoContent, setMemoContent] = useState('')

  const handleGenerate = () => {
    // Simulate memo generation
    const generated = `
DEPARTMENT OF THE AIR FORCE
${formData.from}

MEMORANDUM FOR ${formData.to}

FROM: ${formData.from}

SUBJECT: ${formData.subject}

1. [Opening paragraph - state the purpose of the memorandum]

2. [Body paragraphs - provide details, background, or justification]

3. [Closing paragraph - state the desired action or conclusion]



                                                    [SIGNATURE BLOCK]
                                                    [Name, Rank, USAF]
                                                    [Title]
    `.trim()

    setMemoContent(generated)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <h2 className="text-3xl font-bold text-slate-900">Memorandum Generator</h2>
          <Badge variant="special">New Feature</Badge>
        </div>
        <p className="text-slate-600">Generate official Air Force memoranda with proper formatting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Memo Type Selection */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Memorandum Type</CardTitle>
              <CardDescription>Select the type of memorandum to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                label="Memo Type"
                placeholder="Select type..."
                options={memoTypes}
                value={memoType}
                onChange={(e) => setMemoType(e.target.value)}
                required
              />
            </CardContent>
          </Card>

          {/* Header Information */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Header Information</CardTitle>
              <CardDescription>Enter the memorandum routing details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                  <Select
                    label="Classification"
                    options={classificationOptions}
                    value={formData.classification}
                    onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                  />
                </div>
                <Input
                  label="FROM"
                  placeholder="e.g., 1st Information Systems Squadron"
                  value={formData.from}
                  onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  helperText="Your organization or office symbol"
                />
                <Input
                  label="TO (MEMORANDUM FOR)"
                  placeholder="e.g., All Personnel or specific recipient"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  helperText="Recipient(s) of the memorandum"
                />
                <Input
                  label="SUBJECT"
                  placeholder="Brief, specific subject line"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  helperText="Keep subject line concise and descriptive"
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Memorandum Content</CardTitle>
              <CardDescription>Generated memorandum will appear below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={handleGenerate}
                  disabled={!memoType || !formData.from || !formData.to || !formData.subject}
                  className="w-full"
                  leftIcon={<FileText className="w-5 h-5" />}
                >
                  Generate Memorandum
                </Button>

                {memoContent && (
                  <div className="space-y-4">
                    <div className="p-6 bg-white border-2 border-slate-300 rounded-lg font-mono text-sm whitespace-pre-wrap">
                      {memoContent}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        leftIcon={<Copy className="w-4 h-4" />}
                        onClick={() => navigator.clipboard.writeText(memoContent)}
                      >
                        Copy to Clipboard
                      </Button>
                      <Button
                        variant="outline"
                        leftIcon={<Save className="w-4 h-4" />}
                      >
                        Save as Draft
                      </Button>
                      <Button
                        variant="primary"
                        leftIcon={<Download className="w-4 h-4" />}
                      >
                        Download PDF
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Templates & Help */}
        <div className="space-y-6">
          {/* Quick Templates */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {memoTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setMemoType(type.value)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Formatting Guide */}
          <Card variant="bordered" className="bg-primary/5 border-primary">
            <CardHeader>
              <CardTitle>Formatting Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">Header</p>
                  <p className="text-slate-600">Include organization and office symbol</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Subject Line</p>
                  <p className="text-slate-600">Brief and specific (max 10 words)</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Paragraphs</p>
                  <p className="text-slate-600">Number paragraphs 1, 2, 3, etc.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Signature Block</p>
                  <p className="text-slate-600">4-5 lines below last paragraph</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Memos */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<Eye className="w-4 h-4" />}
                >
                  View Sample Memos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  leftIcon={<FileText className="w-4 h-4" />}
                >
                  AFI 33-332 Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
