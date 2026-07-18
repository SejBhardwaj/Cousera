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

    // Final complete state
    timers.push(setTimeout(() => {
      setVariant('complete');
    }, 1600));

    // Hide loading screen and show website
    timers.push(setTimeout(() => {
      setIsVisible(false);
      // Small delay to ensure loading screen is gone before showing content
      setTimeout(() => {
        onComplete?.();
      }, 100);
    }, 1800));

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [onComplete, duration]);

  // Calculate bar Y translation (slide down like curtain)
  const getBarTranslateY = (barIndex: number): string => {
    switch (variant) {
      case 'initial':
        return '0%';
      
      case 'bar1':
        // Bar 3 (middle) slides down first
        if (barIndex === 2) return '100%';
        return '0%';
      
      case 'bar2':
        // Bars 2, 3, 4 slide down
        if (barIndex === 1 || barIndex === 2 || barIndex === 3) return '100%';
        return '0%';
      
      case 'bar3':
      case 'complete':
        // All bars slid down
        return '100%';
      
      default:
        return '0%';
    }
  };

  // Transition configuration - smooth curtain slide
  const barTransition = {
    duration: 0.8,
    ease: [0.43, 0.13, 0.23, 0.96], // Smooth curtain easing
    type: 'tween' as const
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0 }}
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
          {/* Full-width container for bars with minimal gaps */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              display: 'flex',
              gap: '1px', // Ultra-thin gap
              backgroundColor: '#0F0F0F',
            }}
          >
            {/* Bar 1 - Left */}
            <motion.div
              animate={{
                y: getBarTranslateY(0),
              }}
              transition={barTransition}
              style={{
                flex: 1,
                backgroundColor: fillColor,
                height: '100%',
                position: 'relative',
              }}
            />

            {/* Bar 2 */}
            <motion.div
              animate={{
                y: getBarTranslateY(1),
              }}
              transition={barTransition}
              style={{
                flex: 1,
                backgroundColor: fillColor,
                height: '100%',
                position: 'relative',
              }}
            />

            {/* Bar 3 - Middle (slides first) */}
            <motion.div
              animate={{
                y: getBarTranslateY(2),
              }}
              transition={barTransition}
              style={{
                flex: 1,
                backgroundColor: fillColor,
                height: '100%',
                position: 'relative',
              }}
            />

            {/* Bar 4 */}
            <motion.div
              animate={{
                y: getBarTranslateY(3),
              }}
              transition={barTransition}
              style={{
                flex: 1,
                backgroundColor: fillColor,
                height: '100%',
                position: 'relative',
              }}
            />

            {/* Bar 5 - Right */}
            <motion.div
              animate={{
                y: getBarTranslateY(4),
              }}
              transition={barTransition}
              style={{
                flex: 1,
                backgroundColor: fillColor,
                height: '100%',
                position: 'relative',
              }}
            />

            {/* Logo and branding in center */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: variant === 'complete' ? 0 : 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                top: '40%', // Bit upwards from center
                left: '45%', // Bit leftwards from center
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
