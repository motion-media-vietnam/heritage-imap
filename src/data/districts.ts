// Former district-level areas (before July 1, 2025), not current administrative units.
// Source: Hanoi's official portal; see the district note in MapExplorer.astro.
export const districtGroups = [
  { label: 'Quận cũ', names: ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa', 'Tây Hồ', 'Hai Bà Trưng', 'Cầu Giấy', 'Thanh Xuân', 'Hoàng Mai', 'Long Biên', 'Hà Đông', 'Bắc Từ Liêm', 'Nam Từ Liêm'] },
  { label: 'Huyện cũ', names: ['Ba Vì', 'Chương Mỹ', 'Đan Phượng', 'Đông Anh', 'Gia Lâm', 'Hoài Đức', 'Mê Linh', 'Mỹ Đức', 'Phú Xuyên', 'Phúc Thọ', 'Quốc Oai', 'Sóc Sơn', 'Thạch Thất', 'Thanh Oai', 'Thanh Trì', 'Thường Tín', 'Ứng Hòa'] },
  { label: 'Thị xã cũ', names: ['Sơn Tây'] },
];

// Editorial grouping only, not district boundaries or verified entrances.
export const districtPlaceSlugs: Record<string, string[]> = {
  'Hoàn Kiếm': ['ho-hoan-kiem', 'pho-co', 'cau-long-bien'],
  'Ba Đình': ['hoang-thanh-thang-long'],
  'Đống Đa': ['van-mieu'],
  'Tây Hồ': ['ho-tay'],
};

// The city overview is explicitly labeled as such, not destination-specific footage.
export const hanoiOverviewVideo = {
  id: 'cmY1LfX3Aa4',
  label: 'Video tổng quan Hà Nội · Vietnam Tourism',
  source: 'https://vietnam.travel/things-to-do/my-hanoi',
};
