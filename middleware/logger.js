/**
 * Request Logging Middleware
 * Day 4 Homework - Backend Integration Upgrade
 */

/**
 * Log all incoming requests
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // Capture original end function
  const originalEnd = res.end;
  
  // Override end to log response time
  res.end = function(chunk, encoding) {
    const responseTime = Date.now() - start;
    
    // Log response
    const logEntry = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      userAgent: req.get('user-agent'),
      ip: req.ip
    };
    
    // Color coded output based on status
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log(`  ✓ ${req.method} ${req.path} - ${res.statusCode} (${responseTime}ms)`);
    } else if (res.statusCode >= 400 && res.statusCode < 500) {
      console.log(`  ⚠ ${req.method} ${req.path} - ${res.statusCode} (${responseTime}ms)`);
    } else if (res.statusCode >= 500) {
      console.log(`  ✗ ${req.method} ${req.path} - ${res.statusCode} (${responseTime}ms)`);
    }
    
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

/**
 * API-specific logger for cleaner output
 */
const apiLogger = (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    const start = Date.now();
    
    console.log(`  API: ${req.method} ${req.path}`);
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`  └─ ${res.statusCode} [${duration}ms]`);
    });
  }
  
  next();
};

/**
 * Error logger
 */
const errorLogger = (err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()}`);
  console.error(`  Message: ${err.message}`);
  console.error(`  Stack: ${err.stack}`);
  console.error(`  Route: ${req.method} ${req.path}`);
  
  next(err);
};

module.exports = {
  requestLogger,
  apiLogger,
  errorLogger
};
