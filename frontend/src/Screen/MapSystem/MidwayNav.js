import "./nav.css";
import CheckIcon from "../../assets/icons/CheckIcon";
import { useLocation } from "react-router-dom";

export default function MidwayNav({ steps, numSteps, stage }) {
  const location = useLocation()
  const Step = ({ stepCompleted, step, index }) => {
    return (
      <div
        className={`flex flex-col items-center gap-y-1 ${
          (stage === 2 && numSteps && index === 0 && "animate-out") ||
          (stage === 2 && numSteps && "animate-in")
        }`}
        style={{ zIndex: 20 }}
      >
        <div className="circle-shadow bg-base-white rounded-full h-12 w-12 flex justify-center items-center">
          {stepCompleted ? (
            <div className="bg-utility-blue rounded-full h-8 w-8 flex items-center justify-center">
              <CheckIcon color={"white"} />
            </div>
          ) : (
            <div className="border-utility-blue border-[6px] rounded-full h-8 w-8" />
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-y-1">
          <div className="w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[8px] border-b-utility-blue" />

          <div className="bg-utility-blue rounded-full px-[0.2rem] smx:px-2 py-1 button-shadow">
            <h3 className="text-white text-sm lg:text-lg  font-bold">{step}</h3>
          </div>
        </div>
      </div>
    );
  };

  console.log(location.pathname)

  return (
    <div
      className={`flex relative w-full ${
        (numSteps && "justify-between") || "justify-center"
      } ${location.pathname === "/" ? "px-24 lg:px-28" : "px-20 lg:px-28"}`}
    >
      <Step
        stepCompleted={steps[0].stepCompleted}
        step={steps[0].step}
        index={0}
      />
      {numSteps && (
        <>
          <div
            className={`bg-utility-blue h-2 absolute ${stage === 2 && "animate-line"}`}
            style={{
              top: "25%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: numSteps ? "8rem" : "0",
            }}
          />
          <Step
            stepCompleted={steps[1].stepCompleted}
            step={steps[1].step}
            index={1}
          />
        </>
      )}
    </div>
  );
}
