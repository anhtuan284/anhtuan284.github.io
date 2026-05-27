import Nav from './components/Nav';
import ProjectsList from './components/ProjectsList';
import Reveal from './components/Reveal';
import TerminalLog from './components/TerminalLog';
import Typed from './components/Typed';
import { projects } from './data/projects';

export default function Home() {
  return (
    <>
      <Nav />

      <main id="top">
        <header className="intro">
          <span className="eyebrow">
            <Typed text="▌ MOBILE_ENGINEER · HCMC · OPEN_TO_WORK" />
          </span>

          <h1>
            <span className="name-given">Tuan</span>{' '}
            <span className="name-mid">Truong Bui</span>{' '}
            <span className="name-family">
              Anh<span className="dot-grad">.</span>
            </span>
          </h1>

          <div className="hero-rule" aria-hidden="true" />

          <p className="lede">
            I build mobile apps that ship. Currently shipping Flutter + Firebase at PITEK — before
            that, R&amp;D on RAG pipelines at Azera. I like picking up the thing I don&apos;t know
            yet.
          </p>

          <p className="status-row">
            ▌ now: building PiEx · stack: flutter · firebase · last commit: today
          </p>

          <div className="social-links">
            <a href="https://github.com/anhtuan284" target="_blank" rel="noopener noreferrer">
              github ↗
            </a>
            <a href="https://www.linkedin.com/in/tuantba" target="_blank" rel="noopener noreferrer">
              linkedin ↗
            </a>
            <a href="mailto:dev.atuan03@gmail.com">mail ↗</a>
          </div>
        </header>

        <Reveal as="div" className="stats-row">
          <div className="stat">
            <span className="stat-num">02<span className="stat-plus">+</span></span>
            <span className="stat-label">YEARS BUILDING</span>
          </div>
          <div className="stat">
            <span className="stat-num">{String(projects.length).padStart(2, '0')}</span>
            <span className="stat-label">PROJECTS SHIPPED</span>
          </div>
          <div className="stat">
            <span className="stat-num">02</span>
            <span className="stat-label">PRODUCTION APPS</span>
          </div>
        </Reveal>

        <TerminalLog />

        <Reveal as="section" id="about">
          <h2>About</h2>
          <div className="about-grid">
            <p>
              I&apos;m a mobile engineer based in Ho Chi Minh City. I work across the stack when I
              have to — backend, ML pipelines, the occasional cross-platform client — but mobile is
              where I do my best work right now. I treat each new project as the cheapest way to
              learn something I didn&apos;t know last quarter, and I aim for code that ships and
              stays shipped.
            </p>
            <pre className="now-txt" aria-label="current status">
              <span className="now-label">{'> now.txt'}</span>
              <span className="now-rule">──────────────</span>
              <span><span className="now-key">role  ·</span> <span className="now-val">mobile eng @ pitek</span></span>{'\n'}
              <span><span className="now-key">stack ·</span> <span className="now-val">flutter · firebase · dart</span></span>{'\n'}
              <span><span className="now-key">free  ·</span> <span className="now-val">weekends, side contracts</span></span>{'\n'}
              <span><span className="now-key">loc   ·</span> <span className="now-val">district 7, hcmc, vn</span></span>{'\n'}
              <span><span className="now-key">mail  ·</span> <span className="now-val">dev.atuan03@gmail.com</span></span>
            </pre>
          </div>
        </Reveal>

        <Reveal as="section" id="skills">
          <h2>Skills</h2>
          <div className="skill-rows">
            <div className="skill-row">
              <span className="skill-label">lang/</span>
              <div className="skill-chips">
                {['Dart', 'Java', 'SQL', 'Python', 'TypeScript', 'C++'].map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
            <div className="skill-row">
              <span className="skill-label">mobile/</span>
              <div className="skill-chips">
                {['Flutter', 'Firebase', 'GetX', 'Bloc'].map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
            <div className="skill-row">
              <span className="skill-label">web/</span>
              <div className="skill-chips">
                {['Spring MVC', 'Flask', 'Django', 'ASP.NET', 'React'].map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
            <div className="skill-row">
              <span className="skill-label">ml/data/</span>
              <div className="skill-chips">
                {['TensorFlow', 'PyTorch', 'MySQL', 'MSSQL'].map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
            <div className="skill-row">
              <span className="skill-label">infra/</span>
              <div className="skill-chips">
                {['Docker', 'Linux', 'Git'].map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" id="experience">
          <h2>Experience</h2>
          <div className="timeline">
            <div className="entry current">
              <h3>Mobile Engineer — PITEK Joint Stock Company</h3>
              <p className="when">NOV 2025 → NOW</p>
              <p className="where">Bình Thạnh, HCMC · on-site · full-time</p>
              <ul>
                <li>
                  <strong>PiCare</strong> — shipping features across the resident and agent apps;
                  both ends of the property-management flow.
                </li>
                <li>
                  <strong>PiEx</strong> — solo build of the secondary platform that moves
                  real-estate exchange online. Sellers and landlords meet under a monopoly contract
                  so every listing on the exchange is verified and trustworthy.
                </li>
                <li>
                  <strong>PiEx</strong> — built a map view that visualizes house prices by area, so
                  users can read the local market at a glance.
                </li>
                <li>Partnered with the front-end lead to harden parts of the auth flow.</li>
                <li>Stack: Flutter · Firebase · Dart.</li>
              </ul>
            </div>

            <div className="entry">
              <h3>Software Developer — Azera Vietnam</h3>
              <p className="when">AUG 2024 → NOV 2025</p>
              <ul>
                <li>R&amp;D on an ingestion RAG pipeline for asset querying and search completion.</li>
                <li>Shipped new features and maintained the core codebase end-to-end.</li>
                <li>Sat in on market research and contributed to an MVP launch.</li>
                <li>Picked up design patterns and tooling I still use today.</li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" id="projects">
          <h2>Projects</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 28, maxWidth: '60ch' }}>
            Things I built — by myself or with small teams. Some shipped, some are still cooking,
            some sit as lessons.
          </p>
          <ProjectsList projects={projects} />
        </Reveal>

        <Reveal as="section" id="education">
          <h2>Education</h2>
          <div className="timeline">
            <div className="entry">
              <h3>B.Sc. Computer Science — Ho Chi Minh City Open University</h3>
              <p className="when">OCT 2021 → OCT 2025</p>
              <p className="where">Software Engineering branch · CPA 3.7 / 4.0 · Top 3 in major</p>
            </div>
            <div className="entry">
              <h3>Big Data Track — Samsung Innovation Campus</h3>
              <p className="when">APR 2024 → AUG 2024</p>
              <p className="where">Hadoop · Spark · Kafka · MariaDB</p>
            </div>
          </div>
        </Reveal>

        <Reveal as="section">
          <h2>Recognition</h2>
          <ul>
            <li>
              <strong>Outstanding Exemplary Student 2025</strong> — selected by HCMC Open University&apos;s
              Commendation Council as the only student in the major to receive the title for Academic
              Excellence and Conduct.
              <span className="award-meta">2024 – 2025</span>
            </li>
            <li>
              <strong>4th Prize, Student Informatics Olympiad 2024</strong> — Open Source Software
              track. Built a low-code (Budibase) + computer-vision tool to assist response during
              urgent situations (pandemics, natural disasters).
              <span className="award-meta">NOV 2024 → DEC 2024 · Certificate of Merit</span>
            </li>
            <li>
              <strong>Consolation Prize, Scientific Research</strong> — model to automate student
              attendance and analyze attention via cornea-movement tracking.
              <span className="award-meta">AUG 2023 → MAR 2024</span>
            </li>
          </ul>
        </Reveal>

        <Reveal as="section" id="certifications">
          <h2>Certifications</h2>
          <ul>
            <li>
              <strong>Big Data — Samsung Innovation Campus</strong> — Hadoop, Apache Spark, Kafka,
              MariaDB.
              <span className="award-meta">APR 2024 → AUG 2024 · Samsung Certificate</span>
            </li>
            <li>
              <strong>Deep Learning Specialization (Course 1/5)</strong> — Simple Neural Networks
              (Coursera, Andrew Ng).
              <span className="award-meta">OCT 2023 → NOV 2023 · Coursera Certificate</span>
            </li>
            <li>
              <strong>TOEIC 845 / 990</strong> — Conversational English proficiency.
            </li>
          </ul>
        </Reveal>

        <Reveal as="section" className="life-section" id="life">
          <h2>Life</h2>
          <a href="#" className="life-card" aria-label="Outside of work — running, side projects, learning">
            <div className="life-bg" aria-hidden="true" />
            <div className="life-overlay">
              <span className="life-meta">HCMC · 2026 · OUTSIDE WORK</span>
              <h3 className="life-title">side projects, long runs, books I haven&apos;t finished</h3>
              <span className="life-cta">read the journal <span aria-hidden="true">↗</span></span>
            </div>
          </a>
        </Reveal>

        <footer id="contact">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>reach</h4>
              <ul>
                <li>
                  <a href="mailto:dev.atuan03@gmail.com">dev.atuan03@gmail.com</a>
                </li>
                <li>(+84) 37 782 2815</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>elsewhere</h4>
              <ul>
                <li>
                  <a href="https://github.com/anhtuan284" target="_blank" rel="noopener noreferrer">
                    github.com/anhtuan284
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/tuantba"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    linkedin.com/in/tuantba
                  </a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>meta</h4>
              <ul>
                <li>© {new Date().getFullYear()} ttba.dev</li>
                <li>built {new Date().toISOString().slice(0, 10)}</li>
                <li>hcmc · vn</li>
              </ul>
            </div>
          </div>
          <p className="sig">{`// end of file`}</p>
        </footer>
      </main>
    </>
  );
}
