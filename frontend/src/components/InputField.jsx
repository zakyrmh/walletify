import PropTypes from "prop-types";

const InputField = ({
  type,
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm/6"
    />
  );
};

// Validasi props menggunakan PropTypes
InputField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default InputField;
