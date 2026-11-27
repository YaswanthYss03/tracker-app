// Public Privacy Policy and Terms of Service pages (/privacy, /terms).
// DRAFT: review with a legal advisor and fill in the business details before launch.
import { Link } from 'react-router';
import { Brand } from '../components/Layout';

const UPDATED = '23 October 2026';
const COMPANY = 'Pavakie';
const CONTACT = 'support@pavakie.example'; // TODO: replace with the real support email

function LegalPage({ title, children }) {
  return (
    <div className="public">
      <div className="public-head"><Link to="/" aria-label="Pavakie home"><Brand /></Link></div>
      <div className="legal">
        <h1>{title}</h1>
        <p className="muted small">Last updated {UPDATED}</p>
        {children}
      </div>
    </div>
  );
}

export function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <p>This policy explains what {COMPANY} ("we") collects when you use the Pavakie Tracker app, website and GPS trackers, why, and your choices.</p>
      <h2>What we collect</h2>
      <ul>
        <li><strong>Account:</strong> your email, name and a securely hashed password.</li>
        <li><strong>Tracker data:</strong> the tracker's IMEI, GPS positions, speed, heading, ignition status, battery and signal level, and alerts (for example overspeed or power cut).</li>
        <li><strong>Phone:</strong> a push notification token so we can send alerts to your phone. The app uses the camera only when you choose to scan the IMEI barcode; images are not stored or sent.</li>
        <li><strong>Technical:</strong> IP address and basic logs needed to run and secure the service.</li>
      </ul>
      <h2>Why we use it</h2>
      <ul>
        <li>To show your vehicle's live location, history, trips, reports and alerts to you and the people you share with.</li>
        <li>To send notifications you have turned on.</li>
        <li>To keep the service secure, prevent abuse and fix problems.</li>
      </ul>
      <p>We do not sell your data and do not use it for advertising.</p>
      <h2>Who can see it</h2>
      <ul>
        <li>You, and people you add as viewers or send a share link to (share links show only the live position and expire).</li>
        <li>Our service providers that help run the service (cloud hosting in AWS, Google Firebase for notifications, map tiles providers, email delivery), only as needed to provide it.</li>
        <li>Authorities, if required by law.</li>
      </ul>
      <h2>How long we keep it</h2>
      <p>Detailed GPS positions are deleted automatically after 180 days. Trips, daily totals and alerts are kept while your account exists. When you release a tracker or delete your account, its history is deleted.</p>
      <h2>Your choices and rights</h2>
      <ul>
        <li>Turn notifications on or off per tracker; remove viewers and revoke links at any time.</li>
        <li>Release a tracker to delete its history, or delete your account in Account settings.</li>
        <li>Ask us for a copy of your data or a correction by writing to {CONTACT}.</li>
      </ul>
      <p>Only track vehicles or people you are allowed to. If you track someone else, you must have their consent.</p>
      <h2>Security</h2>
      <p>Data is encrypted in transit (HTTPS). Passwords, activation codes and login tokens are stored only as hashes. Access is limited to the owner and people they share with.</p>
      <h2>Contact</h2>
      <p>Questions or requests: {CONTACT}. We will update this page if this policy changes.</p>
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms of Service">
      <p>By creating an account or using Pavakie Tracker you agree to these terms.</p>
      <h2>The service</h2>
      <p>Pavakie Tracker shows the location and status reported by your GPS tracker. Positions depend on GPS signal, mobile network coverage and the tracker's power, so they can be delayed, inaccurate or unavailable. Do not rely on the service for emergencies or safety-critical decisions.</p>
      <h2>Your account</h2>
      <ul>
        <li>Keep your password and activation codes private. You are responsible for activity on your account.</li>
        <li>Only add trackers you own or are authorised to use.</li>
      </ul>
      <h2>Acceptable use</h2>
      <ul>
        <li>Use the service lawfully. Do not track a person without their consent or use it to stalk or harass anyone.</li>
        <li>Do not attack, overload, reverse engineer or misuse the service.</li>
      </ul>
      <p>We may suspend accounts or trackers that break these terms.</p>
      <h2>Changes and availability</h2>
      <p>We may change or improve features and will try to give notice of important changes. We aim for high availability but cannot guarantee the service will be uninterrupted.</p>
      <h2>Liability</h2>
      <p>The service is provided "as is". To the extent permitted by law, {COMPANY} is not liable for indirect or consequential losses, or for losses caused by inaccurate, delayed or missing location data.</p>
      <h2>Ending</h2>
      <p>You can delete your account at any time in Account settings. These terms are governed by the laws of India.</p>
      <h2>Contact</h2>
      <p>{CONTACT}</p>
    </LegalPage>
  );
}
