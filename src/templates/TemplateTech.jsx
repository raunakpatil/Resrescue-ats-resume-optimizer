import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import font_jetbrains_400 from "../assets/fonts/jetbrainsmono_400.ttf";
import font_inter_400 from "../assets/fonts/inter_400.ttf";

Font.register({
  family: "JetBrainsMono",
  fonts: [
    {
      src: font_jetbrains_400,
      fontWeight: 400,
    },
    {
      src: font_jetbrains_400,
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: "Inter",
  fonts: [
    {
      src: font_inter_400,
      fontWeight: 400,
    },
    {
      src: font_inter_400,
      fontWeight: 700,
    },
  ],
});

const DARK_BG = "#0f172a";
const GREEN = "#22c55e";
const DARK = "#1e293b";
const GRAY = "#64748b";
const LIGHT_GRAY = "#94a3b8";
const WHITE = "#f8fafc";
const GREEN_DIM = "#dcfce7";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9,
    color: DARK,
    backgroundColor: WHITE,
  },
  headerBand: {
    backgroundColor: DARK_BG,
    padding: "24 40 20 40",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    maxWidth: 200,
  },
  name: {
    fontFamily: "JetBrainsMono",
    fontSize: 22,
    fontWeight: 700,
    color: WHITE,
    marginBottom: 2,
  },
  nameCaret: {
    color: GREEN,
  },
  currentTitle: {
    fontFamily: "JetBrainsMono",
    fontSize: 9,
    color: GREEN,
    marginBottom: 10,
  },
  contactItem: {
    fontSize: 8,
    color: "rgba(248,250,252,0.6)",
    marginBottom: 2,
    fontFamily: "JetBrainsMono",
  },
  skillChipsTitle: {
    fontSize: 7,
    color: GREEN,
    fontFamily: "JetBrainsMono",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  chip: {
    backgroundColor: "rgba(34,197,94,0.15)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginBottom: 3,
    marginRight: 3,
  },
  chipText: {
    fontFamily: "JetBrainsMono",
    fontSize: 7.5,
    color: GREEN,
  },
  content: {
    paddingBottom: 10,
    padding: "12 24 24 24",
  },
  sectionTitle: {
    fontFamily: "JetBrainsMono",
    fontSize: 8,
    fontWeight: 700,
    color: GREEN,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
    marginLeft: 8,
  },
  summary: {
    fontSize: 9,
    color: GRAY,
    lineHeight: 1.5,
  },
  expEntry: {
    marginBottom: 7,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  expTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: DARK,
  },
  expDate: {
    fontFamily: "JetBrainsMono",
    fontSize: 7.5,
    color: LIGHT_GRAY,
    backgroundColor: "#f1f5f9",
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 3,
  },
  expCompany: {
    fontSize: 8.5,
    color: GREEN,
    fontWeight: 700,
    marginBottom: 3,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 1,
  },
  bulletPrefix: {
    fontFamily: "JetBrainsMono",
    fontSize: 7.5,
    color: GREEN,
    marginRight: 4,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 8.5,
    color: DARK,
    flex: 1,
    lineHeight: 1.4,
  },
  catSection: {
    marginBottom: 5,
  },
  catLabel: {
    fontFamily: "JetBrainsMono",
    fontSize: 7,
    color: LIGHT_GRAY,
    marginBottom: 2,
  },
  skillsChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillChip: {
    backgroundColor: "#f1f5f9",
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: 3,
    marginRight: 3,
    marginBottom: 2,
  },
  skillChipText: {
    fontFamily: "JetBrainsMono",
    fontSize: 7.5,
    color: DARK,
  },
  eduDegree: {
    fontSize: 10,
    fontWeight: 700,
    color: DARK,
  },
  eduSchool: {
    fontSize: 9,
    color: GREEN,
  },
  metaText: {
    fontSize: 8.5,
    color: LIGHT_GRAY,
    fontFamily: "JetBrainsMono",
  },
});

