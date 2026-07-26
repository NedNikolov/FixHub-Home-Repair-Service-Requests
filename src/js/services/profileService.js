import supabase, { isSupabaseConfigured } from './supabase.js';

const AVATAR_BUCKET = 'profile-images';

function failure(message, error = new Error(message)) {
  return { data: null, error, message };
}

function avatarPath(userId, file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  return `${userId}/avatar-${Date.now()}.${extension}`;
}

export async function updateProfile({ fullName, avatarFile } = {}) {
  if (!isSupabaseConfigured) return failure('Supabase is not configured.');

  const { data: userData, error: userError } = await supabase.auth.getUser();
  const user = userData?.user;
  if (userError || !user) return failure(userError?.message || 'You must be signed in to update your profile.', userError);

  if (!fullName?.trim()) return failure('Please enter your full name.');
  if (avatarFile && !avatarFile.type.startsWith('image/')) return failure('Please choose an image file.');

  try {
    let avatarUrl = user.user_metadata?.avatar_url || '';
    if (avatarFile) {
      const path = avatarPath(user.id, avatarFile);
      const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, avatarFile, {
        cacheControl: '3600',
        upsert: true,
      });
      if (uploadError) return failure(uploadError.message, uploadError);
      avatarUrl = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path).data?.publicUrl || '';
    }

    const { data, error } = await supabase.auth.updateUser({
      data: { ...user.user_metadata, fullName: fullName.trim(), avatar_url: avatarUrl },
    });
    if (error) return failure(error.message, error);
    return { data: data?.user || data, error: null, message: 'Profile updated successfully.' };
  } catch (error) {
    return failure(error.message || 'Unable to update your profile.', error);
  }
}

export async function changePassword(password) {
  if (!isSupabaseConfigured) return failure('Supabase is not configured.');
  if (!password || password.length < 8) return failure('Password must be at least 8 characters.');

  try {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) return failure(error.message, error);
    return { data: data?.user || data, error: null, message: 'Password updated successfully.' };
  } catch (error) {
    return failure(error.message || 'Unable to update your password.', error);
  }
}

export default { updateProfile, changePassword };
