import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui'
import { Upload, FileText, CheckCircle, Download, AlertCircle, Users, ClipboardCheck, XCircle } from 'lucide-react'

export function HowTo() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          How to Use PACE
        </h2>
        <p className="text-slate-600">
          Step-by-step guide to processing Master Eligibility Lists
        </p>
      </div>

      {/* Overview */}
      <Card variant="bordered" className="mb-8 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-primary">What is PACE?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700">
            PACE (Personnel & Administrative Collaboration Engine) is a system designed to streamline the processing of
            Master Eligibility Lists (MELs) for Air Force promotion cycles. It automates eligibility
            checks, generates compliant PDFs, and helps track member promotion data efficiently.
          </p>
        </CardContent>
      </Card>

      {/* Initial MEL Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Upload className="w-7 h-7 text-primary" />
          <span>Processing Initial MEL</span>
        </h3>

        <div className="space-y-4">
          {/* Step 1 */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <CardTitle>Step 1: Upload Roster</CardTitle>
                  <CardDescription>Select cycle, year, and upload your roster file</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="ml-11">
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Navigate to <strong>Master Eligibility List → Initial MEL</strong> from the top menu</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Select the <strong>Promotion Cycle</strong> (SRA, SSG, TSG, MSG, SMS, or CMS)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Select the <strong>Calendar Year</strong></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Drag and drop your Excel file (.xlsx) or click to browse</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-warning mr-2 mt-1 flex-shrink-0" />
                  <span>Ensure your file has all <strong>required columns</strong> and PII columns removed (see below)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Process Initial MEL</strong> to upload and analyze</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <CardTitle>Step 2: Review & Edit</CardTitle>
                  <CardDescription>Review member roster and make necessary edits</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="ml-11">
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <Users className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>Review the roster table showing all uploaded members</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Use the search box to find specific members</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Edit</strong> on any row to modify member information</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-warning mr-2 mt-1 flex-shrink-0" />
                  <span>Review members with flags or eligibility issues</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Continue to Force Distributor</strong> when done reviewing</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <CardTitle>Step 3: Force Distributor</CardTitle>
                  <CardDescription>Enter PASCODE information from Air Force Personnel Center</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="ml-11">
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <ClipboardCheck className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>The system will show PASCODEs detected from your roster</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Fill in PASCODE details for each AFSC</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Add PASCODE</strong> if you need to add additional ones</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Generate PDF</strong> to create the Initial MEL document</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <CardTitle>Step 4: Download PDF</CardTitle>
                  <CardDescription>Download your generated Initial MEL</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="ml-11">
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <Download className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>PDF automatically downloads when generation completes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Download PDF</strong> button if you need to download again</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>The PDF is CUI-compliant with proper headers and footers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Process New Roster</strong> to start another MEL</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Final MEL Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <FileText className="w-7 h-7 text-success" />
          <span>Processing Final MEL</span>
        </h3>

        <div className="space-y-4">
          {/* Step 1 */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-success rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div>
                  <CardTitle>Step 1: Upload Roster</CardTitle>
                  <CardDescription>Select cycle, year, and upload your final roster file</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="ml-11">
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Navigate to <strong>Master Eligibility List → Final MEL</strong> from the top menu</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Select the <strong>Promotion Cycle</strong> (SRA, SSG, TSG, MSG, SMS, or CMS)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Select the <strong>Calendar Year</strong></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Drag and drop your Excel file (.xlsx) or click to browse</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-warning mr-2 mt-1 flex-shrink-0" />
                  <span>Ensure your file has all <strong>required columns</strong> and PII columns removed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Process Final MEL</strong> to upload and analyze</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-success rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <CardTitle>Step 2: Review & Edit</CardTitle>
                  <CardDescription>Review member roster and make necessary edits</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="ml-11">
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <Users className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>Review the roster table showing all uploaded members</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Use the search box to find specific members</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Edit</strong> on any row to modify member information</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-warning mr-2 mt-1 flex-shrink-0" />
                  <span>Review members with flags or eligibility issues</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Continue to Force Distributor</strong> when done reviewing</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-success rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <CardTitle>Step 3: Force Distributor</CardTitle>
                  <CardDescription>Enter PASCODE information and senior rater details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="ml-11">
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <ClipboardCheck className="w-4 h-4 text-primary mr-2 mt-1 flex-shrink-0" />
                  <span>The system will show PASCODEs detected from your roster</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Fill in PASCODE details for each AFSC</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Enter senior rater information (Name, Rank, Title, Date)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Select checkboxes for board certifications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Generate PDF</strong> to create the Final MEL document</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-success rounded-full flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <CardTitle>Step 4: Download PDF</CardTitle>
                  <CardDescription>Download your generated Final MEL</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="ml-11">
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <Download className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>PDF automatically downloads when generation completes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Download PDF</strong> button if you need to download again</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>The PDF includes senior rater signature block and is CUI-compliant</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
                  <span>Click <strong>Process New Roster</strong> to start another MEL</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* File Preparation Requirements */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">File Preparation Requirements</h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Required Columns */}
          <Card variant="bordered" className="border-success/20">
            <CardHeader>
              <CardTitle className="text-success flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Required Columns</span>
              </CardTitle>
              <CardDescription>These columns cannot be blank</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• FULL_NAME</li>
                <li>• GRADE</li>
                <li>• ASSIGNED_PAS_CLEARTEXT</li>
                <li>• DAFSC</li>
                <li>• DOR</li>
                <li>• DATE_ARRIVED_STATION</li>
                <li>• TAFMSD</li>
                <li>• REENL_ELIG_STATUS</li>
                <li>• ASSIGNED_PAS</li>
                <li>• PAFSC</li>
              </ul>
            </CardContent>
          </Card>

          {/* Optional Columns */}
          <Card variant="bordered" className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>Additional Columns</span>
              </CardTitle>
              <CardDescription>Necessary but can be blank</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• GRADE_PERM_PROJ</li>
                <li>• UIF_CODE</li>
                <li>• UIF_DISPOSITION_DATE</li>
                <li>• 2AFSC</li>
                <li>• 3AFSC</li>
                <li>• 4AFSC</li>
              </ul>
            </CardContent>
          </Card>

          {/* Remove PII */}
          <Card variant="bordered" className="border-danger/20">
            <CardHeader>
              <CardTitle className="text-danger flex items-center space-x-2">
                <XCircle className="w-5 h-5" />
                <span>Remove Before Upload</span>
              </CardTitle>
              <CardDescription>PII columns to delete</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• SSAN</li>
                <li>• DATE_OF_BIRTH</li>
                <li>• HOME_ADDRESS</li>
                <li>• HOME_PHONE_NUMBER</li>
                <li>• SPOUSE_SSAN</li>
                <li>• ...and 50+ more PII fields</li>
              </ul>
              <p className="text-xs text-slate-600 mt-2 italic">
                See the upload page for complete list
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips and Best Practices */}
      <Card variant="bordered" className="border-special/20 bg-special/5">
        <CardHeader>
          <CardTitle className="text-special flex items-center space-x-2">
            <AlertCircle className="w-6 h-6" />
            <span>Tips and Best Practices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
              <span><strong>File Format:</strong> Use Excel format (.xlsx). Column names are case-sensitive and must match exactly</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
              <span><strong>Remove PII:</strong> Delete all PII columns before uploading to protect sensitive information</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
              <span><strong>Data Quality:</strong> Verify TIG, TIS, DOR, and AFSC data are accurate before uploading</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
              <span><strong>Review Phase:</strong> Always review flagged members with eligibility issues before proceeding</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
              <span><strong>PASCODE Accuracy:</strong> Double-check PASCODE numbers match Force Distributor data from AFPC</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
              <span><strong>CUI Handling:</strong> Generated MELs contain Controlled Unclassified Information - handle appropriately</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-4 h-4 text-success mr-2 mt-1 flex-shrink-0" />
              <span><strong>Session Management:</strong> You can start a new roster without reloading the page</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
