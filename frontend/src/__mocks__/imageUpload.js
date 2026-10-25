export async function uploadProductImage(file) {
  if (!file) return null;

  return 'https://res.cloudinary.com/demo/image/upload/test-image.jpg';
}
