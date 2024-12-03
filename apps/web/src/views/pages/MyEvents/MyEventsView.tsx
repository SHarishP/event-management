import EventsTable from "./component/event-table";
export default function MyEventsView() {
  return (
    <div className="mt-20">
      <div>
        <h1 className="text-2xl font-bold mb-4 text-center">My Events</h1>
      </div>
      {/* Event Table */}
      <div>
        <EventsTable />
      </div>
    </div>
  );
}
