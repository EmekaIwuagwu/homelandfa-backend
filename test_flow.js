const fetch = require('node-fetch'); // node-fetch might not be installed, use native fetch in node 18+

async function testFlow() {
    const baseUrl = 'http://localhost:4000/api';

    console.log('1. Logging in...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: 'admin@homelandfa.com',
            password: 'password123'
        })
    });

    if (!loginRes.ok) {
        const err = await loginRes.text();
        console.error('Login Failed:', err);
        return;
    }

    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log('✅ Login Successful. Token obtained.');

    console.log('\n2. Fetching Dashboard Overview...');
    const statsRes = await fetch(`${baseUrl}/stats/overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!statsRes.ok) {
        console.error('Stats Failed:', await statsRes.text());
        return;
    }

    const stats = await statsRes.json();
    console.log('✅ Stats Retrieved:', stats);

    console.log('\n3. Creating Test Application...');
    const appRes = await fetch(`${baseUrl}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            player_name: "Test Player",
            date_of_birth: "2010-01-01",
            gender: "Male",
            preferred_program: "Elite Squad",
            parent_name: "Test Parent",
            phone: "08012345678",
            email: "test@example.com",
            emergency_contact_name: "Emergency",
            emergency_contact_phone: "08000000000"
        })
    });

    const appData = await appRes.json();
    console.log('✅ Application Created:', appData);
}

testFlow().catch(console.error);
