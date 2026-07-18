import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface IOSToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function IOSToggle({ 
  checked = false, 
  onChange, 
  disabled = false,
  size = 'md' 
}: IOSToggleProps) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleToggle = () => {
    if (disabled) return;
    
    const newValue = !isChecked;
    setIsChecked(newValue);
    
    // Play click sound
    playClickSound();
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const playClickSound = () => {
    try {
      // Only run in browser environment
      if (typeof window === 'undefined') return;
      
      // Check if AudioContext is available
      const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      
      // Create a subtle click sound using Web Audio API
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = isChecked ? 800 : 1000;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
      // Clean up
      setTimeout(() => {
        audioContext.close();
      }, 200);
    } catch (error) {
      // Silently fail if audio context not available
      console.debug('Audio not available:', error);
    }
  };

  // Size configurations (reduced to normal iOS toggle sizes)
  const sizeConfig = {
    sm: { width: 40, height: 24, knobSize: 20 },
    md: { width: 51, height: 31, knobSize: 27 },
    lg: { width: 60, height: 36, knobSize: 32 }
  };

  const { width, height, knobSize } = sizeConfig[size];

  return (
    <button
      onClick={handleToggle}
      disabled={disabled}
      className="relative focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 rounded-full transition-all duration-200"
      style={{ 
        width: `${width}px`, 
        height: `${height}px`,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      aria-checked={isChecked}
      role="switch"
    >
      {/* Track Background */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={{
          backgroundColor: isChecked 
            ? 'rgb(215, 255, 84)' // Lime/yellowish when ON (#D7FF54)
            : 'rgb(227, 227, 227)' // Gray when OFF
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          boxShadow: 'inset 0px 1px 2px 0px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* I and O indicators */}
        <motion.div
          className="absolute top-1/2 flex items-center justify-between"
          style={{
            width: `${width - 6}px`,
            height: '16px',
            transform: 'translateY(-50%)',
          }}
          initial={false}
          animate={{
            left: isChecked ? '58%' : '29%',
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 60
          }}
        >
          {/* I indicator (line) */}
          <div 
            className="bg-white rounded-full"
            style={{ 
              width: '2px', 
              height: '16px',
              opacity: isChecked ? 0 : 0.8
            }}
          />
          
          {/* O indicator (circle) */}
          <div 
            className="rounded-full border-3 border-gray-50"
            style={{ 
              width: '16px', 
              height: '16px',
              borderWidth: '3px',
              borderColor: 'rgb(250, 250, 250)',
              opacity: isChecked ? 0.8 : 0
            }}
          />
        </motion.div>
      </motion.div>

      {/* Knob */}
      <motion.div
        className="absolute top-1/2"
        style={{
          width: `${knobSize}px`,
          height: `${knobSize}px`,
          transform: 'translateY(-50%)',
        }}
        initial={false}
        animate={{
          left: isChecked ? `${width - knobSize - 3}px` : '3px',
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 60
        }}
      >
        {/* Knob Outer Shadow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(180deg, rgb(255, 255, 255) 0%, rgb(209, 209, 209) 100%)',
            boxShadow: `
              0px 0.82px 1.15px -0.625px rgba(0, 0, 0, 0.26),
              0px 2.11px 2.95px -1.25px rgba(0, 0, 0, 0.25),
              0px 4.23px 5.92px -1.875px rgba(0, 0, 0, 0.24),
              0px 8.01px 11.21px -2.5px rgba(0, 0, 0, 0.22),
              0px 15.92px 22.29px -3.125px rgba(0, 0, 0, 0.18),
              0px 35px 49px -3.75px rgba(0, 0, 0, 0.09)
            `,
          }}
        />
        
        {/* Knob Inner */}
        <div
          className="absolute rounded-full"
          style={{
            width: `${knobSize - 2}px`,
            height: `${knobSize - 2}px`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'linear-gradient(180deg, rgb(242, 242, 242) 0%, rgb(232, 232, 232) 100%)',
          }}
        />
      </motion.div>

      {/* Interaction Area (Extended clickable area) */}
      <div 
        className="absolute"
        style={{
          top: '-22px',
          left: '-30px',
          right: '-30px',
          bottom: '-23px',
        }}
      />
    </button>
  );
}
