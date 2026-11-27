// Public Privacy Policy, Terms of Service, Cookie Policy and Refund Policy (/privacy, /terms, /cookies, /refunds).
// The business details (email, phone, address) come from the server settings (SUPPORT_*); until they are
// set the pages fall back to FALLBACK_EMAIL. Have a legal advisor review the wording before launch.
import { Link } from 'react-router';
import { useAppConfig } from '../lib/data';
import { Brand } from '../components/Layout';
import PublicFooter from '../components/PublicFooter';

const UPDATED = '29 October 2026';
const COMPANY = 'Pavakie';
const FALLBACK_EMAIL = 'support@pavakie.com';
const LEGAL_NAME = 'Pavakie Private Limited';
const GRIEVANCE = { name: 'Sanjan', email: 'sanjan@pavakie.com' };

function useContact() {
  const s = useAppConfig()?.support || {};
  return { email: s.email || FALLBACK_EMAIL, phone: s.phone || '', address: s.address || '' };
}

function Email() {
  const { email } = useContact();
  return <a href={`mailto:${email}`}>{email}</a>;
}

function ContactBlock() {
  const { phone, address } = useContact();
  return (
    <p>
      Email: <Email />
      {phone && <><br />Phone: <a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a></>}
      {address && <><br />Address: {address}</>}
    </p>
  );
}

