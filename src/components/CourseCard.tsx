import { Bookmark, Star, Clock, Play, ChevronRight, Download } from 'lucide-react';
import { useState } from 'react';
import { useBookmark } from '../contexts/BookmarkContext';

interface Course {
  id: string;
  title: string;
  provider: string;
  instructor: string;
  instructorImg: string;
  thumbnail: string;
  category: string;
  categoryColor: string;
  rating: number;
  reviews: number;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress?: number;
  enrolled?: boolean;
  description?: string;
  tags?: string[];
}

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  compact?: boolean;
  isOfflineAvailable?: boolean;
}

const difficultyColors = {
  Beginner: { bg: '#ECFDF5', text: '#059669' },
  Intermediate: { bg: '#EFF6FF', text: '#2563EB' },
  Advanced: { bg: '#FEF3C7', text: '#D97706' },
};

export default function CourseCard({ course, onClick, compact = false, isOfflineAvailable = false }: CourseCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmark();
  const bookmarked = isBookmarked(course.title);
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(course.title);
    } else {
      addBookmark(course.title);
    }
  };

  const diff = difficultyColors[course.difficulty];

  // Fallback image based on category color
  const getFallbackImage = () => {
    return `data:image/svg+xml,%3Csvg width='1200' height='800' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1200' height='800' fill='${encodeURIComponent(course.categoryColor)}'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' font-weight='bold' fill='white' text-anchor='middle' dy='.3em'%3E${encodeURIComponent(course.title.slice(0, 30))}%3C/text%3E%3C/svg%3E`;
  };

  const thumbnailSrc = imageError ? getFallbackImage() : course.thumbnail;

  if (compact) {
    return (
      <div
        className="bg-white rounded-3xl overflow-hidden cursor-pointer"
        style={{
          boxShadow: hovered ? '0 8px 40px rgba(0,0,0,0.12)' : '0 4px 24px rgba(0,0,0,0.07)',
          transform: hovered ? 'translateY(-3px)' : 'none',
          transition: 'all 0.22s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <div className="relative h-36 overflow-hidden">
          <img
            src={thumbnailSrc}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <span
            className="absolute top-3 left-3 tag text-white text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: course.categoryColor }}
          >
            {course.category}
          </span>
          {isOfflineAvailable && (
            <span
              className="absolute top-3 left-3 tag text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ background: '#059669', marginTop: '32px' }}
            >
              <Download size={11} />
              Offline
            </span>
          )}
          <button
            onClick={handleBookmarkClick}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Bookmark size={13} fill={bookmarked ? '#0F0F0F' : 'none'} color="#0F0F0F" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs font-semibold text-muted mb-1">{course.provider}</p>
          <h3 className="font-semibold text-text text-sm leading-snug line-clamp-2 mb-3">{course.title}</h3>
          {course.progress !== undefined && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Progress</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${course.progress}%`, background: course.categoryColor }}
                />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star size={11} fill="#F59E0B" color="#F59E0B" />
              <span className="text-xs font-semibold text-text">{course.rating}</span>
              <span className="text-xs text-muted">({course.reviews.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted">
              <Clock size={11} />
              <span>{course.duration}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-4xl overflow-hidden cursor-pointer"
      style={{
        boxShadow: hovered ? '0 12px 48px rgba(0,0,0,0.14)' : '0 4px 28px rgba(0,0,0,0.07)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={thumbnailSrc}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Play overlay */}
        {hovered && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-float-lg">
              <Play size={20} fill="#0F0F0F" color="#0F0F0F" />
            </div>
          </div>
        )}

        {/* Badges */}
        <span
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: course.categoryColor }}
        >
          {course.category}
        </span>
        {isOfflineAvailable && (
          <span
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5"
            style={{ background: '#059669', marginTop: '40px' }}
          >
            <Download size={12} />
            Offline
          </span>
        )}
        <button
          onClick={handleBookmarkClick}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md"
        >
          <Bookmark size={15} fill={bookmarked ? '#0F0F0F' : 'none'} color="#0F0F0F" />
        </button>

        {/* Progress bar at bottom of image */}
        {course.progress !== undefined && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
            <div
              className="h-full"
              style={{ width: `${course.progress}%`, background: '#D7FF54' }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Provider + Instructor */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={course.instructorImg}
            alt={course.instructor}
            className="w-7 h-7 rounded-full object-cover"
          />
          <div>
            <p className="text-xs font-bold text-muted leading-none">{course.provider}</p>
            <p className="text-xs text-muted/70 leading-none mt-0.5">{course.instructor}</p>
          </div>
        </div>

        <h3 className="font-bold text-text text-base leading-snug mb-3 line-clamp-2">{course.title}</h3>

        {/* Progress if enrolled */}
        {course.progress !== undefined && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted mb-1.5">
              <span className="font-medium">Progress</span>
              <span className="font-bold text-text">{course.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${course.progress}%`, background: course.categoryColor }}
              />
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <Star size={13} fill="#F59E0B" color="#F59E0B" />
            <span className="text-xs font-bold text-text">{course.rating}</span>
            <span className="text-xs text-muted">({course.reviews.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted">
            <Clock size={13} />
            <span>{course.duration}</span>
          </div>
          <span
            className="ml-auto px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: diff.bg, color: diff.text }}
          >
            {course.difficulty}
          </span>
        </div>

        {/* Action */}
        <button
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:shadow-lg active:scale-[0.98]"
          style={{
            background: course.enrolled ? '#0F0F0F' : '#D7FF54',
            color: course.enrolled ? '#ffffff' : '#111111',
          }}
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
          {course.enrolled ? (
            <>
              <Play size={14} fill="currentColor" />
              Continue Learning
            </>
          ) : (
            <>
              Enroll Now
              <ChevronRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export type { Course };
