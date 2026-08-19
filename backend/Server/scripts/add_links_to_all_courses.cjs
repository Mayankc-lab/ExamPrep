const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGODB_URL || 'mongodb://localhost:27017/my_database';

async function fetchOembed(link){
  try{
    const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(link)}&format=json`;
    const res = await fetch(url);
    if(!res.ok) return null;
    return await res.json();
  }catch(e){
    return null;
  }
}

function readCsvLinks(csvPath){
  const csv = fs.readFileSync(csvPath,'utf8');
  const lines = csv.split('\n').map(l=>l.trim()).filter(Boolean);
  const rows = lines.slice(1).map(l=>{
    const cols = l.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/);
    const link = cols[2] ? cols[2].replace(/^"|"$/g,'') : null;
    return link;
  }).filter(Boolean);
  return rows;
}

function extractYouTubeId(url){
  try{
    const u = new URL(url);
    if(u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    if(u.hostname.includes('youtube.com')){
      if(u.searchParams.get('v')) return u.searchParams.get('v');
      const parts = u.pathname.split('/').filter(Boolean);
      return parts[1] || parts[0] || null;
    }
    return null;
  }catch(e){
    const m = url.match(/(?:v=|youtu\.be\/|embed\/|live\/)([A-Za-z0-9_-]{6,})/);
    return m?m[1]:null;
  }
}

async function main(){
  const csvPath = path.resolve(__dirname, '..', '..', 'Client', 'src', 'Assets', 'extracted_links.csv');
  if(!fs.existsSync(csvPath)){
    console.error('CSV not found at', csvPath);
    process.exit(2);
  }
  const links = readCsvLinks(csvPath);
  if(!links.length) {
    console.log('No links to add');
    process.exit(0);
  }

  await mongoose.connect(MONGO_URI);
  const courses = mongoose.connection.collection('courses');
  const allCourses = await courses.find({}).toArray();
  console.log(`Found ${allCourses.length} courses. Processing...`);

  for(const course of allCourses){
    const existing = (course.lectures || []).map(l=> (l && l.lecture && l.lecture.secure_url) ? l.lecture.secure_url : null ).filter(Boolean);
    const toAdd = [];
    for(let i=0;i<links.length;i++){
      const link = links[i];
      if(existing.includes(link)) continue; // skip duplicates
      const o = await fetchOembed(link);
      const title = o?.title || `Imported Lecture ${i+1}`;
      const desc = o?.author_name ? `Imported from ${o.author_name}` : `Imported lecture`;
      const ytId = extractYouTubeId(link) || `ext${i+1}`;
      const lectureObj = {
        _id: new mongoose.Types.ObjectId(),
        title,
        description: desc,
        lecture: { public_id: `yt_${ytId}`, secure_url: link },
      };
      toAdd.push(lectureObj);
    }
    if(toAdd.length){
      const newLectures = (course.lectures || []).concat(toAdd);
      const newCount = newLectures.length;
      await courses.updateOne({ _id: course._id }, { $set: { lectures: newLectures, numberOfLectures: newCount, updatedAt: new Date() } });
      console.log(`Appended ${toAdd.length} lectures to course ${course._id} (${course.title})`);
    } else {
      console.log(`No new links for course ${course._id} (${course.title})`);
    }
  }

  await mongoose.disconnect();
  console.log('Done.');
}

main().catch(err=>{ console.error('Failed:', err); process.exit(1); });
