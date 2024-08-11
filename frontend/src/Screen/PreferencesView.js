import React, { useContext, useState } from "react";
import MidwayNav from "./MapSystem/MidwayNav";
import PreferencesList from "./Preferences/List";
import { placePreferences } from "./Preferences/preferencesList";
import { Modal } from "./utility_components";
import AddIcon from "../assets/icons/AddIcon";
import PurpleSwig from "../assets/images/pref-swiggles/PurpleSwig";
import YellowSwig from "../assets/images/pref-swiggles/YellowSwig";
import BlueSwig from "../assets/images/pref-swiggles/BlueSwig";
import "./screenstyles.css";
import ArrowRight from "../assets/icons/ArrowRightIcon";
import { auth, db } from "../Firebase/Firebase";
import { updateDoc, doc } from "firebase/firestore";
import { UserContext } from "../contexts/UserProvider";
import { useNavigate } from "react-router-dom";

export default function PreferencesView() {
  const nav = useNavigate();
  const [preferences, setPreferences] = useState(placePreferences);
  const [newPreference, setNewPreference] = useState("");
  const [selectedPref, setSelectedPref] = useState([]);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [user] = useContext(UserContext);

  console.log(user);

  const addPreference = () => {
    // check if the new preference is not empty and not already in the list (case-insensitive) by name key
    console.log(newPreference);

    if (
      newPreference.trim() !== "" &&
      !preferences.some(
        (pref) => pref.name.toLowerCase() === newPreference.trim().toLowerCase()
      )
    ) {
      setPreferences([
        ...preferences,
        { name: newPreference.trim(), isSelected: false },
      ]);
      setNewPreference("");
      setIsModalOpen(false);
    } else if (
      preferences.some(
        (pref) => pref.name.toLowerCase() === newPreference.trim().toLowerCase()
      )
    ) {
      setError("this option exists!");
      setTimeout(() => {
        setError(""); // Reset after 5 seconds
      }, 5000);
    }
  };

  async function handleUpdate() {
    if (selectedPref.length > 0) {
      setLoading(true);
      console.log("wlroini");

      // Update only the preferences field
      const userRef = doc(db, "users", user.id);
      console.log(userRef);
      await updateDoc(userRef, {
        preferences: selectedPref,
        signInFirstTime: false,
      });

      console.log("Preferences updated");
      setLoading(false); // Ensure you stop loading after updates
      nav("/");
    } else {
      console.log("nope");
    }
  }

  console.log(!!selectedPref);

  return (
    <div className="app-container flex flex-col items-center p-4 px-5 gap-2 relative">
      <MidwayNav
        steps={[
          { stepCompleted: true, step: "Sign In" },
          { stepCompleted: false, step: "Preferences" },
        ]}
        numSteps={2}
        stage={1}
      />
      <h1 className="text-5xl font-bold mt-4">Is This Right?</h1>
      <p className="text-xl font-semibold">Select Your Preferences</p>
      <div
        className="rounded-lg shadow-xl my-4 p-4"
        style={{ zIndex: 30, height: "40vh" }}
      >
        <PreferencesList
          preferences={preferences}
          setPreferences={setPreferences}
          selectedPrefs={selectedPref}
          setSelectedPref={setSelectedPref}
        />
      </div>
      <div
        className="bg-hot-pink rounded-full px-5 py-3 text-white font-semibold text-lg flex gap-x-3 items-center"
        onClick={() => setIsModalOpen(true)}
        style={{ zIndex: 30 }}
      >
        <AddIcon /> <h2>add preference</h2>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={"Add Preferences"}
      >
        <div className="flex flex-col items-center relative">
          <h3
            className={`absolute -top-7 text-xs text-red ${
              !!error ? "visible" : "invisible"
            }`}
          >
            {error}
          </h3>
          <input
            type="text"
            className="border border-gray-300 focus:outline-none rounded-lg px-3 py-2 mb-4 w-full"
            placeholder="preferences"
            value={newPreference}
            onChange={(e) => setNewPreference(e.target.value)}
          />
          <div className="flex justify-end w-full">
            <div
              className="bg-green text-white rounded-full px-4 py-2"
              onClick={addPreference}
            >
              add
            </div>
          </div>
        </div>
      </Modal>

      <div className={`absolute -top-5 move-in-top`}>
        <PurpleSwig />
      </div>
      <div
        className={`absolute -bottom-2 move-in-bottom`}
        style={{ zIndex: 10 }}
      >
        <YellowSwig />
      </div>
      <div
        className={`absolute -bottom-2 -left-2 move-in-bottom`}
        style={{ zIndex: 20 }}
      >
        <BlueSwig />
      </div>

      <div
        className={`bg-lime rounded-full px-4 py-2 text-xl text-white font-semibold flex items-center gap-x-2 absolute bottom-3 right-5 ${
          (selectedPref.length > 0 && "fade-in") || "opacity-0"
        }`}
        style={{ zIndex: 40 }}
        onClick={handleUpdate}
      >
        <h3>Go</h3>
        <ArrowRight />
      </div>
    </div>
  );
}
