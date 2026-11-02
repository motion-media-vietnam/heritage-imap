import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { prototypeCollection } from '../src/data/imap-prototype.ts';
import { collections, itineraries, examplePrompts } from '../src/data/concierge.ts';
const built=(file:string)=>readFileSync(new URL(`../dist/${file}`,import.meta.url),'utf8');
test('concierge mounts one shared explorer with the complete existing destination catalog',()=>{
 const html=built('heritage-mach-ban/index.html');
 assert.equal((html.match(/id="prototype-map"/g)||[]).length,1);
 assert.equal((html.match(/id="prototype-search"/g)||[]).length,1);
 for(const place of prototypeCollection)assert(html.includes(`data-prototype-story="${place.slug}"`));
 assert(html.includes('href="/imap/"'));
});
test('concierge and homepage render identical shared footer markup',()=>{
 const footer=(html:string)=>html.match(/<footer class="homepage-footer"[\s\S]*?<\/footer>/)?.[0];
 assert(footer(built('index.html')));assert.equal(footer(built('heritage-mach-ban/index.html')),footer(built('index.html')));
});
test('editorial reflow retains every prompt, topic and itinerary',()=>{
 const html=built('heritage-mach-ban/index.html');
 for(const prompt of examplePrompts)assert(html.includes(prompt));
 const titles=[...html.matchAll(/<h3\b[^>]*>([\s\S]*?)<\/h3>/g)].map(([,title])=>title!.replaceAll('&quot;','"').replaceAll('&amp;','&'));
 for(const card of [...collections,...itineraries])assert(titles.includes(card.title));
 assert.equal((html.match(/data-concierge-prompt=/g)||[]).length,examplePrompts.length);
});
