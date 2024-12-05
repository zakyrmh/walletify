import PropTypes from "prop-types";

const ErrorPage = ({ pageName, error }) => {
  return (
    <main className="grid h-screen place-items-center px-6 py-24 ml-80 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">{pageName}</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
          Error
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
          {error}
        </p>
      </div>
    </main>
  );
};

ErrorPage.propTypes = {
  pageName: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
};

export default ErrorPage;
