import PropTypes from "prop-types";

const SuccessPopUp = ({ heading, description, onClick }) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500/75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex flex-col items-center justify-center">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    data-slot="icon"
                    className="text-green-500 size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    ></path>
                  </svg>
                </div>
                <div className="mt-5 text-center">
                  <h3
                    className="text-base font-semibold text-gray-900"
                    id="modal-title"
                  >
                    {heading}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-5 mx-6">
              <button
                type="button"
                onClick={onClick}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-teal-600 text-white px-3 py-2 text-sm font-semibold ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-teal-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SuccessPopUp.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SuccessPopUp;
