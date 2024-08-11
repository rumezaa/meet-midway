export default function ArrowPosIcon({ closed }) {
  return closed ? (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 9L12 15L6 9" stroke="#33363F" stroke-width="2" />
    </svg>
  ) : (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 15L12 9L6 15" stroke="#33363F" stroke-width="2" />
    </svg>
  );
}
