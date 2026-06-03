import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import font_nunito_400 from "../assets/fonts/nunito_400.ttf";

Font.register({
  family: "Nunito",
  fonts: [
    {
      src: font_nunito_400,
      fontWeight: 400,
    },
    {
      src: font_nunito_400,
      fontWeight: 600,
    },
    {
      src: font_nunito_400,
      fontWeight: 700,
    },
  ],
});

const PLUM = "#7c3aed";
const PLUM_LIGHT = "#ede9fe";
const WARM_BG = "#fefdf8";
const DARK = "#1c1917";
const GRAY = "#57534e";
const LIGHT = "#a8a29e";
const BORDER = "#e7e5e4";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Nunito",
    fontSize: 9,
    color: DARK,
    backgroundColor: WARM_BG,
    padding: 0,
  },
  headerArea: {
    backgroundColor: WARM_BG,
    padding: "24 36 16 36",
    borderBottomWidth: 2,
    borderBottomColor: PLUM,
    borderBottomStyle: "solid",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: DARK,
    letterSpacing: -0.5,
    flex: 1,
  },
  accentDot: {
    width: 8,
    height: 8,
    backgroundColor: PLUM,
    borderRadius: 4,
    marginBottom: 5,
    marginLeft: 4,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: PLUM,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  contactItem: {
    fontSize: 8,
    color: GRAY,
    marginRight: 12,
  },
  content: {
    paddingBottom: 10,
    padding: "12 36 24 36",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 6,
  },
  sectionDot: {
    width: 6,
    height: 6,
    backgroundColor: PLUM,
    borderRadius: 3,
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: DARK,
    letterSpacing: 0.3,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
    marginLeft: 8,
  },
  summary: {
    fontSize: 9,
    color: GRAY,
    lineHeight: 1.5,
  },
  expEntry: {
    marginBottom: 8,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  expTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: DARK,
    flex: 1,
  },
  datePill: {
    backgroundColor: PLUM_LIGHT,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  datePillText: {
    fontSize: 7.5,
    color: PLUM,
    fontWeight: 600,
  },
  expCompany: {
    fontSize: 9.5,
    color: PLUM,
    fontWeight: 600,
    marginBottom: 5,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletDot: {
    fontSize: 11,
    color: PLUM,
    marginRight: 5,
    lineHeight: 1.2,
  },
  bulletText: {
    fontSize: 9,
    color: DARK,
    flex: 1,
    lineHeight: 1.5,
  },
  skillCat: {
    marginBottom: 7,
  },
  skillCatLabel: {
    fontSize: 8.5,
    fontWeight: 700,
    color: GRAY,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  skillChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillChip: {
    backgroundColor: PLUM_LIGHT,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 5,
    marginBottom: 5,
  },
  skillChipText: {
    fontSize: 8,
    color: PLUM,
    fontWeight: 600,
  },
  eduEntry: {
    marginBottom: 8,
  },
  eduDegree: {
    fontSize: 10.5,
    fontWeight: 700,
    color: DARK,
  },
  eduSchool: {
    fontSize: 9.5,
    color: PLUM,
    fontWeight: 600,
  },
  metaText: {
    fontSize: 8.5,
    color: LIGHT,
  },
  certEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    alignItems: "center",
  },
});

function SkillsSection({ skills }) {
  if (!skills) return null;
  const cats = Array.isArray(skills) ? skills : skills.categories || [];
  if (cats.length > 0) {
    return (
      <View>
        {cats.map((cat, i) => (
          <View key={i} style={styles.skillCat}>
            <Text style={styles.skillCatLabel}>{cat.name}</Text>
            <View style={styles.skillChipRow}>
              {(cat.skills || []).map((s, j) => (
                <View key={j} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  }
  const groups = [
    { key: "technical", label: "Technical Skills" },
    { key: "frameworks", label: "Frameworks" },
    { key: "tools", label: "Tools & Platforms" },
  ];
  return (
    <View>
      {groups.map(({ key, label }) =>
        (skills[key]?.length > 0) ? (
          <View key={key} style={styles.skillCat}>
            <Text style={styles.skillCatLabel}>{label}</Text>
            <View style={styles.skillChipRow}>
              {skills[key].map((s, j) => (
                <View key={j} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null
      )}
    </View>
  );
}

export function TemplateCreative({ resumeData }) {
  if (!resumeData) return null;
  const { contact = {}, summary, experience = [], skills, education = [], certifications = [], projects = [] } = resumeData;
  const currentTitle = experience[0]?.title || "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerArea}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{contact.name || "Your Name"}</Text>
            <View style={styles.accentDot} />
          </View>
          {currentTitle && <Text style={styles.jobTitle}>{currentTitle}</Text>}
          <View style={styles.contactRow}>
            {contact.email ? <Text style={styles.contactItem}>{contact.email}</Text> : null}
            {contact.phone ? <Text style={styles.contactItem}>{contact.phone}</Text> : null}
            {contact.location ? <Text style={styles.contactItem}>{contact.location}</Text> : null}
            {contact.linkedin ? <Text style={styles.contactItem}>{contact.linkedin}</Text> : null}
            {contact.github ? <Text style={styles.contactItem}>{contact.github}</Text> : null}
            {contact.portfolio ? <Text style={styles.contactItem}>{contact.portfolio}</Text> : null}
          </View>
        </View>

        <View style={styles.content}>
          {/* Summary */}
          {summary && (
            <View>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <View style={styles.sectionLine} />
              </View>
              <Text style={styles.summary}>{summary}</Text>
            </View>
          )}

          {/* Skills */}
          {skills && (
            <View>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Skills & Expertise</Text>
                <View style={styles.sectionLine} />
              </View>
              <SkillsSection skills={skills} />
            </View>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                <View style={styles.sectionLine} />
              </View>
              {experience.map((exp, i) => (
                <View key={i} style={styles.expEntry}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expTitle}>{exp.title}</Text>
                    <View style={styles.datePill}>
                      <Text style={styles.datePillText}>
                        {exp.start_date} – {exp.end_date || "Present"}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.expCompany}>
                    {exp.company}{exp.location ? `  ·  ${exp.location}` : ""}
                  </Text>
                  {(exp.bullets || []).map((bullet, j) => (
                    <View key={j} style={styles.bullet}>
                      <Text style={styles.bulletDot}>·</Text>
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
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Education</Text>
                <View style={styles.sectionLine} />
              </View>
              {education.map((edu, i) => (
                <View key={i} style={styles.eduEntry}>
                  <Text style={styles.eduDegree}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </Text>
                  <Text style={styles.eduSchool}>
                    {edu.institution}{edu.graduation_year ? ` | ${edu.graduation_year}` : ""}
                  </Text>
                  {edu.gpa ? <Text style={styles.metaText}>GPA: {edu.gpa}</Text> : null}
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Certifications</Text>
                <View style={styles.sectionLine} />
              </View>
              {certifications.map((cert, i) => (
                <View key={i} style={styles.certEntry}>
                  <View>
                    <Text style={{ fontSize: 9.5, fontWeight: 700, color: DARK }}>{cert.name}</Text>
                    <Text style={styles.metaText}>{cert.issuer}</Text>
                  </View>
                  <View style={styles.datePill}>
                    <Text style={styles.datePillText}>{cert.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Projects</Text>
                <View style={styles.sectionLine} />
              </View>
              {projects.map((proj, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 10, fontWeight: 700, color: DARK }}>{proj.name}</Text>
                  {proj.description && <Text style={{ fontSize: 9, color: DARK, lineHeight: 1.5, marginTop: 2, marginBottom: 3 }}>{proj.description}</Text>}
                  {proj.technologies?.length > 0 && (
                    <View style={styles.skillChipRow}>
                      {proj.technologies.map((t, j) => (
                        <View key={j} style={styles.skillChip}>
                          <Text style={styles.skillChipText}>{t}</Text>
                        </View>
                      ))}
                    </View>
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
