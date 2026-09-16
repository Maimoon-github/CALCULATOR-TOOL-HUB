# Zakat Calculation Methodology Research

## Executive Summary

This document outlines the Islamic jurisprudence (fiqh) foundations for the Zakat Calculator, referencing authoritative sources including AAOIFI Shari'ah Standards, recognized Zakat institutions, and scholar-reviewed guidance.

---

## 1. Core Zakat Principles

### 1.1 Definition of Zakat
Zakat is the third pillar of Islam - a mandatory charitable contribution of 2.5% on qualifying wealth held for one lunar year (Hawl).

**Sources:**
- Quran 9:103, 2:43, 2:110
- Sahih al-Bukhari, Book 24 (Zakat)
- AAOIFI Shari'ah Standard No. 35

### 1.2 Fundamental Conditions for Zakat Obligation

| Condition | Description | Source |
|-----------|-------------|--------|
| Islam | Muslim obligation | Consensus |
| Freedom | Free individual (not enslaved) | Classical fiqh |
| Ownership | Complete ownership of wealth | AAOIFI SS 35 |
| Nisab | Wealth reaches minimum threshold | Hadith |
| Hawl | Lunar year passage (for most assets) | Hadith |
| Growth Potential | Asset can grow/increase | Hanafi fiqh |

---

## 2. Nisab (Minimum Threshold)

### 2.1 Gold Nisab
- **Weight:** 87.48 grams of pure gold (24K)
- **Hadith Basis:** "There is no Zakat on less than 5 awaq of silver" (Bukhari 1447)
- **Conversion:** 20 dinars = 87.48g gold (scholarly consensus)

### 2.2 Silver Nisab
- **Weight:** 612.36 grams of pure silver
- **Hadith Basis:** "There is no Zakat on less than 5 awaq of silver" (Bukhari 1447)
- **Conversion:** 5 awaq = 612.36g silver (scholarly consensus)

### 2.3 Scholarly Differences on Nisab Method

| Position | View | Proponents |
|----------|------|------------|
| Silver Standard | Use silver nisab as it benefits poor (lower threshold) | Many contemporary scholars |
| Gold Standard | Use gold nisab as more stable | Some modern economists |
| Beneficial Choice | Use whichever is more beneficial for poor | Yusuf al-Qaradawi, ECFR |
| Asset-Type Based | Match asset type to nisab type | Classical position |

**Calculator Implementation:** Allow user selection with clear explanation of differences.

---

## 3. Zakat Rate

### 3.1 Standard Annual Rate
- **Rate:** 2.5% (1/40)
- **Source:** Hadith - "One fortieth of the wealth" (Tirmidhi 625)
- **Application:** On net zakatable wealth above nisab

### 3.2 Alternative Rates (Non-MVP)
- Agricultural produce: 5% or 10% depending on irrigation
- Rikaz (treasures): 20%
- Mining: 2.5% after refining

---

## 4. Asset Categories & Treatment

### 4.1 Gold and Silver

#### 4.1.1 Investment Gold/Silver
- **Status:** Fully zakatable
- **Valuation:** Current market value
- **Purity Consideration:** Calculate based on pure metal content
- **Source:** AAOIFI SS 35, Section 7

#### 4.1.2 Personal Jewellery
| School | Position | Notes |
|--------|----------|-------|
| Hanafi | Zakatable if exceeds need | Even if worn |
| Maliki | Not zakatable if personal use | Excessive amounts zakatable |
| Shafi'i | Not zakatable for personal use | |
| Hanbali | Not zakatable for permissible use | |

**Calculator Implementation:** 
- Ask purpose: Investment vs Personal jewellery vs Trade
- Show methodology notice when personal jewellery selected
- Default: Include investment gold, disclose personal jewellery difference

#### 4.1.3 Gemstones & Non-Gold Materials
- **Diamonds/Gemstones:** Not zakatable for personal use
- **Gold content only:** Calculate zakat on gold weight
- **Trade inventory:** Full market value zakatable
- **Source:** AAOIFI SS 35/7/3

### 4.2 Cash & Cash Equivalents

#### 4.2.1 Included Items
- Cash in hand
- Bank balances (current, savings)
- Digital wallets
- Foreign currency (converted to base currency)
- Money owed to user (receivables - see 4.4)

#### 4.2.2 Valuation
- **Face value** for local currency
- **FX conversion** at calculation date for foreign currency
- **Source:** AAOIFI SS 35/8

### 4.3 Receivables (Money Owed to User)

#### 4.3.1 Classification
| Type | Zakat Treatment | Source |
|------|-----------------|--------|
| Strong receivables | Zakatable annually | Hanafi position |
| Weak/doubtful receivables | Zakat when received (retroactively) | Some scholars |
| Bad debts | Not zakatable | Consensus |

#### 4.3.2 Calculator Implementation
- Ask likelihood of recovery: Certain/Likely/Doubtful/Bad
- Apply methodology-specific treatment
- Show assumption clearly

### 4.4 Investments (Shares, ETFs, Funds)

