import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mic, 
  Send, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Languages, 
  ArrowRight,
  Info,
  HelpCircle
} from 'lucide-react';
import VoiceMicButton from '../components/VoiceMicButton';
import TransactionPreviewCard from '../components/TransactionPreviewCard';
import { useBusiness } from '../context/BusinessContext';
import api from '../services/api';

export default function VoiceAssistant({ setActiveTab }) {
  const { activeLang, changeLanguage, geminiApiKey, refreshAll, showToast } = useBusiness();

  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample prompt chips for quick testing
  const samplePrompts = {
    en: [
      {
        label: 'Guru Credit (₹500 Pending)',
        text: 'Guru 500 rupees pending he will pay tomorrow'
      },
      {
        label: 'Kumar Rice (Credit / Tomorrow)',
        text: 'Today Kumar purchased 10 kg rice for 600 rupees. He will pay tomorrow.'
      },
      {
        label: 'Priya Sunflower Oil (Cash)',
        text: 'Priya bought 2 liters sunflower oil for 290 rupees cash'
      },
      {
        label: 'Karthik Atta (UPI)',
        text: 'Karthik purchased 5 kg atta for 275 rupees paid by UPI'
      },
      {
        label: 'Anitha White Sugar (Pending)',
        text: 'Anitha bought 10 kg sugar for 440 rupees balance pending'
      }
    ],
    ta: [
      {
        label: 'குரு ₹500 கடன் (பாக்கி)',
        text: 'குரு 500 ரூபாய் கடன் பிறகு தருவார்'
      },
      {
        label: 'குமார் அரிசி (கடன் / நாளை)',
        text: 'இன்று குமார் 10 கிலோ அரிசி 600 ரூபாய்க்கு வாங்கினார். நாளை பணம் தருவார்.'
      },
      {
        label: 'பிரியா எண்ணெய் (ரொக்கம்)',
        text: 'பிரியா 2 லிட்டர் சூரியகாந்தி எண்ணெய் 290 ரூபாய்க்கு ரொக்கமாக வாங்கினார்'
      },
      {
        label: 'கார்த்திக் கோதுமை மாவு',
        text: 'கார்த்திக் 5 கிலோ மாவு 275 ரூபாய் பணம் தந்தார்'
      },
      {
        label: 'அனிதா சர்க்கரை (பாக்கி)',
        text: 'அனிதா 5 கிலோ சர்க்கரை 220 ரூபாய் பிறகு தருவார்'
      }
    ]
  };

  const handleProcessText = async (textToProcess) => {
    const text = textToProcess || transcript;
    if (!text || text.trim() === '') {
      setErrorMsg('Please speak or type a transaction command first.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg('');
      setPreview(null);

      const result = await api.processVoice(text, activeLang, geminiApiKey);
      if (result.success && result.preview) {
        setPreview(result.preview);
      } else {
        setErrorMsg(result.error || 'Failed to extract transaction details.');
      }
    } catch (err) {
      console.error('AI voice process failed:', err);
      setErrorMsg(err.message || 'Error processing speech command.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpeechResult = (finalTranscript) => {
    setTranscript(finalTranscript);
    setInterimText('');
    handleProcessText(finalTranscript);
  };

  const handleConfirmTransaction = async (finalData) => {
    try {
      setIsSaving(true);
      await api.createTransaction({
        ...finalData,
        inputMethod: 'voice',
        voiceTranscript: transcript,
        detectedLanguage: activeLang
      });

      // Celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      showToast(`Sale recorded successfully! Stock deducted and customer Khata updated.`);
      await refreshAll();

      // Reset state
      setPreview(null);
      setTranscript('');
      setInterimText('');

    } catch (err) {
      showToast('Failed to save transaction: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelPreview = () => {
    setPreview(null);
    showToast('Transaction canceled', 'warning');
  };

  const activeChips = samplePrompts[activeLang] || samplePrompts.en;

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>

      {/* Top Banner / Guidance */}
      <div className="card" style={{
        background: 'linear-gradient(to right, #ffffff, #f0fdf4)',
        borderColor: '#bbf7d0',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', marginBottom: '8px' }}>
              <Languages size={14} />
              <span>{activeLang === 'ta' ? 'தமிழ் & English குரல் மேலாளர்' : 'Tamil & English Speech Recognition'}</span>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
              {activeLang === 'ta' ? 'குரல் மூலம் விற்பனை பதிவு செய்யுங்கள்' : 'Speak to Create Verified Sales'}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, maxWidth: '650px' }}>
              {activeLang === 'ta'
                ? 'மைக் பட்டனை அழுத்தி "குமார் 10 கிலோ அரிசி 600 ரூபாய் நாளை தருவார்" என பேசுங்கள். AI பில் விவரங்களை சரிபார்த்து உறுதி செய்யக் காட்டும்.'
                : 'Click the mic and speak natural phrases like "Today Kumar purchased 10 kg rice for 600 rupees. He will pay tomorrow." VoiceBiz AI extracts details for your confirmation.'}
            </p>
          </div>

          {/* Language Switch */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid #cbd5e1'
          }}>
            <button
              onClick={() => changeLanguage('ta')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeLang === 'ta' ? '#059669' : 'transparent',
                color: activeLang === 'ta' ? '#ffffff' : '#64748b',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              🇮🇳 தமிழ் (Tamil)
            </button>
            <button
              onClick={() => changeLanguage('en')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeLang === 'en' ? '#059669' : 'transparent',
                color: activeLang === 'en' ? '#ffffff' : '#64748b',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              🇬🇧 English
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Mic Section */}
      <div className="card" style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Large Mic Button */}
        <VoiceMicButton
          language={activeLang}
          isProcessing={isProcessing}
          onTranscriptReady={handleSpeechResult}
          onInterimText={(txt) => setInterimText(txt)}
        />

        {/* Live Recognized Text Box */}
        <div style={{ width: '100%', maxWidth: '700px', marginTop: '24px' }}>
          <div style={{
            position: 'relative',
            backgroundColor: '#f8fafc',
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '16px 20px',
            minHeight: '80px',
            textAlign: 'left'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {activeLang === 'ta' ? 'பதிவான குரல் உரை (Recognized Speech):' : 'Recognized Speech Transcript:'}
            </span>

            <textarea
              className="input-control"
              rows={2}
              value={transcript || interimText}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={activeLang === 'ta' 
                ? 'மைக் மூலம் பேசுங்கள் அல்லது இங்கே நேரடியாக தட்டச்சு செய்து Parse AI ஐ அழுத்தவும்...' 
                : 'Speak with microphone or type your transaction command here...'}
              style={{
                marginTop: '8px',
                border: 'none',
                backgroundColor: 'transparent',
                padding: 0,
                fontSize: '15px',
                fontWeight: '500',
                color: '#0f172a',
                resize: 'none'
              }}
            />

            {interimText && (
              <div style={{ fontSize: '12px', color: '#059669', fontStyle: 'italic', marginTop: '4px' }}>
                Listening: {interimText}...
              </div>
            )}
          </div>

          {/* Action buttons under input */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <button
              onClick={() => { setTranscript(''); setInterimText(''); setPreview(null); }}
              className="btn btn-secondary"
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              <RotateCcw size={13} />
              <span>Clear</span>
            </button>

            <button
              onClick={() => handleProcessText(transcript)}
              disabled={isProcessing || (!transcript && !interimText)}
              className="btn btn-primary"
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              <Sparkles size={15} />
              <span>{isProcessing ? 'Analyzing...' : 'Parse with AI & Validate'}</span>
            </button>
          </div>
        </div>

        {/* Error alert */}
        {errorMsg && (
          <div style={{
            marginTop: '16px',
            padding: '10px 16px',
            borderRadius: '8px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Instant Testing Chips */}
        <div style={{ marginTop: '28px', maxWidth: '780px', width: '100%' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={13} color="#059669" />
            <span>{activeLang === 'ta' ? 'ஒரு முறை கிளிக் செய்து சோதிக்கவும் (Try Sample Commands):' : 'One-Click Quick Test Chips:'}</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {activeChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(chip.text);
                  handleProcessText(chip.text);
                }}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  color: '#334155',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#059669';
                  e.currentTarget.style.backgroundColor = '#ecfdf5';
                  e.currentTarget.style.color = '#065f46';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#334155';
                }}
              >
                <span style={{ fontWeight: '700' }}>{chip.label}:</span>
                <span style={{ opacity: 0.85 }}>"{chip.text.slice(0, 38)}..."</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* AI Transaction Preview Card */}
      {preview && (
        <TransactionPreviewCard
          preview={preview}
          onConfirm={handleConfirmTransaction}
          onCancel={handleCancelPreview}
          isSaving={isSaving}
        />
      )}

      {/* Workflow Explanation Banner */}
      <div className="card" style={{ backgroundColor: '#f8fafc', padding: '20px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={16} color="#059669" />
          <span>How VoiceBiz AI Protects Your Business Data</span>
        </h4>
        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
          As designed in our strict workflow, the AI <strong>never directly modifies</strong> your database.
          Instead, speech is extracted into a preview, the backend verifies inventory and customer Khata, you inspect the details, and the sale is recorded <strong>only when you click Confirm</strong>.
        </p>
      </div>

    </div>
  );
}

