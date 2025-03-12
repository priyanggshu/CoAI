import { FiLogIn } from "react-icons/fi";

const Navbar = ({ isScrolled, setAuthDialogOpen }) => {
  return (
    <nav
    className={`fixed w-full z-30 transition-all duration-300 ${
      isScrolled
        ? "bg-black/50 backdrop-blur-[4px] shadow-lg py-3"
        : "bg-black/30 backdrop-blur-[2px] shadow-xl py-5"
    }`}
  >
    <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
      <div className="flex items-center">
        <span
          className={`text-white text-3xl ${
            isScrolled ? "animate-pulse" : "animate-none"
          } font-dancing font-extrabold`}
        >
          CoAI
        </span>
      </div>
      <div className="hidden font-Syne md:flex space-x-8">
        <a
          href="#landing"
          className="text-gray-300 hover:text-gray-500 hover:translate-x-0.5 transition"
        >
          Welcome
        </a>
        <a
          href="#explore"
          className="text-gray-300 hover:text-gray-500 hover:translate-x-0.5 transition"
        >
          Overview
        </a>
        <a
          href="#process"
          className="text-gray-300 hover:text-gray-500 hover:translate-x-0.5 transition"
        >
          Inside CoAI
        </a>
        <a
          href="#cause"
          className="text-gray-300 hover:text-gray-500 hover:translate-x-0.5 transition"
        >
          Why Us
        </a>
        <a
          href="#credentials"
          className="text-gray-300 hover:text-gray-500 hover:translate-x-0.5 transition"
        >
          Connect
        </a>
      </div>
      <div>
        <div className="">
          <button
            onClick={() => setAuthDialogOpen(true)}
            className="flex items-center gap-3 px-5 py-2 font-Syne font-semibold bg-white text-black rounded-xl hover:bg-[#2D1A57] hover:text-[#D9DBE3] hover:translate-x-1 transition shadow-md"
          >
            Dive In
            <FiLogIn className="scale-110 hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  </nav>
  )
}

export default Navbar