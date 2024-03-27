// Default cache duration is 7 days
const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;

/**
 * Create a local cache key
 */
export function getKey(key: string, prefixKey?: any): string {
  return `${prefixKey ?? ''}${key}`.toUpperCase();
}

/**
 * Remove an item from local storage
 * @param {string} key - The key of the item to be removed
 */
export async function remove(key: string) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(getKey(key));
    }
  } catch (e) {}
}

/**
 * Clear all items from local storage
 */
export function clear() {
  let result;
  if (typeof localStorage !== 'undefined') {
    result = localStorage.clear();
  }
  return result;
}

/**
 * Get a value from local storage based on a key
 * @param {string} key - The key of the item to retrieve
 * @param {any} [def=null] - Default value to return if the item is not found
 */
export async function getKeylocalStorage(key: string, def: any = null) {
  if (typeof localStorage !== 'undefined') {
    const item = localStorage.getItem(getKey(key));
    if (item) {
      try {
        const data = JSON.parse(item);
        const { value, expire } = data;
        // Return directly if within the validity period
        if (expire === null || expire >= Date.now()) {
          return await value;
        }
        remove(getKey(key));
      } catch (e) {
        return await def;
      }
    }
  }
  return await def;
}

/**
 * Set a value in local storage based on a key
 * @param {string} key - The key to set the value for
 * @param {any} value - The value to store
 * @param {number|null} [expire=DEFAULT_CACHE_TIME] - Expiration time in seconds (or null for no expiration)
 */
export function setKeylocalStorage(key: string, value: any, expire: number | null = DEFAULT_CACHE_TIME) {
  try {
    if (typeof localStorage !== 'undefined') {
      const stringData = JSON.stringify({
        value,
        expire: expire !== null ? new Date().getTime() + expire * 1000 : null
      });
      localStorage.setItem(getKey(key), stringData);
    }
  } catch (error) {}
}
