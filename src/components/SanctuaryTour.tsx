import React, { useState, useEffect } from 'react';

export default function MasterSanctuaryTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const tourSteps = [
    {
      title: "The Brain Dump & AI Advocate 🧠",
      text: "Welcome to your home base. Our trauma-informed Soul Echo AI listens to your streaming thoughts, spoken audio, or nonverbal shapes and colors drawn on the expression canvas. The AI automatically interprets your choices with deep empathy—you never have to worry about how to prompt or format text correctly."
    },
    {
      title: "Universal Communication Freedom 🗣️",
      text: "You can dynamically switch between our 5 core input methods: Speak It, Sign It, Point It, Type It, or Connect Device at any single point, inside any room, completely on the fly. Connect Device seamlessly integrates your external AAC hardware via Bluetooth or USB."
    },
    {
      title: "The 9 Healing Rooms 🌿",
      text: "Our sidebar gives you access to 9 structural healing spaces. The Breathe room contains 8 scrollable section cards mapping out meditation basics, all 13 Chakras including Earth Star as Chakra 0, and specialized Solfeggio frequency treatments."
    },
    {
      title: "Hardened Safety & SOS Signals 🔐",
      text: "Your safety is our absolute priority. If an emotional crisis occurs, our secure database layer instantly monitors distress signals within pre-defined safe parameters, routing real-time coordinates to Intercessors on Call and dispatchers immediately."
    },
    {
      title: "The Dual Professional Network 💼",
      text: "Our practitioner portal allows verified holistic health specialists to securely log in, cross-sync metrics, view permitted client mood logs, and distribute custom healing resources and meditative soundscapes directly into the community grid."
    },
    {
      title: "Understanding the Access Tiers 📊",
      text: "Brain Dump is always completely unlimited and free. The Individual Free Tier grants a 33-day trial, after which regular healing rooms limit to 1 use per space every 11 days. Subscribing to paid tiers removes restrictions, and the Ultimate Tier opens exclusive beta testing rooms."
    },
    {
      title: "The Community Evolution Hub 👥",
      text: "Our libraries grow continuously as we bring on more healers. The Community sidebar tab is your space to share stories, find support within our 4 distinct healing circles, and submit active suggestions to help shape what we build next."
    },
    {
      title: "The Creator Ecosystem Portfolio 🚀",
      text: "Explore our entire digital network right from the interface. You can jump directly into our other integrated sister applications: Aurora, the ultimate smart creator commerce and incubation platform, and Size Me Up, our universal cross-retailer fit filtering application."
    }
  ];

  const speakSectionText = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); 
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (isOpen) {
      speakSectionText(tourSteps[currentStep].text);
    }
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [currentStep, isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: '#fffdf4',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 12px 24px -3px rgba(0,0,0,0.15)',
      maxWidth: '360px',
      zIndex: 9999,
      fontFamily: 'sans-serif'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ margin: 0, color: '#0F172A', fontSize: '16px', fontWeight: 'bold' }}>
          {tourSteps[currentStep].title}
        </h4>
        <button 
          onClick={() => {
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            setIsOpen(false);
          }} 
          style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', color: '#6B7280' }}
        >
          ✕
        </button>
      </div>
      
      <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: '0 0 20px 0' }}>
        {tourSteps[currentStep].text}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5E7EB', paddingTop: '14px' }}>
        <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>
          Step {currentStep + 1} of {tourSteps.length}
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {currentStep > 0 && (
            <button 
              disabled={isSpeaking}
              onClick={() => setCurrentStep(prev => prev - 1)}
              style={{ 
                padding: '6px 14px', 
                borderRadius: '8px', 
                border: '1px solid #D1D5DB', 
                background: '#fff', 
                cursor: isSpeaking ? 'not-allowed' : 'pointer', 
                fontSize: '13px', 
                opacity: isSpeaking ? 0.5 : 1 
              }}
            >
              Back
            </button>
          )}
          {currentStep < tourSteps.length - 1 ? (
            <button 
              disabled={isSpeaking}
              onClick={() => setCurrentStep(prev => prev + 1)}
              style={{ 
                padding: '6px 14px', 
                borderRadius: '8px', 
                border: 'none', 
                background: isSpeaking ? '#94a3b8' : '#00cc88', 
                color: '#fff', 
                fontWeight: 'bold', 
                cursor: isSpeaking ? 'not-allowed' : 'pointer', 
                fontSize: '13px' 
              }}
            >
              {isSpeaking ? 'Speaking...' : 'Next'}
            </button>
          ) : (
            <button 
              disabled={isSpeaking}
              onClick={() => setIsOpen(false)}
              style={{ 
                padding: '6px 14px', 
                borderRadius: '8px', 
                border: 'none', 
                background: '#0F172A', 
                color: '#fff', 
                fontWeight: 'bold', 
                cursor: isSpeaking ? 'not-allowed' : 'pointer', 
                fontSize: '13px' 
              }}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
