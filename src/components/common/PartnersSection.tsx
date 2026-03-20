import { FaHeart, FaPlus, FaGlobe, FaMoon, FaRegHandshake } from "react-icons/fa";

export default function PartnersSection() {
  return (
    <section className="bg-[#F8F9FA] py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-10 md:gap-0">
          
          {/* Icon 1 */}
          <div className="text-gray-400 text-5xl md:text-6xl hover:text-[#D2252B] transition">
            <FaHeart />
          </div>

          {/* Icon 2 */}
          <div className="text-gray-400 text-5xl md:text-6xl hover:text-[#D2252B] transition">
            <FaPlus />
          </div>

          {/* Icon 3 */}
          <div className="text-gray-400 text-5xl md:text-6xl hover:text-[#D2252B] transition">
            <FaGlobe />
          </div>

          {/* Icon 4 */}
          <div className="text-gray-400 text-5xl md:text-6xl hover:text-[#D2252B] transition">
            <FaMoon />
          </div>
          <div className="text-gray-400 text-5xl md:text-6xl hover:text-[#D2252B] transition">
            <FaRegHandshake />
          </div>

        </div>

      </div>
    </section>
  );
}