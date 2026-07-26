import supabase, { isSupabaseConfigured } from './supabase.js';

const TABLE_NAME = 'repair_requests';
const IMAGES_TABLE_NAME = 'repair_request_images';

function buildError(message) {
  return { data: null, error: new Error(message), message };
}

export async function createRepairRequest(payload) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const { data, error } = await supabase.from(TABLE_NAME).insert([{ ...payload }]).select();
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export async function getMyRepairRequests(userId) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export async function getRepairRequestById(id, userId) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const { data, error } = await supabase.from(TABLE_NAME).select('*').eq('id', id).eq('user_id', userId).single();
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export async function updateRepairRequest(id, payload, userId) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const { data, error } = await supabase.from(TABLE_NAME).update(payload).eq('id', id).eq('user_id', userId).select();
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export async function deleteRepairRequest(id, userId) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const { data, error } = await supabase.from(TABLE_NAME).delete().eq('id', id).eq('user_id', userId).select();
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export async function saveRepairRequestImage(payload) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const { data, error } = await supabase.from(IMAGES_TABLE_NAME).insert([{ ...payload }]).select();
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export async function getRepairRequestImages(requestId, userId) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const { data, error } = await supabase
      .from(IMAGES_TABLE_NAME)
      .select('*')
      .eq('request_id', requestId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

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
    const { data, error } = await supabase.from(IMAGES_TABLE_NAME).delete().eq('id', imageId).eq('user_id', userId).select();
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export default {
  createRepairRequest,
  getMyRepairRequests,
  getRepairRequestById,
  updateRepairRequest,
  deleteRepairRequest,
  saveRepairRequestImage,
  getRepairRequestImages,
  deleteRepairRequestImage,
};
