import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    // Simple email and password validation (replace with API call)
    if (email === "admin@example.com" && password === "password123") {
      navigate("/dashboard"); // Navigate to the dashboard
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fff",
          padding: "30px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Poppins",
            fontWeight: 600,
            color: "#333",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email ID"
            name="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            sx={{ marginBottom: "20px" }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            sx={{ marginBottom: "20px" }}
          />
          {error && (
            <Typography
              variant="body2"
              sx={{ color: "red", marginBottom: "10px", textAlign: "center" }}
            >
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              bgcolor: "orange",
              color: "white",
              textTransform: "capitalize",
              "&:hover": { bgcolor: "darkorange" },
            }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
