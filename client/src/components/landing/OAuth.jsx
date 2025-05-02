import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { signInWithGoogle } from "../../redux/slices/authSlice";

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
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-xs transition-all duration-600"
        >
          <div
            className={`bg-gradient-to-br from-black/90 via-gray-900 to-black/90 border border-gray-900 rounded-2xl shadow-xl w-full max-w-md mx-4 p-4 text-center transition-all duration-300 ${
              authDialogOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8">
              <h2 className="font-dancing text-white font-extrabold text-3xl sm:text-4xl">
                CoAI
              </h2>
              <p className="font-Syne text-sm sm:text-md mt-1 font-semibold bg-gradient-to-r from-blue-100 to-blue-100 bg-clip-text text-transparent">
                Your collaborative AI workspace.
              </p>
            </div>

            {/* Content */}
            <div className="my-8 sm:my-16">
              <h2 className="font-Krona text-2xl sm:text-3xl font-bold text-gray-200 mb-1">
                Welcome Back
              </h2>
              <p className="font-Syne text-base sm:text-lg text-slate-400 mb-6 sm:mb-8">
                Sign in to your account to continue
              </p>

              <button
                onClick={handleGoogleSignIn}
                className="w-full max-w-xs h-12 px-4 rounded-3xl flex gap-5 mx-auto items-center justify-center bg-gradient-to-r from-gray-800 hover:from-gray-900 to-blue-500/30 border-x border-gray-700 hover:border-gray-800 transition-colors"
              >
                <FcGoogle className="text-xl sm:scale-150" />
                <span className="font-Syne text-sm sm:text-base text-white">
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