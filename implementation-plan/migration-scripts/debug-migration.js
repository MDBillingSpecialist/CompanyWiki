/**
 * Debug Migration Script
 * 
 * This script attempts to perform a simple GraphQL query to Wiki.js to test the API connectivity.
 */
const axios = require('axios');

async function main() {
  const apiUrl = 'http://localhost:3200/graphql';
  const apiKey = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOjEsImdycCI6MSwiaWF0IjoxNzQzMDU3MjUyLCJleHAiOjE4Mzc3MzAwNTIsImF1ZCI6InVybjp3aWtpLmpzIiwiaXNzIjoidXJuOndpa2kuanMifQ.V6iKmJAQTsyRMogksxh5ek7VG31g8wwiNUPi5BLY3-lFiHkjlIT2mw2ytPKy2H_aFAjI7hew9MoH5lpFGdpxGRUnirKvopo9fOqQONg-08dguuFbtzGJ_i_k4J4ao_LDeapmlPoyys8F3xVSTU1B_SrATfd0Aq_EDJ3pbSlO7FlPGWMjfVUtY7x-LXpFRbMoJr56bxJer0fNNJpqtHdfbvQ3xCtA_bUmlo7NRN5CAG4GZ1JwS2C4YWBCn57aVFwHdnjdpPE6WfmYmhBpA0_omNBS6UWCK3elgK76H2m9DZN_DVX_A5-9MnVVm1YTSanpl441xASerpm5GsfTWcoVtw';
  
  // Create a client
  const client = axios.create({
    baseURL: apiUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    }
  });

  try {
    console.log('Testing Wiki.js GraphQL API connection...');
    console.log(`API URL: ${apiUrl}`);
    console.log('API Key: [REDACTED]');
    
    // First try to ping the server
    try {
      console.log('\nTesting HTTP connection...');
      const pingResponse = await axios.get('http://localhost:3200/');
      console.log(`Server response: HTTP ${pingResponse.status}`);
    } catch (pingError) {
      console.error(`Error connecting to server: ${pingError.message}`);
    }
    
    // Try a simple query
    console.log('\nTesting GraphQL API with simple query...');
    
    const simpleQuery = `
      query {
        pages {
          list {
            id
            title
            path
          }
        }
      }
    `;
    
    try {
      const response = await client.post('', {
        query: simpleQuery
      });
      
      console.log('GraphQL Response:');
      console.log(JSON.stringify(response.data, null, 2));
      
      if (response.data.errors) {
        console.error('GraphQL Errors:');
        console.error(JSON.stringify(response.data.errors, null, 2));
      } else {
        console.log('Query successful!');
      }
    } catch (error) {
      console.error('GraphQL Query Error:');
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error('Response data:');
        console.error(JSON.stringify(error.response.data, null, 2));
        console.error('Response headers:');
        console.error(JSON.stringify(error.response.headers, null, 2));
      } else {
        console.error(error.message);
      }
    }
    
    // Try to create a simple page
    console.log('\nTesting page creation...');
    const createQuery = `
      mutation CreateTestPage {
        pages {
          create(
            content: "# Test Page\\n\\nThis is a test page created by the migration script."
            description: "Test page"
            isPublished: true
            isPrivate: false
            path: "test/page"
            title: "Test Page"
          ) {
            responseResult {
              succeeded
              errorCode
              slug
              message
            }
            page {
              id
              path
              title
            }
          }
        }
      }
    `;
    
    try {
      const createResponse = await client.post('', {
        query: createQuery
      });
      
      console.log('Create Page Response:');
      console.log(JSON.stringify(createResponse.data, null, 2));
      
      if (createResponse.data.errors) {
        console.error('GraphQL Errors:');
        console.error(JSON.stringify(createResponse.data.errors, null, 2));
      } else {
        console.log('Page creation test complete!');
      }
    } catch (createError) {
      console.error('Page Creation Error:');
      if (createError.response) {
        console.error(`Status: ${createError.response.status}`);
        console.error('Response data:');
        console.error(JSON.stringify(createError.response.data, null, 2));
      } else {
        console.error(createError.message);
      }
    }
    
  } catch (error) {
    console.error('Error testing Wiki.js API:', error.message);
  }
}

main();