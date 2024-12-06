import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import {
  Image as BannerIcon,
  Article as BlogIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logged out!");
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
      }}
    >
      {/* Welcome Message */}
      <Typography variant="h4" sx={{ marginBottom: 4 }}>
        Welcome Admin
      </Typography>

      {/* Action Boxes */}
      <Grid
        container
        spacing={3}
        sx={{
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* Update Banner Box */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => navigate("/banner")}
            variant="contained"
            sx={{
              width: "100%",
              height: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BannerIcon sx={{ fontSize: 40, marginBottom: 1 }} />
            <Typography>Update Banner</Typography>
          </Button>
        </Grid>

        {/* Update Blog Box */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={() => navigate("/blog")}
            variant="contained"
            color="success"
            sx={{
              width: "100%",
              height: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <BlogIcon sx={{ fontSize: 40, marginBottom: 1 }} />
            <Typography>Update Blog</Typography>
          </Button>
        </Grid>

        {/* Logout Box */}
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            sx={{
              width: "100%",
              height: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LogoutIcon sx={{ fontSize: 40, marginBottom: 1 }} />
            <Typography>Logout</Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
