import { createClient } from '@supabase/supabase-js';

const BLOG_SUPABASE_URL = 'https://tufvduiaybogfhgausqj.supabase.co';
const BLOG_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1ZnZkdWlheWJvZ2ZoZ2F1c3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwOTUyNjksImV4cCI6MjA3MjY3MTI2OX0.o-rO2rm5uYtI-NDp5amFm9gkXcToJWjuHDJFkaOtYtQ';

export const blogSupabase = createClient(BLOG_SUPABASE_URL, BLOG_SUPABASE_ANON_KEY);
