import PropTypes from "prop-types";

function ToggleSwitch({ id, name, value, onChange, required = false }) {
  const handleToggle = (event) => {
    const newValue = event.target.checked;
    if (onChange) {
      onChange({
        target: {
          name,
          value: newValue,
        },
      });
    }
  };

  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        id={id}
        name={name}
        checked={value}
        onChange={handleToggle}
        required={required}
      />
      <div
        className={`relative w-11 h-6 rounded-full transition-all ${
          value
            ? "bg-teal-600 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800"
            : "bg-gray-200 dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-gray-300"
        }`}
      >
        <div
          className={`absolute top-[2px] start-[2px] h-5 w-5 rounded-full bg-white border transition-all ${
            value
              ? "translate-x-full rtl:-translate-x-full border-white"
              : "border-gray-300 dark:border-gray-600"
          }`}
        ></div>
      </div>
    </label>
  );
}

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default ToggleSwitch;
