import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assemblePublications, publicationChapterHref } from '../src/utils/publication-model.ts';
const book = (status='published', date='2026-10-13') => ({id:'test-book',data:{status,publishDate:new Date(date)}});
const chapter = (order:number,slug='chapter-'+order) => ({id:'test-book/'+slug,body:'Complete example text.',data:{book:{id:'test-book'},chapterSlug:slug,order,draft:false}});
test('authored routes follow explicit chapter order and stable slugs',()=>{
 const [edition]=assemblePublications([book()],[chapter(2),chapter(1)],'2026-10-13');
 assert.deepEqual(edition.chapters.map(c=>c.data.order),[1,2]);
 assert.equal(publicationChapterHref(edition.book.id,edition.chapters[0].data.chapterSlug),'/reados/publications/test-book/chapter-1/');
});
test('draft and scheduled books produce no public edition',()=>{
 assert.equal(assemblePublications([book('draft')],[chapter(1)],'2026-10-13').length,0);
 assert.equal(assemblePublications([book('published','2026-10-14')],[chapter(1)],'2026-10-13').length,0);
});
test('partial or ambiguous published editions fail instead of leaking incomplete content',()=>{
 assert.throws(()=>assemblePublications([book()],[],'2026-10-13'),/no chapters/);
 assert.throws(()=>assemblePublications([book()],[chapter(1),chapter(3)],'2026-10-13'),/contiguous/);
 assert.throws(()=>assemblePublications([book()],[chapter(1,'same'),chapter(2,'same')],'2026-10-13'),/Duplicate chapter/);
 assert.throws(()=>assemblePublications([book()],[{...chapter(1),body:''}],'2026-10-13'),/Empty chapter/);
 const draft=chapter(1);draft.data.draft=true;
 assert.throws(()=>assemblePublications([book()],[draft],'2026-10-13'),/draft chapter/);
 assert.equal(assemblePublications([book('draft')],[draft],'2026-10-13',true).length,1);
});
test('orphan chapters and duplicate books are rejected',()=>{
 assert.throws(()=>assemblePublications([],[chapter(1)],'2026-10-13'),/Unknown publication/);
 assert.throws(()=>assemblePublications([book(),book()],[chapter(1)],'2026-10-13'),/Duplicate publication/);
});
test('worked example arithmetic is internally consistent',()=>{
 const revenue=3600,cost=24*85+250+100+250;
 assert.equal(cost,2640);assert.equal(revenue-cost,960);assert.equal((revenue-400)-cost,560);
 assert.equal(960-5*85,535);assert.equal(revenue*.4,1440);assert.equal(revenue*.6,2160);
 assert.equal(1800+1440-2300,940);assert.equal(1800-2300,-500);
 assert.equal(3*3600+2*3600*.4,13680);assert.equal(3*3600,10800);
 assert.equal((560/3200)*100,17.5);assert.equal(Math.round((960/3600)*1000)/10,26.7);
 assert.equal(Math.round((400/960)*1000)/10,41.7);assert.equal(4*24-80,16);
 assert.deepEqual([8/20,5/8,3/5,3/20].map(x=>x*100),[40,62.5,60,15]);
 assert.equal(Math.round((4/6)*1000)/10,66.7);assert.equal(5*85,425);assert.equal(7*85,595);
});
