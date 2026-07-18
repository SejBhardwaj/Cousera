import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete?: () => void;
  fillColor?: string;
  duration?: number;
}

/**
 * Advanced Loading Screen Component
 * Animated preloader with 5 vertical bars that fill sequentially
 * Based on Framer's LoadScreen component with smooth transitions
 */
export default function LoadingScreen({ 
  onComplete, 
  fillColor = '#D7FF54',
  duration = 3200 
}: LoadingScreenProps) {
  const [variant, setVariant] = useState<'initial' | 'bar1' | 'bar2' | 'bar3' | 'complete'>('initial');
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Animation sequence
    const timers: NodeJS.Timeout[] = [];

    // Variant 1 → Variant 2 (1000ms delay)
    timers.push(setTimeout(() => {
      setVariant('bar1');
    }, 1000));

    // Variant 2 → Variant 3 (200ms delay)
    timers.push(setTimeout(() => {
      setVariant('bar2');
    }, 1200));

    // Variant 3 → Variant 4 (200ms delay)
    timers.push(setTimeout(() => {
      setVariant('bar3');
    }, 1400));

    // Final complete state
    timers.push(setTimeout(() => {
      setVariant('complete');
    }, 1600));

    // Fade out and call onComplete
    timers.push(setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, duration));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [onComplete, duration]);

  // Calculate bar heights based on variant
  const getBarHeight = (barIndex: number): string => {
    switch (variant) {
      case 'initial':
        return '100%';
      
      case 'bar1':
        // Bar 3 (middle) starts filling
        if (barIndex === 2) return '0%';
        return '100%';
      
      case 'bar2':
        // Bars 2, 3, 4 fill
        if (barIndex === 1 || barIndex === 2 || barIndex === 3) return '0%';
        return '100%';
      
      case 'bar3':
      case 'complete':
        // All bars filled
        return '0%';
      
      default:
        return '100%';
    }
  };

  // Transition configuration
  const barTransition = {
    duration: variant === 'initial' ? 2 : 1,
    ease: [1, 0, 0.56, 1],
    type: 'tween' as const
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            backgroundColor: '#0F0F0F',
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Full-width container for bars */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'stretch',
            }}
          >
            {/* Bar 1 - 10% position */}
            <motion.div
              animate={{
                height: getBarHeight(0),
              }}
              transition={barTransition}
              style={{
                position: 'absolute',
                left: '0%',
                width: '20%',
                backgroundColor: fillColor,
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                bottom: 0,
                top: 0,
              }}
            />

            {/* Bar 2 - 20% position */}
            <motion.div
              animate={{
                height: getBarHeight(1),
              }}
              transition={barTransition}
              style={{
                position: 'absolute',
                left: '20%',
                width: '20%',
                backgroundColor: fillColor,
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                bottom: 0,
                top: 0,
              }}
            />

            {/* Bar 3 - 40% position (middle - fills first) */}
            <motion.div
              animate={{
                height: getBarHeight(2),
              }}
              transition={barTransition}
              style={{
                position: 'absolute',
                left: '40%',
                width: '20%',
                backgroundColor: fillColor,
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                bottom: 0,
                top: 0,
              }}
            />

            {/* Bar 4 - 60% position */}
            <motion.div
              animate={{
                height: getBarHeight(3),
              }}
              transition={barTransition}
              style={{
                position: 'absolute',
                left: '60%',
                width: '20%',
                backgroundColor: fillColor,
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                bottom: 0,
                top: 0,
              }}
            />

            {/* Bar 5 - 80% position */}
            <motion.div
              animate={{
                height: getBarHeight(4),
              }}
              transition={barTransition}
              style={{
                position: 'absolute',
                left: '80%',
                width: '20%',
                backgroundColor: fillColor,
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
                bottom: 0,
                top: 0,
              }}
            />

            {/* Logo and branding in center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: variant === 'complete' ? 0 : 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: 'calc(50% - 60px)',
                left: 'calc(50% - 40px)',
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px',
              }}
            >
              {/* Logo */}
              <motion.img 
                src="/download (1).jpg" 
                alt="Coursera" 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '32px',
                  objectFit: 'cover',
                  boxShadow: '0 30px 80px rgba(215, 255, 84, 0.3)',
                }}
              />
              
              {/* Coursera text */}
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 900,
                  letterSpacing: '0.02em',
                }}
              >
                Coursera
              </motion.div>

              {/* Progress dots */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut'
                    }}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: fillColor,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
