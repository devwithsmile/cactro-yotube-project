import { fetchVideoData } from '../services/videoService.js';

export async function getVideoData(req, res) {
  try {
    const videoId = "ycYh3eL4NF0";
    const data = await fetchVideoData(videoId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video data' });
  }
}
