export type StackItem = { label: string; ico?: string; note?: string };

export type Project = {
  slug: string;
  title: string;
  status: 'Research' | 'Production' | 'Prototype' | 'Archived' | 'Award' | 'Private';
  year: string;
  role?: string;
  team?: string;
  tagline: string;
  overview: string;
  solution: string[];
  architecture: {
    description: string;
    diagram: string;
  };
  visualization: { caption: string; src?: string; placeholder?: string }[];
  cover?: string;
  stack: StackItem[];
  repo?: string;
  extraLinks?: { label: string; href: string }[];
  highlights?: string[];
};

export const projects: Project[] = [
  {
    slug: 'moodloom',
    title: 'Moodloom — Mood Logger',
    status: 'Production',
    year: '2025',
    role: 'Software Engineer',
    team: 'Project at Azera Vietnam · 2 members',
    tagline:
      'Mood-logging app for mental well-being with an embedded Flame mini-game, ASMR library, and Firebase-driven content delivery.',
    overview:
      'Cross-platform mood tracker built end-to-end during my tenure at Azera Vietnam. Day-to-day journaling, mood analytics, ASMR library, and a Flame-engine mini-game live behind a Riverpod state graph. Backend lives entirely on Firebase: Firestore for journal entries, Cloud Functions for derived analytics, Cloud Storage for media. Google Analytics drives the product feedback loop.',
    solution: [
      'User Story Mapping + persona sessions to lock down MVP feature set with the designer before any code shipped.',
      'Riverpod state graph slicing the app into mood log, content library, mini-game, and settings — each provider testable in isolation.',
      'Flame-engine mini-game embedded as a Flutter widget for a moment of friction-free play between log entries.',
      'Firebase Storage seeded with curated ASMR audio + icon packs; Firestore documents reference Storage paths so content can rotate without app releases.',
      'Cloud Functions compute streaks, mood trends, and trigger nudge notifications.',
      'Google Analytics events instrumented per screen and per primary CTA to inform iteration.',
    ],
    architecture: {
      description:
        'Flutter client manages local state via Riverpod and talks to Firebase services directly. Cloud Functions handle aggregation and any sensitive server-side logic. Storage serves ASMR audio and icon packs; Analytics streams behavioral events back to the team.',
      diagram: `┌────────────────────┐
│  Flutter + Riverpod │
│  + Flame mini-game  │
└──────────┬──────────┘
           │ Firebase SDK
   ┌───────┼───────────────────────────┐
   ▼       ▼               ▼           ▼
Firestore  Storage    Cloud Funcs   Analytics
(journal,  (ASMR,     (streaks,     (events,
 moods)    icons)      nudges)      funnels)`,
    },
    visualization: [
      { caption: 'Daily log flow', placeholder: 'mood entry screen' },
      { caption: 'Mini-game', placeholder: 'Flame engine widget' },
      { caption: 'ASMR library', placeholder: 'audio collection grid' },
    ],
    stack: [
      { label: 'Flutter', ico: '' },
      { label: 'Riverpod', ico: '' },
      { label: 'Flame', ico: '' },
      { label: 'Firestore', ico: '' },
      { label: 'Cloud Functions', ico: '' },
      { label: 'Storage', ico: '' },
      { label: 'Analytics', ico: '' },
      { label: 'Figma', ico: '' },
    ],
    highlights: [
      'Shipped end-to-end at AZVN — design partnership through release.',
      'Flame mini-game embedded inside a Flutter widget tree.',
      'Content rotates via Firestore + Storage without rebuilds.',
    ],
  },
  {
    slug: 'cxr-multi-disease',
    title: 'CXR Multi-disease & RAG Agent',
    status: 'Research',
    year: '2024 – 2025',
    role: 'Solo',
    team: '1 member',
    tagline:
      'Chest X-ray multi-disease detection (YOLO + DenseNet/ResNet/EfficientNet) paired with a LlamaIndex RAG agent for clinician Q&A.',
    overview:
      'A medical-imaging system that combines CNN-based classification, YOLO-based object detection, and a Retrieval-Augmented Generation agent grounded on chest X-ray literature. Three FastAPI services run independently behind a Strapi CMS and a Flutter client; Prometheus + Grafana provide system metrics, Celery orchestrates inference jobs. Built on VinDr-CXR and NIH ChestX-ray14.',
    solution: [
      'Trained DenseNet121, ResNet50, EfficientNetB0 on ChestXray-14 with transfer learning from ImageNet; multi-class loss tuned for rare findings.',
      'Custom-trained Ultralytics YOLOv5/v8 for lesion localization alongside the classifier.',
      'Grad-CAM overlays surfaced through the API so clinicians see *why* a finding was flagged.',
      'RAG service: LlamaIndex chunks medical PDFs into nodes, embeds with BAAI/bge-base-en-v1.5, stores in pgvector, then Llama 3 generates grounded answers.',
      'Microservice split (be-fastapi-cnn, be-fastapi-yolo, be-rag, be-strapi) keeps inference, search, and content concerns isolated.',
      'Celery + Prometheus + Grafana instrument inference latency and queue depth in real time.',
    ],
    architecture: {
      description:
        'Flutter client routes through Strapi for content and through three FastAPI services for inference. The RAG service owns its own pgvector instance and proxies prompts to a local Ollama-hosted Llama 3 model. Prometheus scrapes each service; Grafana renders the operator dashboard.',
      diagram: `┌──────────────┐
│  Flutter UI  │
└──────┬───────┘
       │ REST
       ▼
┌─────────────────────────────────────────────┐
│   FastAPI mesh                               │
│ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│ │ CNN svc  │ │ YOLO svc │ │ RAG svc      │  │
│ │ DenseNet │ │ Ultra-   │ │ LlamaIndex + │  │
│ │ +GradCAM │ │ lytics   │ │ pgvector +   │  │
│ └────┬─────┘ └────┬─────┘ │ Ollama Llama3│  │
└──────┼────────────┼───────┴──────┬───────┘──┘
       │            │              │
       ▼            ▼              ▼
   Strapi CMS   Prometheus    Grafana board`,
    },
    visualization: [
      { caption: 'CNN system architecture', src: '/projects/cxr-multi-disease/cnnsystem.png' },
      { caption: 'RAG system architecture', src: '/projects/cxr-multi-disease/ragsystem.png' },
      { caption: 'Technology stack', src: '/projects/cxr-multi-disease/techstack.png' },
    ],
    cover: '/projects/cxr-multi-disease/cnnsystem.png',
    stack: [
      { label: 'TensorFlow', ico: '󱅉' },
      { label: 'PyTorch', ico: '' },
      { label: 'YOLO', ico: '' },
      { label: 'DenseNet121' },
      { label: 'FastAPI', ico: '' },
      { label: 'LlamaIndex' },
      { label: 'pgvector', ico: '' },
      { label: 'Ollama' },
      { label: 'Strapi' },
      { label: 'Celery' },
      { label: 'Prometheus', ico: '' },
      { label: 'Grafana', ico: '' },
      { label: 'Flutter', ico: '' },
      { label: 'Docker', ico: '' },
    ],
    repo: 'https://github.com/anhtuan284/chest-xray-multi-disease',
    highlights: [
      'Three FastAPI services + Strapi + Flutter, fully containerized.',
      'RAG grounded on chest-disease PDFs — LlamaIndex + pgvector + Llama 3.',
      'Grad-CAM explainability surfaced through the inference API.',
      'Real-time inference metrics via Celery + Prometheus + Grafana.',
    ],
  },
  {
    slug: 'mediscan',
    title: 'MediScan — Low-Code Medical Imaging',
    status: 'Research',
    year: '2024',
    role: 'R&D',
    tagline:
      'R&D platform applying low-code (Appsmith + Strapi) and computer vision (YOLO, DenseNet121) to medical image triage.',
    overview:
      'Exploratory build investigating how far a low-code front-end can carry a real medical-imaging workflow. Appsmith owns the clinician UI; Strapi handles patient/content data; two FastAPI services serve DenseNet121 (chest X-ray) and YOLO (skin condition + dermatology) inference. Grafana + Prometheus track system + model performance.',
    solution: [
      'Split inference into a generic FastAPI core and a dedicated DenseNet service so each model can scale independently.',
      'Strapi modeled as the source of truth for patient records, freeing the FastAPI layer to stay stateless.',
      'Appsmith front-end assembled from API actions — no custom JS bundle, no build pipeline.',
      'Grad-CAM visualization piped into Appsmith image components for explainable predictions.',
      'Grafana dashboards for system metrics + a separate dashboard for model performance over time.',
    ],
    architecture: {
      description:
        'Appsmith front-end calls Strapi (patient data) and two FastAPI services (DenseNet121, YOLO) over REST. Prometheus scrapes service-level metrics; Grafana renders system and model dashboards side by side.',
      diagram: `┌──────────────┐
│ Appsmith UI  │
└──────┬───────┘
       │ REST
   ┌───┼─────────────┬──────────────┐
   ▼   ▼             ▼              ▼
 Strapi  FastAPI    FastAPI       Prometheus
 (CMS)   DenseNet   YOLO core      │
                                    ▼
                                 Grafana`,
    },
    visualization: [
      { caption: 'System flow architecture', src: '/projects/mediscan/systemflow.png' },
      { caption: 'Medical analysis demo', src: '/projects/mediscan/demo1.png' },
      { caption: 'Monitoring dashboard', src: '/projects/mediscan/monitor.png' },
    ],
    cover: '/projects/mediscan/systemflow.png',
    stack: [
      { label: 'TensorFlow', ico: '󱅉' },
      { label: 'YOLO', ico: '' },
      { label: 'DenseNet121' },
      { label: 'FastAPI', ico: '' },
      { label: 'Appsmith' },
      { label: 'Strapi' },
      { label: 'Prometheus', ico: '' },
      { label: 'Grafana', ico: '' },
      { label: 'Docker', ico: '' },
    ],
    repo: 'https://github.com/anhtuan284/mediscan',
    highlights: [
      'Validated low-code (Appsmith) as a viable clinician-facing layer.',
      'Two FastAPI services let models scale + version independently.',
      'Operator monitoring built in from day one.',
    ],
  },
  {
    slug: 'rebuild-zone',
    title: 'RebuildZone — Crisis Response',
    status: 'Award',
    year: '2024',
    role: 'Software Engineer',
    team: 'Team "Lazy Sunday Morning" · 3 members',
    tagline:
      '4th Prize at the Vietnam Open Source Software Olympiad 2024 — a low-code humanitarian aid system for natural disasters and pandemics.',
    overview:
      'A humanitarian-aid platform born out of post-COVID and Typhoon YAGI response work. Targets vulnerable populations during natural disasters and outbreaks. Built around a Budibase front-end with two Flask AI services: a chatbot for health consultations and an X-ray service for damage assessment + medical triage. Open-sourced under Apache 2.0.',
    solution: [
      'Personal status declaration flow for health, condition, and emergency reporting.',
      'Image-based damage prediction and statistical roll-up for relief coordinators.',
      'Donation and humanitarian support management modules.',
      'Decision-support suggestions for triage during overload conditions.',
      'OpenAI-backed chatbot for health consultation and emergency guidance.',
      'Multilingual support for foreigners in Vietnam during a crisis.',
    ],
    architecture: {
      description:
        'Budibase delivers the operator UI and embeds a built-in MongoDB. Two Flask services (chatbot + X-ray) sit behind Docker Compose; Cloudinary stores user-uploaded media; OpenAI powers the chat layer; Sentry tracks errors in the wild.',
      diagram: `┌──────────────────┐
│  Budibase UI     │
│  + MongoDB       │
└──────┬───────────┘
       │ REST
   ┌───┼───────────────┐
   ▼   ▼               ▼
 Chatbot         X-ray
 (Flask +        (Flask +
  OpenAI)         CNN + GradCAM)
       │               │
       ▼               ▼
   Cloudinary      Sentry`,
    },
    visualization: [
      { caption: 'System architecture', src: '/projects/rebuild-zone/architech.svg' },
      { caption: 'Budibase dashboard', src: '/projects/rebuild-zone/images1.png' },
      { caption: 'Imported app view', src: '/projects/rebuild-zone/images3.png' },
    ],
    cover: '/projects/rebuild-zone/architech.svg',
    stack: [
      { label: 'Budibase' },
      { label: 'Flask', ico: '' },
      { label: 'TensorFlow', ico: '󱅉' },
      { label: 'OpenAI', ico: '' },
      { label: 'Docker', ico: '' },
      { label: 'PostgreSQL', ico: '' },
      { label: 'SQLite' },
      { label: 'Redis', ico: '' },
      { label: 'Cloudinary' },
      { label: 'Sentry' },
    ],
    repo: 'https://github.com/anhtuan284/rebuild-zone',
    extraLinks: [
      {
        label: 'Canva pitch deck',
        href: 'https://www.canva.com/design/DAGYu2oIjn0/Z9J7rGkzynJUEw5MUv9A7w/edit',
      },
    ],
    highlights: [
      '4th Prize, OLP 2024 — Open Source Software.',
      'Open-sourced under Apache 2.0 with the Lazy Sunday Morning team.',
      'Designed for low-bandwidth, multilingual crisis usage.',
    ],
  },
  {
    slug: 'rental-housing',
    title: 'House Rental Support',
    status: 'Production',
    year: '2024',
    role: 'Backend + ML',
    team: '2 members',
    tagline:
      'Two-sided rental marketplace with Vietnamese sentiment analysis, location-aware search, and Redis-cached statistics.',
    overview:
      'Web platform that pairs RENTERS with LANDLORDS, originally aimed at first-year university students struggling to find housing near campus. Posts flow through a moderation pipeline (LANDLORD → ADMIN → public); users can report unreliable listings. Includes Vietnamese sentiment analysis on comment threads, Microsoft Map API for proximity search, and a Redis-cached statistics layer.',
    solution: [
      'JWT auth with role-based authorization for ADMIN, RENTER, and LANDLORD.',
      'Google sign-in onboards new users as RENTER with zero friction.',
      'Listing moderation flow: LANDLORD uploads, ADMIN reviews, the post goes public.',
      'Report-and-takedown loop hides listings flagged repeatedly until ADMIN clears or removes them.',
      'Vietnamese sentiment analysis (Underthesea) on listing comments to surface toxic threads.',
      'Microsoft Map API for "show posts near this pin" geo-search.',
      'Real-time chat (text + images) between users with conversation persistence.',
      'Statistical reports cached in Redis to keep heavy aggregations responsive.',
    ],
    architecture: {
      description:
        'React/TypeScript SPA calls a Spring MVC REST backend over HTTPS. Hibernate persists to MySQL; Redis caches statistics and hot search queries. Microsoft Map API powers the location overlay; Underthesea runs as a Python sentiment microservice consumed by Spring.',
      diagram: `┌──────────────┐    REST/JSON   ┌──────────────┐    JPA      ┌──────────────┐
│ React + TS   │ ─────────────► │ Spring MVC   │ ──────────► │   MySQL      │
│   SPA        │ ◄───────────── │ + Hibernate  │ ◄────────── │              │
└──────┬───────┘                └──────┬───────┘             └──────────────┘
       │ Microsoft Map API             │ cache + sentiment
       ▼                               ▼
   geo overlay                ┌────────────────┐
                              │ Redis  +       │
                              │ Underthesea NLP│
                              └────────────────┘`,
    },
    visualization: [
      { caption: 'System architecture', src: '/projects/rental-housing/system.png' },
      { caption: 'Renter UI', src: '/projects/rental-housing/client1.png' },
      { caption: 'Admin console', src: '/projects/rental-housing/admin1.png' },
    ],
    cover: '/projects/rental-housing/system.png',
    stack: [
      { label: 'Spring MVC', ico: '' },
      { label: 'Hibernate', ico: '' },
      { label: 'Java', ico: '' },
      { label: 'MySQL', ico: '' },
      { label: 'Redis', ico: '' },
      { label: 'React', ico: '' },
      { label: 'TypeScript', ico: '' },
      { label: 'Underthesea' },
      { label: 'MS Map API' },
      { label: 'JWT' },
    ],
    repo: 'https://github.com/anhtuan284/rental-housing-webapp',
    highlights: [
      'Vietnamese sentiment analysis on listing comment threads.',
      'Location-aware search via Microsoft Map API.',
      'Redis-cached statistics keep aggregation queries hot.',
    ],
  },
  {
    slug: 'clinic-mobile',
    title: 'Private Clinic Mobile App',
    status: 'Archived',
    year: '2023 – 2024',
    role: 'Backend',
    team: '2 members',
    tagline:
      'Secure Django REST + OAuth2 backend with a React Native client for appointment scheduling, prescriptions, and MOMO payments.',
    overview:
      'Mobile companion to the Private Clinic Web App. Django REST Framework backs a React Native client; OAuth2 secures the API surface. Patients book appointments, browse prescriptions, and pay via MOMO; staff handle scheduling and prescription dispatch on the same backend.',
    solution: [
      'Django REST Framework API protected by OAuth2 — fine-grained scopes per role.',
      'SQLAlchemy migrations let the schema evolve without losing patient data.',
      'Appointment scheduling + service booking flow shared between web and mobile clients.',
      'Prescription and patient management endpoints with audit-friendly write paths.',
      'MOMO payment gateway integrated for in-app billing.',
    ],
    architecture: {
      description:
        'React Native client speaks REST/JSON to Django; OAuth2 issues short-lived access tokens, refresh tokens kept in secure storage. MySQL persists patient and clinical data via SQLAlchemy; MOMO Gateway handles payment.',
      diagram: `┌──────────────┐    REST/OAuth2  ┌──────────────┐    SQLA    ┌──────────────┐
│ React Native │ ──────────────► │ Django REST  │ ─────────► │   MySQL      │
│   client     │ ◄────────────── │ + DRF        │ ◄───────── │              │
└──────┬───────┘                 └──────┬───────┘            └──────────────┘
       │ payments                       │
       ▼                                ▼
  MOMO Gateway                   audit-friendly
                                 write paths`,
    },
    visualization: [
      { caption: 'Booking flow', placeholder: 'appointment screen' },
      { caption: 'Prescription view', placeholder: 'history list' },
      { caption: 'MOMO checkout', placeholder: 'payment confirmation' },
    ],
    stack: [
      { label: 'Django', ico: '' },
      { label: 'DRF' },
      { label: 'SQLAlchemy' },
      { label: 'OAuth2', ico: '' },
      { label: 'MySQL', ico: '' },
      { label: 'React Native', ico: '' },
      { label: 'MOMO Gateway' },
    ],
    repo: 'https://github.com/anhtuan284/clinic-mobileapp-backend',
    extraLinks: [
      { label: 'Mobile front-end repo', href: 'https://github.com/anhtuan284/clinic-mobileapp-fe' },
    ],
    highlights: [
      'OAuth2 scopes enforce role boundaries at the API layer.',
      'Schema evolution via SQLAlchemy migrations without data loss.',
      'MOMO gateway integrated for in-app payments.',
    ],
  },
  {
    slug: 'clinic-webapp',
    title: 'THT Clinic — Web App',
    status: 'Archived',
    year: '2023 – 2024',
    role: 'Full-stack',
    team: '3 members',
    tagline:
      'Flask-based clinic management web app — appointments, prescriptions, VNPAY payments, and a scikit-learn sleep-quality model.',
    overview:
      'End-of-term clinical management platform built with Flask (MVT). Patients schedule appointments, browse prescriptions, and pay via VNPAY; staff manage patients and prescriptions through a Flask-Admin console. A scikit-learn model is embedded for sleep-quality prediction. CI/CD via GitHub Actions; Cloudinary hosts image uploads; BCrypt protects credentials.',
    solution: [
      'Flask MVT with Flask-Admin for the staff console — full CRUD per resource.',
      'Online appointment booking + prescription browsing for patients.',
      'VNPAY integration for in-clinic and online payments.',
      'BCrypt password hashing; WTForms for safe form handling.',
      'Cloudinary for prescription / patient image storage.',
      'ChartJS-driven statistical dashboards for the clinic operator.',
      'scikit-learn sleep-quality model embedded for early-warning predictions.',
      'GitHub Actions CI/CD pipeline for tests + deploy.',
    ],
    architecture: {
      description:
        'Flask handles routing, templates, admin, and API in a single app. SQLAlchemy persists to MySQL; Cloudinary stores images; the sleep-quality model loads from disk into the Flask process for low-latency inference.',
      diagram: `┌──────────────────┐
│ Flask MVT app    │
│ + Flask-Admin    │
│ + ChartJS        │
│ + scikit-learn   │
└──────┬───────────┘
       │ SQLAlchemy
       ▼
   ┌───────────┐      ┌────────────┐
   │  MySQL    │      │ Cloudinary │
   └───────────┘      └────────────┘
       │                  ▲
       │                  │ image uploads
       │       ┌──────────┴─────────┐
       └──────►│  VNPAY Gateway     │
               └────────────────────┘`,
    },
    visualization: [
      { caption: 'Online appointment scheduling', src: '/projects/clinic-webapp/schedule.png' },
      { caption: 'Prescription workflow', src: '/projects/clinic-webapp/prescribe.png' },
      { caption: 'Statistics dashboard', src: '/projects/clinic-webapp/stats.png' },
    ],
    cover: '/projects/clinic-webapp/schedule.png',
    stack: [
      { label: 'Flask', ico: '' },
      { label: 'Flask-Admin' },
      { label: 'SQLAlchemy' },
      { label: 'MySQL', ico: '' },
      { label: 'ChartJS' },
      { label: 'WTForms' },
      { label: 'BCrypt' },
      { label: 'scikit-learn' },
      { label: 'Cloudinary' },
      { label: 'VNPAY' },
      { label: 'GitHub Actions', ico: '' },
    ],
    repo: 'https://github.com/anhtuan284/clinic-webapp',
    highlights: [
      'CI/CD via GitHub Actions from the first commit.',
      'Embedded scikit-learn model for sleep-quality prediction.',
      'VNPAY + Cloudinary integrated for the full clinic workflow.',
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
