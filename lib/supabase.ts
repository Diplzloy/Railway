import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type UserRole = "admin" | "user";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
};

export type Document = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  file_url: string | null;
  file_size: string | null;
  file_name: string | null;
  is_free: boolean;
  is_active: boolean;
  order_num: number;
  created_at: string;
  updated_at: string;
};

export type Page = {
  id: string;
  slug: string;
  title: string;
  content: Record<string, any>;
  meta_title: string | null;
  meta_description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type News = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string | null;
  published_at: string;
  read_time: string | null;
  cover_image_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Media = {
  id: string;
  name: string;
  url: string;
  mime_type: string | null;
  size: number | null;
  bucket: string;
  path: string | null;
  created_at: string;
};

export type Setting = {
  key: string;
  value: string | null;
};

// Helpers
export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  return data;
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
}

export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  if (error || !data) return null;
  return getPublicUrl(bucket, data.path);
}

export async function deleteFile(bucket: string, path: string): Promise<boolean> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return !error;
}
