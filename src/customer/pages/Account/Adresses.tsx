import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { useAppSelector } from "../../../Redux Toolkit/Store";
import UserAddressCard from "./UserAddressCard";
import "./Profile.css";

const Addresses = () => {
  const addresses = useAppSelector((s) => s.user.user?.addresses || []);

  return (
    <div className="grid gap-4">
      <div className="amz-card">
        <div className="amz-card-header">
          <span>Saved addresses</span>
          <button className="amz-btn-primary">
            <AddRoundedIcon sx={{ fontSize: 15 }} />
            Add address
          </button>
        </div>
      </div>

      {!addresses.length ? (
        <div className="amz-card">
          <div className="amz-empty-state">
            <LocationOnRoundedIcon sx={{ fontSize: 54, color: "#9DB2C2" }} />
            <p className="amz-empty-title">No saved addresses</p>
            <p className="amz-empty-desc">Save addresses to speed up future checkout.</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {addresses.map((item) => (
            <UserAddressCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
