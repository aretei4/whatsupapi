const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const app = express();
const port = 3000;

const DOCUMENT_SERVER_SECRET = 'GDA7GiDZsGkmwnSryjynvVyxAR3fhS'; // Must match Document Server config

// Generate JWT token
function generateToken(documentKey) {
  return jwt.sign(
    {     
		 // "docc": "dcox",
		   document: {
			//fileType: "docx",
			key: documentKey,
			fileType: "docx",
            title: "Document.docx",
            url: "http://localhost:3000/download",
			  //title: "Document.docx",
			   //url: "http://localhost:3000/download"
			    permissions: {
				edit: true, // Must be true
				download: true,
				print: false
			  }
		   },
		   editorConfig: {
            callbackUrl: "http://localhost:3000/save",
            user: { id: "user-1", name: "John Doe" },
          }
        // Optional: Add permissions or other metadata     
    },
    DOCUMENT_SERVER_SECRET,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
}

// Serve the editor page
app.get('/editor', (req, res) => {
	// Example: Force a new document.key on each session
const documentKey = Date.now() + "_" + Math.random().toString(36).substr(2);
 // const documentKey = 'doc8999-56123'; // Unique document ID
  const token = generateToken(documentKey);
  const config = 
	 console.log("Received payload:",token);
  const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <script src="http://localhost/web-apps/apps/api/documents/api.js"></script>
    </head>
    <body>
      <div id="onlyoffice-editor" style="width:100%;height:800px"></div>
      <script>
        const docEditor = new DocsAPI.DocEditor("onlyoffice-editor", {
          document: {
            fileType: "docx",
            key: "${documentKey}",
            title: "Document.docx",
            url: "http://localhost:${port}/download",
			  permissions: {
				edit: true, // Must be true
				download: true,
				print: false
			  }
          },
          documentType: "word",
          editorConfig: {
            callbackUrl: "http://localhost:${port}/save",
            user: { id: "user-1", name: "John Doe" },
          },
          token: "${token}" // Attach the JWT token
        });
      </script>
    </body>
  </html>
  `;

  res.send(html);
});

// File download endpoint
app.get('/download', (req, res) => {
  res.sendFile('./example.docx', { root: __dirname });
});

// File save endpoint (with JWT validation)
app.post('/save', express.json(), (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    jwt.verify(token, DOCUMENT_SERVER_SECRET);
    // Save the file from req.body.url
    res.status(200).json({ error: 0 });
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));