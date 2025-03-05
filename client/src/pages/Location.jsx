import React from "react";
import campusMap from "../images/campusMap.jpeg";
import { Link } from "react-router-dom";

const Location = () => {
	return (
		<div className="location w-5/6 flex flex-wrap justify-around my-10">
			<div className="basis-full p-4 bg-sky-100">
				<div className="pb-3">
					<h2 className="text-2xl font-semibold">
						Directions to IIT Ropar Guest House
					</h2>
					<p className="text-xl font-medium underline underline-offset-2">By Air: </p>
					<p>
						The nearest airport to IIT Ropar is the Chandigarh Airport
						(Chandigarh International Airport), located approximately 80
						kilometers away. From the airport, you can hire a taxi or use other
						public transportation to reach IIT Ropar.
					</p>
					<p className="text-xl font-medium underline underline-offset-2">By Train: </p>
					<p>
						The nearest railway station to IIT Ropar is the Rupnagar Railway
						Station (also known as Ropar Railway Station).It is located about 7
						kilometers away from the IIT Ropar campus. From the railway station,
						you can take a taxi or use other local transportation options to
						reach the campus.
					</p>
					<p className="text-xl font-medium underline underline-offset-2">By Road: </p>
					<p>
						IIT Ropar is well-connected by road. You can reach the campus by
						bus, car, or taxi. It is situated near National Highway 205 (NH
						205), making it accessible from nearby cities and towns.
					</p>
				</div>

				<div className="pt-3">
					<h2 className="text-2xl font-semibold">Weather in Ropar</h2>
					<p>
						IIT Ropar, located in the Rupnagar district of Punjab, experiences
						typical weather patterns associated with the Indian subcontinent.
						Here's a general overview of the weather at IIT Ropar across
						different seasons.
					</p>
					<p className="text-xl font-medium underline underline-offset-2">Summer (March to June):</p>
					<p>
						Summers in IIT Ropar are typically hot and dry. Daytime temperatures
						can soar, often reaching above 40°C (104°F). The weather is
						characterized by intense heat and dry conditions, with minimal
						rainfall. It's advisable to stay hydrated and seek shade during the
						hottest parts of the day.
					</p>

					<p className="text-xl font-medium underline underline-offset-2">Monsoon (July to September):</p>
					<p>
						The monsoon season brings relief from the scorching heat of summer.
						During this period, IIT Ropar experiences moderate to heavy
						rainfall. The weather becomes cooler, and the surroundings turn lush
						green due to the rain. However, occasional heavy downpours and
						thunderstorms are common, so it's essential to be prepared for wet
						conditions.
					</p>

					<p className="text-xl font-medium underline underline-offset-2">Autumn (October to November):</p>
					<p>
						Autumn in IIT Ropar is characterized by pleasant weather.
						Temperatures begin to cool down as the monsoon season transitions
						into autumn. Days are generally sunny with mild temperatures, making
						it a comfortable time for outdoor activities.
					</p>

					<p className="text-xl font-medium underline underline-offset-2">Winter (December to February):</p>
					<p>
						Winters in IIT Ropar are cold and foggy. Temperatures can drop
						significantly, often falling below 10°C (50°F), especially during
						the night and early morning. Foggy conditions are prevalent,
						reducing visibility, particularly during the early hours. Warm
						clothing is essential to stay comfortable during the chilly weather.
					</p>
				</div>
			</div>
			<div className="basis-full flex flex-wrap">
				<Link className="p-4 w-1/2 lg:w-full" to='/iitropar-campus-map' target="_blank">
					<img className="w-full h-[395px]" src={campusMap} alt="campus-map" />
				</Link>
				<div className="p-4 w-1/2 lg:w-full h-[427px]">
					<iframe
						width="100%"
						height="100%"
						frameBorder="0"
						scrolling="no"
						marginHeight="0"
						marginWidth="0"
						src="https://maps.google.com/maps?width=698&amp;height=374&amp;hl=en&amp;q=IIT%20Ropar,%20Main%20Campus+(IIT%20Ropar%20Guest%20House)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
						<a href="https://www.gps.ie/">gps tracker</a>
					</iframe>
				</div>
			</div>
		</div>
	);
};

export default Location;
