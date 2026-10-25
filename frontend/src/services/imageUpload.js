export async function uploadProductImage(file) {
  if (!file) return null;

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Configuração do Cloudinary ausente.");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", uploadPreset);
  body.append("folder", "jaca3d/produtos");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body,
    },
  );

  if (!response.ok) {
    throw new Error("Não foi possível enviar a imagem. Tente novamente.");
  }

  const data = await response.json();

  if (!data.secure_url) {
    throw new Error("O Cloudinary não retornou a URL da imagem.");
  }

  return data.secure_url;
}
