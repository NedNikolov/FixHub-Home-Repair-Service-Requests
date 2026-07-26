import supabase, { isSupabaseConfigured } from './supabase.js';

const REQUESTS_TABLE = 'repair_requests';
const ROLES_TABLE = 'user_roles';

function buildError(message) {
  return { data: null, error: new Error(message), message };
}

export async function getCurrentUserRole(userId) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const { data, error } = await supabase.from(ROLES_TABLE).select('role').eq('user_id', userId).maybeSingle();
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export async function getAdminStats() {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const [{ data: usersData, error: usersError }, { data: requestsData, error: requestsError }] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from(REQUESTS_TABLE).select('id,status', { count: 'exact' }),
    ]);

    if (usersError) return { data: null, error: usersError, message: usersError.message };
    if (requestsError) return { data: null, error: requestsError, message: requestsError.message };

    const totalRequests = requestsData?.length || 0;
    const pendingRequests = (requestsData || []).filter((request) => request.status === 'Pending').length;
    const completedRequests = (requestsData || []).filter((request) => request.status === 'Completed').length;

    return {
      data: {
        totalUsers: usersData?.length || 0,
        totalRequests,
        pendingRequests,
        completedRequests,
      },
      error: null,
      message: null,
    };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export async function getAllRequests({ search = '', status = '' } = {}) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    let query = supabase.from(REQUESTS_TABLE).select('*').order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,address.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export async function getAllUsers() {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const { data, error } = await supabase.from('profiles').select('id, full_name, created_at').order('created_at', { ascending: false });
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export async function updateRequestStatus(id, status) {
  if (!isSupabaseConfigured) {
    return buildError('Supabase is not configured.');
  }

  try {
    const { data, error } = await supabase.from(REQUESTS_TABLE).update({ status }).eq('id', id).select();
    if (error) return { data: null, error, message: error.message };
    return { data, error: null, message: null };
  } catch (error) {
    return { data: null, error, message: error.message };
  }
}

export default {
  getCurrentUserRole,
  getAdminStats,
  getAllRequests,
  getAllUsers,
  updateRequestStatus,
};
