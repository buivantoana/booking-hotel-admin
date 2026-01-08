import React from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import InsightsIcon from "@mui/icons-material/Insights";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HotelOutlinedIcon from "@mui/icons-material/HotelOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import logo from "../../src/images/Frame 1321318032.png";
export default function SidebarMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
const role = user?.role;

const menuItems = [
  {
    id: "home",
    label: "Trang chủ",
    icon: <HomeOutlinedIcon />,
    path: "/",
    roles: ["admin", "super_admin"],
  },
  {
    id: "approval",
    label: "Phê duyệt",
    icon: <CheckCircleOutlineIcon />,
    path: "/approval",
    roles: ["admin", "super_admin"],
  },
  {
    id: "hotelManagement",
    label: "Quản lý khách sạn",
    icon: <HotelOutlinedIcon />,
    path: "/manager-hotel",
    roles: ["admin", "super_admin"],
  },
  {
    id: "booking",
    label: "Quản lý đặt phòng",
    icon: <CalendarMonthOutlinedIcon />,
    path: "/manager-bookings",
    roles: ["admin", "super_admin"],
  },
  {
    id: "payment",
    label: "Quản lý thanh toán",
    icon: <PaymentOutlinedIcon />,
    path: "/manager-payments",
    roles: ["admin", "super_admin"],
  },
  {
    id: "review",
    label: "Quản lý đánh giá",
    icon: <StarBorderOutlinedIcon />,
    path: "/review",
    roles: ["admin", "super_admin"],
  },
  {
    id: "account",
    label: "Quản lý tài khoản",
    icon: <AccountCircleOutlinedIcon />,
    path: "/manager-accounts",
    roles: ["admin", "super_admin"],
  },
  {
    id: "staff",
    label: "Quản lý nhân viên",
    icon: <GroupOutlinedIcon />,
    path: "/manager-staff",
    roles: ["admin", "super_admin"],
  },
  {
    id: "reconciliation",
    label: "Quản lý đối soát",
    icon: <InsightsOutlinedIcon />,
    path: "/reconciliation",
    roles: ["accountant", "admin", "super_admin"],
  },
  {
    id: "attribute",
    label: "Thiết lập tiện ích",
    icon: <Add />,
    path: "/manager-attribute",
    roles: ["accountant", "admin", "super_admin"],
  },
];
const filteredMenu = menuItems.filter(item =>
  item.roles.includes(role)
);
  return (
    <Box sx={{ position: "relative", height: "100vh" }}>
      <Box
        sx={{
          width: { xs: "220px", sm: "260px" },
          height: "calc(100vh - 32px)",
          borderRight: "1px solid #eee",
          p: 2,
          bgcolor: "#fff",
          flex: 0.7,
        }}>
        <Box my={3} display={"flex"} justifyContent={"center"}>
          <img src={logo} width={200} alt='' />
        </Box>

        <List sx={{ height: "70vh", overflowY: "auto" }}>
          {filteredMenu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.id}
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: "20px",
                  bgcolor: isActive ? "#F4FBE7" : "transparent",
                  color: isActive ? "#7CB518" : "#8B93A1",
                  "&:hover": {
                    bgcolor: isActive ? "#EAF7D3" : "#f5f5f5",
                  },
                  fontWeight: isActive ? 700 : 500,
                }}>
                <ListItemIcon
                  sx={{
                    color: isActive ? "#7CB518" : "#8B93A1",
                    minWidth: 40,
                  }}>
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  // Set fontSize ở đây là tốt nhất
                  sx={{
                    "& .MuiTypography-root": {
                      fontSize: "18px", // hoặc "1rem"
                      fontWeight: "inherit", // Kế thừa fontWeight từ ListItemButton
                    },
                  }}
                  // Hoặc dùng primaryTypographyProps
                  primaryTypographyProps={{
                    sx: {
                      fontSize: "16px",
                      fontWeight: "inherit",
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}>
        <UserProfileButton />
      </Box>
    </Box>
  );
}

import { Avatar, Button, Popover, Divider, ListItem } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import PersonIcon from "@mui/icons-material/Person";
import { useBookingContext } from "../App";
import { Add } from "@mui/icons-material";
const UserProfileButton = () => {
  const context = useBookingContext();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const navigate = useNavigate();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {/* Button chính - Avatar Card */}
      <Button
        onClick={handleClick}
        sx={{
          bgcolor: "white",
          borderRadius: "10px", // bo góc nhiều hơn giống hình
          padding: "10px 20px",
          border: "1px solid #e0e0e0",

          textTransform: "none",
          display: "flex",
          alignItems: "center",
          gap: 2,
          "&:hover": {
            bgcolor: "#f9f9f9",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        }}>
        <Avatar
          sx={{
            bgcolor: "#98B720",
            color: "white",
            width: 44,
            height: 44,
          }}>
          <PersonIcon />
        </Avatar>

        <Box sx={{ textAlign: "left", flexGrow: 1 }}>
          <Typography
            variant='subtitle1'
            fontWeight='bold'
            width={"120px"}
            overflow={"hidden"}
            color='text.primary'>
            {context?.state?.user?.email}
          </Typography>
          {context?.state?.user?.phone && (
            <Typography variant='body2' color='text.secondary'>
              +84 {context?.state?.user?.phone?.slice(3)}
            </Typography>
          )}
        </Box>

        <ArrowDropUpIcon
          sx={{
            color: "text.secondary",
            transform: open ? "rotate(180deg)" : "rotate(0deg)", // Đảo chiều đúng: mở thì mũi tên xuống
            transition: "transform 0.3s ease",
            ml: 1,
          }}
        />
      </Button>

      {/* Popover - Popup menu */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              width: anchorEl ? anchorEl.offsetWidth : "auto", // RẤT QUAN TRỌNG: rộng bằng button
              mt: 1.5,
              borderRadius: "16px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              overflow: "visible",
              bgcolor: "white",
              padding: 0,
            },
          },
        }}>
        {/* Mũi tên chỉ lên - nằm giữa */}
        <ArrowDropUpIcon
          sx={{
            position: "absolute",
            top: -15,
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 32,
            color: "white",
            filter: "drop-shadow(0 -2px 4px rgba(0,0,0,0.1))",
          }}
        />

        {/* Nội dung popup */}
        <Box sx={{ px: 3.5, py: 3.5 }}>
          <Typography
            onClick={() => {
              handleClose();
              navigate("/manager-profile");
            }}
            sx={{ cursor: "pointer" }}
            variant='h6'
            color='text.primary'
            gutterBottom>
            Hồ sơ cá nhân
          </Typography>

          <Typography
            variant='body1'
            color='error.main'
            onClick={() => {
              context.dispatch({
                type: "LOGOUT",
                payload: {
                  ...context.state,
                  user: {},
                },
              });
              localStorage.removeItem("user");
              localStorage.removeItem("access_token");
              handleClose();
            }}
            fontWeight='bold'
            sx={{
              cursor: "pointer",

              "&:hover": { textDecoration: "underline" },
            }}>
            Đăng xuất
          </Typography>
        </Box>
      </Popover>
    </>
  );
};
