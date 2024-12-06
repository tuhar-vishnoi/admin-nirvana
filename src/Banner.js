import React, { useState, useEffect } from "react";
import useSupabase from "./useSupabase";
import { Link } from "react-router-dom";

const Banner = () => {
  const supabase = useSupabase();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all banners from the database
  const fetchBanners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("banner")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching banners:", error.message);
    } else {
      setBanners(data);
    }
    setLoading(false);
  };

  // Handle image upload and save to the database
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    // Step 1: Upload image to Supabase Storage
    const fileName = `banner-${Date.now()}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from("banner")
      .upload(fileName, file, { upsert: true });

    if (storageError) {
      console.error("Error uploading banner:", storageError.message);
      setLoading(false);
      return;
    }

    // Step 2: Get the public URL of the uploaded image
    const { data: publicUrlData, error: urlError } = supabase.storage
      .from("banner")
      .getPublicUrl(storageData.path);

    if (urlError) {
      console.error(
        "Error getting public URL for the image:",
        urlError.message
      );
      setLoading(false);
      return;
    }

    const publicURL = publicUrlData.publicUrl;
    if (!publicURL) {
      console.error("Failed to retrieve public URL.");
      setLoading(false);
      return;
    }

    // Step 3: Save the image URL to the database
    const { data: dbData, error: dbError } = await supabase
      .from("banner")
      .insert([{ imageurl: publicURL }]); // Save the public URL

    if (dbError) {
      console.error("Error saving banner to database:", dbError.message);
    } else {
      console.log("Banner saved to database:", dbData);
      // Fetch updated banners
      await fetchBanners();
    }

    setLoading(false);
  };

  // Handle banner deletion
  const handleDelete = async (bannerId, imagePath) => {
    setLoading(true);

    // Step 1: Delete the image from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("banner")
      .remove([imagePath]);

    if (storageError) {
      console.error(
        "Error deleting banner from storage:",
        storageError.message
      );
      setLoading(false);
      return;
    }

    // Step 2: Delete the record from the database
    const { error: dbError } = await supabase
      .from("banner")
      .delete()
      .eq("id", bannerId);

    if (dbError) {
      console.error("Error deleting banner from database:", dbError.message);
    } else {
      // Fetch updated banners
      await fetchBanners();
    }

    setLoading(false);
  };

  // Fetch banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <Link
        to="/dashboard"
        underline="hover"
        style={{
          fontSize: "12px",
          color: "rgb(17, 25, 39)",
          fontWeight: "600",
        }}
      >
        Dashboard
      </Link>
      <h1>Banner Management</h1>

      {/* Upload Section */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={loading}
        />
      </div>

      {/* Display Banners */}
      <div style={{ marginTop: "20px" }}>
        {loading && <p>Processing...</p>}
        {banners.length > 0 ? (
          banners.map((banner) => (
            <div key={banner.id} style={{ marginBottom: "20px" }}>
              <img
                src={banner.imageurl}
                alt="Banner"
                style={{ width: "300px", marginBottom: "10px" }}
              />
              <br />
              <button
                onClick={() =>
                  handleDelete(banner.id, banner.imageurl.split("/").pop())
                }
                disabled={loading}
              >
                Delete Banner
              </button>
            </div>
          ))
        ) : (
          <p>No banners uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default Banner;
