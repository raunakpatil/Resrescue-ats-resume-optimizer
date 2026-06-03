import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import font_playfair_400 from "../assets/fonts/playfairdisplay_400.ttf";
import font_lato_400 from "../assets/fonts/lato_400.ttf";
import font_lato_700 from "../assets/fonts/lato_700.ttf";

Font.register({
  family: "Playfair",
  fonts: [
    {
      src: font_playfair_400,
      fontWeight: 400,
    },
    {
      src: font_playfair_400,
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: "Lato",
  fonts: [
    {
      src: font_lato_400,
      fontWeight: 400,
    },
    {
      src: font_lato_400,
      fontWeight: 700,
    },
  ],
});

const CHARCOAL = "#1e2329";
const GOLD = "#d97706";
const DARK = "#1a1a1a";
const GRAY = "#555555";
const LIGHT = "#999999";
const GOLD_LIGHT = "#fef3c7";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Lato",
    fontSize: 9,
    color: DARK,
    backgroundColor: "#ffffff",
  },
  headerBand: {
    backgroundColor: CHARCOAL,
    padding: "32 48 24 48",
  },
  name: {
    fontFamily: "Playfair",
    fontSize: 30,
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  titleBadge: {
    backgroundColor: GOLD,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginBottom: 12,
    alignSelf: "flex-start",
    borderRadius: 2,
  },
  titleText: {
    fontSize: 10,
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  contactItem: {
    fontSize: 8.5,
    color: "rgba(255,255,255,0.7)",
    marginRight: 16,
  },
  content: {
    paddingBottom: 10,
    padding: "12 28 20 28",
  },
  sectionTitle: {
    fontFamily: "Playfair",
    fontSize: 12,
    fontWeight: 700,
    color: CHARCOAL,
    marginTop: 10,
    marginBottom: 2,
  },
  goldLine: {
    height: 2,
    backgroundColor: GOLD,
    marginBottom: 6,
    width: 40,
  },
  summary: {
    fontSize: 9.5,
    color: GRAY,
    lineHeight: 1.6,
  },
  expEntry: {
    marginBottom: 8,
  },
  expHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  expTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: DARK,
    flex: 1,
  },
  dateBadge: {
    backgroundColor: GOLD_LIGHT,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 3,
  },
  dateText: {
    fontSize: 8,
    color: GOLD,
    fontWeight: 700,
  },
  expCompany: {
    fontSize: 9.5,
    color: GOLD,
    fontWeight: 700,
    marginBottom: 4,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bulletDot: {
    fontSize: 9,
    color: GOLD,
    marginRight: 6,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 9,
    color: DARK,
    flex: 1,
    lineHeight: 1.45,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 4,
  },
  skillCat: {
    marginBottom: 6,
  },
  skillCatLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: CHARCOAL,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  skillItem: {
    fontSize: 8.5,
    color: GRAY,
  },
  eduDegree: {
    fontSize: 10.5,
    fontWeight: 700,
    color: DARK,
  },
  eduSchool: {
    fontSize: 9.5,
    color: GOLD,
    fontWeight: 700,
  },
  metaText: {
    fontSize: 8.5,
    color: LIGHT,
  },
  certEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
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
            <Text style={styles.skillItem}>{(cat.skills || []).join(", ")}</Text>
          </View>
        ))}
      </View>
    );
  }
  const groups = [
    { key: "technical", label: "Technical" },
    { key: "frameworks", label: "Frameworks" },
    { key: "tools", label: "Tools" },
  ];
  return (
    <View>
      {groups.map(({ key, label }) =>
        (skills[key]?.length > 0) ? (
          <View key={key} style={styles.skillCat}>
            <Text style={styles.skillCatLabel}>{label}</Text>
            <Text style={styles.skillItem}>{skills[key].join(", ")}</Text>
          </View>
        ) : null
      )}
    </View>
  );
}

export function TemplateExecutive({ resumeData }) {
  if (!resumeData) return null;
  const { contact = {}, summary, experience = [], skills, education = [], certifications = [] } = resumeData;
  const currentTitle = experience[0]?.title || "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Dark header band */}
        <View style={styles.headerBand}>
          <Text style={styles.name}>{contact.name || "Your Name"}</Text>
          {currentTitle && (
            <View style={styles.titleBadge}>
              <Text style={styles.titleText}>{currentTitle}</Text>
            </View>
          )}
          <View style={styles.contactRow}>
            {contact.email ? <Text style={styles.contactItem}>{contact.email}</Text> : null}
            {contact.phone ? <Text style={styles.contactItem}>{contact.phone}</Text> : null}
            {contact.location ? <Text style={styles.contactItem}>{contact.location}</Text> : null}
            {contact.linkedin ? <Text style={styles.contactItem}>{contact.linkedin}</Text> : null}
            {contact.github ? <Text style={styles.contactItem}>{contact.github}</Text> : null}
          </View>
        </View>

        <View style={styles.content}>
          {/* Summary */}
          {summary && (
            <View>
              <Text style={styles.sectionTitle}>Executive Profile</Text>
              <View style={styles.goldLine} />
              <Text style={styles.summary}>{summary}</Text>
            </View>
          )}

          {/* Skills */}
          {skills && (
            <View>
              <Text style={styles.sectionTitle}>Core Competencies</Text>
              <View style={styles.goldLine} />
              <SkillsSection skills={skills} />
            </View>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Professional Experience</Text>
              <View style={styles.goldLine} />
              {experience.map((exp, i) => (
                <View key={i} style={styles.expEntry}>
                  <View style={styles.expHeader}>
                    <Text style={styles.expTitle}>{exp.title}</Text>
                    <View style={styles.dateBadge}>
                      <Text style={styles.dateText}>
                        {exp.start_date} – {exp.end_date || "Present"}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.expCompany}>
                    {exp.company}{exp.location ? `  |  ${exp.location}` : ""}
                  </Text>
                  {(exp.bullets || []).map((bullet, j) => (
                    <View key={j} style={styles.bullet}>
                      <Text style={styles.bulletDot}>◆</Text>
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
              <View style={styles.goldLine} />
              {education.map((edu, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={styles.eduDegree}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </Text>
                  <Text style={styles.eduSchool}>
                    {edu.institution}{edu.graduation_year ? ` | ${edu.graduation_year}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Certifications</Text>
              <View style={styles.goldLine} />
              {certifications.map((cert, i) => (
                <View key={i} style={styles.certEntry}>
                  <View>
                    <Text style={{ fontSize: 9.5, fontWeight: 700, color: DARK }}>{cert.name}</Text>
                    <Text style={styles.metaText}>{cert.issuer}</Text>
                  </View>
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
