import { EventForm } from "./components/event-form";
export default function CreateEventView() {
  return (
    <div className="mt-20 mx-4 mb-4">
      <h1>Create Event</h1>
      <p>Make your event here</p>
      <EventForm />
    </div>
  );
}
