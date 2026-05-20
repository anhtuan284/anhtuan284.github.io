import Nav from './components/Nav';
import ProjectsList from './components/ProjectsList';
import { projects } from './data/projects';

export default function Home() {
  return (
    <>
      <Nav />

      <main id="top">
        <header className="intro">
          <p className="eyebrow">Software Developer · Ho Chi Minh City</p>
          <h1>Tuan Truong Bui Anh</h1>
          <p className="tagline">
            <em>
              Building backend systems, ML pipelines, and the occasional cross-platform client —
              with a bias toward learning what I don&apos;t yet know.
            </em>
          </p>
          <p className="meta">GPA 3.7 / 4.0 &nbsp;·&nbsp; TOEIC 845 / 990</p>
          <p className="meta">District 7, HCMC</p>
          <p className="meta">
            <a href="mailto:dev.atuan03@gmail.com">dev.atuan03@gmail.com</a> &nbsp;·&nbsp; (+84) 37
            782 2815
          </p>
          <div className="social-links">
            <a href="https://github.com/anhtuan284" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/tuantba" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </header>

        <section id="about">
          <h2>About</h2>
          <p>
            I work toward roles in high-demand teams, expanding my range across modern programming
            stacks. I treat new challenges as the most reliable way to keep learning, and I aim to
            bring that energy to the teams I join.
          </p>
        </section>

        <section id="skills">
          <h2>Skills</h2>
          <ul>
            <li>
              <strong>Languages</strong> &nbsp;Dart, Java, SQL, Python, TypeScript, C++
            </li>
            <li>
              <strong>Frameworks</strong> &nbsp;Flutter, Spring MVC, Flask, Django, ASP.NET, React
            </li>
            <li>
              <strong>ML &amp; Data</strong> &nbsp;TensorFlow, PyTorch, MySQL, MSSQL
            </li>
            <li>
              <strong>Infra</strong> &nbsp;Docker, Linux
            </li>
          </ul>
        </section>

        <section id="experience">
          <h2>Experience</h2>
          <div className="entry">
            <h3>Software Developer — Azera Vietnam</h3>
            <p className="when">AUG 2024 → NOV 2025</p>
            <ul>
              <li>R&amp;D on an ingestion RAG pipeline for asset querying and search completion.</li>
              <li>Shipped new features and maintained the core codebase.</li>
              <li>Collaborated on market research and an MVP launch.</li>
              <li>Picked up new design patterns and tooling along the way.</li>
            </ul>
          </div>
        </section>

        <section id="projects">
          <h2>Selected Projects</h2>
          <ProjectsList projects={projects} />
        </section>

        <section id="education">
          <h2>Education</h2>
          <div className="entry">
            <h3>B.Sc. Computer Science — Ho Chi Minh Open University</h3>
            <p className="when">OCT 2021 → PRESENT</p>
          </div>
          <div className="entry">
            <h3>Big Data Track — Samsung Innovation Campus</h3>
            <p className="when">JUN 2024 → AUG 2024</p>
          </div>
        </section>

        <section>
          <h2>Recognition</h2>
          <ul>
            <li>4th Prize, Student Informatics Olympiad 2024 — Open Source Software.</li>
            <li>
              Consolation Prize, Scientific Research — automated student attendance via cornea
              tracking.
            </li>
          </ul>
        </section>

        <footer id="contact">
          <p>
            Reach me at <a href="mailto:dev.atuan03@gmail.com">dev.atuan03@gmail.com</a>.
          </p>
          <p className="sig">© {new Date().getFullYear()} tba.dev</p>
        </footer>
      </main>
    </>
  );
}
