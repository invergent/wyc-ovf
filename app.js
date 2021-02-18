const express = require('express');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const path = require('path');

const app = express();
const port = parseInt(process.env.PORT, 10) || 8000;

const whitelist = [
  'cleontime.whytecleon.ng',
  'cleontime-ui-test.whytecleon.ng',
  'appraisal.whytecleon.ng',
  'appraisal-test.whytecleon.ng'
];

app.set('trust proxy', true);

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 600 // limit each IP to 100 requests per windowMs
});

const resetLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5 // limit each IP to 100 requests per windowMs
});
 
//  apply to all requests
app.use('/login/', limiter);
app.use('/logout/', limiter);
app.use('/admin/', limiter);
app.use('/line-manager/', limiter);
app.use('/staff/', limiter);
app.use('/forgot-password/', resetLimiter);
app.use('/confirm-reset-request/', resetLimiter);
app.use('/password-reset/', resetLimiter);

app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'use.fontawesome.com', '*.pusher.com', '*.cloudinary.com', '*.whytecleon.ng'],
    styleSrc: ["'self'", "'unsafe-inline'", 'use.fontawesome.com'],
    scriptSrc: ["'self'", "'unsafe-eval'", '*.pusher.com'],
    imgSrc: ["'self'", 'data:', '*.cloudinary.com']
  }
}))

app.use((req, res, next) => {
  if (!['development', 'test'].includes(process.env.NODE_ENV)) {
    const { hostname, headers: { host, referer }, secure } = req;
    const forwardedHost = req.headers['x-forwarded-host'];
  
    if (!whitelist.includes(hostname)) return res.status(403).send('Not allowed');
    if (hostname !== host) return res.status(403).send('Not allowed');
    if (forwardedHost && (forwardedHost !== hostname)) {
      return res.status(403).send('Not allowed');
    }
    if (!secure) return res.redirect(`https://${hostname}${req.url}`);
    if (referer) {
      const refererHost = referer.split('/')[2];
      if (!whitelist.includes(refererHost)) {
        return res.status(403).send('Not allowed');
      }
    }
  }

  return next();
});

app.use(express.static('dist/overtime-frontend'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/overtime-frontend/index.html'));
});

app.listen(port);
