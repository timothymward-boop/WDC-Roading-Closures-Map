import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import { Resend } from 'resend';
import path from 'path';

const app = express();
const PORT = 3000;

// Standard middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Resend with the provided API key
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Configure Multer for memory storage (max 40MB file size to match Resend limits)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 40 * 1024 * 1024 }
});

// API Route for submitting reports
app.post('/api/report', upload.single('media'), async (req, res) => {
  try {
    console.log('Received report submission:', req.body.location);
    
    if (!resend) {
      console.warn('Resend not configured, returning error');
      return res.status(500).json({ 
        success: false, 
        error: 'RESEND_API_KEY is not configured. Please add it to your environment variables.' 
      });
    }

    const { location, type, description, lat, lng, status } = req.body;
    const file = req.file;

    const isUpdate = type === 'update';
    const subjectPrefix = isUpdate ? 'UPDATE for Existing Road Issue' : 'New Road Issue Report';
    const headerText = isUpdate ? 'Update for Existing Road Issue' : 'New Road Issue Reported';

    const mapsLink = (lat && lng) ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : null;

    const attachments = [];
    if (file) {
      attachments.push({
        filename: file.originalname,
        content: file.buffer,
      });
    }

    // In Resend's testing mode, you can ONLY send emails to the address that owns the API key.
    // Based on the error, the API key belongs to tim.ward@wdc.govt.nz.
    // We are hardcoding this for now so the submission succeeds. Once you verify a domain on Resend,
    // you can change this back to use process.env.REPORT_RECIPIENT_EMAIL.
    const recipientEmail = 'tim.ward@wdc.govt.nz';

    // Resend requires sending from a verified domain, or their testing domain 'onboarding@resend.dev'
    const { data, error } = await resend.emails.send({
      from: 'Road Issue Reporter <onboarding@resend.dev>',
      to: [recipientEmail],
      subject: `${subjectPrefix}: ${location}`,
      html: `
        <h2>${headerText}</h2>
        <p><strong>Location:</strong> ${location}</p>
        ${mapsLink ? `<p><strong>Google Maps Link:</strong> <a href="${mapsLink}">${mapsLink}</a></p>` : ''}
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Road Status:</strong> ${status || 'Not specified'}</p>
        <p><strong>Description:</strong> ${description}</p>
      `,
      attachments: attachments,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return res.status(400).json({ success: false, error: error.message || 'Failed to send email via Resend' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send report' });
  }
});

// API Route for fetching road closures (Mocking RAMM websource)
app.get('/api/closures', (req, res) => {
  // In a real implementation, this would fetch from the RAMM API
  // For now, we return the mock data with updated timestamps to simulate "fresh" data
  const mockClosures = [
    {
      id: "1",
      roadName: "Ngunguru Road",
      type: "Slip",
      status: "Investigating",
      lat: -35.689,
      lng: 174.456,
      description: "Large slip blocking one lane near the golf course.",
      reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "2",
      roadName: "State Highway 1",
      type: "Flooding",
      status: "Closed",
      lat: -35.801,
      lng: 174.312,
      description: "Flooding across both lanes south of Oakleigh.",
      reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "3",
      roadName: "Riverside Drive",
      type: "Tree Down",
      status: "Clearing",
      lat: -35.728,
      lng: 174.335,
      description: "Tree blocking the footpath and cycleway.",
      reportedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "4",
      roadName: "Whareora Road",
      type: "Pothole",
      status: "Reported",
      lat: -35.705,
      lng: 174.360,
      description: "Deep pothole in the left lane heading east.",
      reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    }
  ];
  
  res.json(mockClosures);
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy route to bypass CORS for RAMM API
app.get('/api/proxy/ramm', async (req, res) => {
  try {
    const targetUrl = 'https://map-auea.ramm.com/v2/mapping/settingdata/296/dc7b8b7b-4273-485a-94a7-4fd02723f982/?format=geojson&forcePoint=false';
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`Upstream responded with status: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('RAMM Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch tracking configuration' });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: `File upload error: ${err.message}` });
  }
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
