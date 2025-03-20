import test from 'node:test';

const APP_URL = process.env.APP_URL;


const VALID_VIDEO_URL = 'https://www.youtube.com/watch?v=7wtfhZwyrcc';
const LONG_DURATION_VIDEO_URL = 'https://www.youtube.com/watch?v=scayzGBLDCI';

test('should get video metadata when URL is valid', async function(t) {
    t.plan(5);

    const raw = await fetch(`${APP_URL}/api/metadata?url=${VALID_VIDEO_URL}`);
    const data = await raw.json();

    t.assert.equal(
        raw.status,
        200,
        'should return 200 status code'
    );
    t.assert.equal(
        data.title,
        'Imagine Dragons - Believer (Official Music Video)',
        'should return the correct video title'
    );
    t.assert.equal(
        data.duration,
        217,
        'should return the correct video duration'
    );
    t.assert.ok(
        data.thumbnail.startsWith('http'),
        'should return a valid thumbnail URL'
    );
    t.assert.ok(
        data.token,
        'should return a valid token'
    );
});

test('should get mp3 audio stream when URL and metadata are valid', async function(t) {
    t.plan(3);

    const {token} = await (
        await fetch(`${APP_URL}/api/metadata?url=${VALID_VIDEO_URL}`)
    ).json();

    const raw = await fetch(`${APP_URL}/api/mp3?metadata=${token}`);
    await raw.arrayBuffer();
    const contentType = raw.headers.get('content-type');
    const disposition = raw.headers.get('content-disposition');

    t.assert.equal(
        raw.status,
        200,
        'should return 200 status code'
    );
    t.assert.ok(
        disposition.includes('attachment; filename='),
        'should return an attachment header'
    );
    t.assert.equal(
        contentType,
        'audio/mpeg',
        'should return an mp3 audio stream'
    );
});

test('should not allow videos with duration greater than 10 minutes', async function(t) {
    t.plan(2);

    const raw = await fetch(`${APP_URL}/api/metadata?url=${LONG_DURATION_VIDEO_URL}`);
    const data = await raw.json();

    t.assert.equal(
        data.message,
        'Video duration should not exceed 10 minutes',
        'should return an error message'
    );
    t.assert.equal(
        raw.status,
        400,
        'should return 400 status code'
    );
});

test('should throw error when URL is not provided', async function(t) {
    t.plan(2);

    const raw = await fetch(`${APP_URL}/api/metadata`);
    const data = await raw.json();

    t.assert.equal(
        data.message,
        'URL query parameter is required',
        'should return an error message'
    );
    t.assert.equal(
        raw.status,
        400,
        'should return 400 status code'
    );
});

test('should throw error when URL is not a valid Youtube video URL', async function(t) {
    t.plan(2);

    const raw = await fetch(`${APP_URL}/api/metadata?url=https://example.com`);
    const data = await raw.json();

    t.assert.equal(
        data.message,
        'A valid Youtube video URL is expected',
        'should return an error message'
    );
    t.assert.equal(
        raw.status,
        400,
        'should return 400 status code'
    );
});

test('should throw error when yt-dlp fails', async function(t) {
    t.plan(2);

    const raw = await fetch(`${APP_URL}/api/metadata?url=https://www.youtube.com/watch?v=invalid`);
    const data = await raw.json();

    t.assert.equal(
        data.message,
        'Incomplete YouTube ID invalid. URL https://www.youtube.com/watch?v=invalid looks truncated.',
        'should return an error message'
    );
    t.assert.equal(
        raw.status,
        500,
        'should return 500 status code'
    );
});

test('should throw error when metadata is invalid', async function(t) {
    t.plan(2);

    const raw = await fetch(`${APP_URL}/api/mp3?metadata=invalid`);
    const data = await raw.json();

    t.assert.equal(
        data.message,
        'Invalid token',
        'should return an error message'
    );
    t.assert.equal(
        raw.status,
        400,
        'should return 400 status code'
    );
});
