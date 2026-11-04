import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  CreditCard, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Receipt,
  DollarSign
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import api from '../services/api';

export default function Customers() {
  const { customers, business, activeLang, refreshAll, showToast } = useBusiness();
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'pending' | 'settled'
  const [modalMode, setModalMode] = useState(null); // 'add' | 'settle'
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    pendingBalance: ''
  });

  const currency = business?.currency || '₹';

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search));
    const isPending = Number(c.pendingBalance) > 0;
    if (filterMode === 'pending') return matchesSearch && isPending;
    if (filterMode === 'settled') return matchesSearch && !isPending;
    return matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormData({ name: '', phone: '', address: '', pendingBalance: '0' });
    setModalMode('add');
  };

  const handleOpenSettle = (cust) => {
    setActiveCustomer(cust);
    setPaymentAmount(cust.pendingBalance);
    setPaymentMethod('cash');
    setPaymentNotes('');
    setModalMode('settle');
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.createCustomer(formData);
      showToast('Customer registered in ledger');
      setModalMode(null);
      await refreshAll();
    } catch (err) {
      showToast('Failed to add customer: ' + err.message, 'error');
    }
  };

  const handleSettlePayment = async (e) => {
    e.preventDefault();
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      showToast('Please enter a valid payment amount', 'warning');
      return;
    }
    try {
      await api.settleCustomerPayment(
        activeCustomer._id || activeCustomer.id,
        Number(paymentAmount),
        paymentMethod,
        paymentNotes
      );
      showToast(`Recorded payment of ${currency}${paymentAmount} for ${activeCustomer.name}`);
      setModalMode(null);
      await refreshAll();
    } catch (err) {
      showToast('Failed to record payment: ' + err.message, 'error');
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Search & Actions Header */}
      <div className="page-search-filter-row">
        <div className="search-input-wrapper">
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder={activeLang === 'ta' ? 'வாடிக்கையாளர் பெயர் அல்லது தொலைபேசி...' : 'Search by name or phone...'}
            className="input-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <div className="filter-tabs-wrapper">
          <button
            onClick={() => setFilterMode('all')}
            style={{
              padding: '7px 12px',
              fontSize: '12px',
              fontWeight: filterMode === 'all' ? '700' : '500',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filterMode === 'all' ? '#ffffff' : 'transparent',
              color: filterMode === 'all' ? '#0f172a' : '#64748b',
              boxShadow: filterMode === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('pending')}
            style={{
              padding: '7px 12px',
              fontSize: '12px',
              fontWeight: filterMode === 'pending' ? '700' : '500',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filterMode === 'pending' ? '#ffffff' : 'transparent',
              color: filterMode === 'pending' ? '#d97706' : '#64748b',
              boxShadow: filterMode === 'pending' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Pending Dues
          </button>
          <button
            onClick={() => setFilterMode('settled')}
            style={{
              padding: '7px 12px',
              fontSize: '12px',
              fontWeight: filterMode === 'settled' ? '700' : '500',
              borderRadius: '7px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: filterMode === 'settled' ? '#ffffff' : 'transparent',
              color: filterMode === 'settled' ? '#059669' : '#64748b',
              boxShadow: filterMode === 'settled' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Settled
          </button>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn btn-primary add-entity-btn"
          style={{ padding: '10px 18px', whiteSpace: 'nowrap' }}
        >
          <UserPlus size={18} />
          <span>{activeLang === 'ta' ? 'புதிய வாடிக்கையாளர்' : 'Add Customer'}</span>
        </button>
      </div>

      {/* Customer Directory Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>{activeLang === 'ta' ? 'வாடிக்கையாளர் பெயர்' : 'Customer Name'}</th>
              <th>{activeLang === 'ta' ? 'தொலைபேசி' : 'Phone Number'}</th>
              <th>{activeLang === 'ta' ? 'முகவரி' : 'Address'}</th>
              <th>{activeLang === 'ta' ? 'மொத்த கொள்முதல்' : 'Total Purchases'}</th>
              <th>{activeLang === 'ta' ? 'செலுத்தியது' : 'Paid Amount'}</th>
              <th>{activeLang === 'ta' ? 'கடன் பாக்கி' : 'Pending Balance'}</th>
              <th>{activeLang === 'ta' ? 'நிலை' : 'Status'}</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((c) => {
              const hasPending = Number(c.pendingBalance) > 0;

              return (
                <tr key={c._id || c.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: '800'
                      }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} color="#94a3b8" />
                      <span>{c.phone || '—'}</span>
                    </div>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '13px' }}>
                    {c.address || '—'}
                  </td>
                  <td style={{ fontWeight: '600' }}>
                    {currency}{Number(c.totalPurchases || 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ color: '#059669', fontWeight: '600' }}>
                    {currency}{Number(c.paidAmount || 0).toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: '800',
                      color: hasPending ? '#dc2626' : '#059669'
                    }}>
                      {currency}{Number(c.pendingBalance || 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td>
                    {hasPending ? (
                      <span className="badge badge-warning">
                        <AlertCircle size={12} />
                        Due ₹{c.pendingBalance}
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} />
                        All Settled
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {hasPending ? (
                      <button
                        onClick={() => handleOpenSettle(c)}
                        className="btn btn-outline-primary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        <CreditCard size={13} />
                        <span>Settle Due</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}>No Dues</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Settle Balance Modal */}
      {modalMode === 'settle' && activeCustomer && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {activeLang === 'ta' ? `கடன் பாக்கி வசூல்: ${activeCustomer.name}` : `Settle Dues: ${activeCustomer.name}`}
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                Current outstanding credit: <strong>{currency}{activeCustomer.pendingBalance}</strong>
              </p>
            </div>

            <form onSubmit={handleSettlePayment} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Amount Received ({currency})*
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={activeCustomer.pendingBalance}
                  className="input-control"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Payment Method
                </label>
                <select
                  className="input-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="cash">Cash (ரொக்கம்)</option>
                  <option value="upi">UPI / GPay / PhonePe</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Settle old grocery balance"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Confirm Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {modalMode === 'add' && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {activeLang === 'ta' ? 'புதிய வாடிக்கையாளர் பதிவு' : 'Register New Customer'}
              </h3>
            </div>

            <form onSubmit={handleSaveCustomer} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Customer Name*
                </label>
                <input
                  type="text"
                  required
                  className="input-control"
                  placeholder="e.g. Kumar, Priya, Ramesh"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Mobile Phone Number
                </label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="+91 98401 23456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Street / Address
                </label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Bazaar Street, Madurai"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Opening Pending Balance ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  className="input-control"
                  placeholder="0"
                  value={formData.pendingBalance}
                  onChange={(e) => setFormData({ ...formData, pendingBalance: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Add to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

