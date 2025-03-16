import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Socials = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-black/70 to-blue-800/5 backdrop-blur-[2px] relative">
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="font-dancing font-bold text-3xl md:text-6xl bg-gradient-to-r from-black/90 to-white bg-clip-text text-transparent mb-6">
          Connect With Ps.
        </h2>
        <p className="font-Krona text-sm text-gray-300 max-w-3xl mx-auto mb-12">
          Stay updated, join the conversation, and be part of the CoAI
          community.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          {[
            {
              name: "LinkedIn",
              icon: FaLinkedin,
              link: "https://linkedin.com/company/CoAI",
              colour: "text-blue-700",
            },
            {
              name: "Twitter",
              icon: FaXTwitter,
              link: "https://twitter.com/CoAI",
              colour: "text-white",
            },
            {
              name: "GitHub",
              icon: FaGithub,
              link: "https://github.com/CoAI",
              colour: "text-gray-600",
            },
          ].map((social, index) => (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-4 py-4 bg-black/30 border border-gray-700/50 hover:border-indigo-500/50 rounded-full transition-all duration-300 hover:bg-black/40 hover:scale-105"
            >
              {React.createElement(social.icon, {
                className: `h-8 w-8 ${social.colour} group-hover:text-indigo-300`,
              })}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Socials;
