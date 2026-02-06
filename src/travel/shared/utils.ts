import * as crypto from 'crypto';

const ALPHANUMERIC_CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Generates a random alphanumeric code (uppercase + lowercase + 0-9).
 * @param length - Length of the code (default: 6)
 * @returns Random code string
 */
export function generateRandomCode(length = 6): string {
  const bytes = crypto.randomBytes(length);
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHANUMERIC_CHARS[bytes[i] % ALPHANUMERIC_CHARS.length];
  }
  return code;
}

export function compareArrays<T>(oldArray: T[], newArray: T[], prop?: string) {
  // Find items to remove (present in oldArray but not in newArray)
  const itemsToRemove = oldArray.filter(
    (item) =>
      !newArray.some((newItem) => {
        if (prop) {
          return newItem[prop] === item[prop];
        } else {
          return newItem === item;
        }
      }),
  );

  // Find items to add (present in newArray but not in oldArray)
  const itemsToAdd = newArray.filter(
    (item) =>
      !oldArray.some((oldItem) => {
        if (prop) {
          return oldItem[prop] === item[prop];
        } else {
          return oldItem === item;
        }
      }),
  );

  // Return the items to remove and add
  return {
    itemsToRemove,
    itemsToAdd,
  };
}
