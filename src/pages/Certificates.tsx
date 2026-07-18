import { useState } from 'react';
import { Award, Download, Share2, ExternalLink, ChevronRight, Star, Clock } from 'lucide-react';
import CertificateViewerModal from '../components/CertificateViewerModal';

const EARNED = [
  {
    title: 'IBM Data Science Professional',
    org: 'IBM',
    date: 'June 15, 2024',
    id: 'CERT-IBM-2024-001',
    logo: '/1a68e21c776065c70542e56ea014cfa5.jpg',
    skills: ['Data Science', 'Machine Learning', 'Python', 'SQL'],
    certificateUrl: '/4ea3d43a265ee2fe179e46725dc9d525.jpg', // Actual certificate template
  },
  {
    title: 'Adobe Certified Professional',
    org: 'Adobe',
    date: 'April 2, 2024',
    id: 'CERT-ADOBE-2024-042',
    logo: '/4cda0b662effeca9c714884a3bc47ce1.jpg',
    skills: ['Photoshop', 'Illustrator', 'Design', 'Creative Cloud'],
    certificateUrl: '/006b282426f45d4bc580ad68c7eed561.jpg', // Actual certificate template
  },
  {
    title: 'AWS Certified Solutions Architect',
    org: 'Amazon Web Services',
    date: 'December 10, 2023',
    id: 'CERT-AWS-2023-189',
    logo: '/69ada9679e4233a8a33e1151027d820f.jpg',
    skills: ['Cloud Computing', 'AWS', 'EC2', 'S3', 'Lambda'],
    certificateUrl: '/7a0417bf7db91b0dd4de5c541b1eb55b.jpg', // Actual certificate template
  },
];

const UPCOMING = [
  {
    title: 'Meta Front-End Developer',
    org: 'Meta',
    progress: 68,
    logo: '/e06c061bc3c7558aefe2fbe49e2ca4c3.jpg',
    estComplete: 'Aug 2024',
  },
  {
    title: 'Stanford Machine Learning Specialization',
    org: 'Stanford University',
    progress: 34,
    logo: '/a0380e4cc974803f294c86a131633a01.jpg',
    estComplete: 'Nov 2024',
  },
  {
    title: 'IIT Cloud Computing Certification',
    org: 'IIT',
    progress: 12,
    logo: '/68cfd7f5e403cdcbe6b4730a6a868c91.jpg',
    estComplete: 'Jan 2025',
  },
];

const PROFESSIONAL_CERTS = [
  {
    title: 'Stanford Machine Learning Specialization',
    org: 'Stanford University',
    duration: '6 months',
    rating: 4.8,
    enrolled: '500K+',
    logo: '/a0380e4cc974803f294c86a131633a01.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    title: 'Meta Back-End Developer',
    org: 'Meta',
    duration: '7 months',
    rating: 4.8,
    enrolled: '200K+',
    logo: '/e06c061bc3c7558aefe2fbe49e2ca4c3.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
  },
  {
    title: 'IIT Cloud Computing Certification',
    org: 'IIT',
    duration: '3 months',
    rating: 4.7,
    enrolled: '350K+',
    logo: '/68cfd7f5e403cdcbe6b4730a6a868c91.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
  },
];

