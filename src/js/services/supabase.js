const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. Supabase client will operate in a disabled state.');
}

let supabase = null;
let createClient = null;

// Try to dynamically import the package; fallback to CDN ESM build if the package isn't installed locally.
try {
  try {
    // attempt local package
    const mod = await import('@supabase/supabase-js');
    createClient = mod.createClient;
  } catch (localErr) {
    // fallback to CDN ESM (jsDelivr) — keeps development workflow working without local install
    const mod = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
    createClient = mod.createClient;
  }

  if (createClient && SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } else {
    const err = (msg) => ({ error: new Error(msg) });
    supabase = {
      auth: {
        signUp: async () => err('Supabase not configured'),
        signInWithPassword: async () => err('Supabase not configured'),
        signOut: async () => err('Supabase not configured'),
        getUser: async () => err('Supabase not configured'),
        getSession: async () => err('Supabase not configured'),
      },
    };
  }
} catch (e) {
  console.warn('[supabase] failed to create client', e);
  supabase = {
    auth: {
      signUp: async () => ({ error: e }),
      signInWithPassword: async () => ({ error: e }),
      signOut: async () => ({ error: e }),
      getUser: async () => ({ error: e }),
      getSession: async () => ({ error: e }),
    },
  };
}

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && createClient);

export default supabase;
