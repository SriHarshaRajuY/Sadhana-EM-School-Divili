import { useEffect, useMemo, useState } from "react";
import { schoolApi } from "./api/schoolApi";
import AdminDashboard from "./components/AdminDashboard";
import {
  emptyAnnouncements,
  emptyEvents,
  emptyFaculty,
  emptyPrograms
} from "./data/emptyContent";
import { defaultSiteContent, mergeSiteContent } from "./data/defaultSiteContent";
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
  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [contentNotice, setContentNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      const requests = [
        { key: "siteContent", label: "website content", fallback: defaultSiteContent, request: schoolApi.getSiteContent },
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
      let nextSiteContent = defaultSiteContent;
      const failedSections = [];

      results.forEach((result, index) => {
        const request = requests[index];

        if (result.status === "fulfilled") {
          if (request.key === "siteContent") {
            nextSiteContent = mergeSiteContent(defaultSiteContent, result.value);
            return;
          }

          nextContent[request.key] = normalizeList(result.value, request.fallback);
          return;
        }

        if (request.key === "siteContent") {
          nextSiteContent = request.fallback;
        } else {
          nextContent[request.key] = request.fallback;
        }
        failedSections.push(request.label);
      });

      setContent(nextContent);
      setSiteContent(nextSiteContent);
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
  const contact = siteContent.contact;
  const schoolName = siteContent.school.name;
  const phoneHref = contact.phoneTel ? `tel:${contact.phoneTel}` : siteConfig.phoneHref;
  const whatsappHref = contact.whatsappUrl || siteConfig.whatsappHref;
  const phoneDisplay = contact.phoneDisplay || siteConfig.phoneDisplay;
  const campus = contact.campus || siteConfig.campus;
  const email = contact.email || siteConfig.email;
  const officeHours = contact.officeHours || siteConfig.officeHours;
  const classOptions = contact.classOptions?.length ? contact.classOptions : defaultSiteContent.contact.classOptions;
  const heroPanels = (siteContent.hero.panels || []).filter((panel) => panel.isPublished !== false);
  const galleryItems = (siteContent.gallery.items || []).filter((item) => item.isPublished !== false);

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
          <p>{siteContent.topBanner.text}</p>
          <div className="quick-actions" aria-label="Quick contact actions">
            {phoneHref ? <a className="quick-action" href={phoneHref}>Call Now</a> : null}
            {whatsappHref ? <a className="quick-action" href={whatsappHref}>WhatsApp</a> : null}
            <a className="quick-action highlight" href="#contact">{siteContent.topBanner.admissionCtaLabel}</a>
          </div>
        </div>
      </div>

      <div className="floating-cta" aria-label="Sticky contact actions">
        {phoneHref ? <a className="float-link" href={phoneHref} aria-label={`Call ${schoolName}`}>Call</a> : null}
        {whatsappHref ? <a className="float-link" href={whatsappHref} aria-label={`Message ${schoolName} on WhatsApp`}>WA</a> : null}
        <a className="float-link gold" href="#contact" aria-label="Go to admission enquiry form">Apply</a>
      </div>

      <header className="site-header">
        <nav className="nav" aria-label="Main navigation">
          <a href="#home" className="brand" aria-label="Sadhana School home">
            <span className="crest" aria-hidden="true">
              <img className="crest-logo" src="/school-logo.jpeg" alt="" />
            </span>
            <span className="brand-text">
              <strong>{schoolName}</strong>
              <span>{siteContent.school.tagline}</span>
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
              <span className="eyebrow">{siteContent.hero.eyebrow}</span>
              <h1>{siteContent.hero.title} <span>{siteContent.hero.highlight}</span></h1>
              <p className="hero-copy">{siteContent.hero.copy}</p>
              <div className="hero-actions">
                <a href="#contact" className="button button-primary">{siteContent.hero.primaryActionLabel}</a>
                <a href="#academics" className="button button-secondary">{siteContent.hero.secondaryActionLabel}</a>
              </div>
            </div>

            <div className="hero-gallery" aria-label="School highlights">
              {heroPanels.map((panel, index) => (
                <div
                  className={`photo-panel ${panel.variant || ""}`}
                  key={`${panel.title}-${index}`}
                  style={panel.imageUrl ? { backgroundImage: `linear-gradient(180deg, transparent 0 48%, rgba(0,0,0,0.56) 100%), url(${panel.imageUrl})` } : undefined}
                >
                  <div className="photo-caption">
                    <strong>{panel.title}</strong>
                    <span>{panel.description}</span>
                  </div>
                </div>
              ))}
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
                <div className="section-kicker">{siteContent.parentTrust.kicker}</div>
                <h2>{siteContent.parentTrust.title}</h2>
              </div>
              <p>{siteContent.parentTrust.body}</p>
            </div>

            <div className="stats">
              {siteContent.parentTrust.stats.map((stat, index) => (
                <div className="stat" key={`${stat.label}-${index}`}>
                  <strong>{stat.label}</strong>
                  <span>{stat.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container intro-layout">
            <div className="message">
              <div className="quote">{siteContent.about.quote}</div>
              <p>{siteContent.about.message}</p>
              <strong>{siteContent.about.attribution}</strong>
            </div>

            <div>
              <div className="section-kicker">{siteContent.about.kicker}</div>
              <h2>{siteContent.about.title}</h2>
              <p style={{ marginTop: 18, color: "var(--muted)", maxWidth: 760 }}>{siteContent.about.body}</p>

              <div className="values" style={{ marginTop: 26 }}>
                {siteContent.about.values.map((value, index) => (
                  <div className="value" key={`${value.title}-${index}`}>
                    <b>{value.label}</b>
                    <h3>{value.title}</h3>
                    <p>{value.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="academics" className="section alt">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-kicker">{siteContent.academics.kicker}</div>
                <h2>{siteContent.academics.title}</h2>
              </div>
              <p>{siteContent.academics.body}</p>
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
                <div className="section-kicker">{siteContent.facilities.kicker}</div>
                <h2>{siteContent.facilities.title}</h2>
              </div>
              <p>{siteContent.facilities.body}</p>
            </div>

            <div className="facility-list">
              {siteContent.facilities.items.length ? (
                siteContent.facilities.items.map((facility, index) => (
                  <div className="facility" key={`${facility.title}-${index}`}>
                    <h3>{facility.title}</h3>
                    <p>{facility.description}</p>
                  </div>
                ))
              ) : (
                <EmptyState title="Facilities are not published yet.">
                  Official facility details will appear here after the school team adds them.
                </EmptyState>
              )}
            </div>
          </div>
        </section>

        <section id="admissions" className="section alt">
          <div className="container admission-band">
            <div className="admission-copy">
              <div className="section-kicker">{siteContent.admissions.kicker}</div>
              <h2>{siteContent.admissions.title}</h2>
              <p>{siteContent.admissions.body}</p>
              <div className="hero-actions">
                <a href="#contact" className="button button-primary">{siteContent.admissions.primaryActionLabel}</a>
                <a href="#events" className="button button-secondary">{siteContent.admissions.secondaryActionLabel}</a>
              </div>
            </div>

            <div className="steps">
              {siteContent.admissions.steps.map((step, index) => (
                <div className="step" key={`${step.label}-${index}`}>
                  <strong>{step.label}</strong>
                  <span>{step.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="events" className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <div className="section-kicker">{siteContent.updates.kicker}</div>
                <h2>{siteContent.updates.title}</h2>
              </div>
              <p>{siteContent.updates.body}</p>
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
                <h3>{siteContent.updates.noticeBoardTitle}</h3>
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
                <div className="section-kicker">{siteContent.gallery.kicker}</div>
                <h2>{siteContent.gallery.title}</h2>
              </div>
              <p>{siteContent.gallery.body}</p>
            </div>

            <div className="gallery">
              {galleryItems.length ? (
                galleryItems.map((item, index) => (
                  <div
                    className={`photo-panel ${item.variant || ""}`}
                    key={`${item.title}-${index}`}
                    style={item.imageUrl ? { backgroundImage: `linear-gradient(180deg, transparent 0 48%, rgba(0,0,0,0.56) 100%), url(${item.imageUrl})` } : undefined}
                  >
                    <div className="photo-caption">
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState title="Official gallery images are not published yet.">
                  Approved campus and activity photos will appear here after the school provides them.
                </EmptyState>
              )}
            </div>
          </div>
        </section>

        <section className="section deep" id="admin">
          <div className="container cms">
            <AdminDashboard />

            <div className="cms-copy">
              <div className="section-kicker">{siteContent.adminCopy.kicker}</div>
              <h2>{siteContent.adminCopy.title}</h2>
              <p>{siteContent.adminCopy.body}</p>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container contact">
            <div>
              <div className="section-kicker">{contact.kicker}</div>
              <h2>{contact.title}</h2>
              <p style={{ marginTop: 18, color: "var(--muted)", maxWidth: 680 }}>{contact.body}</p>

              <div className="contact-card" style={{ marginTop: 28 }}>
                <div className="contact-row">
                  <strong>Campus</strong>
                  <span>{campus || "Campus details will be added by the school office."}</span>
                </div>
                <div className="contact-row">
                  <strong>Phone</strong>
                  <span>{phoneDisplay || "Phone number will be added by the school office."}</span>
                </div>
                <div className="contact-row">
                  <strong>Email</strong>
                  <span>{email || "Email address will be added by the school office."}</span>
                </div>
                <div className="contact-row">
                  <strong>Office Hours</strong>
                  <span>{officeHours || "Office hours will be added by the school office."}</span>
                </div>
              </div>
            </div>

            <form className="form" action="#" method="post" onSubmit={handleInquirySubmit} aria-busy={isSubmitting}>
              <h3>{contact.formTitle}</h3>
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
                <select id="class" name="class" defaultValue={classOptions[0]} required>
                  {classOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
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
              <strong>{schoolName}</strong>
              <span>{siteContent.school.footerTagline}</span>
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
