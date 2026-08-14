const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/my_database';
const COURSE_ID = process.argv[2] || '6a6b4dcfeba7c2531ac2dcce';

async function fetchOembed(link) {
  try {
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(link)}&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

function readCsvLinks(csvPath) {
  const csv = fs.readFileSync(csvPath, 'utf8');
  const lines = csv.split('\n').map(l => l.trim()).filter(Boolean);
  const rows = lines.slice(1).map(l => {
    const cols = l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
    const link = cols[2] ? cols[2].replace(/^"|"$/g, '') : null;
    return link;
  }).filter(Boolean);
  return rows;
}

async function main() {
  const csvPath = path.resolve(__dirname, '..', '..', 'Client', 'src', 'Assets', 'extracted_links.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('CSV not found:', csvPath);
    process.exit(2);
  }
  const links = readCsvLinks(csvPath);
  if (!links.length) {
    console.error('No links to process');
    process.exit(0);
  }

  await mongoose.connect(MONGO_URI);
  const courses = mongoose.connection.collection('courses');

  const lectures = [];
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const o = await fetchOembed(link);
    const title = o?.title || `Lecture ${i + 1}`;
    const author = o?.author_name || '';
    const description = o ? `Imported from ${author}` : `Imported lecture ${i + 1}`;
    lectures.push({
      title,
      description,
      lecture: { public_id: `external_${i+1}`, secure_url: link }
    });
  }

  const update = { $set: { lectures, numberOfLectures: lectures.length, updatedAt: new Date() } };
  await courses.updateOne({ _id: new mongoose.Types.ObjectId(COURSE_ID) }, update);
  console.log(`Updated course ${COURSE_ID} with ${lectures.length} lectures.`);

  // also write frontend constants file
  const constPath = path.resolve(__dirname, '..', '..', 'Client', 'src', 'Contants', 'importedLectures.js');
  const exportJs = `const importedLectures = ${JSON.stringify(lectures, null, 2)};\nexport default importedLectures;\n`;
  fs.writeFileSync(constPath, exportJs, 'utf8');
  console.log('Wrote frontend constants to', constPath);

  await mongoose.disconnect();
}

main().catch(err => { console.error('Error:', err); process.exit(1); });
