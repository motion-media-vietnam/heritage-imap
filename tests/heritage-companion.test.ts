import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getCompanionReply } from '../src/lib/heritage-companion.ts';
import { companionPrompts } from '../src/data/national/companion.ts';
import { answerHeritage } from '../src/lib/hoi-heritage.ts';

test('national companion gives curated suggestions for the five sample questions in VI and EN', async () => {
  for (const prompt of companionPrompts) {
    for (const [index, lang] of (['vi', 'en'] as const).entries()) {
      const reply = await getCompanionReply(prompt.question[index], lang);
      assert.equal(reply.kind, 'editorial', prompt.id + ' ' + lang);
      assert.equal(reply.href, prompt.id === 'hanoi' ? '/hanoi/heritage-mach-ban/' : '#destination-' + prompt.id);
    }
  }
});

test('national companion reuses Hanoi rules without claiming live or unsupported information', async () => {
  const question = 'Hà Nội trong 1 ngày';
  const reply = await getCompanionReply(question, 'vi');
  assert.equal(reply.kind, 'scripted');
  assert.equal(reply.text, answerHeritage(question).reply);
  const live = await getCompanionReply('Giá vé hôm nay ở Ninh Bình?', 'vi');
  assert(!live.kind);
  assert.match(live.text, /chưa có thông tin thời gian thực/);
  const unsupported = await getCompanionReply('Du lịch Đà Nẵng có gì?', 'vi');
  assert(!unsupported.kind);
  assert.match(unsupported.text, /chưa có dữ liệu biên tập/);
});

test('national companion declines non-travel and foreign travel questions', async () => {
  for (const question of ['Viết code ở Hà Nội', 'Du lịch Nhật Bản', 'Giải phương trình']) {
    const reply = await getCompanionReply(question, 'vi');
    assert.equal(reply.href, undefined);
    assert.match(reply.text, /chỉ chuyên mách bạn những điều thú vị về du lịch và khám phá Việt Nam/);
  }
});
