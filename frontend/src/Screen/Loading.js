export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <img
        src={require("../assets/loading.gif")}
        alt="Loading..."
        className="w-24 h-36"
      />
    </div>
  );
}