function HeaderSkills({ skills }) {
  if (!skills) return null;
  const cats = Array.isArray(skills) ? skills : skills.categories || [];
  const topSkills = cats.length > 0
    ? cats[0]?.skills?.slice(0, 8) || []
    : (skills.technical || []).slice(0, 8);

  return (
    <View>
      <Text style={styles.skillChipsTitle}>// top skills</Text>
      <View style={styles.chipRow}>
        {topSkills.map((s, i) => (
          <View key={i} style={styles.chip}>
            <Text style={styles.chipText}>{s}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function FullSkillsSection({ skills }) {
  if (!skills) return null;
  const cats = Array.isArray(skills) ? skills : skills.categories || [];
  if (cats.length > 0) {
    return (
      <View>
        {cats.map((cat, i) => (
          <View key={i} style={styles.catSection}>
            <Text style={styles.catLabel}>// {cat.name.toLowerCase()}</Text>
            <View style={styles.skillsChipRow}>
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
    { key: "technical", label: "languages & tech" },
    { key: "frameworks", label: "frameworks" },
    { key: "tools", label: "tools & platforms" },
  ];
  return (
    <View>
      {groups.map(({ key, label }) =>
        (skills[key]?.length > 0) ? (
          <View key={key} style={styles.catSection}>
            <Text style={styles.catLabel}>// {label}</Text>
            <View style={styles.skillsChipRow}>
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

export function TemplateTech({ resumeData }) {
  if (!resumeData) return null;
  const { contact = {}, summary, experience = [], skills, education = [], certifications = [], projects = [] } = resumeData;
  const currentTitle = experience[0]?.title || "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Two-column dark header */}
        <View style={styles.headerBand}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>
              <Text style={styles.nameCaret}>{">"} </Text>
              {contact.name || "Your Name"}
            </Text>
            {currentTitle && (
              <Text style={styles.currentTitle}>// {currentTitle.toLowerCase()}</Text>
            )}
            {contact.email ? <Text style={styles.contactItem}>✉ {contact.email}</Text> : null}
            {contact.phone ? <Text style={styles.contactItem}>☎ {contact.phone}</Text> : null}
            {contact.location ? <Text style={styles.contactItem}>⌖ {contact.location}</Text> : null}
            {contact.linkedin ? <Text style={styles.contactItem}>⊞ {contact.linkedin}</Text> : null}
            {contact.github ? <Text style={styles.contactItem}>⎇ {contact.github}</Text> : null}
          </View>
          <View style={styles.headerRight}>
            <HeaderSkills skills={skills} />
          </View>
        </View>

        <View style={styles.content}>
          {/* Summary */}
          {summary && (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>// about</Text>
                <View style={styles.sectionLine} />
              </View>
              <Text style={styles.summary}>{summary}</Text>
            </View>
          )}

          {/* Full Skills */}
          {skills && (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, marginTop: 14 }}>
                <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>// skills</Text>
                <View style={styles.sectionLine} />
              </View>
              <FullSkillsSection skills={skills} />
            </View>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, marginTop: 14 }}>
                <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>// experience</Text>
                <View style={styles.sectionLine} />
              </View>
              {experience.map((exp, i) => (
                <View key={i} style={styles.expEntry}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expTitle}>{exp.title}</Text>
                    <Text style={styles.expDate}>
                      {exp.start_date} — {exp.end_date || "present"}
                    </Text>
                  </View>
                  <Text style={styles.expCompany}>
                    {exp.company}{exp.location ? ` @ ${exp.location}` : ""}
                  </Text>
                  {(exp.bullets || []).map((bullet, j) => (
                    <View key={j} style={styles.bullet}>
                      <Text style={styles.bulletPrefix}>›</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, marginTop: 14 }}>
                <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>// projects</Text>
                <View style={styles.sectionLine} />
              </View>
              {projects.map((proj, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={styles.expTitle}>{proj.name}</Text>
                  {proj.description && <Text style={{ fontSize: 9, color: DARK, lineHeight: 1.45, marginTop: 2, marginBottom: 3 }}>{proj.description}</Text>}
                  {proj.technologies?.length > 0 && (
                    <View style={styles.skillsChipRow}>
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

          {/* Education */}
          {education.length > 0 && (
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, marginTop: 14 }}>
                <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>// education</Text>
                <View style={styles.sectionLine} />
              </View>
              {education.map((edu, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
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
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, marginTop: 14 }}>
                <Text style={[styles.sectionTitle, { marginTop: 0, marginBottom: 0 }]}>// certifications</Text>
                <View style={styles.sectionLine} />
              </View>
              {certifications.map((cert, i) => (
                <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                  <Text style={[styles.expTitle, { fontSize: 9 }]}>{cert.name}</Text>
                  <Text style={styles.metaText}>{cert.date}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
