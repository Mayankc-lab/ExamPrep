import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const BASE = 'http://localhost:5000/api/v1';

async function run() {
  try {
    const email = process.env.TEST_ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.TEST_ADMIN_PASSWORD || 'AdminPassword123!';

    // Login
    const loginRes = await axios.post(`${BASE}/user/login`, { email, password }, { validateStatus: () => true });
    if (loginRes.status !== 200) {
      console.error('Login failed', loginRes.status, loginRes.data);
      process.exit(1);
    }

    const setCookie = loginRes.headers['set-cookie'];
    const cookieHeader = Array.isArray(setCookie) ? setCookie.map((c) => c.split(';')[0]).join('; ') : setCookie;
    console.log('Logged in, cookie:', cookieHeader);

    // Get courses
    let coursesRes = await axios.get(`${BASE}/course`, { headers: { Cookie: cookieHeader } });
    let courses = coursesRes.data.courses || [];

    let courseId;
    if (courses.length === 0) {
      // create a course
      const createRes = await axios.post(`${BASE}/course`, { title: 'Test Course', description: 'desc', category: 'Test', createdBy: 'Tester' }, { headers: { Cookie: cookieHeader } });
      if (createRes.status !== 200) {
        console.error('Failed to create course', createRes.status, createRes.data);
        process.exit(1);
      }
      courseId = createRes.data.course._id;
      console.log('Created course', courseId);
    } else {
      courseId = courses[0]._id;
      console.log('Using existing course', courseId);
    }

    // prepare a test pdf file
    const testFilePath = 'uploads/test_note_sample.pdf';
    fs.writeFileSync(testFilePath, 'This is a test PDF content (not a real PDF)');

    const form = new FormData();
    form.append('title', 'Test Note File');
    form.append('description', 'Uploaded during automated test');
    form.append('noteFile', fs.createReadStream(testFilePath));

    const uploadRes = await axios.post(`${BASE}/course/${courseId}/notes`, form, {
      headers: { ...form.getHeaders(), Cookie: cookieHeader },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      validateStatus: () => true,
    });

    console.log('Upload status', uploadRes.status);
    console.log('Upload response', uploadRes.data);

    if (uploadRes.status === 200) {
      const notes = uploadRes.data.notes || [];
      const last = notes[notes.length - 1];
      console.log('Last note entry:', last);
      console.log('Accessible file URL:', last?.file?.secure_url || last?.noteUrl);
    }
  } catch (e) {
    console.error('Error during test', e.response?.data || e.message);
    process.exit(1);
  }
}

run();
