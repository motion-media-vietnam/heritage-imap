interface NationalPartner {
  id: string;
  name: string;
  status: 'proposed' | 'confirmed' | 'active' | 'inactive';
  publicPermission: boolean;
}

export const nationalPartners: readonly NationalPartner[] = [
  { id: 'hanoi', name: 'Sở Văn hóa và Thể thao thành phố Hà Nội', status: 'proposed', publicPermission: false },
  { id: 'ho-chi-minh', name: 'TP. Hồ Chí Minh', status: 'proposed', publicPermission: false },
  { id: 'quang-ninh', name: 'Sở Văn hóa, Thể thao và Du lịch tỉnh Quảng Ninh', status: 'proposed', publicPermission: false },
  { id: 'dien-bien', name: 'Sở Văn hóa, Thể thao và Du lịch tỉnh Điện Biên', status: 'proposed', publicPermission: false },
];

export function canNamePartner(partner: NationalPartner) {
  return partner.publicPermission && (partner.status === 'confirmed' || partner.status === 'active');
}
