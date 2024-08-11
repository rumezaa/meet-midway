import Map from "./MapSystem/Map.js";
import PurpleSwig from "../assets/images/location-swiggles/PurpleSwig.js";
import MidwayNav from "./MapSystem/MidwayNav.js";
import { useState, useEffect, useContext } from "react";
import InfoDrawer from "./MapSystem/InfoDrawer.js";
import { AddressInput } from "./utility_components.js";
import "./screenstyles.css";
import YellowSwig from "../assets/images/location-swiggles/YellowSwig.js";
import ArrivedIcon from "../assets/icons/ArrivedIcon.js";
import BackIcon from "../assets/icons/BackIcon.js";
import CopyIcon from "../assets/icons/CopyIcon.js";
import { Modal } from "./utility_components.js";
import AccountIcon from "../assets/icons/AccountIcon.js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserProvider.js";
import axios from "axios";
import Loading from "./Loading.js";

export default function HomeView() {
  const nav = useNavigate();
  const [steps, setSteps] = useState([
    { step: "Add Friends", stepCompleted: false },
    { step: "Midway!", stepCompleted: false },
  ]);

  const [user] = useContext(UserContext);

  const [stage, setStage] = useState(1);

  const [showSteps, setShowSteps] = useState(false);

  const [numFriends, setNumFriends] = useState(2);

  const [addresses, setAddresses] = useState([]);

  const [showYellowSwig, setShowYellowSwig] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [itinerary, setItinerary] = useState();

  const [paths, setPaths] = useState([]);

  const [selectedItinerary, setSelectedItinerary] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stage === 1) {
      setSteps((prevSteps) => [
        { ...prevSteps[0], stepCompleted: false },
        { ...prevSteps[1], stepCompleted: false },
      ]);

      setAddresses((prevAddresses) => {
        // Extend the array to match the new number of friends + 1
        const updatedAddresses = [...prevAddresses];
        const diff = numFriends + 1 - updatedAddresses.length;

        if (diff > 0) {
          updatedAddresses.push(...Array(diff).fill(""));
        } else if (diff < 0) {
          // Optionally, you can trim the array if numFriends decreases
          updatedAddresses.splice(numFriends + 1);
        }

        return updatedAddresses;
      });
    } else if (stage === 2) {
      setTimeout(() => {
        setSteps((prevSteps) => [
          { ...prevSteps[0], stepCompleted: true },
          prevSteps[1],
        ]);

        setTimeout(() => {
          setShowYellowSwig(true);
          setShowSteps(true);
        }, 500); // Delay before showing the yellow swig
      }, 300); // Duration of the purple swig animation
    } else if (stage === 3) {
      setSteps((prevSteps) => [
        prevSteps[0],
        { ...prevSteps[1], stepCompleted: true },
      ]);
    }
  }, [stage, numFriends]);

  // Assuming user location is available in the user context
  useEffect(() => {
    if (stage === 1) {
      setAddresses((prevAddresses) => {
        const updatedAddresses = [...prevAddresses];
        updatedAddresses[0] = user.location; // Set user's location as the first item
        return updatedAddresses;
      });
    }
  }, [user.location, stage]);

  const handleChange = (val, index) => {
    setAddresses((prevAddresses) => {
      const newAddresses = [...prevAddresses];
      newAddresses[index] = val;
      return newAddresses;
    });
  };


  const pinColors = ["#F61818", "#FDBF49", "#004AAD", "#00C520"];

  //format like [{step: "blah", stepCompleted: boolean}]

  const removeAddress = () => {
    setNumFriends(numFriends - 1);
  };

  const goBack = () => {
    setStage(stage - 1);
    if (stage === 1) {
      setSteps((prevSteps) => [
        { ...prevSteps[0], stepCompleted: false },
        prevSteps[1],
      ]);
    } else if (stage === 2) {
      setSteps((prevSteps) => [
        prevSteps[0],
        { ...prevSteps[1], stepCompleted: false },
      ]);
    }
  };

  const handleStage = async () => {
    if (stage === 1) {
      // Format the addresses and preferences
      const formattedAddy = addresses.map((address) => [
        address.location.lat,
        address.location.lng,
      ]);
      const formattedPreferences = user.preferences.map((pref) =>
        pref.name.toLowerCase()
      );
      // Prepare the data payload
      const data = {
        addresses: formattedAddy,
        preferences: formattedPreferences,
      };
      setLoading(true)
      try {
        // Send the POST request to the Flask server
        
        const response = await axios.post("/get_itinerary", data);
        // Handle the response data
        console.log("Generated Itinerary:", response.data);
        setItinerary(response.data);
        setStage(stage + 1);
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false)
    } else if (stage === 2) {
      const formattedAddy = itinerary.itinerary.map((address) => [
        address.coord.lat,
        address.coord.lng,
      ]);
      const formattedMidpoint = itinerary.midpoint;
      // Prepare the data payload
      const data = {
        addresses: formattedAddy,
        midpoint: formattedMidpoint,
      };
      setLoading(true)
      try {
        // Send the POST request to the Flask server
        const response = await axios.post("/get_directions", data);
        // Handle the response data
        console.log("directions:", response.data);
        setPaths(response.data);
        setStage(stage + 1);
      } catch (error) {
        console.error("Error:", error);
      }
      setLoading(false)
    } else if (stage > 2) {
      setStage(stage + 1);
    }
  };

  const ModalButton = ({ type, text, onButton }) => {
    return (
      <div
        onClick={onButton}
        className={`${
          (type === "link" && "bg-purple") || "bg-white"
        } rounded-lg border border-gray-200 flex justify-between items-center px-6  py-3 gap-x-6`}
      >
        <h3
          className={`${
            (type === "link" && "text-white font-semibold") || "text-black"
          } `}
        >
          {text}
        </h3>
        {(type === "link" && <CopyIcon width={25} />) || (
          <AccountIcon color={"black"} width={25} />
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col relative">
      <div className="bg-white h-40 w-full relative pb-3">
        <div className="mt-6" style={{ position: "relative", zIndex: 30 }}>
          <MidwayNav steps={steps} numSteps={showSteps} stage={stage} />
        </div>

        {
          <div
            className={`absolute bottom-0 ${showSteps && "move-out-top"}`}
            style={{ bottom: "-23rem", left: "-18rem", zIndex: 20 }}
          >
            <PurpleSwig />{" "}
          </div>
        }

        {showYellowSwig && (
          <div
            className={`absolute move-in-top`}
            style={{ bottom: "-25rem", zIndex: 20 }}
          >
            <YellowSwig />
          </div>
        )}
      </div>
      <div
        className="bg-white h-1/3 w-full flex flex-col justify-between pb-3 relative gap-y-2 "
        style={{ zIndex: 20 }}
      >
        <div className="overflow-y-auto w-full h-[9.5rem] relative">
          <AddressInput
            type={"self"}
            idx={0}
            disableRemove={stage > 1}
            onChange={handleChange}
            manageButton={() => setIsModalOpen(true)}
            value={!!addresses && (addresses[0]?.name || addresses[0])}
          />
          {[...Array(numFriends)].map((_, index) => (
            <AddressInput
              color={pinColors[index]}
              key={`${index}-friend`}
              removeAddress={removeAddress}
              onChange={handleChange}
              disableRemove={stage > 1}
              idx={index + 1}
              value={
                !!addresses &&
                (addresses[index + 1]?.name || addresses[index + 1])
              }
            />
          ))}
        </div>
        {stage === 1 && (
          <div
            className=" flex px-20"
            onClick={() => setNumFriends(numFriends + 1)}
          >
            <div className="bg-lime rounded-full text-white px-2">
              <h3>+ add friend</h3>
            </div>
          </div>
        )}
        {stage === 4 && (
          <div className="w-full flex justify-center items-center gap-x-2">
            <ArrivedIcon /> <h3>Your friends have arrived!</h3>
          </div>
        )}
        {(stage === 2 || stage === 3) && (
          <div className="absolute left-4 top-3" onClick={goBack}>
            <BackIcon />
          </div>
        )}
      </div>

      <Map
        stage={stage}
        containerStyle={{ width: "100vw", height: "80vh", zIndex: 20 }}
        friendsAddresses={addresses}
        itinerary={itinerary}
        paths={paths}
        setSelected={setSelectedItinerary}
      />

      <div className="relative h-20">
        <InfoDrawer
          stage={stage}
          onClickButton={handleStage}
          exitButton={() => setStage(1)}
          icon_active={!!addresses[1]}
          itinerary={selectedItinerary}
          user={user}
          directions={paths.directions}
        />
      </div>
      <div className="relative items-center">
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Modal Title"
          className="w-full"
        >
          <div className="flex flex-col gap-y-2 px-5 pb-5">
            <ModalButton type={"link"} text={"copy party link"} />
            <ModalButton
              type={"account"}
              text={"edit profile"}
              onButton={() => nav("/manage-account")}
            />
          </div>
        </Modal>
      </div>

      {loading && (
       <Loading />
      )}
    </div>
  );
}
