const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/my_database';
const COURSE_ID = process.argv[2] || '6a6b4dcfeba7c2531ac2dcce';

function extractYouTubeId(url) {
  try {
    // handle youtu.be/ID, youtube.com/watch?v=ID, youtube.com/live/ID
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1);
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/watch')) return u.searchParams.get('v');
      // /live/ID or /embed/ID
      const parts = u.pathname.split('/').filter(Boolean);
      return parts[1] || parts[0] || null;
    }
    return null;
  } catch (e) {
    // fallback regex
    const m = url.match(/(?:v=|youtu\.be\/|embed\/|live\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : null;
  }
}

async function main() {
  await mongoose.connect(MONGO_URI);
  const courses = mongoose.connection.collection('courses');
  const course = await courses.findOne({ _id: new mongoose.Types.ObjectId(COURSE_ID) });
  if (!course) {
    console.error('Course not found:', COURSE_ID);
    process.exit(2);
  }

  const lectures = (course.lectures || []).map((lec, idx) => {
    const url = lec?.lecture?.secure_url || '';
    const id = extractYouTubeId(url) || `external_${idx+1}`;
    const thumbnail = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    return {
      ...lec,
      thumbnail,
    };
  });

  await courses.updateOne({ _id: course._id }, { $set: { lectures, updatedAt: new Date() } });
  console.log(`Updated ${lectures.length} lectures with thumbnails for course ${COURSE_ID}`);

  // write frontend constants
  const constPath = path.resolve(__dirname, '..', '..', 'Client', 'src', 'Contants', 'importedLectures.js');
  const exportJs = `const importedLectures = ${JSON.stringify(lectures, null, 2)};\nexport default importedLectures;\n`;
  fs.writeFileSync(constPath, exportJs, 'utf8');
  console.log('Wrote frontend constants to', constPath);

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
