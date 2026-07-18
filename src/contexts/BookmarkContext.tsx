import { createContext, useContext, useState, ReactNode } from 'react';

interface BookmarkContextType {
  bookmarks: string[];
  addBookmark: (courseName: string) => void;
  removeBookmark: (courseName: string) => void;
  isBookmarked: (courseName: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<string[]>([
    'Deep Learning Specialization',
    'React for Beginners',
    'Product Management'
  ]);

  const addBookmark = (courseName: string) => {
    if (!bookmarks.includes(courseName)) {
      setBookmarks([...bookmarks, courseName]);
    }
  };

  const removeBookmark = (courseName: string) => {
    setBookmarks(bookmarks.filter(b => b !== courseName));
  };

  const isBookmarked = (courseName: string) => {
    return bookmarks.includes(courseName);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within BookmarkProvider');
  }
  return context;
}
