# PACE Application - Change Log

## Logo Upload and Display

### Frontend Changes
- **RosterPreview.tsx**
  - Added logo preview display showing "Logo: filename" above upload button
  - Changed button text from "Upload Logo" to "Replace Image" when logo exists
  - Wrapped logo display in styled container with slate background and border

### Backend Changes
- **main.py** (Initial MEL pascode submission endpoint, ~line 1037-1066)
  - Added custom logo retrieval from session
  - Convert hex-encoded logo data to temporary file
  - Pass temp logo path to PDF generator
  - Clean up temp logo file after PDF generation (both success and error cases)

- **main.py** (Final MEL pascode submission endpoint, ~line 1302-1331)
  - Same logo handling as Initial MEL endpoint
  - Ensures temp files are deleted after use

- **main.py** (Roster preview endpoint, ~line 392-395)
  - Fixed custom_logo return in session data

## Force Distribution Information Page

### PascodeForm.tsx - Major Restructuring

#### Title and Layout
- Changed page title from "Enter Senior Rater Information" to "Force Distribution Information"
- Removed processing warnings and debug information
- Reordered sections: Unit Commander before Senior Rater

#### Rank Dropdowns
- Added officer rank constants (AF_OFFICER_RANKS)
- Changed rank fields to dropdowns with officer ranks only (2d Lt through Gen)
- Pre-filled defaults: Commander (Lt Col), Senior Rater (Col)
- Default title for both: "Commander"

#### Conditional Senior Rater Display
- MSG/SMS cycles: Always show senior rater fields
- SRA/SSG/TSG cycles: Only show senior rater fields for small units
- Added `needsSeniorRater()` function to determine visibility based on cycle and unit type
- SRID field always required regardless of unit size

#### Small Unit Handling
- Removed separate "Small Unit SR" tab
- Added small unit section as separate area below pascode tabs (not a tab)
- Section appears automatically when `hasSmallUnit` is true
- Styled with blue border and background to distinguish from regular pascodes
- Small unit handling now automatic based on data

#### Button Text
- Changed submit button from "Generate Initial/Final MEL PDF" to "Generate PDF"

### Select.tsx - Dropdown Arrow Fix
- Added explicit vendor prefixes to remove default browser arrows:
  - `[appearance:none]` - Standard CSS
  - `[-webkit-appearance:none]` - Safari/Chrome
  - `[-moz-appearance:none]` - Firefox
  - `bg-[length:0] [background-image:none]` - Removes background image arrows
- Ensures only custom ChevronDown icon displays (no double arrows)

## Page Titles and Labels

### InitialMEL.tsx
- Changed page title to spell out "Initial Master Eligibility Listing"
- Added auto-download functionality via useEffect when step 3 is reached
- Updated download page text to spell out "Master Eligibility Listing" instead of "MEL"
- Moved download button to right side (justify-end)
- Added animated stepper with progressive transitions (scale, pulse effects)

### FinalMEL.tsx
- Changed page title to spell out "Final Master Eligibility Listing"
- Same auto-download and styling changes as InitialMEL.tsx

## Statistics Display

### RosterPreview.tsx
- Changed statistics to vertical layout with centered numbers
- Changed "Discrepancy" to "Discrepancies"
- Changed "Small Unit" to "Small Units"
- Centered numbers above category labels

## PDF Generation - Signature Blocks and Field Names

### Backend Logic Updates

#### initial_mel_generator.py
- **Large Units (pascode loop, ~line 185-215)**:
  - FD Name: Uses Unit Commander name (formatted as "LAST, FIRST MIDDLE")
  - FDID: Format as SRID + last 4 digits of PASCODE
  - Signature Block: Uses Unit Commander rank and title
  - Example: `'fdid': f'{pascode_map[pascode].get("srid", "")}{pascode[-4:]}'`

- **Small Units (~line 162-184 and 231-258)**:
  - FD Name: Uses Unit Commander name
  - FDID: Uses just SRID (no pascode)
  - Signature Block: Uses Senior Rater rank and title
  - Example: `'fdid': f'{senior_rater.get("srid", "")}'`

#### final_mel_generator.py
- **Large Units (pascode loop)**:
  - FD Name: Uses Unit Commander name
  - FDID: Format as SRID + last 4 digits of PASCODE
  - Signature Block: Uses Unit Commander rank and title
  - Example: `'fdid': f'{pascode_map[pascode]["srid"]}{pascode[-4:]}'`

- **Small Units (generate_small_unit_final_mel_pdf function, ~line 241-285)**:
  - FD Name: Uses Unit Commander name
  - FDID: Uses just SRID (line 265)
  - Signature Block: Uses Senior Rater rank and title
  - Example: `'fdid': f'{senior_rater["srid"]}'`

### Field Mapping Summary
| Unit Type | FD Name | FDID | Signature Rank/Title |
|-----------|---------|------|---------------------|
| Large Unit | Unit Commander Name | SRID + Last 4 of PASCODE | Unit Commander |
| Small Unit | Unit Commander Name | SRID only | Senior Rater |

## Summary of Key Features

1. **Logo Management**: Upload, preview, temp file handling, and automatic cleanup
2. **Force Distribution**: Restructured form with conditional fields based on cycle and unit type
3. **User Experience**: Auto-download, animated progress, spelling out abbreviations
4. **Data Accuracy**: Correct signature blocks and field formatting based on unit size
5. **UI Improvements**: Fixed dropdown arrows, centered statistics, improved visual hierarchy
