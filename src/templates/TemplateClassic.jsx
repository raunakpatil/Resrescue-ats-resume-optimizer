import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const COLOR_DARK = "#1B1D1E";
const COLOR_BLACK = "#000000";

const styles = StyleSheet.create({
  page: {
    paddingBottom: 10,
    padding: "16 28",
    fontFamily: "Helvetica",
    fontSize: 9.5,
    lineHeight: 1.25,
    backgroundColor: "#ffffff",
    color: COLOR_BLACK,
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: COLOR_DARK,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLOR_DARK,
    borderBottomStyle: "solid",
    paddingBottom: 2,
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 9.5,
    textTransform: "uppercase",
    color: COLOR_DARK,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLOR_DARK,
    borderBottomStyle: "solid",
    paddingBottom: 2,
    marginBottom: 2,
  },
  contactText: {
    fontSize: 9,
    color: COLOR_BLACK,
    textAlign: "center",
    marginBottom: 1,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: COLOR_DARK,
    textAlign: "left",
    marginTop: 5,
    marginBottom: 2,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: COLOR_DARK,
    borderBottomStyle: "solid",
    paddingBottom: 1.5,
  },
  body: {
    fontSize: 10,
    marginTop: 1,
  },
  // Each bullet is a row: dot + text
  bulletRow: {
    flexDirection: "row",
    marginTop: 1,
    paddingLeft: 20,
  },
  bulletDot: {
    fontSize: 10,
    width: 10,
    fontFamily: "Helvetica",
  },
  bulletText: {
    fontSize: 10,
    flex: 1,
    fontFamily: "Helvetica",
  },
  bulletBoldText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  // Entry header: bold title + pipe-separated rest on same line
  entryHeaderRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
    marginBottom: 1,
  },
  entryTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  entryMeta: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: COLOR_DARK,
  },
  projDateRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  projDateText: {
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: COLOR_DARK,
  },
  projTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 1,
  },
});

// Safe bullet — never crashes because it always has exactly: dot Text + body Text
function Bullet({ bold, children }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>{"• "}</Text>
      <Text style={styles.bulletText}>
        {bold ? <Text style={styles.bulletBoldText}>{bold} </Text> : null}
        <Text>{children}</Text>
      </Text>
    </View>
  );
}

function SkillsSection({ skills }) {
  if (!skills) return null;

  let cats = [];
  if (Array.isArray(skills)) {
    cats = skills;
  } else {
    const groups = [
      { key: "technical", label: "Technical" },
      { key: "frameworks", label: "Frameworks" },
      { key: "tools", label: "Tools" },
      { key: "languages", label: "Languages" },
    ];
    cats = groups
      .filter((g) => skills[g.key]?.length > 0)
      .map((g) => ({ name: g.label, skills: skills[g.key] }));
  }

  return (
    <View>
      {cats.map((cat, i) => (
        <Bullet key={i} bold={cat.name ? `${cat.name}:` : null}>
          {(cat.skills || []).join(", ")}
        </Bullet>
      ))}
    </View>
  );
}

export function TemplateClassic({ resumeData }) {
  if (!resumeData) return null;
  const {
    contact = {},
    summary,
    experience = [],
    skills,
    education = [],
    certifications = [],
    projects = [],
  } = resumeData;

  const contactLine = [
    contact.location,
    contact.phone,
    contact.email,
    contact.linkedin,
    contact.github,
  ]
    .filter(Boolean)
    .join(" | ");

  const jobTitleText =
    contact.jobTitle ||
    (experience.length > 0 ? experience[0].title : null) ||
    "Professional";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* NAME */}
        <Text style={styles.name}>{contact.name || "Your Name"}</Text>

        {/* JOB TITLE */}
        <Text style={styles.jobTitle}>{jobTitleText}</Text>

        {/* CONTACT */}
        <Text style={styles.contactText}>{contactLine}</Text>

        {/* SUMMARY */}
        {summary ? (
          <View>
            <Text style={styles.sectionTitle}>SUMMARY</Text>
            <Text style={styles.body}>{summary}</Text>
          </View>
        ) : null}

        {/* SKILLS */}
        {skills ? (
          <View>
            <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
            <SkillsSection skills={skills} />
          </View>
        ) : null}

        {/* WORK EXPERIENCE */}
        {experience.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>WORK EXPERIENCE</Text>
            {experience.map((exp, i) => {
              const companyLoc = [exp.company, exp.location].filter(Boolean).join(" | ");
              const dateText = `${exp.start_date || ""} \u2013 ${exp.end_date || "Present"}`;

              return (
                <View key={i}>
                  {/* Entry header: title | company | location        [Dates] */}
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5, marginBottom: 1 }}>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", flex: 1, paddingRight: 10 }}>
                      <Text style={styles.entryTitle}>{exp.title}</Text>
                      {companyLoc ? <Text style={styles.entryMeta}>{" | "}{companyLoc}</Text> : null}
                    </View>
                    <Text style={styles.entryMeta}>{dateText}</Text>
                  </View>
                  {/* Bullets */}
                  {(exp.bullets || []).map((bullet, j) => {
                    // Detect "Label: rest" pattern for bold prefix
                    const colonIdx = bullet.indexOf(":");
                    const hasPrefix = colonIdx > 0 && colonIdx < 40;
                    const boldPart = hasPrefix ? bullet.substring(0, colonIdx + 1) : null;
                    const bodyPart = hasPrefix
                      ? bullet.substring(colonIdx + 1).trim()
                      : bullet;
                    return (
                      <Bullet key={j} bold={boldPart}>
                        {bodyPart}
                      </Bullet>
                    );
                  })}
                </View>
              );
            })}
          </View>
        ) : null}

        {/* EDUCATION */}
        {education.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {education.map((edu, i) => {
              const degreeText = `${edu.degree || ""}${edu.field ? ` in ${edu.field}` : ""}`;
              return (
                <View key={i} style={{ marginTop: 5 }}>
                  <Text style={styles.entryTitle}>{degreeText}</Text>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 1 }}>
                    <Text style={styles.entryMeta}>{edu.institution}</Text>
                    <Text style={styles.entryMeta}>{edu.graduation_year || ""}</Text>
                  </View>
                  {edu.gpa ? (
                    <Bullet bold="GPA:">{edu.gpa}</Bullet>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}


        {/* PROJECTS */}
        {projects.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {projects.map((proj, i) => (
              <View key={i}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 5, marginBottom: 1 }}>
                  <Text style={{ ...styles.projTitle, marginBottom: 0 }}>{proj.name || ""}</Text>
                  <Text style={styles.projDateText}>{proj.date || ""}</Text>
                </View>
                {proj.description ? (
                  <Bullet>{proj.description}</Bullet>
                ) : null}
                {proj.technologies && proj.technologies.length > 0 ? (
                  <Bullet bold="Technologies:">
                    {proj.technologies.join(", ")}
                  </Bullet>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
            {certifications.map((cert, i) => {
              const bodyText = [
                cert.issuer,
                cert.date ? `(${cert.date})` : null,
              ]
                .filter(Boolean)
                .join(", ");
              return (
                <Bullet key={i} bold={cert.name ? `${cert.name}` : null}>
                  {bodyText}
                </Bullet>
              );
            })}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
