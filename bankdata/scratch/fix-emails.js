const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres.mgmfcxpjweljmyfvjupg:IdealForAgentFirstWorkflowsUpdateYourSchemaInCodePushItToGitHubAndSupa@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres'
});
async function run() {
  await client.connect();
  const res = await client.query("SELECT id, email FROM auth.users WHERE email NOT LIKE '%@%.%'");
  console.log('Invalid emails found:', res.rows);
  
  if (res.rows.length > 0) {
    console.log('Fixing emails by appending .go.id ...');
    await client.query("UPDATE auth.users SET email = email || '.go.id' WHERE email NOT LIKE '%@%.%'");
    console.log('Fixed.');
  } else {
    console.log('No invalid emails found.');
  }
  await client.end();
}
run().catch(console.error);
