import { X, Download, Share2 } from 'lucide-react';

interface CertificateViewerModalProps {
  isOpen: boolean;
  certificateUrl: string;
  courseName: string;
  onClose: () => void;
}

export default function CertificateViewerModal({
  isOpen,
  certificateUrl,
  courseName,
  onClose,
}: CertificateViewerModalProps) {
  if (!isOpen) return null;

  const handleDownloadCertificate = async () => {
    try {
      // Fetch the certificate image
      const response = await fetch(certificateUrl);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create filename with course name and date
      const filename = `Certificate_${courseName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.jpg`;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Certificate downloaded:', filename);
    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  const handleShare = () => {
    const text = `I earned my certificate for "${courseName}"! 🎓`;
    const url = window.location.href;
    
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: 'Certificate Achievement',
        text: text,
        url: url,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('Link copied to clipboard!');
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 animate-in"
      style={{ 
        background: 'rgba(0,0,0,0.5)', 
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full animate-in"
        style={{ 
          animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-110 z-10"
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
        >
          <X size={20} color="#6B6B7B" strokeWidth={2.5} />
        </button>

        {/* Certificate Container */}
        <div 
          className="rounded-3xl overflow-hidden bg-white p-6"
          style={{ 
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
          }}
        >
          {/* Certificate Image */}
          <div className="relative rounded-2xl overflow-hidden mb-4" style={{ background: '#F6F6F8' }}>
            <img 
              src={certificateUrl} 
              alt={`Certificate for ${courseName}`}
              className="w-full h-auto object-contain"
              style={{ maxHeight: '70vh' }}
            />
          </div>

          {/* Certificate Info & Actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-text text-lg mb-1">{courseName}</h3>
              <p className="text-sm text-muted">Certificate of Completion</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 hover:bg-gray-100 active:scale-95"
                style={{ 
                  background: '#F6F6F8',
                  color: '#0F0F0F',
                  border: '1px solid #E0E0E8'
                }}
              >
                <Share2 size={16} />
                Share
              </button>

              <button
                onClick={handleDownloadCertificate}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ 
                  background: 'linear-gradient(135deg, #D7FF54 0%, #A98BFF 100%)',
                  color: '#111',
                  boxShadow: '0 4px 16px rgba(215,255,84,0.3)'
                }}
              >
                <Download size={16} />
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
