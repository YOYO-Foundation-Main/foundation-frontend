import Image from "next/image";

export default function SideBanner() {
  return (
    <div className="hidden md:flex w-1/2 bg-[#D2252B] items-center justify-center rounded-l-2xl">
      <Image
        src="/assets/foundationLogo.png"
        alt="YOYO Foundation"
        width={250}
        height={250}
        className="object-contain"
      />
    </div>
  );
}