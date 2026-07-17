// Map videos to course topics - returns video file paths from public folder
// Now returns different videos for each lesson by using videoId as seed
export const getVideoForCourse = (courseId: string, videoId?: string): string => {
  const allVideos = [
    '/apartment-decor.mp4',
    '/boho-decor.mp4',
    '/dessert-table.mp4',
    '/digital-marketing.mp4',
    '/morning-routine.mp4',
    '/stretch-routine.mp4'
  ];

  // If we have a videoId, use it to create a deterministic but random selection
  // This ensures the same lesson always gets the same video, but different lessons get different videos
  if (videoId) {
    let hash = 0;
    for (let i = 0; i < videoId.length; i++) {
      hash = ((hash << 5) - hash) + videoId.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    const index = Math.abs(hash) % allVideos.length;
    return allVideos[index];
  }

  // Fallback: random video
  return allVideos[Math.floor(Math.random() * allVideos.length)];
};

// Get video style based on aspect ratio needs
export const getVideoStyle = () => {
  return {
    objectFit: 'contain' as const, // Contain vertical videos in horizontal frame
    backgroundColor: '#000',
  };
};
