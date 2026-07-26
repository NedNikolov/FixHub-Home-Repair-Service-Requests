import supabase, { isSupabaseConfigured } from './supabase.js';

const BUCKET_NAME = 'repair-images';

function buildError(message) {
  return { data: null, error: new Error(message), message };
}

function isImageFile(file) {
  return file && file.type && file.type.startsWith('image/');
}

function uniqueFileName(file, requestId, userId) {
  const extension = file.name.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  return `${userId}/${requestId}/${timestamp}-${Math.random().toString(36).slice(2)}.${extension}`;
}

export async function uploadRepairRequestImages(files, requestId, userId) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  if (!requestId || !userId) {
    return buildError('A valid request and user are required before uploading images.');
  }

  const validFiles = files.filter(isImageFile);
  if (!validFiles.length) {
    return buildError('Please select at least one valid image file.');
  }

  try {
    const uploaded = [];

    for (const file of validFiles) {
      const path = uniqueFileName(file, requestId, userId);
      const { error: storageError } = await supabase.storage.from(BUCKET_NAME).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (storageError) {
        return { data: null, error: storageError, message: storageError.message };
      }

      const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
      uploaded.push({
        request_id: requestId,
        user_id: userId,
        storage_path: path,
        image_url: publicUrlData?.publicUrl || '',
        created_at: new Date().toISOString(),
      });
    }

    if (!uploaded.length) {
      return buildError('No images were uploaded.');
    }

    const { data, error } = await supabase.from('repair_request_images').insert(uploaded).select();
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export async function deleteRepairRequestImage(imageId, userId) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const { data: imageRows, error: lookupError } = await supabase
      .from('repair_request_images')
      .select('*')
      .eq('id', imageId)
      .eq('user_id', userId)
      .single();

    if (lookupError) return { data: null, error: lookupError, message: lookupError.message };

    if (imageRows?.storage_path) {
      await supabase.storage.from(BUCKET_NAME).remove([imageRows.storage_path]);
    }

    const { data, error } = await supabase.from('repair_request_images').delete().eq('id', imageId).eq('user_id', userId).select();
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export default {
  uploadRepairRequestImages,
  deleteRepairRequestImage,
};
