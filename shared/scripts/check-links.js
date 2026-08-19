const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const exts = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.md', '.html'];

function walk(dir, filelist = []){
  const files = fs.readdirSync(dir);
  files.forEach(file =>{
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if(stat.isDirectory()){
      if(file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') return;
      walk(full, filelist);
    } else {
      filelist.push(full);
    }
  });
  return filelist;
}

function existsWithExt(filePath){
  if(fs.existsSync(filePath)) return true;
  for(const e of exts){
    if(fs.existsSync(filePath + e)) return true;
  }
  return false;
}

function checkFile(file){
  const content = fs.readFileSync(file, 'utf8');
  const relRegex = /(?:from\s+|require\()(['"])(\.\/.+?|\.\.\/[^'"\)]+)\1/g;
  const hrefSrcRegex = /(href|src)=(["'])((?:\.\/?|\.\.\/)[^"'>]+)\2/gi;
  const mdLinkRegex = /\[[^\]]+\]\(((?:\.\/?|\.\.\/)[^\)]+)\)/g;
  const missing = [];
  let m;
  while((m = relRegex.exec(content))){
    const rel = m[2];
    const resolved = path.resolve(path.dirname(file), rel);
    if(!existsWithExt(resolved)) missing.push({type:'import', target:rel});
  }
  while((m = hrefSrcRegex.exec(content))){
    const rel = m[3];
    const resolved = path.resolve(path.dirname(file), rel);
    if(!existsWithExt(resolved)) missing.push({type:m[1], target:rel});
  }
  while((m = mdLinkRegex.exec(content))){
    const rel = m[1];
    const resolved = path.resolve(path.dirname(file), rel);
    if(!existsWithExt(resolved)) missing.push({type:'md', target:rel});
  }
  if(missing.length) return {file, missing};
  return null;
}

(function main(){
  console.log('Scanning for relative links/imports...');
  const all = walk(root);
  const candidates = all.filter(f => /\.(js|jsx|ts|tsx|html|md)$/.test(f));
  const results = [];
  for(const f of candidates){
    try{
      const r = checkFile(f);
      if(r) results.push(r);
    }catch(e){
      console.error('Error checking', f, e.message);
    }
  }
  if(results.length === 0){
    console.log('No broken relative links/imports found.');
    return;
  }
  console.log('Broken or missing relative links/imports:');
  for(const r of results){
    console.log('\nFile:', path.relative(root, r.file));
    for(const m of r.missing){
      console.log(' -', m.type, m.target);
    }
  }
})();
