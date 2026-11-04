import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  CreditCard, 
  Download, 
  CheckCircle2, 
  AlertTriangle,
  Coins,
  Calendar,
  Layers,
  PieChart
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export default function Reports() {
  const { stats, products, customers, transactions, business, activeLang } = useBusiness();
  const currency = business?.currency || '₹';

  const currentMonthKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }, []);

  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [selectedYear, setSelectedYear] = useState('2026');

  // Transaction Financials Helper
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
      cost = Math.round(total * 0.75);
    }
    const profit = Math.max(0, total - cost);
    const margin = total > 0 ? Math.round((profit / total) * 100) : 0;
    return { cost, profit, margin, total };
  };

  // Group transactions by month
  const { monthlyMap, monthlyList, yearSummary } = useMemo(() => {
    const mMap = {};
    let yBills = 0;
    let ySales = 0;
    let yInvested = 0;
    let yProfit = 0;

    transactions.forEach(t => {
      const d = new Date(t.createdAt);
      if (isNaN(d.getTime())) return;
      const y = String(d.getFullYear());
      const mKey = `${y}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      if (!mMap[mKey]) {
        mMap[mKey] = {
          key: mKey,
          year: y,
          monthName: d.toLocaleString('en-IN', { month: 'short' }),
          fullMonthName: d.toLocaleString('en-IN', { month: 'long', year: 'numeric' }),
          billsCount: 0,
          salesTotal: 0,
          investedTotal: 0,
          profitTotal: 0
        };
      }

      const f = getTxFinancials(t);
      mMap[mKey].billsCount += 1;
      mMap[mKey].salesTotal += f.total;
      mMap[mKey].investedTotal += f.cost;
      mMap[mKey].profitTotal += f.profit;

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
      }
    };
  }, [transactions, products, selectedYear]);

  // Active Month Data for Month Pill
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

  // Aggregate Sales Calculation
  const totalRevenue = transactions.reduce((acc, t) => acc + (Number(t.total) || 0), 0);
  const totalPaid = transactions.reduce((acc, t) => acc + (Number(t.paid) || 0), 0);
  const totalPending = transactions.reduce((acc, t) => acc + (Number(t.pending) || 0), 0);

  // Top selling products by frequency
  const productSalesMap = {};
  transactions.forEach(t => {
    productSalesMap[t.productName] = (productSalesMap[t.productName] || 0) + Number(t.total);
  });

  const sortedTopProducts = Object.entries(productSalesMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header with Export */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            {activeLang === 'ta' ? 'வணிக பகுப்பாய்வு மற்றும் லாப அறிக்கைகள்' : 'Business Insights & Financial Reports'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
            {activeLang === 'ta' ? 'வருடாந்திர ரசீதுகள், மாதாந்திர முதலீடு மற்றும் லாப பகுப்பாய்வு' : 'Yearly total bills, monthly invested capital, and net profit ledger'}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="btn btn-secondary"
          style={{ fontSize: '13px' }}
        >
          <Download size={15} />
          <span>Export / Print Report</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 1. TOP HIGHLIGHTS: YEAR TOTAL BILL & ACTIVE MONTH PILL          */}
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
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)'
        }}>
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
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase' }}>
                  Annual Summary
                </span>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  {selectedYear} Year Total Bills
                </h4>
              </div>
            </div>

            <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '10px', backgroundColor: '#eef2ff', color: '#4338ca' }}>
              {yearSummary.bills} Invoices
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '10px' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a' }}>
              {yearSummary.bills} Bills
            </div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#4f46e5' }}>
              {currency}{yearSummary.sales.toLocaleString('en-IN')} Total Billed
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#1d4ed8', backgroundColor: '#eff6ff', padding: '3px 10px', borderRadius: '14px' }}>
              💼 Invested: {currency}{yearSummary.invested.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#059669', backgroundColor: '#ecfdf5', padding: '3px 10px', borderRadius: '14px' }}>
              📈 Profit: +{currency}{yearSummary.profit.toLocaleString('en-IN')} (+{yearSummary.margin}%)
            </span>
          </div>
        </div>

        {/* MONTH PILL: TOTAL INVESTED & PROFIT */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #059669',
          padding: '20px 24px',
          boxShadow: '0 6px 20px rgba(5, 150, 105, 0.1)',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)'
        }}>
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
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>
                  Month Capsule
                </span>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                  {activeMonthData.label}
                </h4>
              </div>
            </div>

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
                cursor: 'pointer'
              }}
            >
              <option value="all">All Months</option>
              {monthlyList.map(m => (
                <option key={m.key} value={m.key}>{m.fullMonthName}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginTop: '10px' }}>
            <div style={{ backgroundColor: 'rgba(239, 246, 255, 0.7)', borderRadius: '10px', padding: '10px 12px', border: '1px solid #bfdbfe' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#1e40af', textTransform: 'uppercase' }}>Total Invested</span>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#1e3a8a', marginTop: '2px' }}>
                {currency}{activeMonthData.invested.toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(236, 253, 245, 0.9)', borderRadius: '10px', padding: '10px 12px', border: '1px solid #a7f3d0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#065f46', textTransform: 'uppercase' }}>Net Profit</span>
                <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#059669', color: '#fff', padding: '1px 5px', borderRadius: '6px' }}>
                  +{activeMonthData.margin}%
                </span>
              </div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#047857', marginTop: '2px' }}>
                +{currency}{activeMonthData.profit.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MONTHLY INVESTED & PROFIT FOR EACH MONTH STRIP              */}
      {/* ============================================================== */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '18px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#059669" />
            <span>Monthly Invested & Profit for Each Month</span>
          </h4>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Click any month to set active month capsule
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {monthlyList.map((m) => {
            const isSelected = selectedMonth === m.key;
            const margin = m.salesTotal > 0 ? Math.round((m.profitTotal / m.salesTotal) * 100) : 0;

            return (
              <button
                key={m.key}
                onClick={() => setSelectedMonth(m.key)}
                style={{
                  padding: '10px 14px',
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
                  gap: '3px',
                  minWidth: '160px',
                  boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.15)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <span style={{ fontWeight: '800', color: isSelected ? '#065f46' : '#0f172a' }}>
                    {m.fullMonthName}
                  </span>
                  <span style={{ fontSize: '10px', backgroundColor: isSelected ? '#a7f3d0' : '#f1f5f9', padding: '1px 5px', borderRadius: '6px' }}>
                    {m.billsCount}b
                  </span>
                </div>
                <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '2px' }}>
                  <span style={{ color: '#2563eb' }}>Cost: {currency}{m.investedTotal.toLocaleString('en-IN')}</span>
                  <span style={{ color: '#059669', fontWeight: '800' }}>+{currency}{m.profitTotal.toLocaleString('en-IN')}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px'
      }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            Total Invoiced Sales
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>
            {currency}{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}>
            From {transactions.length} orders recorded
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            Cash / UPI Collected
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#059669', marginTop: '6px' }}>
            {currency}{totalPaid.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {totalRevenue > 0 ? Math.round((totalPaid / totalRevenue) * 100) : 0}% collection rate
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            Outstanding Credit (Khata)
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#d97706', marginTop: '6px' }}>
            {currency}{totalPending.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: '#b45309', marginTop: '4px' }}>
            Pending from customers
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
            Inventory Asset Value
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb', marginTop: '6px' }}>
            {currency}{stats?.totalInventoryValue?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Across {products.length} stock items
          </div>
        </div>
      </div>

      {/* Grid: Top Selling Products + Khata Aging */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        {/* Top Selling Products */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
            Top Revenue Generating Products
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {sortedTopProducts.length > 0 ? (
              sortedTopProducts.map(([name, amount], idx) => {
                const percent = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                      <span style={{ color: '#0f172a' }}>{idx + 1}. {name}</span>
                      <span style={{ color: '#059669', fontWeight: '700' }}>{currency}{amount} ({percent}%)</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${percent}%`, backgroundColor: '#059669', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                No sales recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Customer Balance Concentration */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '16px' }}>
            Pending Khata Dues by Customer
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {customers.filter(c => Number(c.pendingBalance) > 0).length > 0 ? (
              customers
                .filter(c => Number(c.pendingBalance) > 0)
                .sort((a, b) => b.pendingBalance - a.pendingBalance)
                .map((cust) => (
                  <div
                    key={cust._id || cust.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '14px', color: '#0f172a' }}>
                        {cust.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Phone: {cust.phone || 'N/A'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: '#dc2626' }}>
                        {currency}{cust.pendingBalance}
                      </div>
                      <span style={{ fontSize: '11px', color: '#b91c1c' }}>
                        Pending
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#059669', fontSize: '13px' }}>
                <CheckCircle2 size={24} style={{ margin: '0 auto 8px auto', display: 'block' }} />
                All customer balances are fully settled! No pending dues.
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
