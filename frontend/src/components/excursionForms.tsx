import { useState } from 'react';

export function CreateExcursionForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    city: '',
    location: '',
    date: '',
    price: '',
    maxParticipants: '',
    photo: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({ ...prev, photo: file }));
  };

  return (
    <form
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Title', form.title);
        formData.append('Description', form.description);
        formData.append('City', form.city);
        formData.append('Location', form.location);
        formData.append('Date', form.date);
        formData.append('Price', form.price);
        formData.append('MaxParticipants', form.maxParticipants);
        formData.append('Photo', form.photo || '');
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="title" className="block font-medium">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          minLength={10}
          maxLength={100}
          value={form.title}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-medium">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          minLength={10}
          maxLength={200}
          value={form.description}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none resize-none"
          rows={4}
          required
        />
      </div>

      <div>
        <label htmlFor="city" className="block font-medium">
          City *
        </label>
        <input
          type="text"
          id="city"
          name="city"
          maxLength={30}
          value={form.city}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="location" className="block font-medium">
          Location *
        </label>
        <input
          type="text"
          id="location"
          name="location"
          maxLength={50}
          value={form.location}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="date" className="block font-medium">
          Date *
        </label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block font-medium">
          Price *
        </label>
        <input
          type="number"
          id="price"
          name="price"
          min={0}
          max={1000}
          value={form.price}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="maxParticipants" className="block font-medium">
          Max Participants *
        </label>
        <input
          type="number"
          id="maxParticipants"
          name="maxParticipants"
          min={5}
          max={30}
          value={form.maxParticipants}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="photo" className="block font-medium">
          Photo *
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export function EditExcursionForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    city: '',
    location: '',
    date: '',
    price: '',
    maxParticipants: '',
    photo: null,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({ ...prev, photo: file }));
  };

  return (
    <form
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (value !== '' && value !== null) {
            formData.append(key.charAt(0).toUpperCase() + key.slice(1), value);
          }
        });
        onSubmit(formData);
      }}
      className="space-y-4"
    >
      <div>
        <label htmlFor="title" className="block font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          minLength={10}
          maxLength={100}
          value={form.title}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          minLength={10}
          maxLength={200}
          value={form.description}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none resize-none"
          rows={4}
        />
      </div>

      <div>
        <label htmlFor="city" className="block font-medium">
          City
        </label>
        <input
          type="text"
          id="city"
          name="city"
          maxLength={30}
          value={form.city}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="location" className="block font-medium">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          maxLength={50}
          value={form.location}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="date" className="block font-medium">
          Date
        </label>
        <input
          type="datetime-local"
          id="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="price" className="block font-medium">
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          min={0}
          max={1000}
          value={form.price}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="maxParticipants" className="block font-medium">
          Max Participants
        </label>
        <input
          type="number"
          id="maxParticipants"
          name="maxParticipants"
          min={5}
          max={30}
          value={form.maxParticipants}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="photo" className="block font-medium">
          Photo
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
