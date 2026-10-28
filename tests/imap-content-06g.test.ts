import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { featuredPrototypeStories as stories, featuredYouTubeEmbedUrl } from '../src/data/imap-featured.ts';
import { prototypePlaces } from '../src/data/imap-prototype.ts';
import { selectDestination } from '../src/lib/imap-prototype.ts';

const route = readFileSync(new URL('../src/components/imap/PrototypeExplorer.astro', import.meta.url), 'utf8');
const controller = readFileSync(new URL('../src/scripts/imap-prototype.ts', import.meta.url), 'utf8');

// Client-copy contracts; these are not independent verification of visitor facts.
test('four existing destination stories retain the supplied descriptions, addresses and indicative facts', () => {
  const expected = {
    'ho-hoan-kiem': {
      description: 'Hồ Gươm là biểu tượng văn hóa lâu đời ngay giữa lòng thủ đô Hà Nội. Nơi đây mang nét đẹp thơ mộng với làn nước xanh ngọc phẳng lặng, rủ bóng hàng liễu bên quần thể kiến trúc cổ kính gồm Tháp Rùa, cầu Thê Húc và đền Ngọc Sơn trầm mặc.',
      address: 'Khu vực Hồ Hoàn Kiếm, Hà Nội',
      practical: [
        { label: 'Giá tham khảo', value: 'Miễn phí tham quan' },
        { label: 'Giờ tham quan', value: '24/7' },
      ],
    },
    'nha-tho-lon-ha-noi': {
      description: 'Nhà thờ Lớn Hà Nội là công trình kiến trúc Gothic cổ kính mang đậm dấu ấn phong cách châu Âu giữa lòng thủ đô. Nơi đây thu hút du khách bởi vẻ đẹp uy nghiêm của những bức tường rêu phong, mái vòm nhọn cao vút và ô cửa kính màu lộng lẫy. Đây là điểm check-in và biểu tượng văn hóa không thể bỏ qua.',
      address: '40 Nhà Chung, Hà Nội',
      practical: [
        { label: 'Giá tham khảo', value: 'Miễn phí' },
        { label: 'Giờ tham quan tham khảo', value: 'Thứ Hai – Thứ Bảy: 08:00–11:00 và 14:00–17:00. Chủ Nhật: 07:00–11:30 và 15:00–21:00.', wide: true },
      ],
    },
    'pho-co': {
      description: 'Phố cổ Hà Nội là không gian văn hóa đặc sắc lưu giữ hồn cốt nghìn năm văn hiến của thủ đô. Nơi đây nổi tiếng với 36 phố phường xưa cũ, những ngôi nhà mái ngói rêu phong cổ kính cùng lối sống thanh lịch của người Tràng An. Đây là điểm hẹn lý tưởng để khám phá ẩm thực và nhịp sống di sản tinh tế.',
      address: 'Khu vực Phố cổ, quận Hoàn Kiếm, Hà Nội',
      practical: [
        { label: 'Giá tham khảo', value: 'Miễn phí tham quan khu phố' },
        { label: 'Giờ tham quan', value: '24/7' },
      ],
    },
    'den-ngoc-son': {
      description: 'Đền Ngọc Sơn là di tích quốc gia đặc biệt, biểu tượng tâm linh và văn hóa linh thiêng của thủ đô Hà Nội. Tọa lạc trên đảo Ngọc giữa Hồ Gươm, đền mang nét kiến trúc cổ kính hòa quyện cùng thiên nhiên thơ mộng. Nơi đây tôn vinh tinh thần hiếu học và lòng yêu nước sâu sắc của dân tộc.',
      address: 'Đền Ngọc Sơn, Hồ Hoàn Kiếm, Hà Nội',
      practical: [
        { label: 'Giá vé tham khảo', value: '50.000 VNĐ/lượt' },
        { label: 'Học sinh, sinh viên', value: '25.000 VNĐ/lượt, yêu cầu xuất trình thẻ hợp lệ', wide: true },
        { label: 'Thứ Hai – Thứ Năm', value: '07:00–19:00', wide: true },
        { label: 'Thứ Sáu – Chủ Nhật, ngày Lễ/Tết', value: '07:00–22:00', wide: true },
      ],
    },
  };
  for (const [slug, expectedStory] of Object.entries(expected)) {
    const actual = stories[slug]!;
    assert.equal(prototypePlaces.filter(place => place.slug === slug).length, 1);
    assert.equal(actual.description, expectedStory.description);
    assert.equal(actual.address, expectedStory.address);
    assert.deepEqual(actual.practical, expectedStory.practical);
    assert.match(actual.practicalNote, /khách hàng cung cấp/);
    assert.match(actual.practicalNote, /có thể thay đổi/);
  }
  assert.match(stories['ho-hoan-kiem']!.practicalNote, /chỉ áp dụng cho không gian công cộng quanh hồ/);
  assert.match(stories['pho-co']!.practicalNote, /cửa hàng, bảo tàng và điểm tham quan có giờ mở cửa, giá vé và quy định riêng/);
  assert.match(stories['nha-tho-lon-ha-noi']!.practicalNote, /thánh lễ và sự kiện đặc biệt/);
  assert.match(stories['den-ngoc-son']!.practicalNote, /chưa xác minh độc lập/);
  assert.deepEqual(stories['den-ngoc-son']!.referenceLinks?.map(link => link.url), [
    'https://banqldtdthanoi.vn/lien-he/lien-he-danh-thang/',
    'https://tgroup.vn/service/den-ngoc-son-ha-noi',
  ]);
  assert(route.includes('{featured?.address ?? reference?.address ?? place.area}'));
});

