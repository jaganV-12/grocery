import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  CreditCard, 
  Mic, 
  PlusCircle, 
  UserPlus, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  RotateCcw,
  PackageX,
  ExternalLink
} from 'lucide-react';
import StatCard from '../components/StatCard';
import StockAlertModal from '../components/StockAlertModal';
import { useBusiness } from '../context/BusinessContext';
import api from '../services/api';

export default function Dashboard({ setActiveTab }) {
  const { stats, products, business, activeLang, refreshAll, showToast, setInventoryStockFilter } = useBusiness();
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState('out_of_stock');

  // Separated stock groups
  const outOfStockProducts = products.filter(p => Number(p.stock) <= 0);
  const lowStockProducts = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.minimumStock));
  const totalAlertCount = outOfStockProducts.length + lowStockProducts.length;

  const handleOpenStockModal = (tab = 'out_of_stock') => {
    setModalInitialTab(tab);
    setIsStockModalOpen(true);
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset all demo data back to default sample records?')) {
      try {
        await api.resetDemoData();
        await refreshAll();
        showToast('Sample demo data reset successfully');
      } catch (err) {
        showToast('Failed to reset demo data: ' + err.message, 'error');
      }
    }
  };

  const currency = business?.currency || '₹';

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)'
      }}>
        <div style={{ maxWidth: '620px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.18)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>
            <Sparkles size={13} />
            <span>{activeLang === 'ta' ? 'வணிக மேலாண்மை முகப்பு' : 'AI-Powered Business Suite'}</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {business?.name || 'Murugan Maligai'}
          </h2>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '14px', lineHeight: 1.6 }}>
            {activeLang === 'ta' 
              ? 'தமிழ் மற்றும் ஆங்கில குரல் கட்டளைகள் மூலம் விற்பனை, இருப்பு மற்றும் வாடிக்கையாளர் கடன் பாக்கியை எளிதாக நிர்வகிக்கவும்.' 
              : 'Record sales, manage inventory, and track pending customer payments in seconds using Tamil and English voice commands.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('voice')}
            className="btn"
            style={{
              backgroundColor: '#ffffff',
              color: '#065f46',
              fontWeight: '700',
              padding: '12px 20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Mic size={18} color="#059669" />
            <span>{activeLang === 'ta' ? 'புதிய குரல் விற்பனை' : 'New Voice Sale'}</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="btn"
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '12px 16px'
            }}
            title="Reset sample data"
          >
            <RotateCcw size={16} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {/* Today's Sales */}
        <StatCard
          title={activeLang === 'ta' ? "இன்றைய விற்பனை" : "Today's Sales"}
          value={`${currency}${stats?.todaySales?.toLocaleString('en-IN') || 0}`}
          subtitle={activeLang === 'ta' ? `${stats?.todayOrdersCount || 0} விற்பனைகள் செய்யப்பட்டன` : `${stats?.todayOrdersCount || 0} completed orders today`}
          icon={TrendingUp}
          color="emerald"
          badgeText={activeLang === 'ta' ? 'நேரலை' : 'Live'}
          onClick={() => setActiveTab('payments')}
        />

        {/* Total Pending Payments */}
        <StatCard
          title={activeLang === 'ta' ? "மொத்த கடன் பாக்கி" : "Total Pending Payments"}
          value={`${currency}${stats?.totalPendingPayments?.toLocaleString('en-IN') || 0}`}
          subtitle={activeLang === 'ta' ? "வாடிக்கையாளர் நிலுவைத் தொகை" : "Outstanding customer balances"}
          icon={CreditCard}
          color="amber"
          badgeText={stats?.totalPendingPayments > 0 ? (activeLang === 'ta' ? 'வசூலிக்கவும்' : 'Collect') : 'All Clear'}
          onClick={() => setActiveTab('customers')}
        />

        {/* Total Inventory Value */}
        <StatCard
          title={activeLang === 'ta' ? "சரக்கு மதிப்பு" : "Total Inventory Value"}
          value={`${currency}${stats?.totalInventoryValue?.toLocaleString('en-IN') || 0}`}
          subtitle={activeLang === 'ta' ? `${stats?.totalProductsCount || 0} பொருட்கள் இருப்பில் உள்ளன` : `Across ${stats?.totalProductsCount || 0} catalog products`}
          icon={Package}
          color="blue"
          onClick={() => setActiveTab('inventory')}
        />

        {/* Low Stock & Out of Stock Alerts (Strictly Separated) */}
        <StatCard
          title={activeLang === 'ta' ? "இருப்பு எச்சரிக்கை" : "Stock Health Alerts"}
          value={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {outOfStockProducts.length > 0 && (
                <span style={{ color: '#dc2626', fontSize: '22px', fontWeight: '800' }}>
                  {outOfStockProducts.length} <span style={{ fontSize: '13px', fontWeight: '700' }}>Out</span>
                </span>
              )}
              {outOfStockProducts.length > 0 && lowStockProducts.length > 0 && (
                <span style={{ color: '#cbd5e1', fontWeight: '400' }}>•</span>
              )}
              {lowStockProducts.length > 0 && (
                <span style={{ color: '#d97706', fontSize: '22px', fontWeight: '800' }}>
                  {lowStockProducts.length} <span style={{ fontSize: '13px', fontWeight: '700' }}>Low</span>
                </span>
              )}
              {totalAlertCount === 0 && (
                <span style={{ color: '#059669', fontSize: '20px', fontWeight: '800' }}>
                  {activeLang === 'ta' ? 'அனைத்தும் உள்ளன' : 'All In Stock'}
                </span>
              )}
            </div>
          }
          subtitle={
            totalAlertCount > 0 ? (
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                {outOfStockProducts.length > 0 && (
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      setInventoryStockFilter('out_of_stock');
                      setActiveTab('inventory');
                    }}
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: '#dc2626',
                      backgroundColor: '#fee2e2',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: '1px solid #fecaca'
                    }}
                    title="Filter Out of Stock"
                  >
                    🔴 {outOfStockProducts.length} Out of Stock
                  </span>
                )}
                {lowStockProducts.length > 0 && (
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      setInventoryStockFilter('low_stock');
                      setActiveTab('inventory');
                    }}
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: '#b45309',
                      backgroundColor: '#fef3c7',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: '1px solid #fde68a'
                    }}
                    title="Filter Low Stock"
                  >
                    🟡 {lowStockProducts.length} Low Stock
                  </span>
                )}
              </div>
            ) : (
              activeLang === 'ta' ? "சரக்கு இருப்பு திருப்திகரமாக உள்ளது" : "Healthy stock levels across catalog"
            )
          }
          icon={outOfStockProducts.length > 0 ? PackageX : AlertTriangle}
          color={outOfStockProducts.length > 0 ? "rose" : (lowStockProducts.length > 0 ? "amber" : "emerald")}
          badgeText={outOfStockProducts.length > 0 ? "🚨 0 In Stock" : (lowStockProducts.length > 0 ? "Reorder Soon" : "Healthy")}
          onClick={() => handleOpenStockModal(outOfStockProducts.length > 0 ? 'out_of_stock' : 'low_stock')}
        />
      </div>

      {/* 1. SEPARATE OUT OF STOCK BANNER (CRITICAL) */}
      {outOfStockProducts.length > 0 && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '14px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #fca5a5'
            }}>
              <PackageX size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{activeLang === 'ta' ? 'முற்றிலும் தீர்ந்த பொருட்கள் எச்சரிக்கை!' : 'Out of Stock Alert! (0 Available)'}</span>
                <span style={{ fontSize: '11px', backgroundColor: '#dc2626', color: '#fff', padding: '1px 8px', borderRadius: '10px' }}>
                  {outOfStockProducts.length} {activeLang === 'ta' ? 'பொருட்கள்' : 'items'}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#b91c1c', marginTop: '2px', fontWeight: '500' }}>
                {outOfStockProducts.map(p => p.name).join(', ')} — {activeLang === 'ta' ? 'வாடிக்கையாளர்களுக்கு விற்க உடனே மறுஇருப்பு செய்க.' : 'Completely empty! Customers cannot purchase until restocked.'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => handleOpenStockModal('out_of_stock')}
              className="btn btn-primary"
              style={{
                fontSize: '12px',
                padding: '8px 16px',
                backgroundColor: '#dc2626',
                borderColor: '#b91c1c',
                boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)'
              }}
            >
              <span>+ Quick Restock</span>
            </button>

            <button
              onClick={() => {
                setInventoryStockFilter('out_of_stock');
                setActiveTab('inventory');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 14px', borderColor: '#fca5a5', color: '#991b1b', backgroundColor: '#ffffff' }}
            >
              <span>{activeLang === 'ta' ? 'தீர்ந்தவை மட்டும் காண்க' : 'View Out of Stock Only'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 2. SEPARATE LOW STOCK BANNER (WARNING) */}
      {lowStockProducts.length > 0 && (
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '14px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #fde68a'
            }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#92400e', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{activeLang === 'ta' ? 'குறைந்த இருப்பு எச்சரிக்கை!' : 'Low Stock Warning! (Running Low)'}</span>
                <span style={{ fontSize: '11px', backgroundColor: '#d97706', color: '#fff', padding: '1px 8px', borderRadius: '10px' }}>
                  {lowStockProducts.length} {activeLang === 'ta' ? 'பொருட்கள்' : 'items'}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#b45309', marginTop: '2px' }}>
                {lowStockProducts.map(p => `${p.name} (${p.stock} ${p.unit} left)`).join(', ')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => handleOpenStockModal('low_stock')}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 14px', borderColor: '#fde68a', color: '#92400e', backgroundColor: '#ffffff' }}
            >
              <span>+ Quick Add</span>
            </button>

            <button
              onClick={() => {
                setInventoryStockFilter('low_stock');
                setActiveTab('inventory');
              }}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '8px 14px', borderColor: '#fde68a', color: '#92400e', backgroundColor: '#ffffff' }}
            >
              <span>{activeLang === 'ta' ? 'குறைந்தவை மட்டும் காண்க' : 'View Low Stock Only'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Recent Transactions + Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '24px'
      }}>
        
        {/* Recent Transactions Card */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {activeLang === 'ta' ? 'சமீபத்திய பரிவர்த்தனைகள்' : 'Recent Transactions'}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                {activeLang === 'ta' ? 'கடைசியாக பதிவு செய்யப்பட்ட விற்பனைகள்' : 'Latest sales verified and recorded'}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('payments')}
              style={{
                background: 'none',
                border: 'none',
                color: '#059669',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>{activeLang === 'ta' ? 'அனைத்தும்' : 'View All'}</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {stats?.recentTransactions && stats.recentTransactions.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {stats.recentTransactions.map((tx) => (
                <div
                  key={tx._id || tx.invoiceNumber}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: tx.inputMethod === 'voice' ? '#ecfdf5' : '#eff6ff',
                      color: tx.inputMethod === 'voice' ? '#059669' : '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {tx.inputMethod === 'voice' ? <Mic size={18} /> : <Package size={18} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>
                        {tx.customerName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {tx.productName} · {tx.quantity} {tx.unit}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                      {currency}{tx.total}
                    </div>
                    <span className={`badge ${tx.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '10px' }}>
                      {tx.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
              No transactions recorded yet. Click "New Voice Sale" to record your first transaction!
            </div>
          )}
        </div>

        {/* Quick Launchpad & Workflows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Actions Card */}
          <div className="card" style={{ padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>
              {activeLang === 'ta' ? 'விரைவு செயல்பாடுகள்' : 'Quick Actions'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              <button
                onClick={() => setActiveTab('voice')}
                style={{
                  padding: '16px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <Mic size={24} color="#059669" />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>
                  {activeLang === 'ta' ? 'குரல் விற்பனை' : 'Voice Assistant'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                style={{
                  padding: '16px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <PlusCircle size={24} color="#2563eb" />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>
                  {activeLang === 'ta' ? 'பொருள் சேர்க்க' : 'Add Product'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                style={{
                  padding: '16px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <UserPlus size={24} color="#d97706" />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>
                  {activeLang === 'ta' ? 'வாடிக்கையாளர்' : 'New Customer'}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                style={{
                  padding: '16px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <ArrowUpRight size={24} color="#7c3aed" />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>
                  {activeLang === 'ta' ? 'அறிக்கைகள்' : 'View Reports'}
                </span>
              </button>
            </div>
          </div>

          {/* Voice Command Tip Card */}
          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} color="#059669" />
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                {activeLang === 'ta' ? 'குரல் பரிந்துரை (Try Speaking):' : 'Voice Command Example:'}
              </span>
            </div>
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#f1f5f9',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#334155',
              fontStyle: 'italic',
              lineHeight: 1.5
            }}>
              {activeLang === 'ta'
                ? '"இன்று குமார் 10 கிலோ அரிசி 600 ரூபாய்க்கு வாங்கினார். நாளை பணம் தருவார்."'
                : '"Today Kumar purchased 10 kg rice for 600 rupees. He will pay tomorrow."'}
            </div>
          </div>

        </div>

      </div>

      {/* Stock Health & Separation Modal */}
      <StockAlertModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onNavigateInventory={(tab) => setActiveTab(tab)}
        initialTab={modalInitialTab}
      />

    </div>
  );
}

