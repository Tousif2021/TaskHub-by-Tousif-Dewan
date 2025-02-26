
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bqaydqkmqdywfccqdtmk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxYXlkcWttcWR5d2ZjY3FkdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2MDYwMjIsImV4cCI6MjA1NjE4MjAyMn0.Eg7NFz7tw6b2ClpqzJEThbWdAtKLsLcQbFfUuPjs6kg";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
