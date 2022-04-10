import React from "react";
import SEO from "../components/Helmet";
import { appName } from "../config";

const Tos = () => {
  return (
    <div className="home">
      <SEO title="Terms of Service" />
      <div className="tos">
        <h1 style={{ marginBottom: "20px" }}>
          Website Terms and Conditions of Use
        </h1>

        <h2>1. Terms</h2>

        <p>
          By accessing this Website, accessible from&nbsp;
          <a href="https://storieshub.web.app/" className="visited">
            https://storieshub.web.app/
          </a>
          , you are agreeing to be bound by these Website Terms and Conditions
          of Use and agree that you are responsible for the agreement with any
          applicable local laws. If you disagree with any of these terms, you
          are prohibited from accessing this site. The materials contained in
          this Website are protected by copyright and trade mark law.
        </p>

        <h2>2. Use License</h2>

        <p>
          Permission is granted to temporarily download one copy of the
          materials on StoriesHub's Website for personal, non-commercial
          transitory viewing only. This is the grant of a license, not a
          transfer of title, and under this license you may not:
        </p>

        <ul>
          <li>modify or copy the materials;</li>
          <li>
            use the materials for any commercial purpose or for any public
            display;
          </li>
          <li>
            attempt to reverse engineer any software contained on StoriesHub's
            Website;
          </li>
          <li>
            remove any copyright or other proprietary notations from the
            materials; or
          </li>
          <li>
            transferring the materials to another person or "mirror" the
            materials on any other server.
          </li>
        </ul>

        <p>
          This will let StoriesHub to terminate upon violations of any of these
          restrictions. Upon termination, your viewing right will also be
          terminated and you should destroy any downloaded materials in your
          possession whether it is printed or electronic format. These Terms of
          Service has been created with the help of the{" "}
          <a href="https://www.termsofservicegenerator.net" className="visited">
            Terms Of Service Generator
          </a>
          .
        </p>

        <h2>3. Disclaimer</h2>

        <p>
          All the materials on StoriesHub’s Website are provided "as is".
          StoriesHub makes no warranties, may it be expressed or implied,
          therefore negates all other warranties. Furthermore, StoriesHub does
          not make any representations concerning the accuracy or reliability of
          the use of the materials on its Website or otherwise relating to such
          materials or any sites linked to this Website.
        </p>

        <h2>4. Limitations</h2>

        <p>
          StoriesHub or its suppliers will not be hold accountable for any
          damages that will arise with the use or inability to use the materials
          on StoriesHub’s Website, even if StoriesHub or an authorize
          representative of this Website has been notified, orally or written,
          of the possibility of such damage. Some jurisdiction does not allow
          limitations on implied warranties or limitations of liability for
          incidental damages, these limitations may not apply to you.
        </p>

        <h2>5. Revisions and Errata</h2>

        <p>
          The materials appearing on StoriesHub’s Website may include technical,
          typographical, or photographic errors. StoriesHub will not promise
          that any of the materials in this Website are accurate, complete, or
          current. StoriesHub may change the materials contained on its Website
          at any time without notice. StoriesHub does not make any commitment to
          update the materials.
        </p>

        <h2>6. Links</h2>

        <p>
          StoriesHub has not reviewed all of the sites linked to its Website and
          is not responsible for the contents of any such linked site. The
          presence of any link does not imply endorsement by StoriesHub of the
          site. The use of any linked website is at the user’s own risk.
        </p>

        <h2>7. Site Terms of Use Modifications</h2>

        <p>
          StoriesHub may revise these Terms of Use for its Website at any time
          without prior notice. By using this Website, you are agreeing to be
          bound by the current version of these Terms and Conditions of Use.
        </p>

        <h2>8. Your Privacy</h2>

        <p>
          Please read our&nbsp;
          <a href="/policies" className="visited">
            Privacy Policy
          </a>
          .
        </p>

        <h2>9. Governing Law</h2>

        <p>
          Any claim related to StoriesHub's Website shall be governed by the
          laws of in without regards to its conflict of law provisions.
        </p>
      </div>
    </div>
  );
};

export default Tos;
export const Policy = () => {
  return (
    <div className="home">
      <SEO title="Privacy Policy" />
      <div className="tos">
        <h1 style={{ marginBottom: "20px" }}>Privacy Policy for StoriesHub</h1>
        <p>
          StoriesHub is a website to share your stories with a team or
          individually.
        </p>
        <h2>Data</h2>
        <ul>
          <li>
            When you login, we store your email ID and profile picture and they
            are public on the website.
          </li>
          <li>
            StoriesHub only use third party authentication services from Google
            and GitHub.
          </li>
          <li>
            The Authentication on this website is maintained using Firebase
            Authentication.
          </li>
          <li>
            The database for the website is provided by Firestore and only the
            owner can access the data and is primarily handled by Google.
          </li>
          <li>
            The source code of the website is available on GitHub except the
            Firebase configuration.
          </li>
          <li>
            Some basic user settings are stored in browser's local storage.
          </li>
        </ul>
        <h2>Security</h2>
        <ul>
          <li>
            The website is hosted on Firebase as of now and served through
            HTTPS.
          </li>
          <li>
            Your story drafts are only accessible by you and your teammates.
          </li>
          <li>
            Published stories are public and reports can be made but would be
            sent through email to the owner.
          </li>
        </ul>
      </div>
    </div>
  );
};
