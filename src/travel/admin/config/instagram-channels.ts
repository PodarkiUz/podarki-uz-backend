export interface InstagramChannelConfig {
  username: string;
  organizerId: string;
  name: string;
  isActive: boolean;
  description?: string;
  lastProcessedDate?: Date;
}

export const INSTAGRAM_CHANNEL_CONFIGS: InstagramChannelConfig[] = [
  {
    username: 'momenttravel_uz',
    organizerId: '65c38ad9dcf8140001d4fa31',
    name: 'Moment Travel Instagram',
    isActive: true,
    description: 'Travel agency Instagram account',
  },
  {
    username: 'gornieidrugiepoezdki',
    organizerId: '65c38ad9dcf8140001d4fa31',
    name: 'Vezdekhodi Instagram',
    isActive: true,
    description: 'Travel agency Instagram account',
  },
  {
    username: 'aydar_yurt',
    organizerId: '65c38ad9dcf8140001d4fa31',
    name: 'Aydar Yurt Instagram',
    isActive: true,
    description: 'Travel agency Instagram account',
  },
  {
    username: 'lets.hikeee',
    organizerId: '65c38ad9dcf8140001d4fa31',
    name: 'Letshikeeee Instagram',
    isActive: true,
    description: 'Travel agency Instagram account',
  },
];

export function getInstagramChannelConfig(
  username: string,
): InstagramChannelConfig | undefined {
  return INSTAGRAM_CHANNEL_CONFIGS.find(
    (config) =>
      config.username.toLowerCase() === username.toLowerCase() &&
      config.isActive,
  );
}

export function getAllActiveInstagramChannels(): InstagramChannelConfig[] {
  return INSTAGRAM_CHANNEL_CONFIGS.filter((config) => config.isActive);
}

export function getInstagramOrganizerId(username: string): string | null {
  const config = getInstagramChannelConfig(username);
  return config ? config.organizerId : null;
}

export function updateInstagramChannelLastProcessed(
  username: string,
  date: Date,
): void {
  const config = INSTAGRAM_CHANNEL_CONFIGS.find(
    (c) => c.username.toLowerCase() === username.toLowerCase(),
  );
  if (config) {
    config.lastProcessedDate = date;
  }
}
