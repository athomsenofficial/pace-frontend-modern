import { useState, useEffect, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Select,
  Badge,
  Tabs,
  TabList,
  TabButton,
  TabPanels,
  TabPanel,
} from '@/shared/components/ui'
import { Send, Building } from 'lucide-react'

// Air Force Officer Ranks (for Commanders and Senior Raters)
const AF_OFFICER_RANKS = [
  { value: '2d Lt', label: '2d Lt - Second Lieutenant' },
  { value: '1st Lt', label: '1st Lt - First Lieutenant' },
  { value: 'Capt', label: 'Capt - Captain' },
  { value: 'Maj', label: 'Maj - Major' },
  { value: 'Lt Col', label: 'Lt Col - Lieutenant Colonel' },
  { value: 'Col', label: 'Col - Colonel' },
  { value: 'Brig Gen', label: 'Brig Gen - Brigadier General' },
  { value: 'Maj Gen', label: 'Maj Gen - Major General' },
  { value: 'Lt Gen', label: 'Lt Gen - Lieutenant General' },
  { value: 'Gen', label: 'Gen - General' },
]

interface PascodeFormProps {
  sessionData: any
  onSubmit: (sessionId: string, pascodeInfo: Record<string, any>) => Promise<void>
  melType?: 'initial' | 'final'
}

interface SeniorRaterInfo {
  srid: string
  senior_rater_rank: string
  senior_rater_title: string
  senior_rater_first_name: string
  senior_rater_middle_name: string
  senior_rater_last_name: string
  commander_rank: string
  commander_title: string
  commander_first_name: string
  commander_middle_name: string
  commander_last_name: string
}

const createEmptyInfo = (): SeniorRaterInfo => ({
  srid: '',
  senior_rater_rank: 'Col',
  senior_rater_title: 'Commander',
  senior_rater_first_name: '',
  senior_rater_middle_name: '',
  senior_rater_last_name: '',
  commander_rank: 'Lt Col',
  commander_title: 'Commander',
  commander_first_name: '',
  commander_middle_name: '',
  commander_last_name: '',
})

const parseDisplayName = (displayName?: string | null) => {
  if (!displayName) {
    return { first: '', middle: '', last: '' }
  }

  const [lastPart, remainder] = displayName.split(',').map((part) => part.trim())
  if (!remainder) {
    return { first: displayName.trim(), middle: '', last: '' }
  }

  const namePieces = remainder.split(/\s+/).filter(Boolean)
  const first = namePieces[0] || ''
  const middle = namePieces.slice(1).join(' ')

  return {
    first,
    middle,
    last: lastPart || '',
  }
}

const formatDisplayName = (info: SeniorRaterInfo) => {
  const last = info.senior_rater_last_name?.trim()
  const first = info.senior_rater_first_name?.trim()
  const middle = info.senior_rater_middle_name?.trim()

  if (!last && !first) return ''
  const middleFormatted = middle ? ` ${middle}` : ''
  return `${last || ''}, ${first || ''}${middleFormatted}`.trim().replace(/^,/, '').trim()
}

const buildPayload = (info: SeniorRaterInfo) => ({
  srid: info.srid.trim(),
  senior_rater_rank: info.senior_rater_rank.trim(),
  senior_rater_title: info.senior_rater_title.trim(),
  senior_rater_name: formatDisplayName(info),
  senior_rater_first_name: info.senior_rater_first_name.trim(),
  senior_rater_middle_name: info.senior_rater_middle_name.trim(),
  senior_rater_last_name: info.senior_rater_last_name.trim(),
  commander_rank: info.commander_rank.trim(),
  commander_title: info.commander_title.trim(),
  commander_first_name: info.commander_first_name.trim(),
  commander_middle_name: info.commander_middle_name.trim(),
  commander_last_name: info.commander_last_name.trim(),
})

const hydrateFromSession = (entry: any): SeniorRaterInfo => {
  const info = createEmptyInfo()
  if (!entry || typeof entry !== 'object') {
    return info
  }

  info.srid = entry.srid || ''
  info.senior_rater_rank = entry.senior_rater_rank || 'Col'
  info.senior_rater_title = entry.senior_rater_title || 'Commander'

  const parsedName = parseDisplayName(entry.senior_rater_name)
  info.senior_rater_first_name = entry.senior_rater_first_name || parsedName.first
  info.senior_rater_middle_name = entry.senior_rater_middle_name || parsedName.middle
  info.senior_rater_last_name = entry.senior_rater_last_name || parsedName.last

  info.commander_rank = entry.commander_rank || 'Lt Col'
  info.commander_title = entry.commander_title || 'Commander'
  info.commander_first_name = entry.commander_first_name || ''
  info.commander_middle_name = entry.commander_middle_name || ''
  info.commander_last_name = entry.commander_last_name || ''

  return info
}

