import PropTypes from "prop-types";

const Alert = ({ message, type }) => {
  return (
    <div
      className={`rounded-md p-4 mt-4
        ${type === "success" ? "bg-green-50" : "bg-red-50"}`}
    >
      <div className="flex">
        <div className="shrink-0	">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            // className="text-green-400 size-5"
            className={`size-5 ${
              type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3
            className={`text-sm font-medium
              ${type === "success" ? "text-green-800" : "text-red-800"}`}
          >
            {message}
          </h3>
        </div>
      </div>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default Alert;