#### 4.4.1 Trading Shares (Short-term)
- **Treatment:** As trade goods
- **Valuation:** Current market value
- **Source:** AAOIFI SS 35/10/2

#### 4.4.2 Long-term Investment Shares
| Methodology | Approach | Notes |
|-------------|----------|-------|
| Underlying Assets | Calculate proportion of zakatable assets | Requires company breakdown |
| Market Value | Full market value | Simpler but debated |
| Proxy Method | Fixed percentage (e.g., 25-77%) | Approved by some scholars |

**Calculator Implementation:**
- Ask intent: Trading vs Long-term investment
- For long-term: Show methodology options (only scholar-approved)
- Never invent universal percentage

### 4.5 Property

#### 4.5.1 Property Classification Matrix

| Intent | Zakat Treatment | Source |
|--------|-----------------|--------|
| Primary residence | Not zakatable | Consensus |
| Personal/family use | Not zakatable | Consensus |
| Rental property | Zakat on rental income saved, not property value | Majority view |
| Purchased for resale | Zakatable as trade inventory (full value) | AAOIFI SS 35/10 |
| Development stock | Zakatable as business inventory | AAOIFI SS 35/10/4 |
| Land held for resale | Zakatable if intention to trade | Fiqh councils |
| Long-term investment | Differ: Some say not zakatable until sale | Disputed |

#### 4.5.2 Change of Intention
- Capture date intention changed
- Pro-rate or full year based on methodology
- **Source:** Islamic Fiqh Academy resolutions

#### 4.5.3 Mortgage Treatment
| Component | Deductibility | Notes |
|-----------|---------------|-------|
| Principal due within 12 months | Deductible (most views) | Short-term liability |
| Future principal | Not immediately deductible | Long-term |
| Interest component | Not deductible (riba) | All schools |

**Calculator Implementation:**
- Separate principal vs interest
- Ask amount due within eligible period
- Apply liability policy from methodology

### 4.6 Business Assets

#### 4.6.1 Zakatable Business Assets
- Business cash & bank balances
- Stock/inventory for sale
- Raw materials
- Work in progress (scholar-reviewed valuation)
- Trade receivables
- Other current zakatable assets

#### 4.6.2 Non-Zakatable Business Assets
- Machinery & equipment (not for sale)
- Office furniture
- Computers (operational)
- Factory equipment
- Business vehicles (operational)
- Buildings used for operations

**Source:** AAOIFI SS 35/10/3-4

#### 4.6.3 Inventory Valuation Methods
| Method | Description | Scholarly Status |
|--------|-------------|------------------|
| Market/Selling value | Current market price | Common view |
| Cost value | Purchase/manufacturing cost | Some scholars |
| Lower of cost/market | Conservative approach | Modern accounting |

**Calculator Implementation:** Use market value as default, disclose method

#### 4.6.4 Business Liabilities (Deductible)
- Trade payables (current)
- Short-term debt
- Current tax liabilities
- Accrued eligible obligations

---

## 5. Liability Deduction Rules

### 5.1 Eligible Liabilities

| Type | Deductibility | Conditions |
|------|---------------|------------|
| Immediate debts | Fully deductible | Due now |
| Short-term debts (≤12 months) | Deductible | Next lunar year |
| Long-term debts | Only current portion | Varies by methodology |
| Deferred mahr | Deductible when due | Specific condition |
| Unpaid zakat from previous years | Priority deduction | Obligation |

### 5.2 Liability Policies (Methodology Profiles)

```typescript
type LiabilityPolicy = 
  | "ImmediateDueAmount"      // Only what's due now
  | "Next12LunarMonths"       // Amounts due in next year
  | "CurrentLiability"        // Accounting current liabilities
  | "CustomScholarProfile"    // Institution-specific
```

---

## 6. Hawl (Lunar Year)

### 6.1 Standard Rule
- Wealth must be held for one complete lunar year
- Lunar year = 354-355 days
- **Source:** Hadith - "No zakat on wealth until a year passes" (Tirmidhi)