const mergeInfo = (primary: SeniorRaterInfo | undefined, secondary: SeniorRaterInfo): SeniorRaterInfo => {
  if (!primary) {
    return secondary
  }

  const merged: SeniorRaterInfo = createEmptyInfo()
  const keys = Object.keys(merged) as Array<keyof SeniorRaterInfo>

  for (const key of keys) {
    const primaryValue = primary[key]
    const secondaryValue = secondary[key]
    merged[key] = primaryValue || secondaryValue || ''
  }

  return merged
}

export function PascodeForm({ sessionData, onSubmit }: PascodeFormProps) {
  const [pascodeInfo, setPascodeInfo] = useState<Record<string, SeniorRaterInfo>>({})
  const [smallUnitSR, setSmallUnitSR] = useState<SeniorRaterInfo>(createEmptyInfo())
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState(0)

  const derivedPascodes = useMemo(() => {
    const explicit = Array.isArray(sessionData?.pascodes) ? sessionData?.pascodes : []
    if (explicit && explicit.length > 0) {
      return explicit
    }

    const categories = sessionData?.categories
    if (!categories) return []

    const collector = new Set<string>()
    const addFromMembers = (members?: Array<Record<string, any>>) => {
      if (!Array.isArray(members)) return
      members.forEach((member) => {
        const pas = member?.ASSIGNED_PAS
        if (typeof pas === 'string' && pas.trim()) {
          collector.add(pas.trim())
        }
      })
    }

    addFromMembers(categories.eligible)
    addFromMembers(categories.ineligible)
    addFromMembers(categories.discrepancy)
    addFromMembers(categories.btz)
    addFromMembers(categories.small_unit)

    return Array.from(collector)
  }, [sessionData])

  useEffect(() => {
    if (derivedPascodes.length > 0) {
      setPascodeInfo((prev) => {
        const next: Record<string, SeniorRaterInfo> = {}
        derivedPascodes.forEach((pascode: string) => {
          const fromSession = hydrateFromSession(sessionData?.pascode_map?.[pascode])
          next[pascode] = mergeInfo(prev[pascode], fromSession)
        })
        return next
      })
    } else {
      setPascodeInfo({})
    }

    if (sessionData?.senior_rater_needed) {
      setSmallUnitSR((prev) => mergeInfo(prev, hydrateFromSession(sessionData.small_unit_sr)))
    } else {
      setSmallUnitSR(createEmptyInfo())
    }
  }, [derivedPascodes, sessionData])

  const handlePascodeChange = (pascode: string, field: keyof SeniorRaterInfo, value: string) => {
    setPascodeInfo((prev) => ({
      ...prev,
      [pascode]: {
        ...(prev[pascode] ?? createEmptyInfo()),
        [field]: value,
      },
    }))
  }

  const handleSmallUnitChange = (field: keyof SeniorRaterInfo, value: string) => {
    setSmallUnitSR((prev) => ({
      ...(prev ?? createEmptyInfo()),
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload: Record<string, any> = {}

      Object.entries(pascodeInfo).forEach(([pascode, info]) => {
        payload[pascode] = buildPayload(info)
      })

      // Add small unit senior rater if needed
      if (sessionData?.senior_rater_needed) {
        payload.small_unit_sr = buildPayload(smallUnitSR)
      }

      await onSubmit(sessionData.session_id, payload)
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Submission failed')
      setSubmitting(false)
    }
  }

  const isFormValid = () => {
    const hasRequiredCommanderFields = (info: SeniorRaterInfo) =>
      Boolean(
        info.commander_rank &&
          info.commander_title &&
          info.commander_first_name &&
          info.commander_last_name
      )

    const hasRequiredSRIDField = (info: SeniorRaterInfo) =>
      Boolean(info.srid)

    const hasRequiredSeniorRaterFields = (info: SeniorRaterInfo) =>
      Boolean(
        info.senior_rater_rank &&
          info.senior_rater_title &&
          info.senior_rater_first_name &&
          info.senior_rater_last_name
      )

    // Check all pascodes have complete commander info, SRID, and senior rater info if needed
    const pascodeValid = Object.entries(pascodeInfo).every(([pascode, info]) => {
      const commanderValid = hasRequiredCommanderFields(info)
      const sridValid = hasRequiredSRIDField(info)
      const seniorRaterValid = !needsSeniorRater(pascode) || hasRequiredSeniorRaterFields(info)
      return commanderValid && sridValid && seniorRaterValid
    })

    // If small unit SR needed, check it's complete
    const smallUnitValid =
      !sessionData?.senior_rater_needed ||
      (hasRequiredCommanderFields(smallUnitSR) && hasRequiredSRIDField(smallUnitSR) && hasRequiredSeniorRaterFields(smallUnitSR))

    return pascodeValid && smallUnitValid
  }

  const pascodes = derivedPascodes
  const hasMultiplePascodes = pascodes.length > 1
  const cycle = sessionData?.cycle || ''

  // Determine if senior rater is needed based on cycle and unit type
  const needsSeniorRater = (pascode: string) => {
    // MSG and SMS always need senior rater
    if (cycle === 'MSG' || cycle === 'SMS') {
      return true
    }
    // SRA, SSG, TSG only need senior rater if unit is small
    const smallUnitPascodes = sessionData?.categories?.small_unit?.map((m: any) => m.ASSIGNED_PAS) || []
    return smallUnitPascodes.includes(pascode)
  }

  const hasSmallUnit = sessionData?.senior_rater_needed

  const pascodeUnitMap = useMemo(() => {
    const explicit = sessionData?.pascode_unit_map || {}
    if (explicit && Object.keys(explicit).length > 0) {
      return explicit as Record<string, string>
    }

    const categories = sessionData?.categories
    if (!categories) return {}

    const map = new Map<string, string>()
    const collect = (members?: Array<Record<string, any>>) => {
      if (!Array.isArray(members)) return
      members.forEach((member) => {
        const pas = typeof member?.ASSIGNED_PAS === 'string' ? member.ASSIGNED_PAS.trim() : ''
        const unit =
          typeof member?.ASSIGNED_PAS_CLEARTEXT === 'string'
            ? member.ASSIGNED_PAS_CLEARTEXT.trim()
            : ''
        if (pas && unit && !map.has(pas)) {
          map.set(pas, unit)
        }
      })
    }

    collect(categories.eligible)
    collect(categories.ineligible)
    collect(categories.discrepancy)
    collect(categories.btz)
    collect(categories.small_unit)

    return Object.fromEntries(map)
  }, [sessionData])

  const renderInfoForm = (
    info: SeniorRaterInfo,
    changeHandler: (field: keyof SeniorRaterInfo, value: string) => void,
    pascode?: string
  ) => {
    const showSeniorRater = pascode ? needsSeniorRater(pascode) : true

    return (
      <div className="space-y-6">
        {/* Unit Commander Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <p className="text-lg font-semibold text-slate-900">Unit Commander Information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Commander Rank"
              value={info.commander_rank}
              onChange={(e) => changeHandler('commander_rank', e.target.value)}
              options={AF_OFFICER_RANKS}
              disabled={submitting}
              required
            />

            <Input
              label="Commander Title"
              value={info.commander_title}
              onChange={(e) => changeHandler('commander_title', e.target.value)}
              disabled={submitting}
              placeholder="Commander"
              required
            />

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="First Name"
                value={info.commander_first_name}
                onChange={(e) => changeHandler('commander_first_name', e.target.value)}
                disabled={submitting}
                placeholder="FIRST"
                required
              />
              <Input
                label="Middle Initial"
                value={info.commander_middle_name}
                onChange={(e) => changeHandler('commander_middle_name', e.target.value)}
                disabled={submitting}
                placeholder="M"
              />
              <Input
                label="Last Name"
                value={info.commander_last_name}
                onChange={(e) => changeHandler('commander_last_name', e.target.value)}
                disabled={submitting}
                placeholder="LAST"
                required
              />
            </div>
          </div>
        </div>

        {/* Senior Rater Section */}
        <div className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <p className="text-lg font-semibold text-slate-900">Senior Rater Information</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Senior Rater ID (SRID)"
              value={info.srid}
              onChange={(e) => changeHandler('srid', e.target.value)}
              disabled={submitting}
              placeholder="e.g., 1234567"
              required
            />

            {showSeniorRater && (
              <>
                <Select
                  label="Senior Rater Rank"
                  value={info.senior_rater_rank}
                  onChange={(e) => changeHandler('senior_rater_rank', e.target.value)}
                  options={AF_OFFICER_RANKS}
                  disabled={submitting}
                  required
                />

                <Input
                  label="Senior Rater Title"
                  value={info.senior_rater_title}
                  onChange={(e) => changeHandler('senior_rater_title', e.target.value)}
                  disabled={submitting}
                  placeholder="Commander"
                  required
                />

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="First Name"
                    value={info.senior_rater_first_name}
                    onChange={(e) => changeHandler('senior_rater_first_name', e.target.value)}
                    disabled={submitting}
                    placeholder="FIRST"
                    required
                  />
                  <Input
                    label="Middle Initial"
                    value={info.senior_rater_middle_name}
                    onChange={(e) => changeHandler('senior_rater_middle_name', e.target.value)}
                    disabled={submitting}
                    placeholder="M"
                  />
                  <Input
                    label="Last Name"
                    value={info.senior_rater_last_name}
                    onChange={(e) => changeHandler('senior_rater_last_name', e.target.value)}
                    disabled={submitting}
                    placeholder="LAST"
                    required
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Early return for debugging if no sessionData
  if (!sessionData) {
    return (
      <Card variant="bordered">
        <CardContent className="pt-6">
          <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger text-sm">
            <p className="font-semibold mb-2">No Session Data</p>
            <p>The sessionData prop is undefined or null. This is a component configuration issue.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Force Distribution Information</CardTitle>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-slate-600">Session ID:</span>
          <Badge variant="primary">{sessionData?.session_id}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-danger/10 border border-danger rounded-lg text-danger text-sm">
              {error}
            </div>
          )}

          {/* Tabs for Multiple PASCODEs */}
          {hasMultiplePascodes && (
            <Tabs defaultIndex={currentTab} onChange={setCurrentTab}>
              <TabList>
                {pascodes.map((pascode: string) => (
                  <TabButton key={pascode}>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {pascode}
                      {pascodeUnitMap?.[pascode] && (
                        <span className="text-xs text-slate-500">
                          ({pascodeUnitMap[pascode]})
                        </span>
                      )}
                    </div>
                  </TabButton>
                ))}
              </TabList>

              <TabPanels>
                {/* PASCODE Tabs */}
                {pascodes.map((pascode: string) => (
                  <TabPanel key={pascode}>
                    <div className="space-y-4">
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-sm font-medium text-slate-900">PASCODE: {pascode}</p>
                        {pascodeUnitMap?.[pascode] && (
                          <p className="text-sm text-slate-600">
                            Unit: {pascodeUnitMap[pascode]}
                          </p>
                        )}
                      </div>

                      {renderInfoForm(
                        pascodeInfo[pascode] ?? createEmptyInfo(),
                        (field, value) => handlePascodeChange(pascode, field, value),
                        pascode
                      )}
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </Tabs>
          )}

          {pascodes.length === 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600">
              No PASCODEs detected for this session. Verify the roster step and ensure members include PASCODE assignments before continuing.
            </div>
          )}

          {/* Single PASCODE (no tabs) */}
          {!hasMultiplePascodes && pascodes.length === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-900">PASCODE: {pascodes[0]}</p>
                {pascodeUnitMap?.[pascodes[0]] && (
                  <p className="text-sm text-slate-600">
                    Unit: {pascodeUnitMap[pascodes[0]]}
                  </p>
                )}
              </div>

              {renderInfoForm(
                pascodeInfo[pascodes[0]] ?? createEmptyInfo(),
                (field, value) => handlePascodeChange(pascodes[0], field, value),
                pascodes[0]
              )}
            </div>
          )}

          {/* Small Unit Section (separate from tabs) */}
          {hasSmallUnit && (
            <div className="space-y-4 mt-6 pt-6 border-t-2 border-blue-200">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-base font-semibold text-blue-900">Small Unit Senior Rater</p>
                <p className="text-sm text-blue-700 mt-1">
                  Required for units with special senior rater requirements
                </p>
              </div>

              {renderInfoForm(
                smallUnitSR,
                (field, value) => handleSmallUnitChange(field, value)
              )}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              size="lg"
              disabled={!isFormValid() || submitting}
              loading={submitting}
              leftIcon={<Send className="w-5 h-5" />}
            >
              {submitting ? 'Generating PDF...' : 'Generate PDF'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
