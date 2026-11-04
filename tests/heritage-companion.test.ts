import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getCompanionReply } from '../src/lib/heritage-companion.ts';
import { companionPrompts } from '../src/data/national/companion.ts';
import { answerHeritage } from '../src/lib/hoi-heritage.ts';

test('national companion links the five sample questions without inventing answers', async () => {
  for (const prompt of companionPrompts) {
    const reply = await getCompanionReply(prompt.question[0], 'vi');
    assert(!reply.scripted);
    assert.equal(reply.href, prompt.id === 'hanoi' ? '/hanoi/heritage-mach-ban/' : '#destination-' + prompt.id);
  }
  assert.match((await getCompanionReply(companionPrompts[0].question[1], 'en')).text, /three-day itinerary is not available/);
});

test('national companion reuses the existing Hanoi rules and labels the result', async () => {
  const question = 'Hà Nội trong 1 ngày';
  const reply = await getCompanionReply(question, 'vi');
  assert.equal(reply.scripted, true);
  assert.equal(reply.text, answerHeritage(question).reply);
  const unrelated = await getCompanionReply('Viết code ở Hà Nội', 'vi');
  assert(!unrelated.scripted);
  assert.match(unrelated.text, /chưa thể trả lời/);
});
