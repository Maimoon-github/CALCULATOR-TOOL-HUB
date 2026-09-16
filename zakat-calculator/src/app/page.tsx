'use client';

/**
 * Zakat Calculator - Main Application Page
 * 
 * A transparent, scholar-reviewable Zakat calculation platform
 */

import { useState } from 'react';
import { calculateZakat, calculateNisabValues } from '@/lib/zakatEngine';
import {
  ZakatCalculationInput,
  GoldItem,
  SilverItem,
  CashItem,
  PropertyItem,
  BusinessAssetItem,
  PersonalLiabilityItem,
  MarketDataSnapshot,
  DEFAULT_METHODOLOGY,
} from '@/types/zakat';
import CONFIG from '@/config';

export default function HomePage() {
  // State for calculation inputs
  const [currency, setCurrency] = useState<string>('PKR');
  const [nisabMethod, setNisabMethod] = useState<'gold' | 'silver'>('silver');
  const [calculationDate, setCalculationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  // Market data (manual entry for MVP)
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(15000);
  const [silverPricePerGram, setSilverPricePerGram] = useState<number>(180);
  
  // Assets
  const [goldItems, setGoldItems] = useState<GoldItem[]>([]);
  const [silverItems, setSilverItems] = useState<SilverItem[]>([]);
  const [cashItems, setCashItems] = useState<CashItem[]>([
    { id: '1', amount: 0, currency: 'PKR', type: 'cash_in_hand' },
  ]);
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [businessAssets, setBusinessAssets] = useState<BusinessAssetItem[]>([]);
  const [personalLiabilities, setPersonalLiabilities] = useState<PersonalLiabilityItem[]>([]);
  
  // UI state
  const [activeSection, setActiveSection] = useState<string>('gold');
  const [showResult, setShowResult] = useState<boolean>(false);
  
  // Calculate result
  const calculate = () => {
    const marketData: MarketDataSnapshot = {
      goldPrice: {
        provider: 'manual',
        symbol: 'XAU',
        currency: currency,
        unit: 'gram',
        price: goldPricePerGram,
        timestamp: new Date().toISOString(),
      },
      silverPrice: {
        provider: 'manual',
        symbol: 'XAG',
        currency: currency,
        unit: 'gram',
        price: silverPricePerGram,
        timestamp: new Date().toISOString(),
      },
      exchangeRates: [],
      capturedAt: new Date().toISOString(),
    };
    
    const input: ZakatCalculationInput = {
      currency,
      calculationDate,
      methodologyId: 'default-v1',
      nisabMethod,
      goldItems,
      silverItems,
      cashItems: cashItems.filter(item => item.amount > 0),
      receivables: [],
      investments: [],
      properties,
      businessAssets: businessAssets.filter(item => item.amount > 0),
      businessLiabilities: [],
      personalLiabilities: personalLiabilities.filter(item => item.amountDueWithinYear > 0),
      marketData,
    };
    
    const result = calculateZakat(input);
    return result;
  };
  
  const result = showResult ? calculate() : null;
  
  // Nisab values for display
  const nisabValues = calculateNisabValues(goldPricePerGram, silverPricePerGram, DEFAULT_METHODOLOGY);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-canvas py-8 border-b">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">
            Zakat Calculator
          </h1>
          <p className="text-body text-lg max-w-3xl">
            Calculate your Zakat clearly and transparently across gold, silver, cash, property, and business assets.
          </p>
        </div>
      </header>
      
      <main className="container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form - 8 columns */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Methodology & Nisab Selection */}
            <section className="card">
              <h2 className="text-2xl font-bold mb-4">Calculation Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="currency">
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="input"
                  >
                    {CONFIG.SUPPORTED_CURRENCIES.map((curr) => (
                      <option key={curr} value={curr}>{curr}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="calculationDate">
                    Calculation Date
                  </label>
                  <input
                    id="calculationDate"
                    type="date"
                    value={calculationDate}
                    onChange={(e) => setCalculationDate(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-2">Nisab Method</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-canvas-soft">
                    <input
                      type="radio"
                      name="nisabMethod"
                      value="silver"
                      checked={nisabMethod === 'silver'}
                      onChange={() => setNisabMethod('silver')}
                      className="w-4 h-4"
                    />
                    <div>
                      <span className="font-medium">Silver Nisab (612.36g)</span>
                      <p className="text-sm text-muted">
                        Lower threshold - more beneficial for the poor ({formatCurrency(nisabValues.silverNisabValue)})
                      </p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-canvas-soft">
                    <input
                      type="radio"
                      name="nisabMethod"
                      value="gold"
                      checked={nisabMethod === 'gold'}
                      onChange={() => setNisabMethod('gold')}
                      className="w-4 h-4"
                    />
                    <div>
                      <span className="font-medium">Gold Nisab (87.48g)</span>
                      <p className="text-sm text-muted">
                        Higher threshold - more stable benchmark ({formatCurrency(nisabValues.goldNisabValue)})
                      </p>
                    </div>
                  </label>
                </div>
                <p className="text-xs text-muted mt-2">
                  Scholarly approaches differ on which benchmark should be used. Silver nisab produces a lower monetary threshold when silver is relatively inexpensive.
                </p>
              </div>
            </section>
            
            {/* Market Prices */}
            <section className="card">
              <h2 className="text-2xl font-bold mb-4">Current Market Prices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="goldPrice">
                    Gold Price (per gram)
                  </label>
                  <div className="relative">
                    <input
                      id="goldPrice"
                      type="number"
                      value={goldPricePerGram}
                      onChange={(e) => setGoldPricePerGram(parseFloat(e.target.value) || 0)}
                      className="input pr-16"
                      min="0"
                      step="0.01"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm">
                      {currency}/g
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    Updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-2" htmlFor="silverPrice">
                    Silver Price (per gram)
                  </label>
                  <div className="relative">
                    <input
                      id="silverPrice"
                      type="number"
                      value={silverPricePerGram}
                      onChange={(e) => setSilverPricePerGram(parseFloat(e.target.value) || 0)}
                      className="input pr-16"
                      min="0"
                      step="0.01"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-sm">
                      {currency}/g
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted mt-3">
                Enter your local market rates. Live rates will be available in future updates.
              </p>
            </section>
            
            {/* Gold Section */}
            <section className="card">
              <button
                onClick={() => setActiveSection(activeSection === 'gold' ? '' : 'gold')}
                className="w-full flex justify-between items-center text-left"
              >
                <h2 className="text-2xl font-bold">Gold & Silver</h2>
                <span className="text-muted">{activeSection === 'gold' ? '−' : '+'}</span>
              </button>
              
              {activeSection === 'gold' && (
                <div className="mt-4 space-y-4">
                  <div className="bg-canvas-soft p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Add Gold Item</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Weight</label>
                        <input type="number" placeholder="0" className="input text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Unit</label>
                        <select className="input text-sm">
                          <option value="gram">Gram</option>
                          <option value="tola">Tola</option>
                          <option value="ounce">Ounce</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Purity</label>
                        <select className="input text-sm">
                          <option value="24K">24K</option>
                          <option value="22K">22K</option>
                          <option value="21K">21K</option>
                          <option value="18K">18K</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Purpose</label>
                        <select className="input text-sm">
                          <option value="investment">Investment</option>
                          <option value="personal_jewelry">Personal Jewellery</option>
                          <option value="trade">Trade/Resale</option>
                        </select>
                      </div>
                    </div>
                    <button className="btn-primary mt-3 text-sm">Add Gold</button>
                  </div>
                  
                  {goldItems.length === 0 && (
                    <p className="text-muted text-sm text-center py-4">No gold items added yet</p>
                  )}
                  
                  <div className="bg-canvas-soft p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Add Silver Item</h3>
                    <p className="text-muted text-sm">Similar form for silver items</p>
                  </div>
                </div>
              )}
            </section>
            
            {/* Cash Section */}
            <section className="card">
              <button
                onClick={() => setActiveSection(activeSection === 'cash' ? '' : 'cash')}
                className="w-full flex justify-between items-center text-left"
              >
                <h2 className="text-2xl font-bold">Cash & Savings</h2>
                <span className="text-muted">{activeSection === 'cash' ? '−' : '+'}</span>
              </button>
              
              {activeSection === 'cash' && (
                <div className="mt-4 space-y-4">
                  <div className="bg-canvas-soft p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Amount</label>
                        <input
                          type="number"
                          placeholder="0"
                          className="input text-sm"
                          onChange={(e) => {
                            const updated = [...cashItems];
                            updated[0].amount = parseFloat(e.target.value) || 0;
                            setCashItems(updated);
                          }}
                          value={cashItems[0].amount}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Type</label>
                        <select className="input text-sm">
                          <option value="cash_in_hand">Cash in Hand</option>
                          <option value="current_account">Current Account</option>
                          <option value="savings_account">Savings Account</option>
                          <option value="digital_wallet">Digital Wallet</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Institution</label>
                        <input type="text" placeholder="Bank name" className="input text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            
            {/* Property Section */}
            <section className="card">
              <button
                onClick={() => setActiveSection(activeSection === 'property' ? '' : 'property')}
                className="w-full flex justify-between items-center text-left"
              >
                <h2 className="text-2xl font-bold">Property</h2>
                <span className="text-muted">{activeSection === 'property' ? '−' : '+'}</span>
              </button>
              
              {activeSection === 'property' && (
                <div className="mt-4 space-y-4">
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <h3 className="font-semibold mb-2">Property Intent Classification</h3>
                    <p className="text-sm text-muted mb-3">
                      Zakat treatment depends on why you own the property:
                    </p>
                    <ul className="text-sm space-y-1 text-body">
                      <li>• <strong>Primary residence:</strong> Not zakatable</li>
                      <li>• <strong>Rental property:</strong> Only saved rental income is zakatable</li>
                      <li>• <strong>Purchased for resale:</strong> Full market value is zakatable</li>
                    </ul>
                  </div>
                  
                  <div className="bg-canvas-soft p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Intent</label>
                        <select className="input text-sm">
                          <option value="primary_residence">Primary Residence</option>
                          <option value="rental_property">Rental Property</option>
                          <option value="purchased_for_resale">Purchased for Resale</option>
                          <option value="development_stock">Development Stock</option>
                          <option value="land_for_resale">Land for Resale</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Market Value</label>
                        <input type="number" placeholder="0" className="input text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            
            {/* Business Section */}
            <section className="card">
              <button
                onClick={() => setActiveSection(activeSection === 'business' ? '' : 'business')}
                className="w-full flex justify-between items-center text-left"
              >
                <h2 className="text-2xl font-bold">Business Assets</h2>
                <span className="text-muted">{activeSection === 'business' ? '−' : '+'}</span>
              </button>
              
              {activeSection === 'business' && (
                <div className="mt-4 space-y-4">
                  <div className="bg-canvas-soft p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Add Business Asset</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Type</label>
                        <select className="input text-sm">
                          <option value="business_cash">Business Cash</option>
                          <option value="bank_balance">Bank Balance</option>
                          <option value="stock_inventory">Stock/Inventory</option>
                          <option value="raw_materials">Raw Materials</option>
                          <option value="trade_receivables">Trade Receivables</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Amount</label>
                        <input type="number" placeholder="0" className="input text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Valuation Method</label>
                        <select className="input text-sm">
                          <option value="market">Market Value</option>
                          <option value="cost">Cost Value</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            
            {/* Liabilities Section */}
            <section className="card">
              <button
                onClick={() => setActiveSection(activeSection === 'liabilities' ? '' : 'liabilities')}
                className="w-full flex justify-between items-center text-left"
              >
                <h2 className="text-2xl font-bold">Liabilities (Deductions)</h2>
                <span className="text-muted">{activeSection === 'liabilities' ? '−' : '+'}</span>
              </button>
              
              {activeSection === 'liabilities' && (
                <div className="mt-4 space-y-4">
                  <div className="bg-canvas-soft p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Add Liability</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Type</label>
                        <select className="input text-sm">
                          <option value="immediate_debt">Immediate Debt</option>
                          <option value="short_term_debt">Short-term Debt</option>
                          <option value="long_term_debt">Long-term Debt</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Amount Due This Year</label>
                        <input type="number" placeholder="0" className="input text-sm" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">Creditor</label>
                        <input type="text" placeholder="Name" className="input text-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            
            {/* Calculate Button */}
            <button
              onClick={() => setShowResult(true)}
              className="btn-primary w-full py-4 text-lg"
            >
              Calculate My Zakat
            </button>
            
            {/* Disclaimer */}
            <div className="bg-canvas-soft p-4 rounded-lg text-sm text-body">
              <p className="font-semibold mb-2">Important Notice:</p>
              <p>
                Zakat rulings may differ by school of jurisprudence and personal circumstances. 
                This calculator applies the methodology shown in your settings. 
                For complex cases, consult a qualified scholar.
              </p>
            </div>
          </div>
          
          {/* Live Summary - 4 columns (sticky on desktop) */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-4">
              {/* Nisab Card */}
              <div className="card bg-canvas">
                <h3 className="font-bold text-lg mb-3">Today's Nisab</h3>
                <div className="space-y-3">
                  <div className={`p-3 rounded-lg ${nisabMethod === 'silver' ? 'bg-canvas-soft ring-2 ring-primary' : 'bg-canvas-soft'}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Silver Method</span>
                      {nisabMethod === 'silver' && <span className="text-xs text-positive">✓ Selected</span>}
                    </div>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(nisabValues.silverNisabValue)}</p>
                    <p className="text-xs text-muted">612.36g silver</p>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${nisabMethod === 'gold' ? 'bg-canvas-soft ring-2 ring-primary' : 'bg-canvas-soft'}`}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Gold Method</span>
                      {nisabMethod === 'gold' && <span className="text-xs text-positive">✓ Selected</span>}
                    </div>
                    <p className="text-2xl font-bold mt-1">{formatCurrency(nisabValues.goldNisabValue)}</p>
                    <p className="text-xs text-muted">87.48g gold</p>
                  </div>
                </div>
                <p className="text-xs text-muted mt-3">
                  Source: Manual rates | Updated: {new Date().toLocaleDateString()}
                </p>
              </div>
              
              {/* Result Summary */}
              {result && (
                <div className="card bg-canvas">
                  <h3 className="font-bold text-lg mb-3">Calculation Result</h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Total Assets</span>
                      <span className="font-medium">{formatCurrency(result.totalZakatableAssets)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Liabilities</span>
                      <span className="font-medium text-negative">-{formatCurrency(result.totalDeductibleLiabilities)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Net Wealth</span>
                      <span>{formatCurrency(result.netZakatableWealth)}</span>
                    </div>
                    
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted">Nisab Threshold</span>
                        <span>{formatCurrency(result.nisabValue)}</span>
                      </div>
                      <div className={`mt-2 text-center py-2 rounded-lg ${result.nisabReached ? 'bg-positive/10 text-positive' : 'bg-warning/10 text-warning'}`}>
                        {result.nisabReached ? '✓ Nisab Reached' : '✗ Below Nisab'}
                      </div>
                    </div>
                    
                    <div className="border-t-2 pt-4 mt-4">
                      <div className="text-center">
                        <p className="text-muted text-sm mb-1">Estimated Zakat Due</p>
                        <p className="text-4xl font-extrabold text-primary">{formatCurrency(result.zakatDue)}</p>
                        {result.zakatDue > 0 && (
                          <p className="text-xs text-muted mt-1">
                            {Math.round(result.zakatRate * 100)}% × {formatCurrency(result.netZakatableWealth)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Breakdown toggle could go here */}
                  <button className="btn-primary w-full mt-4 text-sm">
                    View Detailed Breakdown
                  </button>
                </div>
              )}
              
              {/* Help Card */}
              <div className="card bg-canvas-soft">
                <h3 className="font-bold text-lg mb-2">How This Works</h3>
                <ol className="text-sm space-y-2 text-body list-decimal list-inside">
                  <li>Enter your assets (gold, silver, cash, etc.)</li>
                  <li>Add deductible liabilities</li>
                  <li>We calculate net zakatable wealth</li>
                  <li>Compare against nisab threshold</li>
                  <li>Apply 2.5% rate if nisab is reached</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-16 py-8 border-t bg-canvas">
        <div className="container text-center text-sm text-muted">
          <p className="mb-2">
            <strong>Zakat Calculator v{CONFIG.APP_VERSION}</strong>
          </p>
          <p className="max-w-2xl mx-auto">
            This is a calculation tool based on the selected methodology. 
            It is not a substitute for scholarly guidance in complex situations.
          </p>
          <p className="mt-4 text-xs">
            Methodology: {DEFAULT_METHODOLOGY.name} v{DEFAULT_METHODOLOGY.version} | 
            Status: {DEFAULT_METHODOLOGY.reviewedBy}
          </p>
        </div>
      </footer>
    </div>
  );
}