function LegalPage({ title, children }) {
  return (
    <div className="public">
      <div className="public-head"><Link to="/" aria-label="Pavakie home"><Brand /></Link></div>
      <main className="legal">
        <h1>{title}</h1>
        <p className="muted small">Last updated {UPDATED}</p>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}

export function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>This policy explains what {COMPANY} ("we") collects when you use the Pavakie Tracker app, website and GPS trackers, why we collect it, who it is shared with, and your choices. By creating an account you agree to it.</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Your account:</strong> email, name, optional phone number and company, and a password stored only as a salted hash. If you sign in with Google we receive your Google account email and name.</li>
        <li><strong>Your vehicles and trackers:</strong> the tracker's IMEI, SIM number, and the name, number plate, type and colour you give the vehicle. The tracker sends its GPS position, speed, heading, ignition state, battery and signal level, and alerts such as overspeed or power cut.</li>
        <li><strong>Records built from that data:</strong> trips, daily distance and riding time, geofences you draw, and the service records, odometer readings, garage names and costs you enter.</li>
        <li><strong>Drivers you add:</strong> name, phone number, licence number and expiry date, and an optional photo or picture. You must have the driver's permission to enter their details.</li>
        <li><strong>People you share with:</strong> the email addresses of viewers you add, and the share links you create.</li>
        <li><strong>Messages you send us:</strong> the name, email, phone, company and message you type in the contact and partner forms.</li>
        <li><strong>Your phone:</strong> a push-notification token so we can send alerts you turned on. The camera is used only when you choose to scan an IMEI barcode; the picture is not stored or sent.</li>
        <li><strong>Technical data:</strong> IP address and basic logs needed to run and secure the service.</li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To show your vehicles' live location, history, trips, reports and alerts to you and the people you share with.</li>
        <li>To send the notifications and emails you ask for, such as alerts and password codes.</li>
        <li>To reply to your messages.</li>
        <li>To keep the service secure, prevent abuse and fix problems.</li>
      </ul>
      <p>We do not sell your data and do not use it for advertising or profiling.</p>

      <h2>Who can see it</h2>
      <ul>
        <li>You, and the people you add as viewers or send a share link to. A share link shows only the live position and expires.</li>
        <li>The service providers listed below, only as far as needed to run the service.</li>
        <li>Authorities, if the law requires it.</li>
      </ul>

      <h2>Service providers and third-party services</h2>
      <div className="table-scroll">
        <table>
          <thead><tr><th>Service</th><th>What it is used for</th><th>What it receives</th></tr></thead>
          <tbody>
            <tr><td>Amazon Web Services</td><td>Hosting the servers and database</td><td>All data described above, stored on our servers</td></tr>
            <tr><td>Google Firebase Cloud Messaging</td><td>Push notifications on your phone</td><td>Your push token and the alert text</td></tr>
            <tr><td>Google Sign-In</td><td>Optional sign-in with Google</td><td>Your Google account details when you choose it; Google's privacy policy applies</td></tr>
            <tr><td>OpenStreetMap, Esri</td><td>Map pictures on the website (street map and satellite view)</td><td>Your IP address and the area of the map you view, sent by your browser</td></tr>
            <tr><td>OpenFreeMap, unpkg.com, Google Fonts</td><td>Map pictures, the map code and a font inside the app</td><td>Your IP address and the area of the map you view, sent by your phone</td></tr>
            <tr><td>OpenStreetMap Nominatim</td><td>Turning a position into a street address</td><td>Coordinates, sent by our server (not your identity)</td></tr>
            <tr><td>Resend</td><td>Sending emails such as password codes and replies</td><td>Your email address and the message</td></tr>
            <tr><td>Google Maps, WhatsApp</td><td>Only when you tap Navigate, a map link or a WhatsApp link, which opens that service</td><td>What you choose to open; their policies apply</td></tr>
          </tbody>
        </table>
      </div>

      <h2>Cookies and local storage</h2>
      <p>We do not use advertising or analytics cookies. See the <Link to="/cookies">Cookie Policy</Link> for what the website stores in your browser.</p>

      <h2>How long we keep it</h2>
      <p>Detailed GPS positions are deleted automatically after 180 days. Trips, daily totals, alerts, drivers and service records are kept while your account exists. When you release a tracker, its history is deleted. When you delete your account, your data and the trackers you owned are deleted.</p>

      <h2>Your choices and rights</h2>
      <ul>
        <li>Turn notifications on or off for each vehicle, remove viewers and revoke share links at any time.</li>
        <li>Edit or delete drivers, service records, geofences and your profile in the app or website.</li>
        <li>Release a tracker to delete its history, or delete your account in Profile and settings.</li>
        <li>Ask us for a copy of your data, a correction, or deletion, or withdraw a consent you gave, by writing to us. We will reply by email. If you are in India you also have the rights given by the Digital Personal Data Protection Act, 2023, including the right to complain to us about how your data is handled.</li>
      </ul>
      <p>Only track vehicles you are allowed to track, and tell drivers that the vehicle is tracked. If you track someone else's vehicle, you must have their consent.</p>
      <p>The service is not meant for people under 18.</p>

      <h2>Security</h2>
      <p>Data is encrypted in transit (HTTPS). Passwords and activation codes are stored only as salted hashes, and login tokens are stored only as hashes. Access is limited to the owner and the people they share with.</p>

      <h2>Contact</h2>
      <p>Questions, requests or complaints about your data: write to us. We will update this page if the policy changes.</p>
      <ContactBlock />
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p>By creating an account or using Pavakie Tracker you agree to these terms and to the <Link to="/privacy">Privacy Policy</Link>.</p>

      <h2>The service</h2>
      <p>Pavakie Tracker shows the location and status reported by your GPS tracker. Positions depend on GPS signal, mobile network coverage and the tracker's power, so they can be delayed, inaccurate or unavailable. Do not rely on the service for emergencies or safety-critical decisions.</p>

      <h2>Your account</h2>
      <ul>
        <li>Give correct details, and keep your password and activation codes private. You are responsible for activity on your account.</li>
        <li>Only add trackers you own or are authorised to use.</li>
        <li>You must be at least 18 years old.</li>
      </ul>

      <h2>Tracking other people</h2>
      <ul>
        <li>Tell your drivers and passengers that the vehicle is tracked, and get their consent where the law requires it.</li>
        <li>Only enter a driver's details with their permission.</li>
        <li>Do not use the service to follow, stalk or harass anyone.</li>
      </ul>

      <h2>Acceptable use</h2>
      <ul>
        <li>Use the service lawfully.</li>
        <li>Do not attack, overload, reverse engineer or misuse the service, or try to reach other people's data.</li>
      </ul>
      <p>We may suspend accounts or trackers that break these terms.</p>

      <h2>Payments</h2>
      <p>The app and website do not take payments. Any tracker, SIM or plan you buy from {COMPANY} or a partner is covered by the invoice or agreement you receive with it. Returns and refunds are explained in the <Link to="/refunds">Refund Policy</Link>.</p>

      <h2>Changes and availability</h2>
      <p>We may change or improve features and will try to give notice of important changes. We aim for high availability but cannot guarantee the service will be uninterrupted.</p>

      <h2>Liability</h2>
      <p>The service is provided "as is". To the extent the law allows, {COMPANY} is not liable for indirect or consequential losses, or for losses caused by inaccurate, delayed or missing location data.</p>

      <h2>Ending</h2>
      <p>You can delete your account at any time in Profile and settings. These terms are governed by the laws of India.</p>

      <h2>Contact</h2>
      <ContactBlock />
    </LegalPage>
  );
}

export function Cookies() {
  return (
    <LegalPage title="Cookie Policy">
      <p>This page explains what the Pavakie Tracker website keeps in your browser.</p>

      <h2>Cookies</h2>
      <p>The website does not set cookies of its own, and it does not use advertising, tracking or analytics cookies. Because of that we do not show a cookie banner.</p>

      <h2>Local storage</h2>
      <p>To keep you signed in and remember your choices, the website stores a few items in your browser's local storage on your device. They are needed for the service to work and are not used to track you.</p>
      <div className="table-scroll">
        <table>
          <thead><tr><th>Item</th><th>Purpose</th><th>How long</th></tr></thead>
          <tbody>
            <tr><td>Sign-in token</td><td>Keeps you signed in after you reload the page</td><td>Until you log out, or the session expires after 30 days without use</td></tr>
            <tr><td>Your profile</td><td>Shows your name and email while the page loads</td><td>Until you log out</td></tr>
            <tr><td>Theme and replay speed</td><td>Remembers light or dark mode and your replay speed</td><td>Until you clear your browser data</td></tr>
          </tbody>
        </table>
      </div>
      <p>You can clear this data in your browser settings. You will then have to sign in again.</p>

      <h2>Third parties</h2>
      <p>Map pictures are loaded from OpenStreetMap and, for the satellite view, Esri. If you choose Sign in with Google, the sign-in button loads from Google, and Google may set its own cookies on its own pages. These services see your IP address. See the <Link to="/privacy">Privacy Policy</Link> for details.</p>

      <h2>Contact</h2>
      <ContactBlock />
    </LegalPage>
  );
}

