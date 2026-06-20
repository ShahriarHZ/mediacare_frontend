"use client";
import { useState } from "react";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent! We will get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-500 mb-8">
        Have a question or need help? Fill out the form below and we will get back to you within 24 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input input-bordered w-full"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="input input-bordered w-full"
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          className="textarea textarea-bordered w-full h-36"
          placeholder="Your message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary w-full">
          Send Message
        </button>
      </form>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-base-200 p-4 rounded-xl">
          <p className="font-semibold">Email</p>
          <p className="text-gray-500 text-sm">support@medicare-connect.com</p>
        </div>
        <div className="bg-base-200 p-4 rounded-xl">
          <p className="font-semibold">Phone</p>
          <p className="text-gray-500 text-sm">+1 (800) 123-4567</p>
        </div>
        <div className="bg-base-200 p-4 rounded-xl">
          <p className="font-semibold">Hours</p>
          <p className="text-gray-500 text-sm">Mon–Fri, 9am–6pm</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;