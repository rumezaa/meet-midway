import Draggable from 'react-draggable';
import RouteIcon from '../../assets/icons/RouteIcon.js';
import GoIcon from '../../assets/icons/GoIcon.js';
import LeaveIcon from '../../assets/icons/LeaveIcon.js';
import './drawer.css';
import { useEffect, useState } from 'react';
import StarRatings from 'react-star-ratings';
import ArrowPosIcon from '../../assets/icons/ArrowPosIcon.js';

export default function InfoDrawer({
  drawer,
  title,
  subtext,
  stage,
  onClickButton,
  icon_active,
  exitButton,
  children,
  itinerary,
  user,
  directions,
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const strokeColors = ["#FF0000", "#FDBF49", "#2985FF", "#2CCE59"];

  const handleDrag = (e, ui) => {
    setPosition({ x: 0, y: ui.y });
  };

  const handleStop = (e, ui) => {
    if (ui.y < -50) {
      setPosition({ x: 0, y: stage === 2 ? -120 : -380 });
      setIsDragging(false)
    } else {
      setIsDragging(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const ItineraryItem = () => {
    return (
      <div className="flex flex-row w-full gap-x-3">
        <div
          className="bg-cover bg-no-repeat h-20 w-20"
          style={{ backgroundImage: `url(${itinerary.img})` }}
        />
        <div className="flex flex-col">
          <h3 className="font-bold">{itinerary.name}</h3>
          <div className="flex flex-row items-center gap-x-1">
            <h3>{itinerary.rating}</h3>
            <div className="pb-1">
              <StarRatings
                rating={itinerary.rating}
                starRatedColor="gold"
                numberOfStars={5}
                name="rating"
                starDimension="15px"
                starSpacing="2px"
              />
            </div>
          </div>
          <h3 className="text-gray-300 text-sm">{itinerary.address}</h3>
        </div>
      </div>
    );
  };

  const DirectionItem = ({ direction, index}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
      setIsExpanded(!isExpanded);
    };


    return (
      <div className="border border-gray-100 mb-2 rounded-md p-3">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={handleToggle}
        >
          <h3 className={`font-semibold`} style={{color: strokeColors[index]}}>Directions for Stop #{index+1}</h3>
          <span><ArrowPosIcon closed={!isExpanded} /></span>
        </div>
        {isExpanded && (
  <div className="mt-2">
    {direction.steps.map((step, idx) => (
      <h3 key={idx}>
        <span className='font-bold'>{idx + 1}.</span> {step}
      </h3>
    ))}
  </div>
)}

      </div>
    );
  };

  useEffect(() => {
    console.log('isDragging state changed:', isDragging);
  }, [isDragging]);

  console.log(position)

  return (
    <Draggable
      axis="y"
      position={position}
      onDrag={handleDrag}
      onStop={handleStop}
      disabled={!isDragging}
    >
      <div
        className={`w-full flex flex-col ${
          isDragging && position.y < -20 ? 'h-0' : 'h-28'
        } relative`}
        style={{ zIndex: 30 }}
      >
        <div className="w-full flex flex-col absolute drawer-shadow">
          <div
            className={`bg-white w-full flex flex-col relative px-4 pt-4 `}
            style={{
              zIndex: 10,
              height: position.y < -50 ? `${stage === 2 ? '20rem' : '30rem'}` : '5rem',
            }}
          >
            <div className="flex text-nowrap justify-between relative">
              <div>
                <h3 className="tracking-wide font-semibold text-lg">
                  {(stage === 1 && `Get the party started ${user.first_name}`) ||
                    (stage === 2 && (itinerary.name || "Click green pin for details!" )) ||
                    (stage === 3 && 'View directions') ||
                    (stage === 4 && 'You all made it! 🥳')}
                </h3>
                <h3 className="tracking-wide text-gray-300 text-xs">
                  {(stage === 1 &&
                    ((!icon_active && 'Add friends to meet midway') ||
                      'Ready to meet midway?')) ||
                    (itinerary.address || "drag for details")}
                </h3>
              </div>
              {(stage === 2 || stage === 3)
               && (
                  <div
                    className="absolute bg-gray-200 h-1 w-32 rounded-full left-1/2 transform -translate-x-1/2 -top-2"
                    onClick={() => setIsDragging(true)}
                  />
                )}
              <div
                className={`rounded-full ${
                  (stage === 1 && !icon_active && 'bg-disabled-purple') ||
                  (stage === 1 && 'bg-purple') ||
                  (stage >= 2 && 'bg-utility-blue')
                } h-16 w-16 absolute right-0
                 -top-12 shadow-xl flex items-center justify-center`}
                onClick={() => {
                  if (icon_active && stage < 4) {
                    onClickButton?.(); // Ensure this is a function if provided
                  } else if (stage === 4) {
                    exitButton?.(); // Ensure this is a function if provided
                  }
                }}
              >
                {(stage === 1 && <RouteIcon />) ||
                  ((stage === 2 || stage === 3) && <GoIcon />) ||
                  (stage === 4 && <LeaveIcon />)}
              </div>
              {children}
            </div>

            <div className="w-full overflow-y-auto mt-4">
              {stage === 2 && position.y !== 0 && !!itinerary && <ItineraryItem />}
              {stage === 3 && position.y !== 0 && (
                <div>
                  {directions.map((obj, idx) => (
                    <DirectionItem key={idx} direction={obj} index={idx} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Draggable>
  );
}
