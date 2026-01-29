import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import { getSimilarEventBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailItem = ({icon, alt, label} :{icon:string, alt:string, label:string}) => (
  <div className="flex-row-gap-2">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({agendaItems} : {agendaItems:string[]}) =>(
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags = ({ tags }: { tags: string | string[] }) => {
  const normalizedTags = (
    typeof tags === 'string' ? [tags] : tags
  ).flatMap(tag =>
    tag.split(',').map(t => t.trim())
  );
  return (
    <div className="flex flex-row-gap-2 flex-wrap">
      {normalizedTags.map(tag => (
        <div className="pill" key={tag}>
          {tag}
        </div>
      ))}
    </div>
  );
};

const EventDetailsPage = async ({params} : {params: Promise <{slug:string}> } ) =>{

  const {slug} = await params;
  const request = await fetch(`${BASE_URL}/api/events/${slug}`)
  const {event} = await request.json()

  const bookings=10;

  const similarEvents: IEvent[] = await getSimilarEventBySlug(event.slug);
  
  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{event.description}</p>

        <div className="details">
          {/* Left side */}
          <div className="content">
            <Image src={event.image} alt="Event Banner" width={800} height={800} className="banner"/>

            <section className="flex-col-gap-2">
              <h2>Overview</h2>
              <p>{event.overview}</p>
            </section>

            <section className="flex-col-gap-2">
              <h2>Event Details:</h2>
              <EventDetailItem icon={"/icons/calendar.svg"} alt={"calendar"} label={event.date} />
              <EventDetailItem icon={"/icons/clock.svg"} alt={"clock"} label={event.time} />
              <EventDetailItem icon={"/icons/pin.svg"} alt={"pin"} label={event.location} />
              <EventDetailItem icon={"/icons/mode.svg"} alt={"mode"} label={event.mode} />
              <EventDetailItem icon={"/icons/audience.svg"} alt={"audience"} label={event.audience} />
            </section>
            <EventAgenda agendaItems={event.agenda} />

            <section className="flex-col-gap-2">
              <h2>About the organizer</h2>
              <p>{event.organizer}</p>
            </section>

            <EventTags tags={event.tags} />
          </div> 


          {/* right side */}
          <aside className="booking">
            <div className="signup-card">
              <h2>Book Your Spot</h2>
              {bookings > 0 ? (
                <p className="text-sm">Join {bookings} people who have already booked thier spot!</p>
              ) : (
                <p className="text-sm">Be the first to book your spot</p>
              )}

              <BookEvent/>
            </div>
          </aside>
        </div>
      </div>


      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {similarEvents.length > 0 && similarEvents.map((event:IEvent) => (
            <EventCard key={event.slug} {...event} />
          ))}
        </div>
      </div>


    </section>
  );

}

export default EventDetailsPage