import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Mic, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Calendar,
  X,
  CreditCard,
  TrendingUp,
  Coins,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ChevronDown,
  Layers,
  BarChart2,
  CalendarDays
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export default function Transactions() {
  const { transactions, products, business, activeLang } = useBusiness();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTx, setSelectedTx] = useState(null);

  // Month & Year state
  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey); // '2026-11' | 'all'
  const [selectedYear, setSelectedYear] = useState('2026');
  const [showLedgerTable, setShowLedgerTable] = useState(false);

  const currency = business?.currency || '₹';

  // Helper: compute financial cost, profit, margin for each transaction
  const getTxFinancials = (t) => {
    const total = Number(t.total) || 0;
    const qty = Number(t.quantity) || 1;
    const matched = products.find(p => 
      p._id === t.productId || 
      p.id === t.productId || 
      (p.name && t.productName && p.name.toLowerCase() === t.productName.toLowerCase())
    );

    let cost = 0;
    if (matched && Number(matched.purchasePrice) > 0) {
      cost = Number(matched.purchasePrice) * qty;
      if (cost > total && total > 0) {
        cost = total * (Number(matched.purchasePrice) / Number(matched.sellingPrice || matched.purchasePrice));
      }
    } else {
      cost = Math.round(total * 0.75); // 75% cost benchmark for groceries
    }
    const profit = Math.max(0, total - cost);
    const margin = total > 0 ? Math.round((profit / total) * 100) : 0;
    return { cost, profit, margin, total };
  };

  // Group transactions by Month & calculate totals
  const { monthlyMap, monthlyList, yearSummary, availableYears } = useMemo(() => {
    const mMap = {};
    const yearsSet = new Set();
    let yBills = 0;
    let ySales = 0;
    let yInvested = 0;
    let yProfit = 0;

    transactions.forEach(t => {
      const d = new Date(t.createdAt);
      if (isNaN(d.getTime())) return;
      const y = String(d.getFullYear());
      yearsSet.add(y);

      const mKey = `${y}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!mMap[mKey]) {
        mMap[mKey] = {
          key: mKey,
          year: y,
          monthNumber: d.getMonth() + 1,
          monthName: d.toLocaleString('en-IN', { month: 'short' }),
          fullMonthName: d.toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
          billsCount: 0,
          salesTotal: 0,
          investedTotal: 0,
          profitTotal: 0,
          paidTotal: 0,
          pendingTotal: 0
        };
      }

      const f = getTxFinancials(t);
      mMap[mKey].billsCount += 1;
      mMap[mKey].salesTotal += f.total;
      mMap[mKey].investedTotal += f.cost;
      mMap[mKey].profitTotal += f.profit;
      mMap[mKey].paidTotal += (Number(t.paid) || 0);
      mMap[mKey].pendingTotal += (Number(t.pending) || 0);

      if (y === selectedYear) {
        yBills += 1;
        ySales += f.total;
        yInvested += f.cost;
        yProfit += f.profit;
      }
    });

    const mList = Object.values(mMap).sort((a, b) => b.key.localeCompare(a.key));
    const yMargin = ySales > 0 ? Math.round((yProfit / ySales) * 100) : 0;

    return {
      monthlyMap: mMap,
      monthlyList: mList,
      yearSummary: {
        bills: yBills,
        sales: ySales,
        invested: yInvested,
        profit: yProfit,
        margin: yMargin
      },
      availableYears: Array.from(yearsSet)
    };
  }, [transactions, products, selectedYear]);

  // Active Month Data for the Month Pill
  const activeMonthData = useMemo(() => {
    if (selectedMonth === 'all') {
      return {
        label: `${selectedYear} Entire Year`,
        bills: yearSummary.bills,
        sales: yearSummary.sales,
        invested: yearSummary.invested,
        profit: yearSummary.profit,
        margin: yearSummary.margin
      };
    }
    const data = monthlyMap[selectedMonth];
    if (data) {
      const margin = data.salesTotal > 0 ? Math.round((data.profitTotal / data.salesTotal) * 100) : 0;
      return {
        label: data.fullMonthName,
        bills: data.billsCount,
        sales: data.salesTotal,
        invested: data.investedTotal,
        profit: data.profitTotal,
        margin
      };
    }
    return {
      label: selectedMonth,
      bills: 0,
      sales: 0,
      invested: 0,
      profit: 0,
      margin: 0
    };
  }, [selectedMonth, monthlyMap, yearSummary, selectedYear]);

  // Filtered transactions for the table
  const filteredTransactions = transactions.filter(t => {
    // 1. Text search
    const matchesSearch = 
      t.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.productName.toLowerCase().includes(search.toLowerCase());

    // 2. Status filter
    const matchesStatus = statusFilter === 'all' || t.paymentStatus === statusFilter;

    // 3. Month filter
    let matchesMonth = true;
    if (selectedMonth !== 'all') {
      const d = new Date(t.createdAt);
      const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      matchesMonth = mKey === selectedMonth;
    }

    return matchesSearch && matchesStatus && matchesMonth;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* ============================================================== */}
      {/* 1. TOP FINANCIAL HIGHLIGHTS: YEAR TOTAL BILL & MONTH PILL       */}
      {/* ============================================================== */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '18px'
      }}>
        
        {/* YEAR TOTAL BILL CARD */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#eef2ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #c7d2fe'
                }}>
                  <Calendar size={18} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {activeLang === 'ta' ? 'வருடாந்திர ரசீதுகள்' : 'Annual Ledger'}
                  </span>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                    {selectedYear} {activeLang === 'ta' ? 'ஆண்டு மொத்த ரசீதுகள்' : 'Year Total Bills'}
                  </h4>
                </div>
              </div>

              {/* Year Selector Pill */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {availableYears.length > 0 ? (
                  availableYears.map(y => (
                    <option key={y} value={y}>{y} Annual</option>
                  ))
                ) : (
                  <option value="2026">2026 Annual</option>
                )}
              </select>
            </div>

            {/* Total Bills Big Counter & Billed Amount */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '10px' }}>
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.02em' }}>
                {yearSummary.bills} <span style={{ fontSize: '16px', fontWeight: '700', color: '#64748b' }}>{activeLang === 'ta' ? 'ரசீதுகள்' : 'Bills'}</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#4f46e5' }}>
                {currency}{yearSummary.sales.toLocaleString('en-IN')} {activeLang === 'ta' ? 'மொத்த விற்பனை' : 'Total Billed'}
              </div>
            </div>
          </div>

          {/* Year Invested & Profit Sub-Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid #f1f5f9',
            flexWrap: 'wrap'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              fontSize: '12px',
              fontWeight: '700',
              border: '1px solid #bfdbfe'
            }}>
              <span>💼 Invested: {currency}{yearSummary.invested.toLocaleString('en-IN')}</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              fontSize: '12px',
              fontWeight: '700',
              border: '1px solid #a7f3d0'
            }}>
              <TrendingUp size={13} />
              <span>Profit: +{currency}{yearSummary.profit.toLocaleString('en-IN')} (+{yearSummary.margin}%)</span>
            </div>
          </div>
        </div>

        {/* MONTH PILL: TOTAL INVESTED & PROFIT */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #059669',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.1)',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #a7f3d0'
                }}>
                  <Coins size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {activeLang === 'ta' ? 'மாதாந்திர நிதி விவரம்' : 'Monthly Financial Capsule'}
                  </span>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                    {activeMonthData.label}
                  </h4>
                </div>
              </div>

              {/* Month Quick Selector Dropdown */}
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid #10b981',
                  backgroundColor: '#ffffff',
                  color: '#065f46',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="all">All Months Combined</option>
                {monthlyList.map(m => (
                  <option key={m.key} value={m.key}>{m.fullMonthName}</option>
                ))}
              </select>
            </div>

            {/* Total Invested & Profit Large Displays */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              marginTop: '12px'
            }}>
              {/* Total Invested */}
              <div style={{
                backgroundColor: 'rgba(239, 246, 255, 0.7)',
                border: '1px solid #bfdbfe',
                borderRadius: '12px',
                padding: '10px 14px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase' }}>
                  {activeLang === 'ta' ? 'மொத்த முதலீடு' : 'Total Invested'}
                </span>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#1e3a8a', marginTop: '2px' }}>
                  {currency}{activeMonthData.invested.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '2px' }}>
                  Cost of Goods Sold
                </div>
              </div>

              {/* Profit */}
              <div style={{
                backgroundColor: 'rgba(236, 253, 245, 0.9)',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '10px 14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#065f46', textTransform: 'uppercase' }}>
                    {activeLang === 'ta' ? 'நிகர லாபம்' : 'Net Profit'}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    padding: '1px 6px',
                    borderRadius: '8px'
                  }}>
                    +{activeMonthData.margin}%
                  </span>
                </div>
                <div style={{ fontSize: '22px', fontWeight: '800', color: '#047857', marginTop: '2px' }}>
                  +{currency}{activeMonthData.profit.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '11px', color: '#059669', marginTop: '2px' }}>
                  Revenue minus Wholesale Cost
                </div>
              </div>
            </div>
          </div>

          {/* Month Sub-Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '14px',
            fontSize: '12px',
            color: '#64748b'
          }}>
            <span>{activeMonthData.bills} {activeLang === 'ta' ? 'ரசீதுகள்' : 'Bills Generated'}</span>
            <span style={{ fontWeight: '700', color: '#0f172a' }}>
              Sales: {currency}{activeMonthData.sales.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 2. MONTHLY INVESTED & PROFIT FOR EACH MONTH (PILLS & LEDGER)    */}
      {/* ============================================================== */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '18px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="#059669" />
              <span>{activeLang === 'ta' ? 'ஒவ்வொரு மாதத்தின் முதலீடு மற்றும் லாபம்' : 'Monthly Invested & Profit for Each Month'}</span>
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
              {activeLang === 'ta' ? 'தேர்ந்தெடுக்கப்பட்ட மாதத்தின் விற்பனை ரசீதுகளைக் காண கிளிக் செய்யவும்' : 'Click any month pill below to inspect its invested cost, net profit, and bills'}
            </p>
          </div>

          <button
            onClick={() => setShowLedgerTable(!showLedgerTable)}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            <BarChart2 size={14} />
            <span>{showLedgerTable ? 'Hide Table View' : 'Show Full Monthly Table'}</span>
          </button>
        </div>

        {/* Scrollable Month Pills Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '6px'
        }}>
          {/* All Months Pill */}
          <button
            onClick={() => setSelectedMonth('all')}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: selectedMonth === 'all' ? '2px solid #059669' : '1px solid #e2e8f0',
              backgroundColor: selectedMonth === 'all' ? '#ecfdf5' : '#f8fafc',
              color: selectedMonth === 'all' ? '#065f46' : '#475569',
              fontWeight: '700',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '4px',
              minWidth: '150px',
              boxShadow: selectedMonth === 'all' ? '0 4px 12px rgba(5, 150, 105, 0.15)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontWeight: '800', fontSize: '13px' }}>All Months ({selectedYear})</span>
              <span style={{ fontSize: '11px', padding: '1px 6px', borderRadius: '10px', backgroundColor: '#ffffff' }}>
                {yearSummary.bills} Bills
              </span>
            </div>
            <div style={{ fontSize: '11px', display: 'flex', gap: '8px', width: '100%' }}>
              <span style={{ color: '#2563eb' }}>Cost: {currency}{yearSummary.invested.toLocaleString('en-IN')}</span>
              <span style={{ color: '#059669', fontWeight: '800' }}>+{currency}{yearSummary.profit.toLocaleString('en-IN')}</span>
            </div>
          </button>

          {/* Each Individual Month Pill */}
          {monthlyList.map((m) => {
            const isSelected = selectedMonth === m.key;
            const margin = m.salesTotal > 0 ? Math.round((m.profitTotal / m.salesTotal) * 100) : 0;

            return (
              <button
                key={m.key}
                onClick={() => setSelectedMonth(m.key)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #059669' : '1px solid #e2e8f0',
                  backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                  color: isSelected ? '#065f46' : '#1e293b',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '4px',
                  minWidth: '175px',
                  boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.2)' : '0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: '800', fontSize: '13px', color: isSelected ? '#065f46' : '#0f172a' }}>
                    📅 {m.fullMonthName}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#a7f3d0' : '#f1f5f9',
                    color: isSelected ? '#064e3b' : '#64748b'
                  }}>
                    {m.billsCount} Bills
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', fontSize: '11px', marginTop: '2px' }}>
                  <span style={{ color: '#2563eb', fontWeight: '600' }}>
                    Invest: {currency}{m.investedTotal.toLocaleString('en-IN')}
                  </span>
                  <span style={{ color: '#059669', fontWeight: '800' }}>
                    Profit: +{currency}{m.profitTotal.toLocaleString('en-IN')} <span style={{ fontSize: '9px' }}>({margin}%)</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Full Monthly Ledger Table (Collapsible) */}
        {showLedgerTable && (
          <div style={{
            marginTop: '8px',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <table className="data-table" style={{ margin: 0 }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th>Month</th>
                  <th>Total Bills</th>
                  <th>Total Sales (Billed)</th>
                  <th>Total Invested (Cost)</th>
                  <th>Net Profit</th>
                  <th>Profit Margin</th>
                  <th>Paid Collections</th>
                  <th>Pending Dues</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {monthlyList.map(m => {
                  const margin = m.salesTotal > 0 ? Math.round((m.profitTotal / m.salesTotal) * 100) : 0;
                  const isSelected = selectedMonth === m.key;

                  return (
                    <tr 
                      key={m.key} 
                      style={{ 
                        backgroundColor: isSelected ? '#f0fdf4' : 'transparent',
                        fontWeight: isSelected ? '700' : 'normal'
                      }}
                    >
                      <td>
                        <span style={{ fontWeight: '800', color: '#0f172a' }}>{m.fullMonthName}</span>
                      </td>
                      <td>
                        <span className="badge badge-slate">{m.billsCount} Invoices</span>
                      </td>
                      <td style={{ fontWeight: '700', color: '#0f172a' }}>
                        {currency}{m.salesTotal.toLocaleString('en-IN')}
                      </td>
                      <td style={{ color: '#2563eb', fontWeight: '600' }}>
                        {currency}{m.investedTotal.toLocaleString('en-IN')}
                      </td>
                      <td style={{ color: '#059669', fontWeight: '800' }}>
                        +{currency}{m.profitTotal.toLocaleString('en-IN')}
                      </td>
                      <td>
                        <span className="badge badge-success">+{margin}%</span>
                      </td>
                      <td style={{ color: '#059669', fontWeight: '600' }}>
                        {currency}{m.paidTotal.toLocaleString('en-IN')}
                      </td>
                      <td style={{ color: m.pendingTotal > 0 ? '#dc2626' : '#64748b', fontWeight: m.pendingTotal > 0 ? '700' : 'normal' }}>
                        {currency}{m.pendingTotal.toLocaleString('en-IN')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedMonth(m.key)}
                          className="btn btn-secondary"
                          style={{
                            padding: '4px 10px',
                            fontSize: '11px',
                            backgroundColor: isSelected ? '#059669' : '#ffffff',
                            color: isSelected ? '#ffffff' : '#0f172a'
                          }}
                        >
                          {isSelected ? '✓ Filtered' : 'Filter Bills'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 3. SEARCH & STATUS FILTER ROW                                   */}
      {/* ============================================================== */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px', maxWidth: '500px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder={activeLang === 'ta' ? 'ரசீது எண், வாடிக்கையாளர் அல்லது பொருளைத் தேடுக...' : 'Search by invoice #, customer, or product...'}
              className="input-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px', border: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: statusFilter === 'all' ? '700' : '500',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: statusFilter === 'all' ? '#ffffff' : 'transparent',
                color: statusFilter === 'all' ? '#0f172a' : '#64748b'
              }}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: statusFilter === 'paid' ? '700' : '500',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: statusFilter === 'paid' ? '#ffffff' : 'transparent',
                color: statusFilter === 'paid' ? '#059669' : '#64748b'
              }}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: statusFilter === 'pending' ? '700' : '500',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: statusFilter === 'pending' ? '#ffffff' : 'transparent',
                color: statusFilter === 'pending' ? '#d97706' : '#64748b'
              }}
            >
              Pending Dues
            </button>
          </div>
        </div>

        {/* Active Filter Indicator Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Showing <strong>{filteredTransactions.length}</strong> invoices for{' '}
            <strong style={{ color: '#059669' }}>{activeMonthData.label}</strong>
          </span>
          {selectedMonth !== 'all' && (
            <button
              onClick={() => setSelectedMonth('all')}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '6px',
                padding: '3px 8px',
                fontSize: '11px',
                fontWeight: '600',
                color: '#64748b',
                cursor: 'pointer'
              }}
            >
              Clear Month
            </button>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. TRANSACTIONS & SALES TABLE (WITH INVESTED & PROFIT COLUMNS)  */}
      {/* ============================================================== */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>{activeLang === 'ta' ? 'ரசீது எண்' : 'Invoice #'}</th>
              <th>{activeLang === 'ta' ? 'தேதி' : 'Date & Time'}</th>
              <th>{activeLang === 'ta' ? 'வாடிக்கையாளர்' : 'Customer'}</th>
              <th>{activeLang === 'ta' ? 'பொருள்' : 'Product Item'}</th>
              <th>{activeLang === 'ta' ? 'அளவு' : 'Quantity'}</th>
              <th>{activeLang === 'ta' ? 'மொத்த தொகை' : 'Total Bill'}</th>
              <th>{activeLang === 'ta' ? 'முதலீடு (அடக்கம்)' : 'Invested (Cost)'}</th>
              <th>{activeLang === 'ta' ? 'லாபம்' : 'Net Profit'}</th>
              <th>{activeLang === 'ta' ? 'செலுத்தியது' : 'Paid'}</th>
              <th>{activeLang === 'ta' ? 'பாக்கி' : 'Pending'}</th>
              <th>{activeLang === 'ta' ? 'முறை' : 'Mode'}</th>
              <th>{activeLang === 'ta' ? 'நிலை' : 'Status'}</th>
              <th style={{ textAlign: 'right' }}>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => {
              const f = getTxFinancials(tx);

              return (
                <tr key={tx._id || tx.invoiceNumber}>
                  <td style={{ fontWeight: '700', color: '#0f172a' }}>
                    {tx.invoiceNumber}
                  </td>
                  <td style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: '#0f172a' }}>{tx.customerName}</span>
                  </td>
                  <td>
                    {tx.productName}
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {tx.quantity} {tx.unit}
                  </td>
                  <td style={{ fontWeight: '800', color: '#0f172a' }}>
                    {currency}{tx.total}
                  </td>

                  {/* Invested Cost */}
                  <td style={{ color: '#2563eb', fontWeight: '700' }}>
                    {currency}{f.cost}
                  </td>

                  {/* Net Profit */}
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#059669',
                      fontWeight: '800',
                      fontSize: '13px'
                    }}>
                      +{currency}{f.profit}
                      <span style={{ fontSize: '10px', backgroundColor: '#ecfdf5', color: '#059669', padding: '1px 5px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                        +{f.margin}%
                      </span>
                    </span>
                  </td>

                  <td style={{ color: '#059669', fontWeight: '600' }}>
                    {currency}{tx.paid}
                  </td>
                  <td style={{ color: tx.pending > 0 ? '#dc2626' : '#059669', fontWeight: '700' }}>
                    {currency}{tx.pending}
                  </td>
                  <td>
                    {tx.inputMethod === 'voice' ? (
                      <span className="badge badge-success" style={{ fontSize: '10px' }}>
                        <Mic size={10} /> Voice AI
                      </span>
                    ) : (
                      <span className="badge badge-slate" style={{ fontSize: '10px' }}>
                        Manual
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${tx.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                      {tx.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="btn btn-secondary"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                      title="View & Print Invoice Receipt"
                    >
                      <FileText size={13} />
                      <span>Bill</span>
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="13" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <Receipt size={32} style={{ margin: '0 auto 10px auto', opacity: 0.4 }} />
                  <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>
                    No invoices found for this search/month selection.
                  </div>
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    <button 
                      onClick={() => { setSelectedMonth('all'); setStatusFilter('all'); setSearch(''); }}
                      className="btn btn-secondary"
                      style={{ fontSize: '12px' }}
                    >
                      Show All 2026 Invoices
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ============================================================== */}
      {/* 5. INVOICE RECEIPT MODAL                                        */}
      {/* ============================================================== */}
      {selectedTx && (
        <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px dashed #cbd5e1',
              backgroundColor: '#f8fafc',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                {business?.name || 'Murugan Maligai'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {business?.address} · Ph: {business?.phone}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                GSTIN: {business?.gstin}
              </div>
              <div style={{
                marginTop: '12px',
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: '700'
              }}>
                Tax Invoice: {selectedTx.invoiceNumber}
              </div>
            </div>

            <div style={{ padding: '24px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Customer:</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>{selectedTx.customerName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Date & Time:</span>
                <span>{new Date(selectedTx.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ color: '#64748b' }}>Recorded By:</span>
                <span style={{ fontWeight: '600', color: '#059669' }}>VoiceBiz AI (Voice Command)</span>
              </div>

              {selectedTx.voiceTranscript && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#475569',
                  fontStyle: 'italic',
                  marginBottom: '16px'
                }}>
                  "{selectedTx.voiceTranscript}"
                </div>
              )}

              {/* Items bill */}
              <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '12px 0', margin: '14px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', marginBottom: '6px' }}>
                  <span>{selectedTx.productName} ({selectedTx.quantity} {selectedTx.unit} @ {currency}{selectedTx.unitPrice})</span>
                  <span>{currency}{selectedTx.total}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '800', marginBottom: '6px' }}>
                <span>Total Bill Amount:</span>
                <span>{currency}{selectedTx.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', marginBottom: '4px' }}>
                <span>Amount Paid:</span>
                <span>{currency}{selectedTx.paid}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: selectedTx.pending > 0 ? '#dc2626' : '#059669', fontWeight: '700', marginBottom: '10px' }}>
                <span>Balance Due:</span>
                <span>{currency}{selectedTx.pending}</span>
              </div>

              {/* Financial investment & profit breakdown on bill */}
              {(() => {
                const f = getTxFinancials(selectedTx);
                return (
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    border: '1px solid #e2e8f0',
                    marginTop: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                      <span>Wholesale Invested Cost:</span>
                      <span style={{ color: '#2563eb', fontWeight: '700' }}>{currency}{f.cost}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#059669', fontWeight: '800' }}>
                      <span>Store Net Profit:</span>
                      <span>+{currency}{f.profit} (+{f.margin}%)</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedTx(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="btn btn-primary"
              >
                <Printer size={15} />
                <span>Print Bill</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
