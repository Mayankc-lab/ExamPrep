const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/my_database';
const COURSE_ID = process.argv[2] || '6a6b4dcfeba7c2531ac2dcce';

function extractYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if (u.hostname.includes('youtube.com')) {
      if (u.searchParams.get('v')) return u.searchParams.get('v');
      const parts = u.pathname.split('/').filter(Boolean);
      return parts[1] || parts[0] || null;
    }
    return null;
  } catch (e) {
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

  const first = (course.lectures || [])[0];
  if (!first || !first.lecture || !first.lecture.secure_url) {
    console.error('No lecture URL found to derive thumbnail');
    process.exit(2);
  }
  const url = first.lecture.secure_url;
  const id = extractYouTubeId(url);
  if (!id) {
    console.error('Could not extract YouTube id from', url);
    process.exit(2);
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  const publicId = `yt_${id}`;

  await courses.updateOne({ _id: course._id }, { $set: { 'thumbnail.public_id': publicId, 'thumbnail.secure_url': thumbnailUrl, updatedAt: new Date() } });
  console.log(`Set course thumbnail to ${thumbnailUrl} for course ${COURSE_ID}`);

  await mongoose.disconnect();
}

main().catch(err => { console.error(err); process.exit(1); });
