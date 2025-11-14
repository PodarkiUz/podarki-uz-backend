import { createHmac } from 'crypto';

/**
 * Verify Telegram WebApp initData hash
 * @param initData - The initData string from Telegram WebApp
 * @param botToken - Telegram bot token
 * @returns true if hash is valid, false otherwise
 */
export function verifyTelegramHash(
  initData: string,
  botToken: string,
): boolean {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');

    if (!hash) {
      return false;
    }

    // Remove hash from params
    urlParams.delete('hash');

    // Sort parameters alphabetically
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    // Create secret key from bot token
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Compute hash
    const computedHash = createHmac('sha256', secretKey.toString())
      .update(dataCheckString)
      .digest('hex');

    return computedHash === hash;
  } catch (error) {
    console.error('Error verifying Telegram hash:', error);
    return false;
  }
}

/**
 * Verify Telegram auth data from Mini App
 * @param authData - Telegram auth data object
 * @param botToken - Telegram bot token
 * @returns true if hash is valid, false otherwise
 */
export function verifyTelegramAuthData(
  authData: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  },
  botToken: string,
): boolean {
  try {
    // Create data-check-string
    const dataCheckArray: string[] = [];

    if (authData.id) dataCheckArray.push(`id=${authData.id}`);
    if (authData.first_name)
      dataCheckArray.push(`first_name=${authData.first_name}`);
    if (authData.last_name)
      dataCheckArray.push(`last_name=${authData.last_name}`);
    if (authData.username) dataCheckArray.push(`username=${authData.username}`);
    if (authData.photo_url)
      dataCheckArray.push(`photo_url=${authData.photo_url}`);
    if (authData.auth_date)
      dataCheckArray.push(`auth_date=${authData.auth_date}`);

    // Sort alphabetically
    dataCheckArray.sort();
    const dataCheckString = dataCheckArray.join('\n');

    // Create secret key from bot token
    const secretKey = createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    // Compute hash
    const computedHash = createHmac('sha256', secretKey.toString())
      .update(dataCheckString)
      .digest('hex');

    return computedHash === authData.hash;
  } catch (error) {
    console.error('Error verifying Telegram auth data:', error);
    return false;
  }
}
