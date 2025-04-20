import ky from 'ky';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyDngv7PREo2lVGVJe-e7EOq9uOyFiThMV0';
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Fetch video details (expanded with more data)
export async function fetchVideoData(videoId, accessToken = null) {
  const url = `${YOUTUBE_API_BASE}/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
  
  try {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    const response = await ky.get(url, { headers }).json();
    const item = response.items && response.items[0];
    
    if (!item) return null;
    
    return {
      id: item.id,
      channelId: item.snippet.channelId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      statistics: item.statistics,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails
    };
  } catch (error) {
    console.error('Error fetching video data:', error);
    throw error;
  }
}

// Update video title and description
export async function updateVideoMetadata(videoId, title, description, accessToken) {
  if (!accessToken) {
    throw new Error('Authentication required for this operation');
  }
  
  // First, get the current video data to ensure we have the proper etag
  const url = `${YOUTUBE_API_BASE}/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
  
  try {
    const currentVideo = await ky.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` }
    }).json();
    
    if (!currentVideo.items || !currentVideo.items[0]) {
      throw new Error('Video not found');
    }
    
    const video = currentVideo.items[0];
    const snippet = video.snippet;
    
    // Update with new data
    snippet.title = title || snippet.title;
    snippet.description = description || snippet.description;
    
    // Send update to YouTube
    const updateUrl = `${YOUTUBE_API_BASE}/videos?part=snippet&key=${YOUTUBE_API_KEY}`;
    const response = await ky.put(updateUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      json: {
        id: videoId,
        snippet: snippet,
      }
    }).json();
    
    return response;
  } catch (error) {
    console.error('Error updating video metadata:', error);
    throw error;
  }
}

// Fetch comments for a video
export async function fetchVideoComments(videoId, accessToken = null) {
  const url = `${YOUTUBE_API_BASE}/commentThreads?part=snippet,replies&videoId=${videoId}&key=${YOUTUBE_API_KEY}`;
  
  try {
    const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
    const response = await ky.get(url, { headers }).json();
    
    return response.items.map(item => {
      const comment = item.snippet.topLevelComment.snippet;
      return {
        id: item.id,
        commentId: item.snippet.topLevelComment.id,
        text: comment.textDisplay,
        authorDisplayName: comment.authorDisplayName,
        authorProfileImageUrl: comment.authorProfileImageUrl,
        authorChannelId: comment.authorChannelId,
        likeCount: comment.likeCount,
        publishedAt: comment.publishedAt,
        updatedAt: comment.updatedAt,
        replies: item.replies ? item.replies.comments.map(reply => ({
          id: reply.id,
          text: reply.snippet.textDisplay,
          authorDisplayName: reply.snippet.authorDisplayName,
          authorProfileImageUrl: reply.snippet.authorProfileImageUrl,
          authorChannelId: reply.snippet.authorChannelId,
          likeCount: reply.snippet.likeCount,
          publishedAt: reply.snippet.publishedAt,
          updatedAt: reply.snippet.updatedAt,
        })) : []
      };
    });
  } catch (error) {
    console.error('Error fetching video comments:', error);
    throw error;
  }
}

// Add a comment to a video
export async function addComment(videoId, text, accessToken) {
  if (!accessToken) {
    throw new Error('Authentication required for this operation');
  }
  
  const url = `${YOUTUBE_API_BASE}/commentThreads?part=snippet&key=${YOUTUBE_API_KEY}`;
  
  try {
    const response = await ky.post(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      json: {
        snippet: {
          videoId: videoId,
          topLevelComment: {
            snippet: {
              textOriginal: text
            }
          }
        }
      }
    }).json();
    
    return response;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

// Reply to a comment
export async function replyToComment(commentId, text, accessToken) {
  if (!accessToken) {
    throw new Error('Authentication required for this operation');
  }
  
  const url = `${YOUTUBE_API_BASE}/comments?part=snippet&key=${YOUTUBE_API_KEY}`;
  
  try {
    const response = await ky.post(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },
      json: {
        snippet: {
          parentId: commentId,
          textOriginal: text
        }
      }
    }).json();
    
    return response;
  } catch (error) {
    console.error('Error replying to comment:', error);
    throw error;
  }
}

// Delete a comment
export async function deleteComment(commentId, accessToken) {
  if (!accessToken) {
    throw new Error('Authentication required for this operation');
  }
  
  const url = `${YOUTUBE_API_BASE}/comments?id=${commentId}&key=${YOUTUBE_API_KEY}`;
  
  try {
    await ky.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

// Rate a video (like or dislike)
export async function rateVideo(videoId, rating, accessToken) {
  if (!accessToken) {
    throw new Error('Authentication required for this operation');
  }
  
  // rating must be one of: 'like', 'dislike', 'none'
  if (!['like', 'dislike', 'none'].includes(rating)) {
    throw new Error('Invalid rating value. Must be one of: like, dislike, none');
  }
  
  const url = `${YOUTUBE_API_BASE}/videos/rate?id=${videoId}&rating=${rating}&key=${YOUTUBE_API_KEY}`;
  
  try {
    await ky.post(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return { success: true, rating };
  } catch (error) {
    console.error('Error rating video:', error);
    throw error;
  }
}

// Get current rating for a video
export async function getVideoRating(videoId, accessToken) {
  if (!accessToken) {
    throw new Error('Authentication required for this operation');
  }
  
  const url = `${YOUTUBE_API_BASE}/videos/getRating?id=${videoId}&key=${YOUTUBE_API_KEY}`;
  
  try {
    const response = await ky.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).json();
    
    // Response has format: { items: [{ videoId: '...', rating: 'like|dislike|none|unspecified' }] }
    const rating = response.items[0]?.rating || 'none';
    return { rating };
  } catch (error) {
    console.error('Error getting video rating:', error);
    throw error;
  }
}
