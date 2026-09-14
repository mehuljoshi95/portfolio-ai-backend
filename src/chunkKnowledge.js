const fs = require("fs");
const path = require("path");

const inputPath = path.join(
    __dirname,
    "./knowledge/portfolio-knowledge.json"
);

const outputPath = path.join(
    __dirname,
    "./knowledge/portfolio-chunks.json"
);

function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function createChunk({
    id,
    section,
    title,
    content,
    metadata = {}
}) {
    return {
        id,
        section,
        title,
        content: content.trim(),
        metadata
    };
}

function main() {
    if (!fs.existsSync(inputPath)) {
        console.error("Knowledge file not found:");
        console.error(inputPath);
        process.exit(1);
    }

    const knowledge = JSON.parse(
        fs.readFileSync(inputPath, "utf-8")
    );

    const chunks = [];

    for (const item of knowledge) {
        const section = item.section;
        const content = item.content;

        if (!content || !content.trim()) {
            continue;
        }

        /*
         * ABOUT
         */

        if (section === "about") {
            chunks.push(
                createChunk({
                    id: "about",
                    section: "about",
                    title: "About Mehul Joshi",
                    content,
                    metadata: {
                        source: "portfolio",
                        type: "profile"
                    }
                })
            );

            continue;
        }

        /*
         * SKILLS
         */

        if (section === "skills") {
            const skillSections = [
                {
                    title: "Frontend Engineering",
                    content:
                        "Frontend Engineering: Building responsive, scalable and maintainable interfaces for complex business applications. React, Next.js, Angular, Redux, TypeScript.",
                    technologies: [
                        "React",
                        "Next.js",
                        "Angular",
                        "Redux",
                        "TypeScript"
                    ]
                },
                {
                    title: "Backend Engineering",
                    content:
                        "Backend Engineering: Designing reliable APIs, services and backend architectures capable of handling demanding workloads. Node.js, Express, REST, Laravel, Microservices.",
                    technologies: [
                        "Node.js",
                        "Express",
                        "REST",
                        "Laravel",
                        "Microservices"
                    ]
                },
                {
                    title: "Data & Databases",
                    content:
                        "Data & Databases: Database design, query optimization, indexing, caching and high-performance data access. MySQL, MongoDB, PostgreSQL.",
                    technologies: [
                        "MySQL",
                        "MongoDB",
                        "PostgreSQL"
                    ]
                },
                {
                    title: "Cloud & DevOps",
                    content:
                        "Cloud & DevOps: Building deployment workflows and production infrastructure with modern cloud tooling. AWS, EC2, ECS, S3, Docker, CI/CD.",
                    technologies: [
                        "AWS",
                        "EC2",
                        "ECS",
                        "S3",
                        "Docker",
                        "CI/CD"
                    ]
                },
                {
                    title: "Mobile Engineering",
                    content:
                        "Mobile Engineering: Developing cross-platform mobile applications and integrating them with scalable backend services. React Native, REST APIs.",
                    technologies: [
                        "React Native",
                        "REST APIs"
                    ]
                },
                {
                    title: "AI-Assisted Engineering",
                    content:
                        "AI-Assisted Engineering: Using modern AI tools to accelerate development, automation, debugging and engineering productivity. Copilot, ChatGPT, Codex, Gemini, Cursor.",
                    technologies: [
                        "Copilot",
                        "ChatGPT",
                        "Codex",
                        "Gemini",
                        "Cursor"
                    ]
                }
            ];

            for (const skill of skillSections) {
                chunks.push(
                    createChunk({
                        id: `skill-${slugify(skill.title)}`,
                        section: "skills",
                        title: skill.title,
                        content: skill.content,
                        metadata: {
                            source: "portfolio",
                            type: "skill",
                            technologies: skill.technologies
                        }
                    })
                );
            }

            continue;
        }

        /*
         * JOURNEY
         */

        if (section === "journey") {
            const journeySections = [
                {
                    title: "2016 — The Beginning",
                    content:
                        "2016, The Beginning: Started my professional software engineering journey as a PHP Developer. Built web applications, worked with MySQL and learned the fundamentals of real-world software development."
                },
                {
                    title: "2018 — Becoming Full Stack",
                    content:
                        "2018, Becoming Full Stack: Expanded into Laravel, React, Angular, WordPress, REST APIs, payment gateways and third-party integrations while building commercial products."
                },
                {
                    title: "2020 — Product Engineering",
                    content:
                        "2020, Product Engineering: Started thinking beyond individual features. Focus shifted toward architecture, maintainability, performance and complete product ownership."
                },
                {
                    title: "2022 — Enterprise Engineering",
                    content:
                        "2022, Enterprise Engineering: Joined RyDOT Infotech as a Senior Software Engineer. Built web and mobile platforms using React, Angular, React Native, Node.js and Express."
                },
                {
                    title: "2023-2025 — Scale & Architecture",
                    content:
                        "2023-2025, Scale & Architecture: Worked on enterprise systems handling 200K+ daily requests and 15K+ active users. Focused heavily on database optimization, caching, API performance and microservices."
                },
                {
                    title: "2023-2025 — Leadership",
                    content:
                        "2023-2025, Leadership: Progressed into Senior Engineer and Team Lead responsibilities, mentoring developers, reviewing architecture and helping teams deliver production software."
                },
                {
                    title: "2026 — Engineering + AI",
                    content:
                        "2026, Engineering + AI: Currently focused on scalable architecture, engineering leadership, automation and AI-powered development workflows — including building an AI-powered Jira automation agent."
                }
            ];

            for (const journey of journeySections) {
                chunks.push(
                    createChunk({
                        id: `journey-${slugify(journey.title)}`,
                        section: "journey",
                        title: journey.title,
                        content: journey.content,
                        metadata: {
                            source: "portfolio",
                            type: "career-journey"
                        }
                    })
                );
            }

            continue;
        }

        /*
         * EXPERIENCE
         */

        if (section === "experience") {
            const experiences = [
                {
                    company: "Ulora Technologies",
                    role: "Senior Software Engineer / Team Lead",
                    period: "NOV 2025 — JUL 2026",
                    content:
                        "NOV 2025 — JUL 2026 ULORA TECHNOLOGIES, Senior Software Engineer / Team Lead. Led a team of 3 engineers, coordinated project execution, performed code reviews, managed Agile workflows and designed CI/CD pipelines. Also developed an AI-powered Jira automation agent to reduce repetitive project-management work.",
                    technologies: [
                        "Leadership",
                        "Node.js",
                        "Express.js",
                        "React.js",
                        "AI Automation",
                        "CI/CD",
                        "Jenkins",
                        "Jira"
                    ]
                },
                {
                    company: "RyDOT Infotech",
                    role: "Senior Software Engineer / Team Lead",
                    period: "MAR 2022 — OCT 2025",
                    content:
                        "MAR 2022 — OCT 2025 RYDOT INFOTECH, Senior Software Engineer / Team Lead. Designed and developed scalable web and mobile applications. Worked across React, Angular, React Native, Node.js and Express while owning complete software development lifecycles. Led engineering initiatives around performance, microservices, production reliability and developer mentoring.",
                    technologies: [
                        "Leadership",
                        "React.js",
                        "Angular",
                        "Next.js",
                        "React Native",
                        "Node.js",
                        "Express.js",
                        "Microservices",
                        "Architecture",
                        "Monolithic Architecture",
                        "AWS",
                        "Jira",
                        "AI Tools"
                    ]
                },
                {
                    company: "Repute Infosystems",
                    role: "Full Stack Developer",
                    period: "JAN 2018 — MAR 2022",
                    content:
                        "JAN 2018 — MAR 2022 REPUTE INFOSYSTEMS, Full Stack Developer. Built commercial WordPress products and full-stack applications using Laravel, React, Angular and MySQL. Worked on Sociamonials, ARForms, ARMember and ARPrice, including payment integrations, authentication, membership systems and social-media automation.",
                    technologies: [
                        "WordPress",
                        "PHP",
                        "Laravel",
                        "React",
                        "Angular",
                        "MySQL"
                    ]
                },
                {
                    company: "BinaryBits",
                    role: "PHP Developer",
                    period: "JUN 2016 — OCT 2017",
                    content:
                        "JUN 2016 — OCT 2017 BINARYBITS, PHP Developer. Began my professional software engineering career. Developed PHP applications, automated data extraction tools and MySQL-based systems.",
                    technologies: [
                        "PHP",
                        "JavaScript",
                        "MySQL",
                        "Web Development"
                    ]
                }
            ];

            for (const experience of experiences) {
                chunks.push(
                    createChunk({
                        id: `experience-${slugify(
                            experience.company
                        )}`,
                        section: "experience",
                        title: experience.company,
                        content: experience.content,
                        metadata: {
                            source: "portfolio",
                            type: "experience",
                            company: experience.company,
                            role: experience.role,
                            period: experience.period,
                            technologies: experience.technologies
                        }
                    })
                );
            }

            continue;
        }

        /*
         * PROJECTS
         */

        if (section === "projects") {
            const projects = [
                {
                    title: "Courier ERP",
                    content:
                        "PROJECT / 01 Courier ERP: Enterprise logistics platform supporting courier booking, tracking, delivery operations, reporting and real-time data synchronization. Impact: 200K+ requests/day.",
                    technologies: [
                        "Angular",
                        "Node.js",
                        "Express.js",
                        "Electron",
                        "MongoDB",
                        "PostgreSQL",
                        "FCM",
                        "Redis",
                        "Microservices"
                    ],
                    impact: "200K+ requests/day"
                },
                {
                    title: "Radiant",
                    content:
                        "PROJECT / 02 Radiant: Real-time solar monitoring platform for collecting, processing and visualizing energy-generation data through dashboards and APIs.",
                    technologies: [
                        "React",
                        "Node.js",
                        "Express.js",
                        "MQTT",
                        "REST APIs",
                        "MongoDB"
                    ],
                    impact: "Real-time monitoring"
                },
                {
                    title: "Digital Walls",
                    content:
                        "PROJECT / 03 Digital Walls: Digital signage platform for managing dynamic content distribution, scheduling, campaigns, screen updates and analytics.",
                    technologies: [
                        "React",
                        "Node.js",
                        "Express.js",
                        "REST APIs",
                        "MongoDB"
                    ],
                    impact: "Scalable content delivery"
                },
                {
                    title: "Sociamonials",
                    content:
                        "PROJECT / 04 Sociamonials: Social-media management platform supporting content scheduling, campaign management, analytics, media management and automated publishing workflows.",
                    technologies: [
                        "Laravel",
                        "React",
                        "MySQL",
                        "REST APIs"
                    ],
                    impact: "Automation & integrations"
                },
                {
                    title: "AI Jira Automation Agent",
                    content:
                        "PROJECT / 05 AI Jira Automation Agent: AI-powered engineering automation designed to reduce repetitive Jira project-management tasks and improve team productivity.",
                    technologies: [
                        "AI",
                        "Jira",
                        "Automation",
                        "Node.js",
                        "REST APIs"
                    ],
                    impact: "AI + Developer Productivity"
                }
            ];

            for (const project of projects) {
                chunks.push(
                    createChunk({
                        id: `project-${slugify(project.title)}`,
                        section: "projects",
                        title: project.title,
                        content: project.content,
                        metadata: {
                            source: "portfolio",
                            type: "project",
                            technologies: project.technologies,
                            impact: project.impact
                        }
                    })
                );
            }

            continue;
        }

        /*
         * ARCHITECTURE
         */

        if (section === "architecture") {
            chunks.push(
                createChunk({
                    id: "architecture",
                    section: "architecture",
                    title: "How I Think About Architecture",
                    content,
                    metadata: {
                        source: "portfolio",
                        type: "architecture"
                    }
                })
            );

            continue;
        }

        /*
         * AI ENGINEERING
         */

        if (section === "ai-engineering") {
            chunks.push(
                createChunk({
                    id: "ai-engineering",
                    section: "ai-engineering",
                    title: "AI Engineering",
                    content,
                    metadata: {
                        source: "portfolio",
                        type: "ai-engineering"
                    }
                })
            );

            continue;
        }

        /*
         * CONTACT
         */

        if (section === "contact") {
            chunks.push(
                createChunk({
                    id: "contact",
                    section: "contact",
                    title: "Contact",
                    content,
                    metadata: {
                        source: "portfolio",
                        type: "contact"
                    }
                })
            );

            continue;
        }

        /*
         * FALLBACK
         *
         * If a new section is added to the portfolio later,
         * we don't want to silently lose it.
         */

        chunks.push(
            createChunk({
                id: section,
                section,
                title: section,
                content,
                metadata: {
                    source: "portfolio",
                    type: "section"
                }
            })
        );
    }

    fs.writeFileSync(
        outputPath,
        JSON.stringify(chunks, null, 2),
        "utf-8"
    );

    console.log(
        `Created ${chunks.length} knowledge chunks`
    );

    console.log(`Output: ${outputPath}`);

    console.log("\nChunks:");

    chunks.forEach((chunk, index) => {
        console.log(
            `${index + 1}. ${chunk.id}`
        );
    });
}

main();