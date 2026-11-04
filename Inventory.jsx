import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Package, 
  Filter, 
  CheckCircle2, 
  ArrowUpDown,
  RefreshCw
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';
import api from '../services/api';

export default function Inventory() {
  const { products, business, activeLang, refreshAll, showToast, inventoryStockFilter, setInventoryStockFilter } = useBusiness();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | 'stock'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    tamilName: '',
    category: 'Grains & Staples',
    unit: 'kg',
    purchasePrice: 0,
    sellingPrice: 0,
    stock: 0,
    minimumStock: 10
  });

  const currency = business?.currency || '₹';

  const categories = ['All', ...new Set(products.map(p => p.category || 'General'))];

  // Separated stock groups
  const outOfStockProducts = products.filter(p => Number(p.stock) <= 0);
  const lowStockProducts = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= Number(p.minimumStock));
  const inStockProducts = products.filter(p => Number(p.stock) > Number(p.minimumStock));

  const filteredProducts = products.filter(p => {
    const stockVal = Number(p.stock) || 0;
    const minVal = Number(p.minimumStock) || 0;

    // Stock health separation
    if (inventoryStockFilter === 'out_of_stock' && stockVal > 0) return false;
    if (inventoryStockFilter === 'low_stock' && (stockVal <= 0 || stockVal > minVal)) return false;
    if (inventoryStockFilter === 'in_stock' && stockVal <= minVal) return false;

    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.tamilName && p.tamilName.includes(search)) ||
      (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      tamilName: '',
      category: 'Grains & Staples',
      unit: 'kg',
      purchasePrice: '',
      sellingPrice: '',
      stock: '',
      minimumStock: 10
    });
    setModalMode('add');
  };

  const handleOpenEdit = (prod) => {
    setCurrentProduct(prod);
    setFormData({
      name: prod.name,
      tamilName: prod.tamilName || '',
      category: prod.category || 'General',
      unit: prod.unit || 'kg',
      purchasePrice: prod.purchasePrice,
      sellingPrice: prod.sellingPrice,
      stock: prod.stock,
      minimumStock: prod.minimumStock
    });
    setModalMode('edit');
  };

  const handleOpenStockAdjust = (prod) => {
    setCurrentProduct(prod);
    setFormData({
      stock: prod.stock,
      addAmount: ''
    });
    setModalMode('stock');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await api.createProduct(formData);
        showToast('New product added to inventory');
      } else if (modalMode === 'edit') {
        await api.updateProduct(currentProduct._id || currentProduct.id, formData);
        showToast('Product updated successfully');
      } else if (modalMode === 'stock') {
        const newStock = Number(currentProduct.stock) + Number(formData.addAmount || 0);
        await api.updateProduct(currentProduct._id || currentProduct.id, { stock: newStock });
        showToast(`Stock updated to ${newStock} ${currentProduct.unit}`);
      }
      setModalMode(null);
      await refreshAll();
    } catch (err) {
      showToast('Error saving product: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      try {
        await api.deleteProduct(id);
        showToast(`Deleted "${name}"`);
        await refreshAll();
      } catch (err) {
        showToast('Failed to delete product: ' + err.message, 'error');
      }
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Action Header */}
      <div className="page-search-filter-row">
        <div className="search-input-wrapper">
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder={activeLang === 'ta' ? 'பொருள் அல்லது வகையைத் தேடுக...' : 'Search products by name...'}
            className="input-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px' }}
          />
        </div>

        <select
          className="input-control category-select-control"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ width: 'auto', minWidth: '150px' }}
        >
          {categories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <button
          onClick={handleOpenAdd}
          className="btn btn-primary add-entity-btn"
          style={{ padding: '10px 18px', whiteSpace: 'nowrap' }}
        >
          <Plus size={18} />
          <span>{activeLang === 'ta' ? 'புதிய பொருள் சேர்க்க' : 'Add New Product'}</span>
        </button>
      </div>

      {/* Dedicated Stock Health Status Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        <button
          onClick={() => setInventoryStockFilter('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '700',
            border: inventoryStockFilter === 'all' ? '2px solid #059669' : '1px solid #e2e8f0',
            backgroundColor: inventoryStockFilter === 'all' ? '#ecfdf5' : '#ffffff',
            color: inventoryStockFilter === 'all' ? '#065f46' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: inventoryStockFilter === 'all' ? '0 2px 8px rgba(5, 150, 105, 0.15)' : 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <span>{activeLang === 'ta' ? 'அனைத்து பொருட்கள்' : 'All Products'}</span>
          <span style={{
            fontSize: '11px',
            padding: '2px 7px',
            borderRadius: '10px',
            backgroundColor: inventoryStockFilter === 'all' ? '#a7f3d0' : '#f1f5f9',
            color: inventoryStockFilter === 'all' ? '#064e3b' : '#64748b',
            fontWeight: '800'
          }}>
            {products.length}
          </span>
        </button>

        <button
          onClick={() => setInventoryStockFilter('out_of_stock')}
          style={{
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '800',
            border: inventoryStockFilter === 'out_of_stock' ? '2px solid #dc2626' : '1px solid #fecaca',
            backgroundColor: inventoryStockFilter === 'out_of_stock' ? '#fef2f2' : '#ffffff',
            color: '#dc2626',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: inventoryStockFilter === 'out_of_stock' ? '0 2px 8px rgba(220, 38, 38, 0.2)' : 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#dc2626' }}></span>
          <span>{activeLang === 'ta' ? 'தீர்ந்தவை (0 இருப்பு)' : 'Out of Stock (0 Qty)'}</span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            fontWeight: '800'
          }}>
            {outOfStockProducts.length}
          </span>
        </button>

        <button
          onClick={() => setInventoryStockFilter('low_stock')}
          style={{
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '800',
            border: inventoryStockFilter === 'low_stock' ? '2px solid #d97706' : '1px solid #fde68a',
            backgroundColor: inventoryStockFilter === 'low_stock' ? '#fffbeb' : '#ffffff',
            color: '#b45309',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: inventoryStockFilter === 'low_stock' ? '0 2px 8px rgba(217, 119, 6, 0.2)' : 'none',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#d97706' }}></span>
          <span>{activeLang === 'ta' ? 'குறைந்த இருப்பு' : 'Low Stock (Running Low)'}</span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: '#fef3c7',
            color: '#92400e',
            fontWeight: '800'
          }}>
            {lowStockProducts.length}
          </span>
        </button>

        <button
          onClick={() => setInventoryStockFilter('in_stock')}
          style={{
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '700',
            border: inventoryStockFilter === 'in_stock' ? '2px solid #10b981' : '1px solid #e2e8f0',
            backgroundColor: inventoryStockFilter === 'in_stock' ? '#f0fdf4' : '#ffffff',
            color: inventoryStockFilter === 'in_stock' ? '#047857' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
          <span>{activeLang === 'ta' ? 'போதுமான இருப்பு' : 'Healthy In Stock'}</span>
          <span style={{
            fontSize: '11px',
            padding: '2px 7px',
            borderRadius: '10px',
            backgroundColor: inventoryStockFilter === 'in_stock' ? '#dcfce7' : '#f1f5f9',
            color: inventoryStockFilter === 'in_stock' ? '#166534' : '#64748b',
            fontWeight: '700'
          }}>
            {inStockProducts.length}
          </span>
        </button>
      </div>

      {/* Informative Banner when Out of Stock or Low Stock filter is active */}
      {inventoryStockFilter === 'out_of_stock' && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🚨</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#991b1b' }}>
                {activeLang === 'ta' ? 'முற்றிலும் தீர்ந்த பொருட்கள் மட்டும் (0 இருப்பு)' : 'Out of Stock Products Only (0 Available)'}
              </div>
              <div style={{ fontSize: '12px', color: '#b91c1c' }}>
                {outOfStockProducts.length === 0 
                  ? 'All items currently have stock available.' 
                  : `Showing only the ${outOfStockProducts.length} completely depleted items. Click "+ Restock" to update inventory.`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setInventoryStockFilter('all')}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#fca5a5', color: '#991b1b' }}
          >
            Show All Products
          </button>
        </div>
      )}

      {inventoryStockFilter === 'low_stock' && (
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#92400e' }}>
                {activeLang === 'ta' ? 'குறைந்த இருப்பு பொருட்கள் மட்டும்' : 'Low Stock Products Only (Below Minimum)'}
              </div>
              <div style={{ fontSize: '12px', color: '#b45309' }}>
                {lowStockProducts.length === 0 
                  ? 'No products are running low right now.' 
                  : `Showing ${lowStockProducts.length} items below minimum safety stock. Reorder soon to prevent running out.`}
              </div>
            </div>
          </div>
          <button
            onClick={() => setInventoryStockFilter('all')}
            className="btn btn-secondary"
            style={{ fontSize: '12px', padding: '6px 12px', borderColor: '#fde68a', color: '#92400e' }}
          >
            Show All Products
          </button>
        </div>
      )}

      {/* Product Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>{activeLang === 'ta' ? 'பொருள் பெயர்' : 'Product Name'}</th>
              <th>{activeLang === 'ta' ? 'வகை' : 'Category'}</th>
              <th>{activeLang === 'ta' ? 'அலகு' : 'Unit'}</th>
              <th>{activeLang === 'ta' ? 'கொள்முதல் விலை' : 'Purchase Price'}</th>
              <th>{activeLang === 'ta' ? 'விற்பனை விலை' : 'Selling Price'}</th>
              <th>{activeLang === 'ta' ? 'இருப்பு' : 'Available Qty'}</th>
              <th>{activeLang === 'ta' ? 'குறைந்த இருப்பு அளவு' : 'Min Stock'}</th>
              <th>{activeLang === 'ta' ? 'நிலை' : 'Status'}</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const isOut = Number(p.stock) <= 0;
              const isLow = !isOut && Number(p.stock) <= Number(p.minimumStock);
              const margin = p.sellingPrice - p.purchasePrice;
              const marginPercent = p.purchasePrice > 0 ? Math.round((margin / p.purchasePrice) * 100) : 0;

              return (
                <tr 
                  key={p._id || p.id}
                  style={{
                    backgroundColor: isOut ? '#fff5f5' : (isLow ? '#fffdf5' : 'transparent'),
                    borderLeft: isOut ? '4px solid #dc2626' : (isLow ? '4px solid #d97706' : '4px solid transparent')
                  }}
                >
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>
                      {p.name}
                    </div>
                    {p.tamilName && (
                      <div style={{ fontSize: '12px', color: '#059669', fontWeight: '500' }}>
                        {p.tamilName}
                      </div>
                    )}
                  </td>
                  <td>
                    <span className="badge badge-slate" style={{ fontSize: '11px' }}>
                      {p.category || 'General'}
                    </span>
                  </td>
                  <td style={{ fontWeight: '600', color: '#475569' }}>
                    {p.unit}
                  </td>
                  <td>
                    {currency}{p.purchasePrice}
                  </td>
                  <td style={{ fontWeight: '700', color: '#0f172a' }}>
                    {currency}{p.sellingPrice}
                    <span style={{ fontSize: '11px', color: '#059669', marginLeft: '6px' }}>
                      (+{marginPercent}%)
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '15px',
                        fontWeight: '800',
                        color: isOut ? '#dc2626' : (isLow ? '#d97706' : '#0f172a')
                      }}>
                        {p.stock}
                      </span>
                      {isOut && (
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          backgroundColor: '#fee2e2',
                          color: '#b91c1c'
                        }}>
                          0 LEFT
                        </span>
                      )}
                      <button
                        onClick={() => handleOpenStockAdjust(p)}
                        title="Quick Restock"
                        style={{
                          background: isOut ? '#dc2626' : '#f1f5f9',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: isOut ? '#ffffff' : '#059669',
                          cursor: 'pointer'
                        }}
                      >
                        + Restock
                      </button>
                    </div>
                  </td>
                  <td style={{ color: '#64748b' }}>
                    {p.minimumStock} {p.unit}
                  </td>
                  <td>
                    {isOut ? (
                      <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={12} />
                        Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="badge badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <AlertTriangle size={12} />
                        Low Stock
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        <CheckCircle2 size={12} />
                        In Stock
                      </span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        title="Edit product"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id || p.id, p.name)}
                        className="btn btn-danger"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        title="Delete product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                  <Package size={36} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
                  <div style={{ fontWeight: '800', fontSize: '16px', color: '#0f172a' }}>
                    {inventoryStockFilter === 'out_of_stock' 
                      ? (activeLang === 'ta' ? 'எந்தப் பொருளும் தீரவில்லை! அனைத்தும் இருப்பில் உள்ளன.' : 'No products are out of stock!') 
                      : inventoryStockFilter === 'low_stock' 
                        ? (activeLang === 'ta' ? 'எந்தப் பொருளுக்கும் குறைந்த இருப்பு எச்சரிக்கை இல்லை.' : 'No products are running low!') 
                        : (activeLang === 'ta' ? 'தேடலுக்குரிய பொருட்கள் எதுவும் கிடைக்கவில்லை.' : 'No products match your search/filter criteria.')}
                  </div>
                  <div style={{ fontSize: '13px', marginTop: '6px' }}>
                    {inventoryStockFilter !== 'all' ? (
                      <button 
                        onClick={() => setInventoryStockFilter('all')}
                        className="btn btn-secondary"
                        style={{ marginTop: '12px', fontSize: '12px' }}
                      >
                        {activeLang === 'ta' ? 'அனைத்து பொருட்களையும் காட்டு' : 'Reset to All Products'}
                      </button>
                    ) : (
                      <span>Try adjusting your search terms or category selection.</span>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit / Restock Modal */}
      {modalMode && (
        <div className="modal-overlay" onClick={() => setModalMode(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                {modalMode === 'add' && (activeLang === 'ta' ? 'புதிய சரக்கு பொருள் சேர்க்க' : 'Add New Product')}
                {modalMode === 'edit' && (activeLang === 'ta' ? 'பொருளை திருத்து' : `Edit: ${currentProduct?.name}`)}
                {modalMode === 'stock' && (activeLang === 'ta' ? 'இருப்பு கூட்ட / குறைக்க' : `Restock: ${currentProduct?.name}`)}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {modalMode === 'stock' ? (
                <div>
                  <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
                    Current Stock: <strong>{currentProduct?.stock} {currentProduct?.unit}</strong>
                  </div>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                    Add Incoming Stock Quantity ({currentProduct?.unit}):
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="input-control"
                    placeholder="e.g. 25"
                    value={formData.addAmount}
                    onChange={(e) => setFormData({ ...formData, addAmount: e.target.value })}
                  />
                  <div style={{ fontSize: '12px', color: '#059669', marginTop: '6px' }}>
                    New total will be: {(Number(currentProduct?.stock) || 0) + (Number(formData.addAmount) || 0)} {currentProduct?.unit}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Product Name (English)*
                      </label>
                      <input
                        type="text"
                        required
                        className="input-control"
                        placeholder="e.g. Ponni Boiled Rice"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Tamil Name (தமிழ் பெயர்)
                      </label>
                      <input
                        type="text"
                        className="input-control"
                        placeholder="எ.கா. பொன்னி புழுங்கல் அரிசி"
                        value={formData.tamilName}
                        onChange={(e) => setFormData({ ...formData, tamilName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Category
                      </label>
                      <input
                        type="text"
                        className="input-control"
                        placeholder="e.g. Grains, Oils, Staples"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Unit of Measurement*
                      </label>
                      <select
                        className="input-control"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      >
                        <option value="kg">kg (கிலோ)</option>
                        <option value="liter">liter (லிட்டர்)</option>
                        <option value="packet">packet (பாக்கெட்)</option>
                        <option value="piece">piece (எண்ணிக்கை)</option>
                        <option value="box">box (டப்பா)</option>
                        <option value="bag">bag (மூட்டை)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Purchase Cost (₹)*
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        className="input-control"
                        placeholder="48"
                        value={formData.purchasePrice}
                        onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Selling Price (₹)*
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        className="input-control"
                        placeholder="60"
                        value={formData.sellingPrice}
                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Current Stock Available*
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        className="input-control"
                        placeholder="100"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Minimum Low-Stock Alert*
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="input-control"
                        placeholder="10"
                        value={formData.minimumStock}
                        onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                      />
                    </div>
                  </div>
                </>
              )}

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
                  Save to Inventory
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

