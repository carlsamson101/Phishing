import { createClient } from '@supabase/supabase-js';

// You will find these keys in your Supabase Dashboard under Settings -> API
const supabaseUrl = 'https://ktjzteteiohschzlylpl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0anp0ZXRlaW9oc2Noemx5bHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NzU2NDQsImV4cCI6MjA5NzI1MTY0NH0.72iKyjoM1dHKgvuL-83fAmrLpIjy4JLOoymSzw0EbDA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);