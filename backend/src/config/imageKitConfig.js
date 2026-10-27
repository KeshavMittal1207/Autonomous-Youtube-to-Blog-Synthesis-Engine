import ImageKit from "@imagekit/nodejs";

const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "dummy_private_key";
const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || process.env.INAGEKIT_PUBLIC_KEY || "dummy_public_key";
const urlEndpoint = process.env.IMAGEKIT_URLENDPOINT || "https://ik.imagekit.io/dummy";

export const imageKit = new ImageKit({
  privateKey,
  publicKey,
  urlEndpoint
});
