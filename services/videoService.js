import ky from 'ky';
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || 'AIzaSyDngv7PREo2lVGVJe-e7EOq9uOyFiThMV0';

export async function fetchVideoData(videoId) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`;
  const response = await ky.get(url).json();
  const item = response.items && response.items[0];
  if (!item) return null;
  return {
    id: item.id,
    channelId: item.snippet.channelId,
    title: item.snippet.title,
    description: item.snippet.description,
    channelTitle: item.snippet.channelTitle,
    statistics: item.statistics,
  };
}
