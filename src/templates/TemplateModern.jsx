import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import font_dmsans_400 from "../assets/fonts/dmsans_400.ttf";

Font.register({
  family: "DMSans",
  fonts: [
    {
      src: font_dmsans_400,
      fontWeight: 400,
    },
    {
      src: font_dmsans_400,
      fontWeight: 500,
    },
    {
      src: font_dmsans_400,
      fontWeight: 700,
    },
  ],
});

const BLUE = "#2563eb";
const DARK = "#111827";
const GRAY = "#4b5563";
const LIGHT = "#9ca3af";
const ACCENT_BG = "#eff6ff";

const styles = StyleSheet.create({
  page: {
    fontFamily: "DMSans",
    fontSize: 9,
    color: DARK,
    backgroundColor: "#ffffff",
    flexDirection: "row",
  },
  accentBar: {
    width: 5,
    backgroundColor: BLUE,
  },
  content: {
    paddingBottom: 10,
    flex: 1,
    padding: "20 26",
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: DARK,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 500,
    color: BLUE,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },
  contactItem: {
    fontSize: 8.5,
    color: GRAY,
    marginRight: 16,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: BLUE,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 10,
    marginBottom: 6,
  },
  summary: {
    fontSize: 9.5,
    color: GRAY,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  expEntry: {
    marginBottom: 6,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  expTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: DARK,
  },
  expDate: {
    fontSize: 8.5,
    color: LIGHT,
    backgroundColor: ACCENT_BG,
    padding: "2 6",
    borderRadius: 4,
  },
  expCompany: {
    fontSize: 9,
    color: BLUE,
    fontWeight: 500,
    marginBottom: 4,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bulletDot: {
    fontSize: 9,
    color: BLUE,
    marginRight: 6,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 9,
    color: DARK,
    flex: 1,
    lineHeight: 1.45,
  },
  skillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginBottom: 6,
  },
  skillCategoryLabel: {
    fontSize: 8.5,
    fontWeight: 700,
    color: GRAY,
    marginBottom: 3,
  },
  skillChip: {
    fontSize: 8,
    backgroundColor: ACCENT_BG,
    color: BLUE,
    padding: "2 7",
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 3,
  },
  eduEntry: {
    marginBottom: 6,
  },
  eduDegree: {
    fontSize: 10,
    fontWeight: 700,
    color: DARK,
  },
  eduSchool: {
    fontSize: 9,
    color: BLUE,
  },
  certEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  certName: {
    fontSize: 9.5,
    fontWeight: 700,
    color: DARK,
  },
  certSub: {
    fontSize: 8.5,
    color: GRAY,
  },
});

function SkillsSection({ skills }) {
  if (!skills) return null;
  const cats = Array.isArray(skills) ? skills : skills.categories || [];
  
  if (cats.length > 0) {
    return (
      <View>
        {cats.map((cat, i) => (
          <View key={i}>
            <Text style={styles.skillCategoryLabel}>{cat.name}</Text>
            <View style={styles.skillRow}>
              <Text style={styles.skillList}>{(cat.skills || []).join(", ")}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  }
  return (
    <View>
      {cats.map((cat, i) => (
        <View key={i}>
          <Text style={styles.skillCategoryLabel}>{cat.name}</Text>
          <View style={styles.skillRow}>
            {(cat.skills || []).map((s, j) => (
              <Text key={j} style={styles.skillChip}>{s}</Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

export function TemplateModern({ resumeData }) {
  if (!resumeData) return null;
  const { contact = {}, summary, experience = [], skills, education = [], certifications = [], projects = [] } = resumeData;
  const currentTitle = experience[0]?.title || "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />
        <View style={styles.content}>
          {/* Header */}
          <Text style={styles.name}>{contact.name || "Your Name"}</Text>
          {currentTitle && <Text style={styles.jobTitle}>{currentTitle}</Text>}
          <View style={styles.contactRow}>
            {contact.email ? <Text style={styles.contactItem}>{contact.email}</Text> : null}
            {contact.phone ? <Text style={styles.contactItem}>{contact.phone}</Text> : null}
            {contact.location ? <Text style={styles.contactItem}>{contact.location}</Text> : null}
            {contact.linkedin ? <Text style={styles.contactItem}>{contact.linkedin}</Text> : null}
            {contact.github ? <Text style={styles.contactItem}>{contact.github}</Text> : null}
          </View>

          {/* Summary */}
          {summary && (
            <View>
              <Text style={styles.sectionTitle}>Profile</Text>
              <Text style={styles.summary}>{summary}</Text>
            </View>
          )}

          {/* Skills */}
          {skills && (
            <View>
              <Text style={styles.sectionTitle}>Technical Skills</Text>
              <SkillsSection skills={skills} />
            </View>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Professional Experience</Text>
              {experience.map((exp, i) => (
                <View key={i} style={styles.expEntry}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expTitle}>{exp.title}</Text>
                    <Text style={styles.expDate}>
                      {exp.start_date} – {exp.end_date || "Present"}
                    </Text>
                  </View>
                  <Text style={styles.expCompany}>
                    {exp.company}{exp.location ? ` · ${exp.location}` : ""}
                  </Text>
                  {(exp.bullets || []).map((bullet, j) => (
                    <View key={j} style={styles.bullet}>
                      <Text style={styles.bulletDot}>▸</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu, i) => (
                <View key={i} style={styles.eduEntry}>
                  <Text style={styles.eduDegree}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </Text>
                  <Text style={styles.eduSchool}>
                    {edu.institution}{edu.graduation_year ? ` | ${edu.graduation_year}` : ""}
                  </Text>
                  {edu.gpa ? <Text style={styles.certSub}>GPA: {edu.gpa}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {certifications.map((cert, i) => (
                <View key={i} style={styles.certEntry}>
                  <View>
                    <Text style={styles.certName}>{cert.name}</Text>
                    <Text style={styles.certSub}>{cert.issuer}</Text>
                  </View>
                  <Text style={styles.certSub}>{cert.date}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Projects</Text>
              {projects.map((proj, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={styles.expTitle}>{proj.name}</Text>
                  {proj.description && <Text style={{ fontSize: 9, color: DARK, lineHeight: 1.45, marginTop: 2, marginBottom: 3 }}>{proj.description}</Text>}
                  {proj.technologies?.length > 0 && (
                    <Text style={styles.certSub}>{proj.technologies.join(", ")}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