### 6.2 Exceptions (No Hawl Required)
- Agricultural produce (at harvest)
- Livestock offspring (follow mother's hawl)
- Profits from existing zakatable wealth (follow original hawl)

### 6.3 Calculator Implementation
- Optional: User's Zakat anniversary date
- Support Hijri and Gregorian dates
- Explain lunar year concept

---

## 7. Currency & Exchange Rates

### 7.1 Multi-Currency Treatment
- Convert all assets to base calculation currency
- Use exchange rate at calculation date
- Store FX rates used in calculation snapshot

### 7.2 Supported Currencies (MVP)
- PKR (default)
- USD
- GBP
- EUR
- AED
- SAR
- CAD
- AUD

---

## 8. Calculation Formula

### 8.1 Core Formula

```
Total Zakatable Assets
  - Gold (pure weight × current price)
  - Silver (pure weight × current price)
  - Cash & equivalents
  - Receivables (per methodology)
  - Investments (per methodology)
  - Property for resale (current market value)
  - Business inventory & assets
  + Other zakatable assets

Eligible Deductible Liabilities
  - Short-term debts
  - Current portion of long-term debts
  - Trade payables
  - Other deductible obligations
  = Net Zakatable Wealth

IF Net Zakatable Wealth >= Nisab Value
  THEN Zakat Due = Net Zakatable Wealth × 2.5%
  ELSE Zakat Due = 0
```

### 8.2 Precision Requirements
- Use decimal arithmetic (not floating point)
- Internal precision: 6+ decimal places
- Display precision: 2 decimal places (currency)
- Final rounding: Round half-up for payment

---

## 9. Scholarly References

### 9.1 Primary Sources
1. **AAOIFI Shari'ah Standards** (Standard 35: Zakat)
   - Accounting and Auditing Organization for Islamic Financial Institutions
   - Bahrain-based international standards body

2. **Islamic Fiqh Academy** (Jeddah)
   - Resolutions on Zakat of shares, property, businesses

3. **European Council for Fatwa and Research (ECFR)**
   - Contemporary fatwas on Zakat issues

### 9.2 Recognized Zakat Institutions
- Zakat Foundation of America
- National Zakat Foundation (UK)
- Darul Qasim (US)
- Al-Azhar University (Egypt)
- International Islamic Fiqh Academy

### 9.3 Key Scholarly Works
- "Fiqh al-Zakat" by Yusuf al-Qaradawi
- "Al-Mughni" by Ibn Qudamah (Hanbali)
- "Al-Hidayah" (Hanafi)
- "Mukhtasar Khalil" (Maliki)
- "Al-Umm" by al-Shafi'i

---

## 10. Disputed Issues & Calculator Approach

### 10.1 Issues with Legitimate Scholarly Difference

| Issue | Different Views | Calculator Approach |
|-------|-----------------|---------------------|
| Gold vs Silver Nisab | See section 2.3 | Allow selection, explain both |
| Personal jewellery | See section 4.1.2 | Ask purpose, show methodology notice |
| Investment shares valuation | See section 4.4.2 | Offer scholar-approved methods only |
| Rental property | Income vs full value | Separate property value from rental income |
| Long-term liabilities | Deduction scope | Use methodology profile |
| Receivables treatment | When to pay zakat | Ask recovery likelihood, apply rules |

### 10.2 Calculator Philosophy
```
NOT: Automated Mufti
IS:  Calculation Tool + Methodology Explainer

For disputed/complex cases:
1. Explain the difference
2. Show assumption being used
3. Allow selection where appropriate
4. Recommend scholar review for complex situations
```

---

## 11. Methodology Governance

### 11.1 Required Documentation for Each Rule
```
Rule ID: [unique identifier]
Description: [what the rule does]
Source: [scholarly reference]
Methodology: [which school/approach]
Formula: [calculation formula]
Examples: [worked examples]
Counterexamples: [what it doesn't apply to]
Unit Tests: [test case references]
Review Date: [last scholarly review]
Reviewed By: [scholar/institution name]
```

### 11.2 Version Control
- All methodology changes require:
  - Source documentation
  - Scholar review
  - Version number increment
  - Test suite updates
  - Release notes

---

## 12. MVP Methodology Profile (Default)

```typescript
const defaultMethodology: ZakatMethodology = {
  id: "default-v1",
  name: "Standard Sunni Methodology",
  nisabMethod: "silver", // Default to silver (more beneficial for poor)
  goldNisabGrams: 87.48,
  silverNisabGrams: 612.36,
  zakatRate: 0.025,
  jewelryPolicy: "ask_purpose", // Ask user, show differences
  liabilityPolicy: "Next12LunarMonths",
  propertyPolicy: "intent_based", // Classify by owner's intention
  investmentPolicy: "trading_market_value", // Trading shares at market value
  reviewedBy: "Pending Scholar Review",
  reviewedAt: null,
  version: "1.0.0"
};
```

**Note:** This default profile requires formal scholar review before production deployment presenting itself as authoritative.

---

## 13. Research Gaps Requiring Scholar Review

1. **Exact purity ratios** for different karat values (verify 22K, 21K, 18K)
2. **Work in progress valuation** for business inventory
3. **Specific proxy percentages** for long-term share investments (if offering)
4. **Treatment of retirement accounts/pensions** (Phase 2)
5. **Crypto-currency treatment** (Phase 3, separate research needed)
6. **Mortgage interest handling** in non-Islamic banking contexts
7. **Treatment of insurance policies** (Phase 2)
8. **Gold/silver coins** numismatic vs melt value

---

## 14. Conclusion

This research provides the fiqh foundation for the Zakat Calculator. The implementation must:

1. **Never hard-code disputed positions** as universal truth
2. **Always disclose methodology** being applied
3. **Allow configuration** where legitimate differences exist
4. **Require scholar review** before presenting as authoritative
5. **Prioritize transparency** over simplicity in religious matters
6. **Direct users to qualified scholars** for complex personal situations

The calculator serves as a tool to assist users in calculating Zakat according to recognized methodologies, not as a substitute for scholarly guidance in complex or disputed cases.

---

**Document Version:** 1.0.0  
**Created:** Research Phase  
**Status:** Requires Scholar Review  
**Next Review:** Before MVP Launch
