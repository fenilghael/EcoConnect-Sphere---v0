// Simple script to create admin account via API
// Run this with: node create-admin-simple.js

const https = require('https');
const http = require('http');

const makeRequest = (url, data) => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = client.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(responseData);
          resolve(jsonResponse);
        } catch (error) {
          reject(new Error('Invalid JSON response: ' + responseData));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

async function createAdmin() {
  try {
    console.log('🌱 Creating admin account for EcoConnect Sphere...');
    
    const response = await makeRequest(
      'http://localhost:5000/api/auth/create-admin',
      JSON.stringify({})
    );

    if (response.success) {
      console.log('🎉 Admin account created successfully!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email:', response.credentials.email);
      console.log('🔑 Password:', response.credentials.password);
      console.log('👤 Role:', response.credentials.role);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚠️  Please change the password after first login!');
    } else {
      console.log('⚠️', response.message);
      if (response.credentials) {
        console.log('Existing admin credentials:');
        console.log('📧 Email:', response.credentials.email);
        console.log('🔑 Password:', response.credentials.password);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('💡 Make sure the backend server is running on http://localhost:5000');
  }
}

createAdmin();
