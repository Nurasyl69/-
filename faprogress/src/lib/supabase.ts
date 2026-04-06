import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Group {
  id: string;
  name: string;
  age_range: string;
  birth_years: string;
  description: string;
  created_at: string;
}

export interface Player {
  id: string;
  group_id: string;
  name: string;
  birth_year: number;
  parent_name: string;
  parent_phone: string;
  parent_telegram: string;
  created_at: string;
}

export interface Schedule {
  id: string;
  group_id: string;
  day_of_week: number;
  time_start: string;
  time_end: string;
  location: string;
  created_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  image_url: string;
  published: boolean;
  created_at: string;
}

export interface Coach {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  photo_url: string;
  created_at: string;
}
