import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-gray-400">
      {/* Main Footer */}
      <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Contact */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="h-4 w-4" />
            <span>shiva.project@email.com</span>
          </div>

          <div className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4" />
            <span>+91 9XXXXXXXXX</span>
          </div>
        </div>

        {/* Project By */}
        <div className="text-sm">
          <span className="text-gray-500">Project by</span>{" "}
          <span className="text-white font-medium">Sai Shiva Sheelampally</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 text-center py-3 text-xs text-gray-500">
        © 2026 stays.in — All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;
