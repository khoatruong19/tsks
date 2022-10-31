import React from "react";

const Login = () => {
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center bg-primaryColor">
      <button className="group transform rounded-md bg-secondaryColor px-3 py-2 shadow-md duration-150 ease-in-out hover:bg-gray-600">
        <div className="flex items-center gap-2">
          <img
            className="h-10 w-10 object-cover"
            alt=""
            src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
          />
          <span className="transform font-semibold text-textColor duration-150 ease-in-out group-hover:text-primaryColor">
            {" "}
            Sign In With Google
          </span>
        </div>
      </button>
    </div>
  );
};

export default Login;
