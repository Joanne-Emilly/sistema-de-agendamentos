const SUPABASE_URL = "SUA_URL_DO_PROJETO";
const SUPABASE_ANON_KEY = "SUA_CHAVE_PUBLICA";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);