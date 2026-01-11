const fetch = require('node-fetch');
const fs = require('fs');
const assert = require('assert');

// Helper wrapper for fetch
const baseUrl = 'http://localhost:4000/api';
let authToken = '';
let applicationId = '';
let videoId = '';

const headers = () => ({
    'Content-Type': 'application/json',
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
});

async function runTests() {
    console.log('🚀 Starting Comprehensive API Test Suite...\n');
    const results = { passed: 0, failed: 0 };

    const test = async (name, fn) => {
        try {
            await fn();
            console.log(`✅ [PASS] ${name}`);
            results.passed++;
        } catch (error) {
            console.error(`❌ [FAIL] ${name}`);
            console.error(`   Error: ${error.message}`);
            if (error.response) console.error(`   Response: ${error.response}`);
            results.failed++;
        }
    };

    // --- AUTHENTICATION TESTS ---

    await test('Auth: Login Admin', async () => {
        const res = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@homelandfa.com', password: 'password123' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        assert.ok(data.token, 'Token missing');
        authToken = data.token;
    });

    await test('Auth: Get Current User (Me)', async () => {
        const res = await fetch(`${baseUrl}/auth/me`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        assert.strictEqual(data.user.email, 'admin@homelandfa.com');
    });

    // --- APPLICATION TESTS ---

    await test('Apps: Create Application (Public)', async () => {
        const payload = {
            player_name: "Test Junior",
            date_of_birth: "2012-05-20",
            gender: "Male",
            preferred_program: "Development Squad",
            parent_name: "Test Parent",
            phone: "08099999999",
            email: "parent@test.com",
            emergency_contact_name: "Mom",
            emergency_contact_phone: "08088888888"
        };

        const res = await fetch(`${baseUrl}/applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || JSON.stringify(data.errors));
        assert.ok(data.id, 'Application ID missing');
        applicationId = data.id;
    });

    await test('Apps: List Applications (Protected)', async () => {
        const res = await fetch(`${baseUrl}/applications`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        assert.ok(Array.isArray(data.data), 'Data is not an array');
        assert.ok(data.total >= 1, 'Total count should be at least 1');
    });

    await test('Apps: Update Status', async () => {
        const res = await fetch(`${baseUrl}/applications/${applicationId}/status`, {
            method: 'PATCH',
            headers: headers(),
            body: JSON.stringify({ status: 'approved' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        assert.strictEqual(data.success, true);
    });

    await test('Apps: Check Status Update', async () => {
        const res = await fetch(`${baseUrl}/applications/${applicationId}`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        assert.strictEqual(data.application.status, 'approved');
    });

    await test('Apps: Export CSV', async () => {
        const res = await fetch(`${baseUrl}/applications/export`, { headers: headers() });
        if (!res.ok) throw new Error('Export failed');
        const text = await res.text();
        assert.ok(text.includes('Test Junior'), 'CSV should contain player name');
        assert.ok(text.includes('parent@test.com'), 'CSV should contain email');
    });

    // --- VIDEO TESTS ---

    await test('Videos: Create Video', async () => {
        const payload = {
            title: "New Training Drill",
            description: "Speed work",
            category: "Training",
            youtube_url: "https://youtube.com/watch?v=123",
            duration: 120
        };

        const res = await fetch(`${baseUrl}/videos`, {
            method: 'POST',
            headers: headers(),
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || JSON.stringify(data.errors));
        assert.ok(data.video.id, 'Video ID missing');
        videoId = data.video.id;
    });

    await test('Videos: Get All (Public)', async () => {
        // No auth header needed
        const res = await fetch(`${baseUrl}/videos`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        assert.ok(data.data.length > 0, 'Should return videos');
    });

    await test('Videos: Update Video', async () => {
        const res = await fetch(`${baseUrl}/videos/${videoId}`, {
            method: 'PATCH',
            headers: headers(),
            body: JSON.stringify({ title: "Updated Drill Title" })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        assert.strictEqual(data.video.title, "Updated Drill Title");
    });

    await test('Videos: Delete Video', async () => {
        const res = await fetch(`${baseUrl}/videos/${videoId}`, {
            method: 'DELETE',
            headers: headers()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        assert.strictEqual(data.message, 'Video deleted');
    });

    // --- STATS TESTS ---

    await test('Stats: Overview', async () => {
        const res = await fetch(`${baseUrl}/stats/overview`, { headers: headers() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        assert.ok(typeof data.totalApplications === 'number');
    });

    console.log('\n--- TEST SUMMARY ---');
    console.log(`Total: ${results.passed + results.failed}`);
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);

    if (results.failed > 0) process.exit(1);
}

runTests().catch(console.error);
