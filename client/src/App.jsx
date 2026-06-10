import { useEffect, useMemo, useState } from "react";
import { schoolApi } from "./api/schoolApi";
import AdminDashboard from "./components/AdminDashboard";
import {
  emptyAnnouncements,
  emptyEvents,
  emptyFaculty,
  emptyPrograms
} from "./data/emptyContent";
import { siteConfig } from "./config/siteConfig";
import "./styles.css";

const initialContent = {
  announcements: emptyAnnouncements,
  events: emptyEvents,
  faculty: emptyFaculty,
  programs: emptyPrograms
};

const normalizeList = (items, fallback) => (Array.isArray(items) && items.length ? items : fallback);

const eventMonthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "Asia/Kolkata"
});

const eventDayFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  timeZone: "Asia/Kolkata"
});

const getEventDate = (event) => {
  const date = new Date(event.startsAt);

  if (Number.isNaN(date.getTime())) {
    return { month: "TBA", day: "--" };
  }

  return {
    month: eventMonthFormatter.format(date),
    day: eventDayFormatter.format(date)
  };
};

function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  );
}

function App() {
  const [content, setContent] = useState(initialContent);
  const [contentNotice, setContentNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      const requests = [
        { key: "announcements", label: "notices", fallback: emptyAnnouncements, request: schoolApi.getAnnouncements },
        { key: "events", label: "events", fallback: emptyEvents, request: schoolApi.getEvents },
        { key: "faculty", label: "faculty", fallback: emptyFaculty, request: schoolApi.getFaculty },
        { key: "programs", label: "academic programs", fallback: emptyPrograms, request: schoolApi.getPrograms }
      ];

      const results = await Promise.allSettled(requests.map((item) => item.request()));

      if (!isMounted) {
        return;
      }

      const nextContent = { ...initialContent };
      const failedSections = [];

      results.forEach((result, index) => {
        const request = requests[index];

        if (result.status === "fulfilled") {
          nextContent[request.key] = normalizeList(result.value, request.fallback);
          return;
        }

        nextContent[request.key] = request.fallback;
        failedSections.push(request.label);
      });

      setContent(nextContent);
      setContentNotice(
        failedSections.length
          ? `Live ${failedSections.join(", ")} could not be loaded right now. Please contact the school office for the latest information.`
          : ""
      );
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleAnnouncements = useMemo(
    () => content.announcements.slice(0, 4),
    [content.announcements]
  );

  const visibleEvents = useMemo(() => content.events.slice(0, 3), [content.events]);
  const visiblePrograms = useMemo(() => content.programs.slice(0, 4), [content.programs]);

  const handleInquirySubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);

    try {
      await schoolApi.submitInquiry({
        parentName: String(formData.get("parent") || "").trim(),
        studentName: String(formData.get("student") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        classInterest: String(formData.get("class") || "").trim(),
        message: String(formData.get("message") || "").trim(),
        source: "website"
      });

      form.reset();
      window.alert("Thank you. The admissions team will contact you soon.");
    } catch (error) {
      window.alert(error.message || "Unable to send enquiry right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="top-utility">
        <div className="top-utility-inner">
          <p>Admissions enquiry open for the new academic year. Quality learning, values and care closer to home.</p>
          <div className="quick-actions" aria-label="Quick contact actions">
            {siteConfig.phoneHref ? <a className="quick-action" href={siteConfig.phoneHref}>Call Now</a> : null}
            {siteConfig.whatsappHref ? <a className="quick-action" href={siteConfig.whatsappHref}>WhatsApp</a> : null}
            <a className="quick-action highlight" href="#contact">Admission Enquiry</a>
          </div>
        </div>
      </div>

      <div className="floating-cta" aria-label="Sticky contact actions">
        {siteConfig.phoneHref ? <a className="float-link" href={siteConfig.phoneHref} aria-label="Call Sadhana School">Call</a> : null}
        {siteConfig.whatsappHref ? <a className="float-link" href={siteConfig.whatsappHref} aria-label="Message Sadhana School on WhatsApp">WA</a> : null}
        <a className="float-link gold" href="#contact" aria-label="Go to admission enquiry form">Apply</a>
      </div>

      <header className="site-header">
        <nav className="nav" aria-label="Main navigation">
          <a href="#home" className="brand" aria-label="Sadhana School home">
            <span className="crest" aria-hidden="true">
              <img className="crest-logo" src="/school-logo.jpeg" alt="" />
            </span>
            <span className="brand-text">
              <strong>Sadhana School</strong>
              <span>Learning. Values. Care.</span>
            </span>
          </a>

          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#academics">Academics</a>
            <a href="#facilities">Facilities</a>
            <a href="#events">Events</a>
            <a href="#gallery">Gallery</a>
            <a href="#admin">Admin</a>
            <a href="#contact" className="primary-link">Admissions</a>
          </div>
        </nav>
      </header>

      <main id="home">
        <section className="hero" aria-label="Sadhana School introduction">
          <div className="hero-inner">
            <div>
              <span className="eyebrow">Nearer school. Stronger future.</span>
              <h1>Sadhana School <span>brings quality education closer home.</span></h1>
              <p className="hero-copy">A parent-friendly school experience built around strong basics, regular practice, English confidence, discipline and values at a feasible cost.</p>
              <div className="hero-actions">
                <a href="#contact" className="button button-primary">Start Admission Enquiry</a>
                <a href="#academics" className="button button-secondary">Explore Academics</a>
              </div>
            </div>

            <div className="hero-gallery" aria-label="School highlights">
              <div className="photo-panel large">
                <div className="photo-caption">
                  <strong>Focused classroom learning</strong>
                  <span>Daily practice, teacher attention and clear academic routines.</span>
                </div>
              </div>
              <div className="photo-panel classroom">
                <div className="photo-caption">
                  <strong>Modern study support</strong>
                  <span>Corporate-style learning discipline for local students.</span>
                </div>
              </div>
              <div className="photo-panel activity">
                <div className="photo-caption">
                  <strong>Values with confidence</strong>
                  <span>Communication, manners, activities and care.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {contentNotice ? (
          <div className="container site-alert" role="status">
            {contentNotice}
          </div>
        ) : null}

        <section className="section deep" aria-label="School numbers">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-kicker">Why parents choose Sadhana</div>
                <h2>Marks matter. Distance matters. The right school nearby matters more.</h2>
              </div>
              <p>Families should not have to send children far away just to get serious academic support. Sadhana is positioned for local students who need strong learning with practical affordability.</p>
            </div>

            <div className="stats">
              <div className="stat">
                <strong>01</strong>
                <span>Nearby access for surrounding villages and towns</span>
              </div>
              <div className="stat">
                <strong>02</strong>
                <span>Strong basics with regular exam-focused practice</span>
              </div>
              <div className="stat">
                <strong>03</strong>
                <span>English, discipline and confidence building</span>
              </div>
              <div className="stat">
                <strong>04</strong>
                <span>Quality education with feasible fee planning</span>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container intro-layout">
            <div className="message">
              <div className="quote">"A school should prepare children for marks, manners and real confidence."</div>
              <p>Sadhana School is designed for parents who want strong academics without losing the comfort, safety and cultural grounding of learning close to their native place.</p>
              <strong>Principal's Message</strong>
            </div>

            <div>
              <div className="section-kicker">About Sadhana</div>
              <h2>A calm, disciplined school for growing students with care.</h2>
              <p style={{ marginTop: 18, color: "var(--muted)", maxWidth: 760 }}>Sadhana is presented as a trusted school for rural and semi-urban families: simple admission information, clear academic positioning, facility highlights, events, notices, gallery and a staff-friendly content update model.</p>

              <div className="values" style={{ marginTop: 26 }}>
                <div className="value">
                  <b>01</b>
                  <h3>Strong Basics</h3>
                  <p>Concept clarity, daily revision and steady academic habits from the early years.</p>
                </div>
                <div className="value">
                  <b>02</b>
                  <h3>Parent Trust</h3>
                  <p>Clear communication, simple admission process and visible student progress.</p>
                </div>
                <div className="value">
                  <b>03</b>
                  <h3>Whole Child</h3>
                  <p>Learning with values, confidence, communication and participation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="academics" className="section alt">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-kicker">Academics</div>
                <h2>Structured learning for every stage of school life.</h2>
              </div>
              <p>Academic program details are published from the school dashboard after they are verified by the office team.</p>
            </div>

            <div className="program-grid">
              {visiblePrograms.length ? (
                visiblePrograms.map((program) => (
                  <article className="program" key={program._id || program.title}>
                    <div>
                      <small>{program.stage}</small>
                      <h3>{program.title}</h3>
                      <p>{program.description}</p>
                    </div>
                    <a href="#contact">Enquire</a>
                  </article>
                ))
              ) : (
                <EmptyState title="Academic programs are not published yet.">
                  Official program details will appear here after the school team adds them.
                </EmptyState>
              )}
            </div>
          </div>
        </section>

        <section id="facilities" className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-kicker">Facilities</div>
                <h2>A school environment made for learning, safety and routine.</h2>
              </div>
              <p>Facilities listed here should reflect verified campus services and can be refined after the school office confirms the final list.</p>
            </div>

            <div className="facility-list">
              <div className="facility">
                <h3>Smart Classrooms</h3>
                <p>Clean, organized spaces for daily teaching and interactive lessons.</p>
              </div>
              <div className="facility">
                <h3>Library & Reading</h3>
                <p>Reading culture, story sessions and language growth for young learners.</p>
              </div>
              <div className="facility">
                <h3>Science & Computer Lab</h3>
                <p>Practical exposure that helps students connect concepts with real use.</p>
              </div>
              <div className="facility">
                <h3>Safe Transport</h3>
                <p>Better access for nearby villages and parents who need dependable travel.</p>
              </div>
              <div className="facility">
                <h3>Playground & Sports</h3>
                <p>Sports, games and physical development alongside classroom learning.</p>
              </div>
              <div className="facility">
                <h3>Student Care</h3>
                <p>Teacher attention, discipline, attendance follow-up and parent communication.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="admissions" className="section alt">
          <div className="container admission-band">
            <div className="admission-copy">
              <div className="section-kicker">Admissions</div>
              <h2>Make the school decision simple for parents.</h2>
              <p>Parents should immediately understand what Sadhana offers: serious study near home, feasible fee planning, values and regular academic follow-up.</p>
              <div className="hero-actions">
                <a href="#contact" className="button button-primary">Book Campus Visit</a>
                <a href="#events" className="button button-secondary">View Updates</a>
              </div>
            </div>

            <div className="steps">
              <div className="step">
                <strong>Step 01</strong>
                <span>Submit parent and student details.</span>
              </div>
              <div className="step">
                <strong>Step 02</strong>
                <span>Visit campus and understand fee structure.</span>
              </div>
              <div className="step">
                <strong>Step 03</strong>
                <span>Student interaction and class guidance.</span>
              </div>
              <div className="step">
                <strong>Step 04</strong>
                <span>Admission confirmation and orientation.</span>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-kicker">Events & Notices</div>
                <h2>Latest school updates in one clear place.</h2>
              </div>
              <p>Staff can update announcements, events, notices and admission updates from the protected admin panel.</p>
            </div>

            <div className="notice-layout">
              <div className="event-list">
                {visibleEvents.length ? (
                  visibleEvents.map((schoolEvent) => {
                    const date = getEventDate(schoolEvent);

                    return (
                      <article className="event" key={schoolEvent._id || schoolEvent.title}>
                        <div className="date">{date.month} <span>{date.day}</span></div>
                        <div>
                          <h3>{schoolEvent.title}</h3>
                          <p>{schoolEvent.description}</p>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <EmptyState title="No official events are published yet.">
                    Confirmed school events will appear here once they are added.
                  </EmptyState>
                )}
              </div>

              <aside className="notice-board">
                <h3>Notice Board</h3>
                {visibleAnnouncements.length ? (
                  <ul>
                    {visibleAnnouncements.map((announcement) => (
                      <li key={announcement._id || announcement.title}>{announcement.title}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="notice-empty">No official notices are published yet.</div>
                )}
              </aside>
            </div>
          </div>
        </section>

        <section id="gallery" className="section alt">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-kicker">Gallery</div>
                <h2>Show parents the real life of the school.</h2>
              </div>
              <p>Official school images can be published here after the school office reviews and approves them.</p>
            </div>

            <div className="gallery">
              <EmptyState title="Official gallery images are not published yet.">
                Approved campus and activity photos will appear here after the school provides them.
              </EmptyState>
            </div>
          </div>
        </section>

        <section className="section deep" id="admin">
          <div className="container cms">
            <AdminDashboard />

            <div className="cms-copy">
              <div className="section-kicker">CMS Plan</div>
              <h2>Staff should update the website without calling a developer.</h2>
              <p>This protected dashboard connects directly to the MERN API for verified notices, events, faculty profiles, academic programs and admission enquiries.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container contact">
            <div>
              <div className="section-kicker">Contact</div>
              <h2>Speak to Sadhana School admissions.</h2>
              <p style={{ marginTop: 18, color: "var(--muted)", maxWidth: 680 }}>Use this section for phone number, WhatsApp, address, map link and office timings. The enquiry form is designed for parent leads.</p>

              <div className="contact-card" style={{ marginTop: 28 }}>
                <div className="contact-row">
                  <strong>Campus</strong>
                  <span>{siteConfig.campus || "Campus details will be added by the school office."}</span>
                </div>
                <div className="contact-row">
                  <strong>Phone</strong>
                  <span>{siteConfig.phoneDisplay || "Phone number will be added by the school office."}</span>
                </div>
                <div className="contact-row">
                  <strong>Email</strong>
                  <span>{siteConfig.email || "Email address will be added by the school office."}</span>
                </div>
                <div className="contact-row">
                  <strong>Office Hours</strong>
                  <span>{siteConfig.officeHours || "Office hours will be added by the school office."}</span>
                </div>
              </div>
            </div>

            <form className="form" action="#" method="post" onSubmit={handleInquirySubmit} aria-busy={isSubmitting}>
              <h3>Admission Enquiry</h3>
              <div className="field">
                <label htmlFor="parent">Parent Name</label>
                <input
                  id="parent"
                  name="parent"
                  type="text"
                  placeholder="Enter parent name"
                  autoComplete="name"
                  minLength="2"
                  maxLength="120"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="student">Student Name</label>
                <input
                  id="student"
                  name="student"
                  type="text"
                  placeholder="Enter student name"
                  autoComplete="name"
                  maxLength="120"
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Mobile Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter mobile number"
                  autoComplete="tel"
                  inputMode="tel"
                  minLength="7"
                  maxLength="30"
                  pattern="[0-9+\-\s()]+"
                  title="Use digits, spaces, +, -, or brackets."
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  autoComplete="email"
                />
              </div>
              <div className="field">
                <label htmlFor="class">Class Interested</label>
                <select id="class" name="class" defaultValue="Primary" required>
                  <option>Primary</option>
                  <option>Middle School</option>
                  <option>High School</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us what you want to know"
                  maxLength="1200"
                ></textarea>
              </div>
              <button className="button button-primary" type="submit" disabled={isSubmitting}>Send Enquiry</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="brand">
            <span className="crest" aria-hidden="true">
              <img className="crest-logo" src="/school-logo.jpeg" alt="" />
            </span>
            <span className="brand-text">
              <strong>Sadhana School</strong>
              <span>Quality education closer home</span>
            </span>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#academics">Academics</a>
            <a href="#admissions">Admissions</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
