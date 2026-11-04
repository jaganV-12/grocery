import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Package, 
  User, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Edit3, 
  Save, 
  ArrowRight,
  Cpu
} from 'lucide-react';

export default function TransactionPreviewCard({ preview, onConfirm, onCancel, isSaving = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    customer: preview.customer || '',
    product: preview.product || '',
    quantity: preview.quantity || 1,
    unit: preview.unit || 'kg',
    price: preview.price || 0,
    total: preview.total || 0,
    paid: preview.paid || 0,
    pending: preview.pending || 0,
    payment_status: preview.payment_status || 'paid',
    payment_due_date: preview.payment_due_date || 'Immediate',
    notes: preview.notes || ''
  });

  const handleFieldChange = (field, val) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: val };
      if (field === 'quantity' || field === 'price') {
        const q = field === 'quantity' ? Number(val) : Number(prev.quantity);
        const p = field === 'price' ? Number(val) : Number(prev.price);
        updated.total = Math.round(q * p);
        if (updated.payment_status === 'paid') {
          updated.paid = updated.total;
          updated.pending = 0;
        } else {
          updated.paid = 0;
          updated.pending = updated.total;
        }
      }
      if (field === 'payment_status') {
        if (val === 'paid') {
          updated.paid = updated.total;
          updated.pending = 0;
          updated.payment_due_date = 'Immediate (Cash)';
        } else {
          updated.paid = 0;
          updated.pending = updated.total;
          updated.payment_due_date = 'Tomorrow';
        }
      }
      return updated;
    });
  };

  const handleConfirmClick = () => {
    onConfirm({
      ...preview,
      ...formData,
      customerName: formData.customer,
      productName: formData.product,
      quantity: Number(formData.quantity),
      unitPrice: Number(formData.price),
      total: Number(formData.total),
      paid: Number(formData.paid),
      pending: Number(formData.pending),
      paymentStatus: formData.payment_status,
      paymentDueDate: formData.payment_due_date,
      notes: formData.notes
    });
  };

  const validation = preview.validation || { canConfirm: true, warnings: [], errors: [] };

  return (
    <div className="card" style={{
      border: '2px solid #10b981',
      boxShadow: '0 12px 30px -10px rgba(16, 185, 129, 0.25)',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      padding: 0
    }}>
      {/* Header bar */}
      <div style={{
        padding: '16px 22px',
        backgroundColor: '#ecfdf5',
        borderBottom: '1px solid #d1fae5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#059669',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#047857', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI TRANSACTION PREVIEW
            </span>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#064e3b' }}>
              Verify & Confirm Before Saving
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: '600',
            backgroundColor: '#ffffff',
            color: '#059669',
            padding: '4px 10px',
            borderRadius: '12px',
            border: '1px solid #a7f3d0'
          }}>
            <Cpu size={12} />
            {preview.engine || 'VoiceBiz AI'}
          </span>

          <button
            onClick={() => setIsEditing(!isEditing)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: '600',
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: isEditing ? '#0f172a' : '#ffffff',
              color: isEditing ? '#ffffff' : '#334155',
              cursor: 'pointer'
            }}
          >
            <Edit3 size={13} />
            <span>{isEditing ? 'Done Editing' : 'Edit Values'}</span>
          </button>
        </div>
      </div>

      <div style={{ padding: '22px' }}>
        {/* Voice Transcript Quote */}
        {preview.rawTranscript && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: '#f8fafc',
            borderLeft: '4px solid #059669',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#334155',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>"{preview.rawTranscript}"</div>
            <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700', fontStyle: 'normal' }}>
              📅 {preview.formattedDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        )}

        {/* Khata Ledger Pending Balance Breakdown */}
        {preview.matchedCustomer && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f0fdf4',
            borderRadius: '10px',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Khata Balance Breakdown · {formData.customer || preview.matchedCustomer.matchedName}
              </div>
              <div style={{ fontSize: '13px', color: '#15803d', marginTop: '2px' }}>
                Previous Outstanding: <strong>₹{preview.matchedCustomer.currentPendingBalance || 0}</strong>
                {Number(formData.pending) > 0 && <span> + New Credit: <strong>₹{formData.pending}</strong></span>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#475569', fontWeight: '600' }}>Updated Ledger Balance:</span>
              <div style={{ fontSize: '19px', fontWeight: '800', color: '#b45309', lineHeight: 1.1 }}>
                ₹{(Number(preview.matchedCustomer.currentPendingBalance || 0) + Number(formData.pending || 0))}
              </div>
            </div>
          </div>
        )}

        {/* Warnings or Inventory Check Alerts */}
        {validation.warnings && validation.warnings.length > 0 && (
          <div style={{
            padding: '12px 14px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            marginBottom: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            {validation.warnings.map((warn, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#92400e' }}>
                <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        )}

        {/* Structured Data Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* Customer */}
          <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
              <User size={14} color="#059669" />
              <span>Customer Name</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                className="input-control"
                value={formData.customer}
                onChange={(e) => handleFieldChange('customer', e.target.value)}
                style={{ marginTop: '6px' }}
              />
            ) : (
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                {formData.customer || 'Customer'}
                {preview.matchedCustomer?.currentPendingBalance > 0 && (
                  <span style={{ fontSize: '11px', color: '#b45309', display: 'block', fontWeight: '600' }}>
                    Existing Khata: ₹{preview.matchedCustomer.currentPendingBalance} pending
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product */}
          <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
              <Package size={14} color="#059669" />
              <span>Product Item</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                className="input-control"
                value={formData.product}
                onChange={(e) => handleFieldChange('product', e.target.value)}
                style={{ marginTop: '6px' }}
              />
            ) : (
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                {formData.product}
                {preview.matchedProduct && (
                  <span style={{ fontSize: '11px', color: '#059669', display: 'block', fontWeight: '600' }}>
                    Available in Stock: {preview.matchedProduct.availableStock} {preview.matchedProduct.unit}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quantity & Unit */}
          <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
              Quantity & Unit
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <input
                  type="number"
                  className="input-control"
                  value={formData.quantity}
                  onChange={(e) => handleFieldChange('quantity', e.target.value)}
                  style={{ width: '80px' }}
                />
                <input
                  type="text"
                  className="input-control"
                  value={formData.unit}
                  onChange={(e) => handleFieldChange('unit', e.target.value)}
                />
              </div>
            ) : (
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>
                {formData.quantity} {formData.unit}
              </div>
            )}
          </div>

          {/* Total Amount & Price */}
          <div style={{ padding: '12px', backgroundColor: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#047857' }}>
              Total Sale Amount
            </div>
            {isEditing ? (
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <input
                  type="number"
                  className="input-control"
                  value={formData.total}
                  onChange={(e) => handleFieldChange('total', e.target.value)}
                />
              </div>
            ) : (
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#065f46', marginTop: '2px' }}>
                ₹{formData.total}
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#047857', marginLeft: '6px' }}>
                  (@ ₹{formData.price || Math.round(formData.total / formData.quantity)}/{formData.unit})
                </span>
              </div>
            )}
          </div>

          {/* Payment Status */}
          <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>
              Payment Terms
            </div>
            {isEditing ? (
              <select
                className="input-control"
                value={formData.payment_status}
                onChange={(e) => handleFieldChange('payment_status', e.target.value)}
                style={{ marginTop: '6px' }}
              >
                <option value="paid">Paid (Cash / UPI)</option>
                <option value="pending">Pending (Credit)</option>
              </select>
            ) : (
              <div style={{ marginTop: '6px' }}>
                <span className={`badge ${formData.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                  {formData.payment_status === 'paid' ? 'Paid in Full' : 'Credit / Pending Dues'}
                </span>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Due: {formData.payment_due_date || 'Immediate'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9'
        }}>
          <button
            onClick={onCancel}
            disabled={isSaving}
            className="btn btn-secondary"
            style={{ padding: '10px 20px' }}
          >
            <XCircle size={16} />
            <span>Cancel</span>
          </button>

          <button
            onClick={handleConfirmClick}
            disabled={isSaving}
            className="btn btn-primary"
            style={{
              padding: '10px 26px',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)'
            }}
          >
            <CheckCircle2 size={18} />
            <span>{isSaving ? 'Updating Stock & Ledger...' : 'Confirm & Save Transaction'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

