import Image from "next/image";

export default function VolunteerStory() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

      {/* IMAGE */}
      <Image
        src="/assets/p4.jpg"
        alt="story"
        width={600}
        height={400}
        className="rounded-xl"
      />

      {/* TEXT */}
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4">
          There are still many who need us
        </h2>

        <p className="text-gray-600 mb-4">
          Elit sit risus lorem proin eget eu molestie nibh odio non neque turpis proin viverra vel arcu venenatis nulla fin blandit.
        </p>

        <p className="text-gray-600">
          Lorem tristique morbi nulla curabitur etiam vestibulum suscipit nullam sagittis imperdiet non aliquam.
        </p>
      </div>

    </div>
  );
}