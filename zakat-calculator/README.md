# Zakat Calculator

A transparent, scholar-reviewable Islamic wealth calculation platform for calculating Zakat on gold, silver, cash, property, and business assets.

## Overview

This is a modern web application that helps Muslims calculate their annual Zakat obligation with full transparency about:

- What assets are included/excluded
- Which nisab methodology is being used
- Current market prices applied
- Liabilities deducted
- Complete calculation breakdown

## Key Features

### Core Calculation Engine
- **Precise Decimal Arithmetic**: Uses Decimal.js for accurate financial calculations
- **Multi-Asset Support**: Gold, Silver, Cash, Investments, Property, Business Assets
- **Dynamic Nisab**: Calculates nisab value based on current gold/silver prices
- **Methodology Profiles**: Configurable fiqh approaches for disputed matters

### Asset Categories
1. **Gold & Silver** - With purity calculations (24K, 22K, 21K, 18K) and unit conversions (gram, tola, ounce)
2. **Cash & Savings** - Bank accounts, digital wallets, foreign currencies
3. **Receivables** - Money owed with recovery likelihood assessment
4. **Investments** - Shares, ETFs with trading vs long-term intent classification
5. **Property** - Intent-based classification (residence, rental, resale inventory)
6. **Business Assets** - Inventory, raw materials, trade receivables

### Transparency Features
- Live market price display with timestamps
- Manual rate override capability
- Full calculation breakdown showing every step
- Methodology notices for disputed fiqh positions
- Scholar review status disclosure

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Precision Math**: Decimal.js
- **Typography**: Montserrat (primary UI font)

## Design System

Based on the specified visual foundation:

- **Primary Color**: Lime (#9fe870)
- **Canvas**: White (#ffffff) / Soft Sage (#e8ebe6)
- **Ink**: #0e0f0c
- **Semantic Colors**: Positive (#2ead4b), Warning (#ffd11a), Negative (#d03238)
- **Card Radius**: 24px
- **Max Width**: 1600px fluid grid

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd zakat-calculator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── globals.css       # Global styles & design tokens
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main calculator page
├── config/               # Application configuration
│   └── index.ts          # Constants and defaults
├── lib/                  # Core business logic
│   └── zakatEngine.ts    # Calculation engine (pure functions)
├── types/                # TypeScript type definitions
│   └── zakat.ts          # All Zakat-related types
└── components/           # React components (future)
    ├── ui/               # Base UI components
    ├── calculator/       # Calculator-specific components
    └── layout/           # Layout components
```

## Calculation Methodology

### Default Profile (v1.0.0)
- **Nisab Method**: Silver (612.36g) - more beneficial for the poor
- **Zakat Rate**: 2.5% (1/40)
- **Jewelry Policy**: Ask purpose, show methodology differences
- **Liability Policy**: Next 12 Lunar Months
- **Property Policy**: Intent-based classification
- **Investment Policy**: Trading shares at market value

### Nisab Standards
- **Gold Nisab**: 87.48 grams of pure gold
- **Silver Nisab**: 612.36 grams of pure silver

*Source: Hadith consensus - "There is no Zakat on less than 5 awaq of silver"*

### Important Disclaimers

> **This is a calculation tool, not an automated Mufti.**

Zakat rulings may differ by school of jurisprudence and personal circumstances. This calculator applies the methodology shown in settings. For complex cases, consult a qualified scholar.

## Fiqh Transparency

The calculator explicitly handles scholarly differences:

| Issue | Approaches Supported |
|-------|---------------------|
| Gold vs Silver Nisab | User selection with explanation |
| Personal Jewellery | Ask purpose, show differences |
| Investment Shares | Trading (full value) vs Long-term (underlying/proxy) |
| Rental Property | Income only (not property value) |
| Property for Resale | Full market value as trade inventory |

## Privacy & Security

- **No Account Required**: Anonymous calculations
- **Local Processing**: Calculations happen in browser
- **No Financial Logging**: Sensitive data never logged
- **Manual Rate Entry**: No external API dependencies for MVP
- **User-Controlled Data**: Local storage only with explicit action

## Accessibility

- WCAG compliant color contrast
- Keyboard navigation support
- Screen reader friendly labels
- Visible focus indicators
- Semantic HTML structure

## Testing

Run the development server and test various scenarios:

```bash
npm run dev
```

Test cases covered:
- Below/At/Above Nisab thresholds
- Gold purity conversions
- Multi-currency calculations
- Property intent classifications
- Liability deductions
- Business asset valuations

## Future Phases

### Phase 2
- Live metal price APIs
- FX rate providers
- Multiple properties
- Mortgage handling
- PDF export
- Hijri calendar support
- Saved calculations

### Phase 3
- Portfolio imports
- Accounting integrations
- Historical calculations
- Family member calculations
- Zakat distribution planner

## Scholar Review Status

**Current Status**: Pending Formal Scholar Review

Before production deployment presenting authoritative guidance, this calculator requires:
1. Qualified scholar review of all calculation rules
2. Signed methodology version approval
3. Documentation of sources for each rule

## Contributing

When adding new calculation rules, ensure:
- Rule ID and description documented
- Scholarly source cited
- Formula clearly specified
- Unit tests written
- Review date tracked

## License

[To be determined]

## Contact

For scholarly inquiries regarding calculation methodology, please consult qualified local scholars.

---

**Version**: 1.0.0  
**Last Updated**: 2026  
**Status**: Development MVP
