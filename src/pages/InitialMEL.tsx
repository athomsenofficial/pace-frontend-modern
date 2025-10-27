import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Select, Badge } from '@/shared/components/ui'
import { FileUpload } from '@/features/mel/components/FileUpload'
import { RosterPreview } from '@/features/mel/components/RosterPreview'
import { PascodeForm } from '@/features/mel/components/PascodeForm'
import { Upload, CheckCircle, Download, RefreshCw, AlertCircle, XCircle } from 'lucide-react'
import { uploadInitialMEL, submitInitialMELPascodes, downloadBlob } from '@/services/api'
import type { RosterPreviewResponse } from '@/services/rosterApi'

const STEPS = ['Upload Roster', 'Review & Edit', 'Force Distributor', 'Download PDF']

export function InitialMEL() {
  const [activeStep, setActiveStep] = useState(0)
  const [sessionData, setSessionData] = useState<any>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)

  // Step 1: File upload state
  const [file, setFile] = useState<File | null>(null)
  const [cycle, setCycle] = useState('')
  const [year, setYear] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const cycleOptions = [
    { value: 'SRA', label: 'Senior Airman (SRA)' },
    { value: 'SSG', label: 'Staff Sergeant (SSG)' },
    { value: 'TSG', label: 'Technical Sergeant (TSG)' },
    { value: 'MSG', label: 'Master Sergeant (MSG)' },
    { value: 'SMS', label: 'Senior Master Sergeant (SMS)' },
    { value: 'CMS', label: 'Chief Master Sergeant (CMS)' },
  ]

  // Generate dynamic year options based on April 1st cutoff
  const getYearOptions = () => {
    const today = new Date()
    const currentYear = today.getFullYear()
    const isAfterApril1 = today.getMonth() >= 3 // Month is 0-indexed, so 3 = April

    const baseYear = isAfterApril1 ? currentYear + 1 : currentYear

    return [
      { value: String(baseYear), label: String(baseYear) },
      { value: String(baseYear - 1), label: String(baseYear - 1) },
      { value: String(baseYear - 2), label: String(baseYear - 2) },
    ]
  }

  const yearOptions = getYearOptions()

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
  }

  const handleFileUpload = async () => {
    if (!file || !cycle || !year) {
      alert('Please select a file, cycle, and year')
      return
    }

    setIsProcessing(true)

    try {
      const data = await uploadInitialMEL(file, cycle, year)
      setSessionData({ ...data, cycle, year })
      setActiveStep(1)
    } catch (error: any) {
      console.error('Upload failed:', error)
      alert(error.response?.data?.detail || error.message || 'Failed to upload roster')
    } finally {
      setIsProcessing(false)
    }
  }

  const updateSessionFromRoster = (data: RosterPreviewResponse) => {
    setSessionData((prev: any) => (prev ? { ...prev, ...data } : data))
  }

  const handleContinueToSeniorRater = (latestData: RosterPreviewResponse) => {
    updateSessionFromRoster(latestData)
    setActiveStep(2)
  }

  const handlePascodeSubmit = async (sessionId: string, pascodeInfo: Record<string, any>) => {
    try {
      const blob = await submitInitialMELPascodes(sessionId, pascodeInfo)
      setPdfBlob(blob)
      setActiveStep(3)
    } catch (error: any) {
      console.error('PDF generation failed:', error)
      throw error
    }
  }

  const handleDownload = () => {
    if (pdfBlob) {
      const filename = `initial_mel_${sessionData.session_id}.pdf`
      downloadBlob(pdfBlob, filename)
    }
  }

  const handleReset = () => {
    setActiveStep(0)
    setSessionData(null)
    setPdfBlob(null)
    setFile(null)
    setCycle('')
    setYear('')
  }

  // Auto-download PDF when step 3 is reached
  useEffect(() => {
    if (activeStep === 3 && pdfBlob) {
      handleDownload()
    }
  }, [activeStep, pdfBlob])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <h2 className="text-3xl font-bold text-slate-900">Initial Master Eligibility Listing</h2>
          <Badge variant="primary">Step {activeStep + 1} of {STEPS.length}</Badge>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-8">
        <div className="w-full flex items-start">
          {STEPS.map((step, index) => (
            <>
              <div key={`step-${index}`} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-500 ease-in-out transform ${
                    index < activeStep
                      ? 'bg-success text-white scale-110'
                      : index === activeStep
                      ? 'bg-primary text-white scale-110 animate-pulse'
                      : 'bg-slate-200 text-slate-600 scale-100'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {index < activeStep ? <CheckCircle className="w-6 h-6" /> : index + 1}
                </div>
                <span className={`text-sm mt-2 text-slate-700 text-center whitespace-nowrap transition-all duration-300 ${
                  index === activeStep ? 'font-semibold' : ''
                }`}>{step}</span>
              </div>
              {index < STEPS.length - 1 && (
                <div key={`line-${index}`} className="flex-1 pt-5 px-2 relative overflow-hidden">
                  <div className="w-full h-1 bg-slate-200" />
                  <div
                    className={`absolute top-5 left-2 h-1 bg-success transition-all duration-700 ease-in-out ${
                      index < activeStep ? 'w-[calc(100%-1rem)]' : 'w-0'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  />
                </div>
              )}
            </>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px]">
        {/* Step 0: Upload Roster */}
        {activeStep === 0 && (
          <div className="space-y-6">
            {/* Centered Content Container - same width as stepper */}
            <div className="flex justify-center">
              <div className="w-full max-w-3xl space-y-6">
                {/* Cycle Information with Upload */}
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Cycle Information</CardTitle>
                    <CardDescription>Upload roster file and select promotion cycle information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* File Upload - Smaller, 33% size */}
                      <div className="flex justify-center">
                        <div className="w-full max-w-sm">
                          <FileUpload
                            onFileSelect={handleFileSelect}
                            accept=".csv,.xlsx"
                            maxSize={10}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Select
                          label="Promotion Cycle"
                          placeholder="Select cycle"
                          options={cycleOptions}
                          value={cycle}
                          onChange={(e) => setCycle(e.target.value)}
                          required
                        />
                        <Select
                          label="Calendar Year"
                          placeholder="Select year"
                          options={yearOptions}
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          required
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        onClick={handleFileUpload}
                        disabled={!file || !cycle || !year || isProcessing}
                        loading={isProcessing}
                        className="w-full"
                        size="sm"
                        leftIcon={<Upload className="w-4 h-4" />}
                      >
                        {isProcessing ? 'Processing Roster...' : 'Process Initial MEL'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Informational Components - Centered with stepper width */}
            <div className="flex justify-center">
              <div className="w-full max-w-3xl space-y-6">
                {/* Required Columns */}
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Required Columns (can't be blank)</CardTitle>
                    <CardDescription>
                      Ensure your Excel file contains the following columns for successful processing:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {[
                        'FULL_NAME',
                        'GRADE',
                        'ASSIGNED_PAS_CLEARTEXT',
                        'DAFSC',
                        'DOR',
                        'DATE_ARRIVED_STATION',
                        'TAFMSD',
                        'REENL_ELIG_STATUS',
                        'ASSIGNED_PAS',
                        'PAFSC',
                      ].map((column) => (
                        <div key={column} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm text-slate-700">{column}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-primary">
                      <p className="text-sm text-slate-700">
                        <strong>Note:</strong> Column names must match exactly (case-sensitive).
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Optional Columns */}
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Additional Columns (STILL NECESSARY, but will process if blank)</CardTitle>
                    <CardDescription>
                      These columns are essential for proper processing and categorization of service members,
                      but in some cases these fields are blank.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {[
                        'GRADE_PERM_PROJ',
                        'UIF_CODE',
                        'UIF_DISPOSITION_DATE',
                        '2AFSC',
                        '3AFSC',
                        '4AFSC',
                      ].map((column) => (
                        <div key={column} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-sm text-slate-700">{column}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-primary">
                      <p className="text-sm text-slate-700">
                        <strong>Note:</strong> Column names must match exactly (case-sensitive).
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Remove Columns Warning */}
                <Card variant="bordered" className="border-danger">
                  <CardHeader>
                    <CardTitle className="text-danger-dark">Remove these columns before uploading</CardTitle>
                    <CardDescription>
                      These columns contain PII or sensitive information. While we do not store any data,
                      removal of PII ensures we can continue to provide you MEL generation services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      {[
                        'SSAN',
                        'RECORD_STATUS',
                        'OFFICE_SYMBOL',
                        'DUTY_TITLE',
                        'DUTY_START_DATE',
                        'DUTY_PHONE',
                        'DATE_OF_BIRTH',
                        'HOME_ADDRESS',
                        'HOME_CITY',
                        'HOME_STATE',
                        'HOME_ZIP_CODE',
                        'SUPV_NAME',
                        'PROJ_EVAL_CLOSE_DATE',
                        'MARITAL_STATUS',
                        'RNLTD',
                        'GAINING_PAS',
                        'GAINING_PAS_CLEARTEXT',
                        'LAST_EVAL_RATING',
                        'LAST_EVAL_CLOSE_DATE',
                        'PERF_INDICATOR',
                        'SPOUSE_SSAN',
                        'SUPV_BEGIN_DATE',
                        'HOME_PHONE_NUMBER',
                        'AGE',
                        'DEROS',
                        'DEPLOY_ADMIN_STATUS',
                        'DEPLOY_ADMIN_STATUS_CLEARTEXT',
                        'DEPLOY_ADMIN_STOP_DATE',
                        'DEPLOY_LEGAL_STATUS',
                        'DEPLOY_LEGAL_STATUS_CLEARTEXT',
                        'DEPLOY_LEGAL_STOP_DATE',
                        'DEPLOY_PHYS_STATUS',
                        'DEPLOY_PHYS_STATUS_CLEARTEXT',
                        'DEPLOY_PHYS_STOP_DATE',
                        'DEPLOY_TIME_STATUS',
                        'DEPLOY_TIME_STATUS_CLEARTEXT',
                        'DEPLOY_TIME_STOP_DATE',
                        'AVAILABILITY_CODE',
                        'AVAILABILITY_CODE_CLEARTEXT',
                        'AVAILABILITY_DATE',
                        'AVAILABILITY_STATUS',
                        'AVAILABILITY_STATUS_CLEARTEXT',
                        'LIMITATION_CODE',
                        'LIMITATION_CODE_CLEARTEXT',
                        'LIMITATION_END_DATE',
                        'SEC_CLR',
                        'TYPE_SEC_INV',
                        'DT_SCTY_INVES_COMPL',
                        'SEC_ELIG_DT',
                        'TECH_ID',
                        'ACDU_STATUS',
                        'ANG_ROLL_INDICATOR',
                        'AFR_SECTION_ID',
                        'CIVILIAN_ART_ID',
                        'ATTACHED_PAS',
                        'FUNCTIONAL_CATEGORY',
                      ].map((column) => (
                        <div key={column} className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-danger" />
                          <span className="text-sm text-slate-700">{column}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-danger">
                      <p className="text-sm text-slate-700">
                        <strong>Important:</strong> These columns must be removed before uploading to protect sensitive information.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Review & Edit */}
        {activeStep === 1 && sessionData && (
          <RosterPreview
            sessionId={sessionData.session_id}
            sessionData={sessionData}
            onContinue={handleContinueToSeniorRater}
            onSessionUpdate={updateSessionFromRoster}
            melType="initial"
          />
        )}

        {/* Step 2: Force Distributor */}
        {activeStep === 2 && sessionData && (
          <PascodeForm
            sessionData={sessionData}
            onSubmit={handlePascodeSubmit}
            melType="initial"
          />
        )}

        {/* Step 3: Download PDF */}
        {activeStep === 3 && (
          <Card variant="bordered">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <div className="p-4 bg-success/10 border border-success rounded-lg">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-success" />
                    <h3 className="text-xl font-semibold text-success-dark">
                      PDF Generated Successfully!
                    </h3>
                  </div>
                  <p className="text-sm text-slate-700">
                    Your Initial Master Eligibility Listing has been generated and is ready to download.
                  </p>
                </div>

                <div className="flex gap-4 justify-end">
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<RefreshCw className="w-5 h-5" />}
                    onClick={handleReset}
                  >
                    Process New Roster
                  </Button>

                  <Button
                    size="lg"
                    leftIcon={<Download className="w-5 h-5" />}
                    onClick={handleDownload}
                  >
                    Download PDF
                  </Button>
                </div>

                {sessionData && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg text-left">
                    <p className="text-sm font-medium text-slate-600 mb-2">Session Details:</p>
                    <p className="text-sm text-slate-700">
                      Session ID: <span className="font-mono">{sessionData.session_id}</span>
                    </p>
                    <p className="text-sm text-slate-700">
                      PASCODEs Processed: {sessionData.pascodes?.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
