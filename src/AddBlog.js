import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSupabase from "./useSupabase";

const AddBlog = () => {
  const supabase = useSupabase();
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Store the public URL of the image
  const [imagePath, setImagePath] = useState(""); // Store the image path for deletion
  const [h1Heading, setH1Heading] = useState("");
  const [h1Description, setH1Description] = useState("");
  const [h2Heading, setH2Heading] = useState("");
  const [h2Description, setH2Description] = useState("");
  const [h3Heading, setH3Heading] = useState("");
  const [h3Description, setH3Description] = useState("");
  const [h4Heading, setH4Heading] = useState("");
  const [h4Description, setH4Description] = useState("");
  const [h5Heading, setH5Heading] = useState("");
  const [h5Description, setH5Description] = useState("");
  const [h6Heading, setH6Heading] = useState("");
  const [h6Description, setH6Description] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch blog data for editing
  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", id)
          .single();

        if (data) {
          setTitle(data.title || "");
          setH1Heading(data.h1_heading || "");
          setH1Description(data.h1_description || "");
          setH2Heading(data.h2_heading || "");
          setH2Description(data.h2_description || "");
          setH3Heading(data.h3_heading || "");
          setH3Description(data.h3_description || "");
          setH4Heading(data.h4_heading || "");
          setH4Description(data.h4_description || "");
          setH5Heading(data.h5_heading || "");
          setH5Description(data.h5_description || "");
          setH6Heading(data.h6_heading || "");
          setH6Description(data.h6_description || "");

          // Set image path and fetch public URL
          const imagePath = data.imagepath || "";
          setImagePath(imagePath);

          if (imagePath) {
            const { data: publicUrlData, error: urlError } = supabase.storage
              .from("banner")
              .getPublicUrl(imagePath);

            if (urlError) {
              console.error("Error getting image URL:", urlError.message);
            } else {
              setImageUrl(publicUrlData.publicUrl);
            }
          }
        }

        if (error) {
          console.error("Error fetching blog:", error.message);
        }
      };
      fetchBlog();
    }
  }, [id, supabase]);

  // Handle image upload
  const handleImageUpload = async (file) => {
    const fileName = `blog-${Date.now()}-${file.name}`;
    setLoading(true);

    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("banner")
      .upload(fileName, file, { upsert: true });

    if (storageError) {
      console.error("Error uploading image:", storageError.message);
      setLoading(false);
      return;
    }

    // Get public URL
    const { data: publicUrlData, error: urlError } = supabase.storage
      .from("banner")
      .getPublicUrl(storageData.path);

    if (urlError) {
      console.error("Error getting image URL:", urlError.message);
      setLoading(false);
      return;
    }

    setImageUrl(publicUrlData.publicUrl);
    setImagePath(storageData.path); // Store image path for deletion
    setLoading(false);
  };

  // Handle image deletion
  const handleImageDelete = async () => {
    if (!imagePath) return;

    setLoading(true);

    // Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("banner")
      .remove([imagePath]);

    if (storageError) {
      console.error("Error deleting image:", storageError.message);
      setLoading(false);
      return;
    }

    // Clear the image URL and path
    setImageUrl("");
    setImagePath("");
    setLoading(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const blogData = {
      title,
      imagepath: imagePath, // Save image path for deletion
      h1_heading: h1Heading,
      h1_description: h1Description,
      h2_heading: h2Heading,
      h2_description: h2Description,
      h3_heading: h3Heading,
      h3_description: h3Description,
      h4_heading: h4Heading,
      h4_description: h4Description,
      h5_heading: h5Heading,
      h5_description: h5Description,
      h6_heading: h6Heading,
      h6_description: h6Description,
    };

    if (id) {
      // Update blog
      const { error } = await supabase
        .from("blogs")
        .update(blogData)
        .eq("id", id);

      if (error) {
        console.error("Error updating blog:", error.message);
      } else {
        console.log("Blog updated successfully");
        navigate("/blog");
      }
    } else {
      // Insert new blog
      const { error } = await supabase.from("blogs").insert([blogData]);

      if (error) {
        console.error("Error adding blog:", error.message);
      } else {
        console.log("Blog added successfully");
        navigate("/blog");
      }
    }

    setLoading(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
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
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        {id ? "Edit Blog" : "Add a New Blog"}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Blog Title */}

        {/* Image Upload */}
        <Typography variant="h6" gutterBottom>
          Upload Blog Image
        </Typography>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          disabled={loading}
        />
        {imageUrl && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={imageUrl}
              alt="Uploaded Preview"
              style={{ width: "200px", marginBottom: "10px" }}
            />
            <br />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleImageDelete}
              disabled={loading}
            >
              Delete Image
            </Button>
          </div>
        )}
        <br />
        <br />

        <TextField
          label="Blog Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Typography variant="h6" gutterBottom>
          Heading 1
        </Typography>
        <TextField
          label="Heading 1 Text"
          variant="outlined"
          fullWidth
          value={h1Heading}
          onChange={(e) => setH1Heading(e.target.value)}
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="Description for Heading 1"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={h1Description}
          onChange={(e) => setH1Description(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Heading 2 */}
        <Typography variant="h6" gutterBottom>
          Heading 2
        </Typography>
        <TextField
          label="Heading 2 Text"
          variant="outlined"
          fullWidth
          value={h2Heading}
          onChange={(e) => setH2Heading(e.target.value)}
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="Description for Heading 2"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={h2Description}
          onChange={(e) => setH2Description(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Heading 3 */}
        <Typography variant="h6" gutterBottom>
          Heading 3
        </Typography>
        <TextField
          label="Heading 3 Text"
          variant="outlined"
          fullWidth
          value={h3Heading}
          onChange={(e) => setH3Heading(e.target.value)}
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="Description for Heading 3"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={h3Description}
          onChange={(e) => setH3Description(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Heading 4 */}
        <Typography variant="h6" gutterBottom>
          Heading 4
        </Typography>
        <TextField
          label="Heading 4 Text"
          variant="outlined"
          fullWidth
          value={h4Heading}
          onChange={(e) => setH4Heading(e.target.value)}
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="Description for Heading 4"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={h4Description}
          onChange={(e) => setH4Description(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Heading 5 */}
        <Typography variant="h6" gutterBottom>
          Heading 5
        </Typography>
        <TextField
          label="Heading 5 Text"
          variant="outlined"
          fullWidth
          value={h5Heading}
          onChange={(e) => setH5Heading(e.target.value)}
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="Description for Heading 5"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={h5Description}
          onChange={(e) => setH5Description(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Heading 6 */}
        <Typography variant="h6" gutterBottom>
          Heading 6
        </Typography>
        <TextField
          label="Heading 6 Text"
          variant="outlined"
          fullWidth
          value={h6Heading}
          onChange={(e) => setH6Heading(e.target.value)}
          sx={{ marginBottom: 1 }}
        />
        <TextField
          label="Description for Heading 6"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={h6Description}
          onChange={(e) => setH6Description(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ marginTop: 2 }}
        >
          {loading ? "Saving..." : id ? "Update Blog" : "Save Blog"}
        </Button>
      </form>
    </Box>
  );
};

export default AddBlog;
