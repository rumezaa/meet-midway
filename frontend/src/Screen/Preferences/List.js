import React, { useState } from "react";

export default function PreferencesList({
  preferences,
  setPreferences,
  selectedPrefs,
  setSelectedPref,
  height,
  width,
}) {
  const colors = [
    { selected: "#FF3A3A", unselected: "#FBAAAA" },
    { selected: "#FDBF49", unselected: "#F4D497" },
    { selected: "#2CCE59", unselected: "#A0ECA0" },
    { selected: "#5498FF", unselected: "#A4C7FF" },
    { selected: "#DCD7D7", unselected: "#F2EFEF" },
    { selected: "#673AB7", unselected: "#BAA2E4" },
  ];

  const handlePreferenceClick = (preference, colorIndex) => {

    console.log(colorIndex)
    const updatedPreferences = preferences.map((pref) => {
      if (pref.name === preference.name) {
        return { ...pref, isSelected: !pref.isSelected, colorRef: colorIndex };
      }
      return pref;
    });

    const ranked = updatedPreferences
      .filter((pref) => pref.isSelected)
      .sort((a, b) => a.rank - b.rank);
    ranked.forEach((pref, index) => {
      pref.rank = index + 1;
    });

    const unranked = updatedPreferences.filter((pref) => !pref.isSelected);

    setPreferences([...ranked, ...unranked]);
    setSelectedPref([...ranked]);
  };

  console.log(selectedPrefs);

  const rankedPreferences = preferences.filter((pref) => pref.isSelected);
  const unrankedPreferences = preferences.filter((pref) => !pref.isSelected);

  const PreferenceItem = ({
    idx,
    children,
    isRanked,
    onClick,
    color,
    name,
  }) => (
    <div
      className={`uppercase flex items-center justify-center h-10 px-4 py-1 rounded-lg cursor-pointer text-white`}
      onClick={onClick}
      style={{ backgroundColor: color }}
    >
      {isRanked && (
        <span className="text-white font-bold opacity-80">{idx}&nbsp;</span>
      )}
      <h3
        className={`${isRanked ? "font-bold" : "font-semibold"} ${
          color === "#F2EFEF" && "text-gray-300"
        }`}
      >
        {name}
      </h3>
    </div>
  );

  return (
    <div
      className={`flex flex-wrap justify-center gap-2 overflow-y-auto pt-5 w-full ${
        preferences.length > 2 && "h-full"
      }`}
    >
      {rankedPreferences
        .sort((a, b) => a.rank - b.rank)
        .map((pref) => (
          <PreferenceItem
            key={pref.name}
            idx={pref.rank}
            isRanked={pref.isSelected}
            onClick={() => handlePreferenceClick(pref, pref.colorRef)}
            color={colors[pref.colorRef].selected}
            name={pref.name}
          />
        ))}
      {unrankedPreferences.map((pref, index) => (
        <PreferenceItem
          key={pref.name}
          idx={null}
          name={pref.name}
          isRanked={pref.isSelected}
          onClick={() =>
            handlePreferenceClick(pref, pref.colorRef || index % colors.length)
          }
          color={colors[pref.colorRef || index % colors.length].unselected}
        />
      ))}
    </div>
  );
}
