
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xngupqmwtbncjkegbhys.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZ3VwcW13dGJuY2prZWdiaHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTUwNTEsImV4cCI6MjA1NjY5MTA1MX0.pziqAse7yC0cFl-8B1LUUpwdZY5xO-wAMDTMrCTHC3A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
