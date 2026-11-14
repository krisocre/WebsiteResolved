// Research and journal QA. No external collection or form submissions.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),cp=require('node:child_process'),crypto=require('node:crypto'),puppeteer=require('puppeteer');
const {createServer}=require('../server.cjs');
const root=path.resolve(__dirname,'..'),output=path.join(root,'preview/blog-launch');fs.mkdirSync(output,{recursive:true});
const articles=JSON.parse(fs.readFileSync(path.join(root,'content/articles.json'),'utf8'));
const summary=JSON.parse(fs.readFileSync(path.join(root,'data/rating-visibility-summary.json'),'utf8'));
const evidence=JSON.parse(fs.readFileSync(path.join(root,'data/review-evidence-matrix.json'),'utf8'));
const csv=fs.readFileSync(path.join(root,'data/rating-visibility-scenarios.csv'),'utf8').trim().split(/\r?\n/);
const headers=csv.shift().split(','),rows=csv.map(line=>Object.fromEntries(line.split(',').map((value,index)=>[headers[index],value])));
assert.equal(rows.length,1744);assert.equal(summary.scenario_count,1744);assert.equal(new Set(rows.map(row=>row.review_count_before+':'+row.star_points_before)).size,1744);
for(const row of rows){
 const count=+row.review_count_before,points=+row.star_points_before,after=+row.review_count_after,remaining=+row.star_points_after;
 assert.equal(after,count-1);assert.equal(remaining,points-1);assert.ok(remaining>=after&&remaining<=5*after);assert.ok(remaining/after>points/count);
 for(const [total,n,display]of [[points,count,+row.display_before],[remaining,after,+row.display_after]]){
  const tenths=Math.round(display*10);assert.ok((2*tenths-1)*n<=20*total&&20*total<(2*tenths+1)*n,'Display must lie in its exact half-up rounding interval');
 }
 assert.equal(row.display_unchanged==='True',row.display_before===row.display_after);
}
assert.equal(rows.find(row=>row.review_count_before==='10'&&row.star_points_before==='44').display_after,'4.8');
assert.equal(rows.find(row=>row.review_count_before==='50'&&row.star_points_before==='220').display_after,'4.5');
assert.equal(rows.find(row=>row.review_count_before==='100'&&row.star_points_before==='440').display_after,'4.4');
assert.equal(rows.some(row=>row.review_count_before==='10'&&row.star_points_before==='49'),false,'Infeasible one-star profile excluded');
for(const group of summary.groups){const sample=rows.filter(row=>+row.review_count_before===group.review_count);assert.equal(sample.length,group.feasible_states);assert.equal(sample.filter(row=>row.display_unchanged==='True').length,group.unchanged_states);}
assert.equal(evidence.cases.length,12);assert.equal(new Set(evidence.cases.map(item=>item.id)).size,12);
assert.equal(evidence.cases.filter(item=>item.route==='More context').length,5);assert.equal(evidence.cases.filter(item=>item.route==='Assess policy fit').length,6);
assert.equal(evidence.cases.filter(item=>item.route==='Dedicated report').length,1);
for(const item of evidence.cases)for(const source of item.source_ids)assert.match(evidence.sources[source],/^https:\/\/(?:support\.google\.com|blog\.google)\//);
assert.equal(fs.readFileSync(path.join(root,'data/review-evidence-matrix.csv'),'utf8').trim().split(/\r?\n/).length,13);
const pages=['index.html','blog.html',...articles.map(article=>'blog/'+article.slug+'.html')];
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');const before=pages.map(hash);
cp.execFileSync(process.execPath,['build-blog.cjs'],{cwd:root});assert.deepEqual(pages.map(hash),before,'Blog generation is stable and does not duplicate the homepage section');
assert.equal((fs.readFileSync(path.join(root,'index.html'),'utf8').match(/id="journal"/g)||[]).length,1);
for(const article of articles){
 const html=fs.readFileSync(path.join(root,'blog',article.slug+'.html'),'utf8');
 assert.ok(!/data-rating-summary|data-evidence-cases/.test(html),'Research content must be present in static HTML');
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(schema['@type'],'BlogPosting');assert.equal(schema.author.name,'ReputationResolved');assert.equal(schema.mainEntity['@type'],'Dataset');assert.ok(schema.wordCount>1200);
 assert.equal(schema.mainEntity.distribution.contentUrl,'../data/'+article.dataset);assert.equal(schema.aggregateRating,undefined);
 assert.ok(!/reviewsboost\.ca|reviewremoval\.ca|AW-\d|GTM-/.test(html),'Other brands and tracking are not copied');
}
const server=createServer();
(async()=>{let browser;try{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port+'/';
 browser=await puppeteer.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage(),errors=[],external=[],layouts=[];await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);
 page.on('pageerror',error=>errors.push(error.message));await page.setRequestInterception(true);
 page.on('request',request=>{if(!request.url().startsWith(base)||request.method()!=='GET'){external.push(request.url());return request.abort();}return request.continue();});
 for(const file of pages.slice(1))for(const width of [1440,768,390,320]){
  await page.setViewport({width,height:900});assert.equal((await page.goto(base+file,{waitUntil:'networkidle0'})).status(),200);
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.$$eval('h1',nodes=>nodes.length),1);assert.equal(await page.$$eval('title',nodes=>nodes.length),1);
  assert.equal(await page.$eval('meta[name=robots]',node=>node.content),'noindex, nofollow');
  const layout=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth+1,font:parseFloat(getComputedStyle(document.body).fontSize),height:document.documentElement.scrollHeight}));
  assert.equal(layout.overflow,false,file+' overflow at '+width);assert.equal(layout.font,16);layouts.push({file,...layout});
  if(width<761){await page.click('.menu-button');assert.equal(await page.$eval('.menu-button',node=>node.getAttribute('aria-expanded')),'true');await page.keyboard.press('Escape');assert.equal(await page.$eval('.menu-button',node=>node.getAttribute('aria-expanded')),'false');}
  const links=await page.$$eval('a[href]',nodes=>nodes.map(node=>node.getAttribute('href')));
  for(const href of links){const url=new URL(href,base+file);if(url.origin!==new URL(base).origin)continue;const local=path.join(root,url.pathname==='/'?'index.html':decodeURIComponent(url.pathname.slice(1)));assert.ok(fs.existsSync(local),'Existing link '+href);if(url.hash&&path.extname(local)==='.html')assert.ok(fs.readFileSync(local,'utf8').includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'),'Existing anchor '+href);}
  if(file.includes('/')){
   assert.equal(await page.$eval('.article-toc details',node=>node.open),false);await page.click('.article-toc summary');assert.equal(await page.$eval('.article-toc details',node=>node.open),true);await page.click('.article-toc summary');
   await page.$$eval('.research-figure img',nodes=>nodes.forEach(node=>{node.loading='eager';}));
   await page.waitForFunction(()=>Array.from(document.querySelectorAll('.research-figure img')).every(node=>node.complete&&node.naturalWidth>0));
  }
  if([1440,390].includes(width)){const name=path.basename(file,'.html')+'-'+width;await page.screenshot({path:path.join(output,name+'.png')});}
 }
 await page.goto(base+'blog/'+articles[0].slug+'.html',{waitUntil:'networkidle0'});
 await page.select('#model-size','10');assert.equal(await page.$eval('#model-display',node=>node.textContent),'4.4 → 4.8');
 await page.select('#model-size','500');assert.equal(await page.$eval('#model-display',node=>node.textContent),'4.4 → 4.4');assert.equal(await page.$eval('#model-mean',node=>node.textContent),'4.4068');
 for(const file of ['data/rating-visibility-scenarios.csv','data/rating-visibility-summary.json','data/review-evidence-matrix.csv','data/review-evidence-matrix.json','data/rating-visibility-model.py','data/evidence-packet-template.txt']){const response=await fetch(base+file);assert.equal(response.status,200,file+' served');assert.ok((await response.text()).length>200);}
 await page.setJavaScriptEnabled(false);await page.goto(base+'blog/'+articles[1].slug+'.html',{waitUntil:'networkidle0'});assert.equal(await page.$$eval('.evidence-case',nodes=>nodes.length),12,'All evidence cases readable without JS');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 fs.writeFileSync(path.join(output,'checks.json'),JSON.stringify({scenarios:rows.length,evidenceCases:evidence.cases.length,layouts,errors,externalRequests:external},null,2));
 console.log('PASS: 1,744 independently checked states, twelve source-linked cases, stable static generation, schema/metadata, all internal links/downloads, twelve responsive page layouts, mobile navigation, progressive TOC, calculator, no-JS content and zero external requests.');
}finally{if(browser)await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}})().catch(error=>{console.error(error);process.exitCode=1;});
