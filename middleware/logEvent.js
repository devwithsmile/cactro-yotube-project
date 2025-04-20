import EventLog from '../models/eventLogModel.js';

export default async function logEvent(req, res, next) {
  const { user, method, path, body, query } = req;
  const userId = user ? user._id : null;
  
  try {
    // Skip logging for static resources or health checks
    if (path.startsWith('/api-docs') || path === '/health') {
      return next();
    }

    const eventLog = new EventLog({
      userId,
      action: `${method} ${path}`,
      details: {
        body: method !== 'GET' ? body : undefined,
        query: Object.keys(query).length ? query : undefined,
      },
    });

    // Don't block the request flow, log asynchronously
    eventLog.save().catch(err => console.error('Event logging error:', err));
    
    next();
  } catch (error) {
    console.error('Logging middleware error:', error);
    next(); // Continue even if logging fails
  }
}
