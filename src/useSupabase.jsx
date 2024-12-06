
import { createClient } from "@supabase/supabase-js";
// Create a single supabase client for interacting with your database
export const supabase = createClient(
  "https://ddovfbjkkocdcjzwgxgj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkb3ZmYmpra29jZGNqendneGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MTk3NjQsImV4cCI6MjA0ODk5NTc2NH0.W-2VksPXfXGMye2RP_0sszo4-xkO8YFP81VYsAqOnJQ"
);

const useSupabase = () => {
  return supabase;
};

export default useSupabase;
