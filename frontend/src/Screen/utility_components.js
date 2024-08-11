import OptionsIcon from "../assets/icons/OptionsIcon";
import RemoveIcon from "../assets/icons/RemoveIcon";
import PinIconOutline from "../assets/icons/PinIcons/PinIconOutline";
import XIcon from "../assets/icons/XIcon";
import AccountIcon from "../assets/icons/AccountIcon";
import LockIcon from "../assets/icons/LockIcon";
import RouteIcon from "../assets/icons/RouteIcon";
import AutoCompleteLocation from "./MapSystem/AutoCompleteLocation";
import { EyeIcon } from "../assets/icons/EyeIcon";

export const AddressInput = ({
  type,
  color,
  removeAddress,
  onChange,
  disableRemove,
  manageButton,
  value = "",
  idx,
}) => {
  const PathImg = () => {
    return (
      <svg
        width="2"
        height="19"
        viewBox="0 0 2 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1L1 18"
          stroke="#585858"
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="1 4"
        />
      </svg>
    );
  };
  return (
    <div className="flex justify-center h-12 gap-x-2 mb-1">
      <div className="flex justify-center relative">
        {(type === "self" && (
          <div className="flex flex-col items-center justify-center gap-y-1">
            <div className="shadow-lg border bg-white h-6 w-6 rounded-full flex justify-center items-center">
              <div className="bg-utility-blue rounded-full h-4 w-4" />
            </div>
            <div className="absolute -bottom-3">
              <PathImg />
            </div>
          </div>
        )) || (
          <div className="flex flex-col items-center justify-center">
            <PinIconOutline color={color} />
          </div>
        )}
      </div>

      <AutoCompleteLocation
        placeholder={
          (type === "self" && "Your Address") || "Enter Friend's Address"
        }
        idx={idx}
        autocomplete="off"
        onChange={onChange}
        disabled={disableRemove}
        value={value}
      />

      <div className="flex justify-center items-center">
        {(type === "self" && (
          <div onClick={manageButton}>
            <OptionsIcon />
          </div>
        )) || (
          <div
            className={`${disableRemove && "invisible"}`}
            onClick={removeAddress}
          >
            <RemoveIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed w-full inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg shadow-xl mx-4">
            <div className="flex justify-between items-center p-4 ">
              <h2 className="text-xl font-semibold">{title}</h2>
              <div onClick={onClose}>
                <XIcon />
              </div>
            </div>
            <div className="p-4">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export const TextInput = ({
  type,
  padding,
  onChange,
  value,
  showPswd,
  setShowPswd,
}) => {
  return (
    <div
      className={`flex bg-white rounded-full gap-x-1 ${
        padding || "p-3"
      } w-full shadow-lg items-center`}
    >
      <div>
        {(type === "Email" && <AccountIcon width={25} height={24} />) ||
          (type === "Password" && <LockIcon width={25} height={18} />) ||
          (type === "Location" && <RouteIcon width={25} color={"#9A9A9A"} />)}
      </div>

      <input
        type={type === "Password" && !showPswd ? "password" : "text"}
        placeholder={type}
        className="placeholder-gray-200 focus:outline-none text-gray-300 text-lg w-full"
        onChange={onChange}
        value={value}
      />

      {type === "Password" && (
        <div onClick={setShowPswd} className="mr-2">
          <EyeIcon isHidden={!showPswd} />
        </div>
      )}
    </div>
  );
};
