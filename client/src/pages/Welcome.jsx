import React, { useState } from 'react';
import { 
  Mic, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Package, 
  CreditCard, 
  CheckCircle2, 
  Languages, 
  Store, 
  Zap, 
  ChevronRight,
  Menu,
  X,
  Play
} from 'lucide-react';
import { useBusiness } from '../context/BusinessContext';

export default function Welcome({ onGetStarted, onLogin }) {
  const { activeLang, changeLanguage } = useBusiness();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="liquid-glass-viewport">
      {/* Ambient Emerald Ambient Glows */}
      <div className="liquid-glass-bg-glow-1"></div>
      <div className="liquid-glass-bg-glow-2"></div>
      <div className="liquid-glass-bg-glow-3"></div>

      {/* -------------------------------------------------------------
          NAVIGATION BAR
          ------------------------------------------------------------- */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(8, 8, 8, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #19D3A2 0%, #059669 100%)',
              color: '#041c15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(25, 211, 162, 0.4)'
            }}>
              <Mic size={22} />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                VoiceBiz <span style={{ color: '#19D3A2' }}>AI</span>
              </div>
              <div style={{ fontSize: '10px', color: '#CDCDCD', fontWeight: '500', letterSpacing: '0.04em' }}>
                VOICE BUSINESS MANAGEMENT
              </div>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'color 0.2s' }}
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              style={{ background: 'none', border: 'none', color: '#CDCDCD', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#19D3A2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#CDCDCD'}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('workflow')}
              style={{ background: 'none', border: 'none', color: '#CDCDCD', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#19D3A2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#CDCDCD'}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('about')}
              style={{ background: 'none', border: 'none', color: '#CDCDCD', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#19D3A2'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#CDCDCD'}
            >
              About
            </button>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onLogin}
              className="liquid-glass-btn-secondary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Login
            </button>

            <button
              onClick={onGetStarted}
              className="liquid-glass-btn-primary"
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-only-btn"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: '8px',
                color: '#ffffff',
                padding: '6px',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div style={{
            padding: '16px 24px',
            backgroundColor: 'rgba(12, 12, 12, 0.95)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button onClick={() => { setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ background: 'none', border: 'none', color: '#fff', textAlign: 'left', fontSize: '15px', padding: '6px 0' }}>Home</button>
            <button onClick={() => scrollToSection('features')} style={{ background: 'none', border: 'none', color: '#CDCDCD', textAlign: 'left', fontSize: '15px', padding: '6px 0' }}>Features</button>
            <button onClick={() => scrollToSection('workflow')} style={{ background: 'none', border: 'none', color: '#CDCDCD', textAlign: 'left', fontSize: '15px', padding: '6px 0' }}>How It Works</button>
            <button onClick={() => scrollToSection('about')} style={{ background: 'none', border: 'none', color: '#CDCDCD', textAlign: 'left', fontSize: '15px', padding: '6px 0' }}>About</button>
          </div>
        )}
      </header>

      {/* -------------------------------------------------------------
          HERO SECTION
          ------------------------------------------------------------- */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '70px 24px 60px 24px',
        textAlign: 'center'
      }}>
        {/* Top Pill Badge */}
        <div style={{ display: 'inline-flex', marginBottom: '20px' }}>
          <div className="liquid-glass-badge">
            <Sparkles size={14} />
            <span>AI Voice Technology for Small Indian Businesses</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontSize: 'clamp(36px, 5.5vw, 64px)',
          fontWeight: '900',
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          maxWidth: '920px',
          margin: '0 auto 20px auto',
          color: '#FFFFFF'
        }}>
          Your Business. Your Voice.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #19D3A2 0%, #a7f3d0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Your Control.
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          color: '#CDCDCD',
          maxWidth: '720px',
          margin: '0 auto 36px auto',
          lineHeight: 1.6
        }}>
          Manage sales, inventory, customers and payments effortlessly with the power of AI voice technology in Tamil and English.
        </p>

        {/* Main CTA Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '54px'
        }}>
          <button
            onClick={onGetStarted}
            className="liquid-glass-btn-primary"
            style={{ padding: '14px 34px', fontSize: '16px' }}
          >
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </button>

          <button
            onClick={onLogin}
            className="liquid-glass-btn-secondary"
            style={{ padding: '14px 28px', fontSize: '15px' }}
          >
            <span>Sign In to Dashboard</span>
          </button>
        </div>

        {/* -------------------------------------------------------------
            HERO VISUAL: AI MICROPHONE & FLOATING GLASS PANELS
            ------------------------------------------------------------- */}
        <div style={{
          position: 'relative',
          maxWidth: '960px',
          margin: '0 auto',
          padding: '40px 20px 20px 20px'
        }}>
          {/* Main Central Microphone Hub */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 5
          }}>
            <div style={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(25, 211, 162, 0.3) 0%, rgba(25, 211, 162, 0.05) 70%)',
              border: '2px solid rgba(25, 211, 162, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 50px rgba(25, 211, 162, 0.35)',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #19D3A2 0%, #059669 100%)',
                color: '#041c15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(25, 211, 162, 0.5)'
              }}>
                <Mic size={42} />
              </div>
            </div>

            <div className="liquid-glass-badge" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.18)' }}>
              <span>"Today Kumar purchased 10 kg rice for 600 rupees. He will pay tomorrow."</span>
            </div>
            <div style={{ fontSize: '12px', color: '#19D3A2', marginTop: '6px', fontWeight: '600' }}>
              🇮🇳 "குமார் 10 கிலோ அரிசி 600 ரூபாய்க்கு வாங்கினார்"
            </div>
          </div>

          {/* Desktop Floating Panels */}
          <div className="hero-floating-panels-desktop">
            {/* Floating Glass Panel 1: Sales (Left) */}
            <div
              className="liquid-glass-card liquid-glass-floating"
              style={{
                position: 'absolute',
                top: '15px',
                left: '0%',
                padding: '16px 20px',
                width: '240px',
                textAlign: 'left',
                zIndex: 10
              }}
            >
              <div className="liquid-glass-card-reflection"></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(25, 211, 162, 0.15)', color: '#19D3A2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#CDCDCD', fontWeight: '600', textTransform: 'uppercase' }}>Today's Sales</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>₹18,450</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#19D3A2', fontWeight: '600' }}>
                +24% over yesterday
              </div>
            </div>

            {/* Floating Glass Panel 2: Pending Payments (Right) */}
            <div
              className="liquid-glass-card liquid-glass-floating-delay"
              style={{
                position: 'absolute',
                top: '40px',
                right: '0%',
                padding: '16px 20px',
                width: '240px',
                textAlign: 'left',
                zIndex: 10
              }}
            >
              <div className="liquid-glass-card-reflection"></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#CDCDCD', fontWeight: '600', textTransform: 'uppercase' }}>Customer Khata</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#F59E0B' }}>₹2,350</div>
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#CDCDCD' }}>
                Kumar balance: ₹600 pending
              </div>
            </div>

            {/* Floating Glass Panel 3: Inventory (Bottom Center) */}
            <div
              className="liquid-glass-card liquid-glass-floating"
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '12px 22px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                zIndex: 10,
                width: 'max-content'
              }}
            >
              <div className="liquid-glass-card-reflection"></div>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={16} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#FFFFFF' }}>Ponni Boiled Rice</div>
                <div style={{ fontSize: '11px', color: '#CDCDCD' }}>Auto stock deducted: 110 kg remaining</div>
              </div>
              <span className="badge badge-success" style={{ fontSize: '10px' }}>In Stock</span>
            </div>
          </div>

          {/* Mobile Stacked Panels (Responsive for Handhelds) */}
          <div className="hero-floating-panels-mobile">
            <div className="liquid-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(25, 211, 162, 0.15)', color: '#19D3A2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#CDCDCD' }}>Today's Sales</div>
                  <div style={{ fontSize: '17px', fontWeight: '800', color: '#FFFFFF' }}>₹18,450</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: '#19D3A2', fontWeight: '700' }}>+24% today</span>
            </div>

            <div className="liquid-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#CDCDCD' }}>Customer Khata</div>
                  <div style={{ fontSize: '17px', fontWeight: '800', color: '#F59E0B' }}>₹2,350 pending</div>
                </div>
              </div>
              <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '600' }}>Kumar: ₹600</span>
            </div>

            <div className="liquid-glass-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(37, 99, 235, 0.15)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#CDCDCD' }}>Stock Health</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF' }}>Ponni Boiled Rice (110 kg)</div>
                </div>
              </div>
              <span className="badge badge-success" style={{ fontSize: '10px' }}>In Stock</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          FEATURES SECTION
          ------------------------------------------------------------- */}
      <section id="features" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1280px',
        margin: '60px auto 0 auto',
        padding: '80px 24px 40px 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="liquid-glass-badge" style={{ marginBottom: '14px' }}>
            <Zap size={13} />
            <span>CORE CAPABILITIES</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>
            Designed for Modern Small Businesses
          </h2>
          <p style={{ color: '#CDCDCD', fontSize: '16px', maxWidth: '640px', margin: '0 auto' }}>
            Eliminate tedious notebook accounting and slow POS typing. Manage everything with voice.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {/* Feature 1 */}
          <div className="liquid-glass-card" style={{ padding: '28px' }}>
            <div className="liquid-glass-card-reflection"></div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(25, 211, 162, 0.12)', color: '#19D3A2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', border: '1px solid rgba(25, 211, 162, 0.25)' }}>
              <Mic size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>
              Tamil & English Voice Entry
            </h3>
            <p style={{ fontSize: '14px', color: '#CDCDCD', lineHeight: 1.6, margin: 0 }}>
              Speak naturally in Tamil, English, or Tanglish. VoiceBiz AI extracts customers, items, quantities, and payment terms in real time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="liquid-glass-card" style={{ padding: '28px' }}>
            <div className="liquid-glass-card-reflection"></div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(25, 211, 162, 0.12)', color: '#19D3A2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', border: '1px solid rgba(25, 211, 162, 0.25)' }}>
              <Package size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>
              Intelligent Stock Deduction
            </h3>
            <p style={{ fontSize: '14px', color: '#CDCDCD', lineHeight: 1.6, margin: 0 }}>
              Inventory is verified before every sale. Once confirmed, stock counts adjust immediately with low-stock warnings when thresholds are crossed.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="liquid-glass-card" style={{ padding: '28px' }}>
            <div className="liquid-glass-card-reflection"></div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(25, 211, 162, 0.12)', color: '#19D3A2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', border: '1px solid rgba(25, 211, 162, 0.25)' }}>
              <CreditCard size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>
              Customer Khata & Balance Ledger
            </h3>
            <p style={{ fontSize: '14px', color: '#CDCDCD', lineHeight: 1.6, margin: 0 }}>
              Track credit sales and pending payments effortlessly. Settle customer balances via cash or UPI with 1-click settlement receipts.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="liquid-glass-card" style={{ padding: '28px' }}>
            <div className="liquid-glass-card-reflection"></div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(25, 211, 162, 0.12)', color: '#19D3A2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px', border: '1px solid rgba(25, 211, 162, 0.25)' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>
              Two-Step Owner Confirmation
            </h3>
            <p style={{ fontSize: '14px', color: '#CDCDCD', lineHeight: 1.6, margin: 0 }}>
              The AI never modifies your database blindly. It generates a preview card for your review, and records transactions only after you confirm.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          WORKFLOW / HOW IT WORKS SECTION
          ------------------------------------------------------------- */}
      <section id="workflow" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1280px',
        margin: '40px auto 0 auto',
        padding: '60px 24px'
      }}>
        <div className="liquid-glass-card" style={{ padding: '40px 32px', textAlign: 'center' }}>
          <div className="liquid-glass-card-reflection"></div>
          <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#FFFFFF', marginBottom: '8px' }}>
            How VoiceBiz AI Works
          </h3>
          <p style={{ fontSize: '14px', color: '#CDCDCD', marginBottom: '32px' }}>
            Zero complex menus — speak and verify in 3 simple steps
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            textAlign: 'left'
          }}>
            <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#19D3A2', marginBottom: '8px' }}>01</div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>Speak Sale Order</h4>
              <p style={{ fontSize: '13px', color: '#CDCDCD', lineHeight: 1.5, margin: 0 }}>
                Owner taps the mic and speaks in Tamil or English: "Kumar purchased 10 kg rice for 600 rupees."
              </p>
            </div>

            <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#19D3A2', marginBottom: '8px' }}>02</div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>AI Verification & Preview</h4>
              <p style={{ fontSize: '13px', color: '#CDCDCD', lineHeight: 1.5, margin: 0 }}>
                Backend verifies stock levels and customer Khata, showing an editable transaction preview card.
              </p>
            </div>

            <div style={{ padding: '20px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#19D3A2', marginBottom: '8px' }}>03</div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '6px' }}>Confirm & Auto-Update</h4>
              <p style={{ fontSize: '13px', color: '#CDCDCD', lineHeight: 1.5, margin: 0 }}>
                Owner clicks Confirm. Stock is deducted, customer balance is updated, and an invoice is generated!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          ABOUT SECTION
          ------------------------------------------------------------- */}
      <section id="about" style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '60px 24px 80px 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '30px',
          alignItems: 'center'
        }}>
          <div>
            <div className="liquid-glass-badge" style={{ marginBottom: '14px' }}>
              <Store size={14} />
              <span>BUILT FOR INDIAN RETAIL</span>
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em', margin: '0 0 16px 0' }}>
              Empowering Small Grocery, Textile & Provisional Shops
            </h2>
            <p style={{ color: '#CDCDCD', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
              Small Indian shop owners work 14 hours a day and struggle with manual pen-and-paper registers. VoiceBiz AI simplifies daily operations so owners can record transactions instantly between serving customers.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#FFFFFF' }}>
                <CheckCircle2 size={18} color="#19D3A2" />
                <span>Zero complex hardware or barcode scanners required</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#FFFFFF' }}>
                <CheckCircle2 size={18} color="#19D3A2" />
                <span>Works on any laptop, tablet, or smartphone browser</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#FFFFFF' }}>
                <CheckCircle2 size={18} color="#19D3A2" />
                <span>Dual language support with local Tamil dialect recognition</span>
              </div>
            </div>
          </div>

          {/* Testimonial / Store preview card */}
          <div className="liquid-glass-card" style={{ padding: '32px' }}>
            <div className="liquid-glass-card-reflection"></div>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏪</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
              Murugan Maligai & Department Store
            </div>
            <div style={{ fontSize: '13px', color: '#19D3A2', marginBottom: '16px' }}>
              Madurai, Tamil Nadu · Live VoiceBiz AI User
            </div>
            <p style={{ fontSize: '14px', color: '#CDCDCD', fontStyle: 'italic', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              "Recording credit sales in Tamil while weighing rice for customers saves me over an hour every night. No more lost balance sheets or forgotten payments!"
            </p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#CDCDCD' }}>Proprietor: S. Murugan</span>
              <span className="liquid-glass-badge" style={{ fontSize: '11px' }}>Verified Merchant</span>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          BOTTOM CALL TO ACTION BANNER
          ------------------------------------------------------------- */}
      <section style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1280px',
        margin: '0 auto 80px auto',
        padding: '0 24px'
      }}>
        <div className="liquid-glass-card" style={{
          padding: '50px 32px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(25, 211, 162, 0.12) 0%, rgba(255, 255, 255, 0.04) 100%)',
          borderColor: 'rgba(25, 211, 162, 0.35)'
        }}>
          <div className="liquid-glass-card-reflection"></div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '800', color: '#FFFFFF', marginBottom: '14px' }}>
            Ready to Transform Your Business with Voice?
          </h2>
          <p style={{ color: '#CDCDCD', fontSize: '16px', maxWidth: '620px', margin: '0 auto 30px auto' }}>
            Create an account in 30 seconds and start recording voice transactions today.
          </p>

          <button
            onClick={onGetStarted}
            className="liquid-glass-btn-primary"
            style={{ padding: '16px 38px', fontSize: '16px' }}
          >
            <span>Create Free Account</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* -------------------------------------------------------------
          FOOTER
          ------------------------------------------------------------- */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '30px 24px',
        textAlign: 'center',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ fontSize: '13px', color: '#CDCDCD' }}>
            © 2026 VoiceBiz AI · Voice-First Business Management for Indian MSMEs
          </div>
          <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
            <span style={{ color: '#CDCDCD' }}>Tamil & English Speech Recognition</span>
            <span style={{ color: '#19D3A2' }}>● Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