test('headings are updated in static markup and the dynamically restored directory heading', () => {
  for (const heading of ['Thông tin tham khảo', 'Trải nghiệm cùng nơi', 'Địa điểm gần đây', 'Chọn một địa điểm']) assert(route.includes(heading));
  for (const old of ['Thông tin tham quan', 'Câu chuyện cùng nơi', 'Tiếp tục khám phá gần đây', 'Lựa chọn câu chuyện', 'Chọn câu chuyện']) {
    assert(!route.includes(old)); assert(!controller.includes(old));
  }
  assert(controller.includes(": 'Chọn một địa điểm';"));
  assert(route.includes('<DestinationPortrait src={place.portraitImage} />'));
  assert(route.includes('<DestinationPortrait src={nearby.place.portraitImage} />'));
  assert(route.includes('<h2 tabindex="-1">{place.name}</h2>'));
});

test('real switching callbacks keep Phố Cổ and Đinh Lễ independent with at most one active player', () => {
  const ids = ['pho-co', 'pho-sach-dinh-le'];
  const src = featuredYouTubeEmbedUrl(stories[ids[0]!]!.youtubeUrl)!;
  assert.equal(src, featuredYouTubeEmbedUrl(stories[ids[1]!]!.youtubeUrl));
  assert.match(src, /autoplay=1&mute=1/);
  const ast = ts.createSourceFile('controller.ts', controller, ts.ScriptTarget.Latest, true);
  const functions = ['stopVideo', 'openPlace'].map(name => {
    const node = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === name);
    assert(node); return node.getText(ast);
  }).join('\n');
  const source = ts.transpileModule(functions, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  let frames: Array<{ src: string }> = [];
  const context = {
    selected: undefined as string | undefined, previousFocus: null, cameraFlight: false, map: undefined,
    prototypeCollection: prototypePlaces, mobile: { matches: true }, visible: new Set(ids), selectDestination,
    templates: new Map(ids.map(id => [id, { content: { cloneNode: () => ({ src }) } }])),
    content: {
      querySelectorAll: (selector: string) => selector === 'iframe' ? frames : [],
      replaceChildren() { for (const frame of frames) assert.equal(frame.src, 'about:blank'); frames = []; },
      append(frame: { src: string }) { assert.equal(frames.length, 0); frames.push(frame); },
      querySelector: () => null, scrollTop: 0,
    },
    story: { hidden: true }, storyLabel: { textContent: '' }, explorer: { classList: { add() {} } },
    reopen: { hidden: true }, videoHeight: 0, cameraIntent: 'discovery',
    filter() {}, setSheetState() {}, measureStoryFrame: () => 0, resizeMap() {}, keepSelectedVisible() {},
    trigger: {},
  };
  const run = (code: string) => runInNewContext(code, context, { timeout: 1000 });
  run(source);
  let previous: { src: string } | undefined;
  for (const id of [...ids, ids[0]!]) {
    run(`openPlace('${id}', trigger);`);
    assert.equal(context.selected, id);
    assert.equal(context.storyLabel.textContent, prototypePlaces.find(place => place.slug === id)!.name);
    assert.equal(frames.length, 1);
    assert.equal(frames[0]!.src, src);
    if (previous) { assert.equal(previous.src, 'about:blank'); assert.notEqual(previous, frames[0]); }
    previous = frames[0];
  }
});
