import skybag from '../../assets/national/vietnam-airlines/skybag.png?url';
import type { NationalPhoto } from './assets';
import type { Localized } from './locale';
import { activeWindow, httpsLink } from '../../lib/national-selection';

export const airlineBookingUrl = 'https://www.vietnamairlines.com/vi-vn/ve-may-bay';

export const skybagArtwork: NationalPhoto = {
  src: skybag,
  small: skybag,
  width: 853,
  height: 1200,
  alt: ['Artwork SKYBAG của Vietnam Airlines với túi vàng bên cửa sổ máy bay', 'Vietnam Airlines SKYBAG artwork with a gold bag beside an aircraft window'],
};

export interface AirlineCampaign {
  campaignId: string;
  title: Localized;
  subtitle: Localized;
  image: NationalPhoto;
  bookingUrl: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'approved';
  optionalTerms?: Localized;
}

export const airlineCampaigns: readonly AirlineCampaign[] = [];

export function findAirlineCampaign(campaigns: readonly AirlineCampaign[], today: string) {
  return campaigns.find(campaign => {
    const booking = httpsLink(campaign.bookingUrl);
    return campaign.status === 'approved' && campaign.campaignId.trim() && campaign.image.src && booking
      && /^(www\.)?vietnamairlines\.com$/.test(new URL(booking).hostname)
      && activeWindow({ start: campaign.startDate, end: campaign.endDate }, today);
  });
}

export const offerCopy = {
  title: ['Vietnam Airlines Travel Offers', 'Vietnam Airlines Travel Offers'],
  subtitle: ['Khởi hành cùng Vietnam Airlines. Mở ra những hành trình đáng nhớ.', 'Set off with Vietnam Airlines. Open the door to journeys worth remembering.'],
  booking: ['Khám phá chuyến bay', 'Explore flights'],
  official: ['Tìm và đặt vé trên website chính thức của Vietnam Airlines.', 'Search and book on the official Vietnam Airlines website.'],
  imageNote: ['Artwork SKYBAG · Bản duyệt nội bộ', 'SKYBAG artwork · Internal preview'],
} satisfies Record<string, Localized>;
