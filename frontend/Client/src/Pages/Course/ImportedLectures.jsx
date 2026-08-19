import { useState } from 'react'
import importedLectures from '../../Contants/importedLectures'
import { isYoutubeUrl, toEmbedUrl } from '../../Helper/videoUtils'

function getVideoSource(lecture) {
  return lecture?.lecture?.secure_url || lecture?.lectureUrl || lecture?.videoUrl || '';
}

function ImportedLectures(){
  const [current, setCurrent] = useState(0)
  const lectures = importedLectures || []

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Imported Lectures</h2>
      {lectures.length === 0 ? (
        <p>No lectures available.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="w-full aspect-video bg-black">
              <iframe
                title={lectures[current].title}
                src={toEmbedUrl(getVideoSource(lectures[current]))}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <h3 className="mt-3 text-xl font-semibold">{lectures[current].title}</h3>
            <p className="text-sm text-gray-600">{lectures[current].description}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Playlist</h4>
            <ul>
              {lectures.map((l, idx) => (
                <li key={idx} className={`flex items-center gap-3 py-2 cursor-pointer ${idx===current? 'font-bold':''}`} onClick={() => setCurrent(idx)}>
                  <img src={l.thumbnail || (l.lecture && l.lecture.secure_url ? l.lecture.secure_url.replace('watch?v=', '').includes('youtu') ? `https://img.youtube.com/vi/${l.lecture.secure_url.split('v=')[1] || ''}/hqdefault.jpg` : '' : '')} alt="thumb" className="w-20 h-12 object-cover rounded-sm" onError={(e)=>{e.target.style.display='none'}} />
                  <div>
                    <div className="text-sm">{l.title}</div>
                    <div className="text-xs text-gray-500">{l.description}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImportedLectures
