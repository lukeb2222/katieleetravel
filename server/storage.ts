// Storage is not used in this project - images are served as static assets
export async function storagePut(
  _relKey: string,
  _data: Buffer | Uint8Array | string,
  _contentType?: string
): Promise<{ key: string; url: string }> {
  throw new Error("Storage uploads are not available - use static assets");
}

export async function storageGet(_relKey: string): Promise<{ key: string; url: string }> {
  throw new Error("Storage is not available - use static assets");
}

export async function storageGetSignedUrl(_relKey: string): Promise<string> {
  throw new Error("Storage is not available - use static assets");
}