export function Refunds() {
  return (
    <LegalPage title="Refund and Cancellation Policy">
      <p>This policy explains when you can cancel after installation, return a faulty tracker, cancel your plan, and how refunds are paid. It applies to purchases made directly from {LEGAL_NAME} ("we"). If you bought from a dealer, the dealer handles returns and refunds under the invoice they gave you. We are selling in India only at the moment.</p>
      <p>The Pavakie Tracker app and website do not take payments, so nothing inside them can be refunded.</p>

      <h2>What you buy</h2>
      <ul>
        <li><strong>First year:</strong> the GPS tracker, installation and software support, for one price.</li>
        <li><strong>Later years:</strong> an annual subscription. The price depends on the features you choose.</li>
        <li><strong>SIM and connectivity:</strong> supplied with the tracker. The SIM is activated on the tracker's first connection to the network.</li>
      </ul>

      <h2>Cancelling because you changed your mind</h2>
      <ul>
        <li>You can cancel within <strong>7 days of installation</strong>. Write to us within that time.</li>
        <li>We will remove the tracker. You return it in good condition with its accessories, and <strong>you pay the return shipping</strong>.</li>
        <li>There is no restocking fee.</li>
        <li>The installation charge is <strong>not refunded</strong>.</li>
        <li>After the 7 days, the plan runs for the full year and cannot be cancelled early.</li>
      </ul>

      <h2>Faulty or damaged trackers</h2>
      <ul>
        <li>If the tracker is dead on arrival, damaged in transit, or stops working after installation, tell us <strong>within 2 days</strong> of delivery or installation. Send a photo or short video if you can.</li>
        <li>We will <strong>replace it or refund you in full</strong>. We pay the shipping for faulty items.</li>
        <li>Faults reported after 2 days are handled under the warranty below.</li>
      </ul>

      <h2>Warranty</h2>
      <ul>
        <li>The tracker has a <strong>12-month warranty</strong> against manufacturing faults. We repair or replace faulty units.</li>
        <li>The warranty does not cover water damage, impact or physical damage, wrong wiring, tampering, or repairs by anyone other than us or our authorised installers.</li>
      </ul>

      <h2>Plan renewals and cancellation</h2>
      <ul>
        <li>Plans are annual. You can cancel <strong>only at the end of the yearly term</strong>. We do not refund part of a year that has already started.</li>
        <li>Depending on how you pay and what you prefer, your plan renews automatically or you renew it yourself each year. We will remind you before your renewal date and tell you the price and features.</li>
        <li><strong>Service downtime:</strong> if the service is down for more than 24 hours because of us, we automatically extend your plan by the same length of time.</li>
        <li>Downtime caused by things outside our control does not count. Examples are your mobile network, a disconnected or flat vehicle battery, a tracker that was switched off, or no signal where the vehicle is.</li>
      </ul>

      <h2>SIM and data</h2>
      <p>The SIM is activated on the tracker's first connection. Once it is activated, the SIM pack is not refundable.</p>

      <h2>How to request a refund</h2>
      <ol>
        <li>Email <Email /> with your name, invoice number, the tracker's IMEI and the reason. Add photos if the tracker is faulty.</li>
        <li>We will reply by email. If we accept your request, we send return instructions.</li>
        <li>We inspect the returned tracker when we receive it.</li>
      </ol>

      <h2>How and when you are refunded</h2>
      <ul>
        <li>Refunds are issued within <strong>7 working days</strong> of us accepting your request. Your bank may take a few more days to show it.</li>
        <li>We refund to the payment method you used. If that is not possible, we refund by bank transfer to an account you tell us.</li>
        <li>GST is refunded as shown on your invoice.</li>
      </ul>

      <h2>Dealer purchases</h2>
      <p>If you bought through a dealer, ask the dealer for returns and refunds. Warranty repairs and the software service still come from us, and you can write to us for help.</p>

      <h2>Your data</h2>
      <p>Returning a tracker does not delete your account. To remove your data, release the tracker or delete your account in Profile and settings, as described in the <Link to="/privacy">Privacy Policy</Link>.</p>

      <h2>Contact</h2>
      <p>
        {LEGAL_NAME}<br />
        Sri Eshwar Tech Park, Coimbatore, Tamil Nadu 641202<br />
        Email: <Email />
      </p>
      <p>Grievance officer: {GRIEVANCE.name}, <a href={`mailto:${GRIEVANCE.email}`}>{GRIEVANCE.email}</a></p>
    </LegalPage>
  );
}
