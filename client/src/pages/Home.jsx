import React from "react";
import Guesthouse2 from "../images/Guesthouse2.jpeg";
import Slider from "../components/Slider";
import { sliderItems } from "../data";

const Home = () => {
  const otherLinks = [
    {
      link: "https://www.iitrpr.ac.in/guest-house/",
      text: "Guest House",
    },
    {
      link: "https://www.iitrpr.ac.in/academic",
      text: "Academics",
    },
    {
      link: "https://www.iitrpr.ac.in/research",
      text: "Research",
    },
    {
      link: "https://www.iitrpr.ac.in/admissions",
      text: "Admissions",
    },
    {
      link: "https://www.iitrpr.ac.in/facilities",
      text: "Facilities",
    },

    {
      link: "https://www.iitrpr.ac.in/",
      text: "More",
    },
  ];
  return (
    <div className="flex flex-col items-center w-screen">
      <div className="mt-10">
        <Slider items={sliderItems} />
      </div>
      <div className="home w-5/6 grid grid-cols-4 my-10 text-justify">
        <div className="content col-span-3 p-4">
          <p className="text-2xl font-semibold">
            Welcome to IIT Ropar's Guest House...
          </p>

          <p className="text-xl font-medium underline underline-offset-4 pt-4">
            The Guest House:
          </p>
          <p className="py-2 text-l">
            Nestled within the greenery of IIT Ropar's campus, the guest house
            offers a welcoming retreat for visitors. With its modern design
            blending seamlessly with the serene environment, it provides a
            comfortable and inviting atmosphere. Each room is well-appointed,
            combining tasteful decor with cozy furnishings for a relaxing stay.
            Whether guests are enjoying a peaceful walk through the gardens or
            focusing on academic endeavors, the guest house ensures a pleasant
            experience filled with comfort and hospitality.
          </p>

          <p className="text-xl font-medium underline underline-offset-4 pt-4">
            The Campus:
          </p>
          <p className="py-2 text-l">
            Nestled in the heart of Punjab's Rupnagar district, the campus of
            the Indian Institute of Technology, Ropar, is a blend of modern
            architecture and natural beauty spread across 500 acres. Walking
            through its green pathways, surrounded by lush trees and colorful
            flora, offers a sense of tranquility away from the outside world.
            The campus boasts sleek, contemporary buildings housing cutting-edge
            facilities for academics, research, and student life. Recreational
            spaces provide areas for students to relax and socialize amidst the
            serene surroundings. Sustainability efforts are evident throughout,
            showcasing a commitment to environmental conservation. From academic
            pursuits to cultural events, the campus buzzes with activity,
            creating a vibrant community where learning and growth thrive.
          </p>

          <img className="bg-cover" src={Guesthouse2} alt="Guesthouse" />
        </div>

        <div className="links col-span-1 p-4 rounded-xl">
          <p className="text-2xl font-semibold">Other links</p>
          <div className="py-3">
            {otherLinks.map((item) => (
              <>
                <a
                  className="my-1"
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.text}
                </a>
                <hr className="border-dotted border-t-2 border-gray-400 my-1" />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
