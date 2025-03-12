import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { signInWithGoogle } from "../redux/slices/authSlice";

const OAuth = ({ authDialogOpen, setAuthDialogOpen }) => {
  const dispatch = useDispatch();

  const handleGoogleSignIn = async () => {
    try {
      dispatch(signInWithGoogle());
      setAuthDialogOpen(false);
    } catch (error) {
      console.error("Error during sign-in dispatch:", error);
    }
  };

  return (
    <div className="Oauth">
      {authDialogOpen ? (
        <div
          onClick={() => setAuthDialogOpen(false)}
          className="scale-110 fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-xs transition-all duration-600"
        >
          <div
            className={`bg-gradient-to-br from-black/90 via-gray-900 to-black/90 border border-gray-900 rounded-2xl shadow-xl w-xl h-3/7 p-4 text-center scale-95 opacity-0 transition-all duration-300 ${
              authDialogOpen ? "scale-100 opacity-100" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-8">
              <h2 className="font-dancing text-white font-extrabold text-4xl">
                CoAI
              </h2>
              <p className="font-Syne text-md mt-1 font-semibold bg-gradient-to-r from-blue-100 via-gray-900 to-blue-100 bg-clip-text text-transparent">
                Your collaborative AI workspace.
              </p>
            </div>

            <div className="my-16">
              <h2 className="font-Krona text-3xl font-bold text-gray-200 mb-1">
                Welcome Back
              </h2>
              <p className="font-Syne text-lg text-slate-400 mb-8">
                Sign in to your account to continue
              </p>

              <button
                onClick={handleGoogleSignIn}
                className="w-60 h-12 px-4 rounded-3xl flex gap-5 mx-auto items-center justify-center bg-gradient-to-r from-gray-800 hover:from-gray-900 to-blue-500/30 border-x border-gray-700 hover:border-gray-800"
              >
                <FcGoogle className="scale-150" />
                <span className="font-Syne text-base text-white">
                  Sign in with Google
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default OAuth;
