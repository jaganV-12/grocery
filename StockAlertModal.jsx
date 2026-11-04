import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  PackageX, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  RefreshCw,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import api from '../services/api';

export default function StockAlertModal({ isOpen, onClose, onNavigateInventory, initialTab = 'out_of_stock' }) {
  const { products, business, activeLang, refreshAll, showToast, setInventoryStockFilter } = useBusiness();
  const [activeTab, setActiveTab] = useState(initialTab); // 'out_of_stock' | 'low_stock' | 'separated'
  const [restockInputs, setRestockInputs] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  if (!isOpen) return null;

  const currency = business?.currency || '₹';

  // Separate strictly:
  // 1. Out of stock: stock <= 0
  const outOfStockProducts = products.filter(p => Number(p.stock) <= 0);

  // 2. Low stock: stock > 0 AND stock <= minimumStock
  const lowStockProducts = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.minimumStock));

  const handleInputChange = (productId, val) => {
    setRestockInputs(prev => ({ ...prev, [productId]: val }));
  };

  const handleQuickRestock = async (product) => {
    const rawVal = restockInputs[product._id || product.id];
    const addAmt = Number(rawVal);
    if (!addAmt || addAmt <= 0) {
      showToast('Please enter a valid quantity to add (e.g. 10)', 'error');
      return;
    }

    try {
      setUpdatingId(product._id || product.id);
      const newStock = Math.max(0, Number(product.stock || 0) + addAmt);
      await api.updateProduct(product._id || product.id, { stock: newStock });
      showToast(`Restocked ${product.name}! New stock: ${newStock} ${product.unit}`);
      setRestockInputs(prev => ({ ...prev, [product._id || product.id]: '' }));
      await refreshAll();
    } catch (err) {
      showToast('Failed to restock: ' + err.message, 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleGoToInventory = (filterType) => {
    setInventoryStockFilter(filterType);
    onClose();
    if (onNavigateInventory) {
      onNavigateInventory('inventory');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(226, 232, 240, 0.8)',
        overflow: 'hidden',
        animation: 'fadeInModal 0.2s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(to right, #f8fafc, #ffffff)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <PackageX size={22} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>
                {activeLang === 'ta' ? 'இருப்பு எச்சரிக்கை விவரங்கள்' : 'Stock Health & Restock Center'}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                {activeLang === 'ta' 
                  ? 'தீர்ந்த பொருட்கள் மற்றும் குறைந்த இருப்பு பொருட்கள் தனித்தனியாக பிரிக்கப்பட்டுள்ளன' 
                  : 'Out of Stock and Low Stock items are strictly separated below'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Separated Tabs Navigation */}
        <div style={{
          padding: '12px 24px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          gap: '10px',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => setActiveTab('out_of_stock')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: activeTab === 'out_of_stock' ? '2px solid #dc2626' : '1px solid #e2e8f0',
              backgroundColor: activeTab === 'out_of_stock' ? '#fef2f2' : '#ffffff',
              color: activeTab === 'out_of_stock' ? '#b91c1c' : '#475569',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626' }}></span>
            <span>{activeLang === 'ta' ? 'தீர்ந்த பொருட்கள் (0 இருப்பு)' : '🔴 Out of Stock'}</span>
            <span style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '2px 7px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '800'
            }}>
              {outOfStockProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('low_stock')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: activeTab === 'low_stock' ? '2px solid #d97706' : '1px solid #e2e8f0',
              backgroundColor: activeTab === 'low_stock' ? '#fffbeb' : '#ffffff',
              color: activeTab === 'low_stock' ? '#92400e' : '#475569',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706' }}></span>
            <span>{activeLang === 'ta' ? 'குறைந்த இருப்பு' : '🟡 Low Stock'}</span>
            <span style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              padding: '2px 7px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '800'
            }}>
              {lowStockProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('separated')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: activeTab === 'separated' ? '2px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: activeTab === 'separated' ? '#eff6ff' : '#ffffff',
              color: activeTab === 'separated' ? '#1d4ed8' : '#475569',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{activeLang === 'ta' ? 'இரண்டும் தனித்தனியாகக் காண்க' : '📋 View Both (Separated)'}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* 1. OUT OF STOCK SECTION */}
          {(activeTab === 'out_of_stock' || activeTab === 'separated') && (
            <div style={{
              border: '1px solid #fecaca',
              borderRadius: '14px',
              overflow: 'hidden',
              backgroundColor: '#fff'
            }}>
              {/* Section Header */}
              <div style={{
                padding: '12px 18px',
                backgroundColor: '#fef2f2',
                borderBottom: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🚨</span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#991b1b' }}>
                    {activeLang === 'ta' ? 'முற்றிலும் தீர்ந்த பொருட்கள் (Out of Stock - 0 Qty)' : 'OUT OF STOCK ITEMS (0 Available)'}
                  </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#b91c1c' }}>
                  {outOfStockProducts.length} {activeLang === 'ta' ? 'பொருட்கள்' : 'item(s)'}
                </span>
              </div>

              {outOfStockProducts.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#059669', fontSize: '14px', fontWeight: '600' }}>
                  ✓ {activeLang === 'ta' ? 'எந்தப் பொருளும் தீரவில்லை! அனைத்தும் இருப்பில் உள்ளன.' : 'No items are out of stock. Everything has available inventory.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', divideY: '1px solid #f1f5f9' }}>
                  {outOfStockProducts.map(prod => (
                    <div 
                      key={prod._id || prod.id}
                      style={{
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: '#fff5f5'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                          {prod.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                          {prod.tamilName && <span style={{ color: '#059669', fontWeight: '600' }}>{prod.tamilName}</span>}
                          <span>•</span>
                          <span>{prod.category}</span>
                          <span>•</span>
                          <span>Price: {currency}{prod.sellingPrice}/{prod.unit}</span>
                          <span>•</span>
                          <span style={{ color: '#b91c1c', fontWeight: '600' }}>Min needed: {prod.minimumStock} {prod.unit}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          backgroundColor: '#dc2626',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: '800',
                          letterSpacing: '0.02em'
                        }}>
                          0 {prod.unit} (DEPLETED)
                        </span>

                        {/* Quick Restock Form */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            min="1"
                            placeholder="+ Qty"
                            value={restockInputs[prod._id || prod.id] || ''}
                            onChange={(e) => handleInputChange(prod._id || prod.id, e.target.value)}
                            style={{
                              width: '74px',
                              padding: '6px 8px',
                              fontSize: '13px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              outline: 'none',
                              textAlign: 'center'
                            }}
                          />
                          <button
                            onClick={() => handleQuickRestock(prod)}
                            disabled={updatingId === (prod._id || prod.id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              backgroundColor: '#059669',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Plus size={14} />
                            <span>{updatingId === (prod._id || prod.id) ? 'Updating...' : '+ Restock'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. LOW STOCK SECTION */}
          {(activeTab === 'low_stock' || activeTab === 'separated') && (
            <div style={{
              border: '1px solid #fde68a',
              borderRadius: '14px',
              overflow: 'hidden',
              backgroundColor: '#fff'
            }}>
              {/* Section Header */}
              <div style={{
                padding: '12px 18px',
                backgroundColor: '#fffbeb',
                borderBottom: '1px solid #fde68a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>⚠️</span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#92400e' }}>
                    {activeLang === 'ta' ? 'குறைந்த இருப்புப் பொருட்கள் (Low Stock - Below Minimum)' : 'LOW STOCK ITEMS (Below Minimum Threshold)'}
                  </span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#b45309' }}>
                  {lowStockProducts.length} {activeLang === 'ta' ? 'பொருட்கள்' : 'item(s)'}
                </span>
              </div>

              {lowStockProducts.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#059669', fontSize: '14px', fontWeight: '600' }}>
                  ✓ {activeLang === 'ta' ? 'எந்தப் பொருளுக்கும் குறைந்த இருப்பு எச்சரிக்கை இல்லை.' : 'All items are above the minimum required stock.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {lowStockProducts.map(prod => (
                    <div 
                      key={prod._id || prod.id}
                      style={{
                        padding: '14px 18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                        borderBottom: '1px solid #f8fafc',
                        backgroundColor: '#fffdf5'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>
                          {prod.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                          {prod.tamilName && <span style={{ color: '#059669', fontWeight: '600' }}>{prod.tamilName}</span>}
                          <span>•</span>
                          <span>{prod.category}</span>
                          <span>•</span>
                          <span>Price: {currency}{prod.sellingPrice}/{prod.unit}</span>
                          <span>•</span>
                          <span style={{ color: '#b45309', fontWeight: '600' }}>Safety Min: {prod.minimumStock} {prod.unit}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          border: '1px solid #fde68a',
                          fontSize: '11px',
                          fontWeight: '800'
                        }}>
                          Only {prod.stock} {prod.unit} Left
                        </span>

                        {/* Quick Restock Form */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            min="1"
                            placeholder="+ Qty"
                            value={restockInputs[prod._id || prod.id] || ''}
                            onChange={(e) => handleInputChange(prod._id || prod.id, e.target.value)}
                            style={{
                              width: '74px',
                              padding: '6px 8px',
                              fontSize: '13px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              outline: 'none',
                              textAlign: 'center'
                            }}
                          />
                          <button
                            onClick={() => handleQuickRestock(prod)}
                            disabled={updatingId === (prod._id || prod.id)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: '8px',
                              backgroundColor: '#d97706',
                              color: '#ffffff',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Plus size={14} />
                            <span>{updatingId === (prod._id || prod.id) ? 'Updating...' : '+ Add'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer with Direct Link to Inventory */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleGoToInventory('out_of_stock')}
              style={{
                background: '#fee2e2',
                border: '1px solid #fecaca',
                color: '#991b1b',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>View Out of Stock in Inventory ({outOfStockProducts.length})</span>
              <ExternalLink size={13} />
            </button>

            <button
              onClick={() => handleGoToInventory('low_stock')}
              style={{
                background: '#fef3c7',
                border: '1px solid #fde68a',
                color: '#92400e',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>View Low Stock in Inventory ({lowStockProducts.length})</span>
              <ExternalLink size={13} />
            </button>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

