import { Drawer, IconButton } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ DrawerList }: any) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        height: 68,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 14px",
        borderBottom: "1px solid #DCE8EC",
        background: "rgba(248,251,252,0.92)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <IconButton onClick={() => setOpen(true)}>
          <MenuRoundedIcon />
        </IconButton>
        <button
          onClick={() => navigate("/")}
          style={{ border: "none", background: "transparent", fontWeight: 700, cursor: "pointer", color: "#0F172A" }}
        >
          Shopzy
        </button>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <DrawerList toggleDrawer={() => () => setOpen(false)} />
      </Drawer>
    </div>
  );
};

export default Navbar;
