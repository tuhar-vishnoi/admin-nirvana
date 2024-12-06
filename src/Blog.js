import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import useSupabase from "./useSupabase"; // Custom hook to initialize Supabase

const Blog = () => {
  const supabase = useSupabase();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch blogs from Supabase
  const fetchBlogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching blogs:", error.message);
    } else {
      setBlogs(data);
    }
    setLoading(false);
  };

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  // Delete a blog with confirmation
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (isConfirmed) {
      const { error } = await supabase.from("blogs").delete().match({ id });
      if (error) {
        console.error("Error deleting blog:", error.message);
      } else {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      }
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Blog Header */}
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
        Blog Posts
      </Typography>

      {/* Add Blog Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ marginBottom: 3 }}
        onClick={() => navigate("/addblog")}
      >
        Add Blog
      </Button>

      {/* Loading State */}
      {loading && (
        <CircularProgress sx={{ margin: "20px auto", display: "block" }} />
      )}

      {/* Display Blogs */}
      <Grid container spacing={2}>
        {blogs.map((blog) => (
          <Grid item xs={12} sm={6} md={4} key={blog.id}>
            <Box
              sx={{
                border: "1px solid #ddd",
                padding: 2,
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="h6">{blog.title}</Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                {blog.description}
              </Typography>
              <Button
                variant="outlined"
                sx={{ marginBottom: 2 }} // Added spacing between buttons
                onClick={() => navigate(`/addblog/${blog.id}`)}
              >
                Read More
              </Button>

              {/* Delete Button */}
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(blog.id)}
              >
                Delete
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Blog;
