import { useState } from "react";
import emailjs from "@emailjs/browser";
import { profile } from "../data";

const empty = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const send = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.send(
        "service_3urrs98",
        "template_o6x8rvt",
        {
          from_name: form.name,
          to_name: profile.name,
          from_email: form.email,
          to_email: profile.email,
          message: form.message,
        },
        "5zuNASB_q5Jp0gjBn"
      );
      setForm(empty);
      setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form className="contact-form" onSubmit={send}>
      <label>
        <span>Name</span>
        <input name="name" required value={form.name} onChange={update} autoComplete="name" />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" required value={form.email} onChange={update} autoComplete="email" />
      </label>
      <label className="contact-wide">
        <span>Message</span>
        <textarea name="message" required rows={5} value={form.message} onChange={update} />
      </label>
      <div className="contact-actions">
        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending message…" : "Send message"}
        </button>
        <p className="contact-status" role="status">
          {status === "sent" && "Message sent. I'll reply by email."}
          {status === "error" && (
            <>
              The message didn&apos;t go through. Email me directly at{" "}
              <a href={`mailto:${profile.email}`}>{profile.email}</a>.
            </>
          )}
        </p>
      </div>
    </form>
  );
}
