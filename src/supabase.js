import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://urncxkivrzrdaqztknpy.supabase.co'
const supabaseKey = 'sb_publishable_7531kouKE4dVCA5gTTl0VA_cQwi57hD'

export const supabase = createClient(supabaseUrl, supabaseKey)