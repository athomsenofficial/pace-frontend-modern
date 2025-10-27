import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Tabs,
  TabList,
  TabButton,
  TabPanels,
  TabPanel,
} from '@/shared/components/ui'
import { Search, Edit, Trash2, Plus, Upload, ArrowRight, RefreshCw, CheckCircle, XCircle, AlertCircle, Star, Building } from 'lucide-react'
import {  getRosterPreview, type RosterPreviewResponse, type RosterMember } from '@/services/rosterApi'
import { EditMemberModal } from './EditMemberModal'
import { AddMemberModal } from './AddMemberModal'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { LogoUploadModal } from './LogoUploadModal'

interface RosterPreviewProps {
  sessionId: string
  sessionData: any
  onContinue: (latestData: RosterPreviewResponse) => void
  melType?: 'initial' | 'final'
  onSessionUpdate?: (data: RosterPreviewResponse) => void
}

export function RosterPreview({
  sessionId,
  sessionData,
  onContinue,
  melType = 'initial',
  onSessionUpdate,
}: RosterPreviewProps) {
  const [rosterData, setRosterData] = useState<RosterPreviewResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedPascode, setSelectedPascode] = useState<string>('all')

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [logoModalOpen, setLogoModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<RosterMember | null>(null)

  useEffect(() => {
    if (sessionId) {
      void loadRosterData()
    }
  }, [sessionId])

  // Reset pascode selection when changing tabs
  useEffect(() => {
    setSelectedPascode('all')
  }, [currentTab])

  const loadRosterData = async (resetPage = false): Promise<RosterPreviewResponse | null> => {
    setLoading(true)
    setError(null)
    try {
      const data = await getRosterPreview(sessionId, 'all', page + 1, rowsPerPage)
      setRosterData(data)
      if (resetPage) setPage(0)
      onSessionUpdate?.(data)
      return data
    } catch (apiError: any) {
      console.warn('Roster preview API not available, using session data:', apiError)
      try {
        const transformedData = transformSessionDataToPreview(sessionData)
        setRosterData(transformedData)
        if (resetPage) setPage(0)
        onSessionUpdate?.(transformedData)
        return transformedData
      } catch (err: any) {
        setError(err.message || 'Failed to load roster data')
        return null
      }
    } finally {
      setLoading(false)
    }
  }

  const transformSessionDataToPreview = (data: any): RosterPreviewResponse => {
    if (!data) {
      return {
        session_id: sessionId,
        cycle: 'SSG',
        year: new Date().getFullYear(),
        edited: false,
        statistics: {
          total_uploaded: 0,
          total_processed: 0,
          eligible: 0,
          ineligible: 0,
          discrepancy: 0,
          btz: 0,
          errors: (data?.errors || []).length,
        },
        categories: {
          eligible: [],
          ineligible: [],
          discrepancy: [],
          btz: [],
          small_unit: [],
        },
        errors: data?.errors || [],
        pascodes: data?.pascodes || [],
        pascode_unit_map: data?.pascode_unit_map || {},
        custom_logo: {
          uploaded: false,
          filename: null,
        },
        pascode_map: data?.pascode_map || {},
        srid_pascode_map: data?.srid_pascode_map || {},
        small_unit_sr: data?.small_unit_sr || null,
        senior_rater_needed: Boolean(data?.senior_rater_needed),
      }
    }

    return {
      ...data,
      pascode_map: data.pascode_map || {},
      srid_pascode_map: data.srid_pascode_map || {},
      small_unit_sr: data.small_unit_sr || null,
      senior_rater_needed: Boolean(
        data.senior_rater_needed ?? (Array.isArray(data.small_unit_df) && data.small_unit_df.length > 0)
      ),
    } as RosterPreviewResponse
  }

  const getCurrentCategoryMembers = (): RosterMember[] => {
    if (!rosterData) return []

    const categories = ['eligible', 'ineligible', 'discrepancy', 'btz', 'small_unit']
    const category = categories[currentTab] as keyof typeof rosterData.categories
    const members = rosterData.categories[category] || []

    // Filter by pascode if one is selected (for eligible and ineligible tabs only)
    if ((currentTab === 0 || currentTab === 1) && selectedPascode !== 'all') {
      return members.filter((member) => member.ASSIGNED_PAS === selectedPascode)
    }

    return members
  }

  // Get unique pascodes for the current category
  const getCurrentCategoryPascodes = (): string[] => {
    if (!rosterData) return []

    const categories = ['eligible', 'ineligible', 'discrepancy', 'btz', 'small_unit']
    const category = categories[currentTab] as keyof typeof rosterData.categories
    const members = rosterData.categories[category] || []

    const pascodes = new Set<string>()
    members.forEach((member) => {
      if (member.ASSIGNED_PAS) {
        pascodes.add(member.ASSIGNED_PAS)
      }
    })

    return Array.from(pascodes).sort()
  }

  const filteredMembers = getCurrentCategoryMembers().filter((member) =>
    member.FULL_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.ASSIGNED_PAS?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.SSAN?.includes(searchTerm)
  )

  const paginatedMembers = filteredMembers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleEditMember = (member: RosterMember) => {
    setSelectedMember(member)
    setEditModalOpen(true)
  }

  const handleDeleteMember = (member: RosterMember) => {
    setSelectedMember(member)
    setDeleteDialogOpen(true)
  }

  const handleAddMember = () => {
    setAddModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger">
        {error}
      </div>
    )
  }

  const handleContinue = async () => {
    const latestData = rosterData ?? (await loadRosterData())
    if (!latestData) return
    onSessionUpdate?.(latestData)
    onContinue(latestData)
  }

  return (
    <div className="space-y-6">
      <Card variant="bordered">
        <CardContent className="pt-6">
          {/* Header */}
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Roster Review - {rosterData?.cycle} {rosterData?.year}
              </h2>
              <p className="text-sm text-slate-500">Session: {sessionId}</p>
            </div>
            <div className="flex flex-col items-end gap-3">
              {/* Logo Info */}
              {rosterData?.custom_logo?.uploaded && (
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-sm text-slate-600">
                    <span className="font-semibold">Logo:</span> {rosterData.custom_logo.filename}
                  </span>
                </div>
              )}
              <Button
                variant="primary"
                size="md"
                leftIcon={<Upload className="w-5 h-5" />}
                onClick={() => setLogoModalOpen(true)}
                className="bg-success hover:bg-success-dark text-white border-success font-semibold px-6"
              >
                {rosterData?.custom_logo?.uploaded ? 'Replace Image' : 'Upload Logo'}
              </Button>
            </div>
          </div>

          {/* Statistics Dashboard */}
          <div className="mb-6 p-6 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {/* Eligible */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="p-3 bg-success/20 rounded-full border-2 border-success/50">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <div className="text-3xl font-bold text-slate-800">{rosterData?.statistics.eligible || 0}</div>
                <div className="text-xs text-slate-600">Eligible</div>
              </div>

              {/* Ineligible */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="p-3 bg-danger/20 rounded-full border-2 border-danger/50">
                  <XCircle className="w-6 h-6 text-danger" />
                </div>
                <div className="text-3xl font-bold text-slate-800">{rosterData?.statistics.ineligible || 0}</div>
                <div className="text-xs text-slate-600">Ineligible</div>
              </div>

              {/* Discrepancies */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="p-3 bg-warning/20 rounded-full border-2 border-warning/50">
                  <AlertCircle className="w-6 h-6 text-warning" />
                </div>
                <div className="text-3xl font-bold text-slate-800">{rosterData?.statistics.discrepancy || 0}</div>
                <div className="text-xs text-slate-600">Discrepancies</div>
              </div>

              {/* BTZ */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="p-3 bg-blue-500/20 rounded-full border-2 border-blue-500/50">
                  <Star className="w-6 h-6 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-slate-800">{rosterData?.statistics.btz || 0}</div>
                <div className="text-xs text-slate-600">BTZ</div>
              </div>

              {/* Small Units */}
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="p-3 bg-purple-500/20 rounded-full border-2 border-purple-500/50">
                  <Building className="w-6 h-6 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-slate-800">{rosterData?.categories.small_unit?.length || 0}</div>
                <div className="text-xs text-slate-600">Small Units</div>
              </div>

              {/* Total */}
              <div className="flex items-center gap-3 bg-primary/10 rounded-lg p-3 border border-primary/30">
                <div>
                  <div className="text-3xl font-bold text-slate-800">{rosterData?.statistics.total_processed || 0}</div>
                  <div className="text-xs font-semibold text-slate-600">TOTAL PROCESSED</div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs defaultIndex={currentTab} onChange={setCurrentTab}>
            <div className="mb-6">
              <TabList className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                <TabButton className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white hover:shadow-sm hover:scale-[1.02] data-[selected]:bg-white data-[selected]:shadow-md data-[selected]:scale-[1.02]">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                    <span>Eligible ({rosterData?.statistics.eligible || 0})</span>
                  </div>
                </TabButton>
                <TabButton className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white hover:shadow-sm hover:scale-[1.02] data-[selected]:bg-white data-[selected]:shadow-md data-[selected]:scale-[1.02]">
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                    <span>Ineligible ({rosterData?.statistics.ineligible || 0})</span>
                  </div>
                </TabButton>
                <TabButton className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white hover:shadow-sm hover:scale-[1.02] data-[selected]:bg-white data-[selected]:shadow-md data-[selected]:scale-[1.02]">
                  <div className="flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                    <span>Discrepancies ({rosterData?.statistics.discrepancy || 0})</span>
                  </div>
                </TabButton>
                <TabButton className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white hover:shadow-sm hover:scale-[1.02] data-[selected]:bg-white data-[selected]:shadow-md data-[selected]:scale-[1.02]">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                    <span>BTZ ({rosterData?.statistics.btz || 0})</span>
                  </div>
                </TabButton>
                <TabButton className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-white hover:shadow-sm hover:scale-[1.02] data-[selected]:bg-white data-[selected]:shadow-md data-[selected]:scale-[1.02]">
                  <div className="flex items-center justify-center gap-2">
                    <Building className="w-4 h-4 transition-transform duration-200 group-hover:rotate-12" />
                    <span>Small Units ({rosterData?.categories.small_unit?.length || 0})</span>
                  </div>
                </TabButton>
              </TabList>
            </div>

            <TabPanels>
              {[0, 1, 2, 3, 4].map((tabIndex) => {
                const pascodes = getCurrentCategoryPascodes()
                const showPascodeTabs = (tabIndex === 0 || tabIndex === 1) && pascodes.length > 0

                return (
                <TabPanel key={tabIndex}>
                  {/* Search and Add Controls */}
                  <div className="mb-4 flex gap-4 flex-wrap items-center">
                    <div className="flex-grow min-w-[300px]">
                      <Input
                        placeholder="Search by name, PASCODE, or SSAN..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="w-4 h-4" />}
                      />
                    </div>
                    <Button
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={handleAddMember}
                    >
                      Add Member
                    </Button>
                  </div>

                  {/* PASCODE Sub-Tabs (for Eligible and Ineligible only) */}
                  {showPascodeTabs && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        <button
                          onClick={() => setSelectedPascode('all')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            selectedPascode === 'all'
                              ? 'bg-primary text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                          style={{
                            minWidth: pascodes.length > 8 ? '80px' : '120px',
                            maxWidth: pascodes.length > 15 ? '60px' : pascodes.length > 8 ? '80px' : '150px',
                          }}
                        >
                          All Units
                        </button>
                        {pascodes.map((pascode) => {
                          const unitName = rosterData?.pascode_unit_map?.[pascode] || pascode

                          return (
                            <button
                              key={pascode}
                              onClick={() => setSelectedPascode(pascode)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors overflow-hidden ${
                                selectedPascode === pascode
                                  ? 'bg-primary text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                              style={{
                                minWidth: pascodes.length > 8 ? '80px' : '120px',
                                maxWidth: pascodes.length > 15 ? '60px' : pascodes.length > 8 ? '80px' : '150px',
                              }}
                              title={unitName}
                            >
                              <div className="truncate">
                                {pascode}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Members Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Grade</TableHead>
                          <TableHead>PASCODE</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Status/Reason</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedMembers.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <div className="text-center py-8 text-slate-500">
                                No members found matching your search
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedMembers.map((member) => (
                            <TableRow key={member.member_id}>
                              <TableCell>{member.FULL_NAME}</TableCell>
                              <TableCell>{member.GRADE}</TableCell>
                              <TableCell>{member.ASSIGNED_PAS}</TableCell>
                              <TableCell>{member.ASSIGNED_PAS_CLEARTEXT}</TableCell>
                              <TableCell>
                                {member.REASON || (
                                  <Badge variant="success">Eligible</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditMember(member)}
                                    className="text-primary hover:text-primary-dark"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMember(member)}
                                    className="text-danger hover:text-danger-dark"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-600">Show:</label>
                        <select
                          value={rowsPerPage}
                          onChange={(e) => {
                            setRowsPerPage(Number(e.target.value))
                            setPage(0)
                          }}
                          className="px-3 py-1.5 pr-8 border border-slate-300 rounded-md text-sm bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                          }}
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-slate-600">per page</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredMembers.length)} of {filteredMembers.length} results
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={(page + 1) * rowsPerPage >= filteredMembers.length}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </TabPanel>
                )
              })}
            </TabPanels>
          </Tabs>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Button
              size="lg"
              leftIcon={<ArrowRight className="w-5 h-5" />}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <EditMemberModal
        isOpen={editModalOpen}
        member={selectedMember}
        sessionId={sessionId}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedMember(null)
        }}
        onSave={() => {
          setEditModalOpen(false)
          setSelectedMember(null)
          void loadRosterData()
        }}
      />

      <AddMemberModal
        isOpen={addModalOpen}
        sessionId={sessionId}
        cycle={rosterData?.cycle}
        onClose={() => setAddModalOpen(false)}
        onSave={() => {
          setAddModalOpen(false)
          void loadRosterData(true)
        }}
      />

      <LogoUploadModal
        isOpen={logoModalOpen}
        sessionId={sessionId}
        currentLogo={rosterData?.custom_logo}
        onClose={() => setLogoModalOpen(false)}
        onUpload={() => {
          setLogoModalOpen(false)
          void loadRosterData()
        }}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        member={selectedMember}
        sessionId={sessionId}
        onClose={() => {
          setDeleteDialogOpen(false)
          setSelectedMember(null)
        }}
        onConfirm={() => {
          setDeleteDialogOpen(false)
          setSelectedMember(null)
          void loadRosterData(true)
        }}
      />
    </div>
  )
}
