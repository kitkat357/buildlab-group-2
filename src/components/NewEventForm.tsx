import { useState } from "react";
import Button from "@/components/Button";


type NewEventFormProps = {
    communityId: string;
}


export default function NewEventForm({ communityId }: NewEventFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");

  return (
    <>
      <Button label="+ New Event" onClick={() => setOpen(true)} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Create a new event
            </h2>

            <form className="space-y-4">
                {/* field will go here */}
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Event name"
                    />
                    <textarea
                        id="description"
                        name="description"
                        required
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="What is this event about?"
                    />
                </div>
            </form>

            <div className="mt-6 flex justify-end">
              <Button
                label="Cancel"
                variant="secondary"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