export default function Certificates() {
  const [showCertificateViewer, setShowCertificateViewer] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<{ url: string; name: string } | null>(null);

  const handleViewCertificate = (certificateUrl: string, title: string) => {
    setSelectedCertificate({ url: certificateUrl, name: title });
    setShowCertificateViewer(true);
  };

  return (
    <div className="flex-1 py-4 px-4 md:pr-4 md:pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Header */}
      <div
        className="p-7 rounded-4xl"
        style={{ background: 'linear-gradient(135deg, #111111 0%, #1a1a2e 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: '#D7FF54' }}>
                <Award size={18} color="#111" />
              </div>
              <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Certificates</span>
            </div>
            <h1 className="text-section text-white mb-2">Your Achievements</h1>
            <p className="text-white/50 text-sm">Showcase your skills with industry-recognized credentials</p>
          </div>
          <div className="flex gap-4">
            {[
              { label: 'Earned', value: '3' },
              { label: 'In Progress', value: '3' },
              { label: 'Skills', value: '14' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earned Certificates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-card-title text-text">Earned Certificates</h2>
          <span className="tag text-xs font-bold" style={{ background: '#ECFDF5', color: '#059669' }}>3 earned</span>
        </div>
        <div className="space-y-4">
          {EARNED.map((cert) => (
            <div
              key={cert.id}
              className="card-static rounded-4xl overflow-hidden p-0 group hover:-translate-y-1 transition-transform duration-200 cursor-pointer"
              onClick={() => handleViewCertificate(cert.certificateUrl, cert.title)}
            >
              <div className="flex">
                {/* Color bar */}
                <div className="w-2 flex-shrink-0" style={{ background: cert.color }} />
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-14 h-14 rounded-3xl flex items-center justify-center flex-shrink-0 bg-white border border-border p-2"
                      >
                        <img src={cert.logo} alt={cert.org} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h3 className="font-bold text-text text-base mb-0.5">{cert.title}</h3>
                        <p className="text-sm text-muted mb-1">{cert.org}</p>
                        <p className="text-xs text-muted/70">Issued {cert.date} · ID: {cert.id}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {cert.skills.map((skill) => (
                            <span key={skill} className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: '#F6F6F8' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="w-9 h-9 rounded-2xl flex items-center justify-center border border-border hover:bg-bg transition-colors" title="Download">
                        <Download size={14} />
                      </button>
                      <button className="w-9 h-9 rounded-2xl flex items-center justify-center border border-border hover:bg-bg transition-colors" title="Share">
                        <Share2 size={14} />
                      </button>
                      <button className="w-9 h-9 rounded-2xl flex items-center justify-center border border-border hover:bg-bg transition-colors" title="View">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* In Progress */}
      <div>
        <h2 className="text-card-title text-text mb-4">In Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {UPCOMING.map((c) => (
            <div key={c.title} className="card-static p-5 rounded-3xl">
              <div className="w-16 h-16 rounded-2xl mb-3 flex items-center justify-center bg-white border border-border p-2">
                <img src={c.logo} alt={c.org} className="w-full h-full object-contain" />
              </div>
              <h3 className="font-bold text-text text-sm mb-1">{c.title}</h3>
              <p className="text-xs text-muted mb-4">{c.org} · Est. {c.estComplete}</p>
              <div className="h-2 bg-gray-100 rounded-full mb-2">
                <div className="h-full rounded-full" style={{ width: `${c.progress}%`, background: 'linear-gradient(90deg, #A98BFF 0%, #D7FF54 100%)' }} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Progress</span>
                <span className="font-bold text-text">{c.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Certificates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-card-title text-text">Explore Professional Certificates</h2>
          <button className="text-sm font-semibold text-muted hover:text-text transition-colors flex items-center gap-1">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROFESSIONAL_CERTS.map((c) => (
            <div
              key={c.title}
              className="card-static rounded-3xl overflow-hidden p-0 cursor-pointer hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="h-32 overflow-hidden relative">
                <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center p-1">
                    <img src={c.logo} alt={c.org} className="w-full h-full object-contain" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-black/50">{c.org}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-text text-sm mb-2">{c.title}</h3>
                <div className="flex items-center justify-between text-xs text-muted">
                  <div className="flex items-center gap-1">
                    <Star size={11} fill="#F59E0B" color="#F59E0B" />
                    <span className="font-semibold text-text">{c.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>{c.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" />

      {/* Certificate Viewer Modal */}
      {selectedCertificate && (
        <CertificateViewerModal
          isOpen={showCertificateViewer}
          certificateUrl={selectedCertificate.url}
          courseName={selectedCertificate.name}
          onClose={() => {
            setShowCertificateViewer(false);
            setSelectedCertificate(null);
          }}
        />
      )}
    </div>
  );
}


