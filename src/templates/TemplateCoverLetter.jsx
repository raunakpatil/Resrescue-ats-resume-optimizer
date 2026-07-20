import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register fonts if not already registered globally
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-bold.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: "50px",
    fontFamily: "Open Sans",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#222222",
  },
  paragraph: {
    marginBottom: 12,
  }
});

const TemplateCoverLetter = ({ text }) => {
  if (!text) return null;
  // split text by double newline to create paragraphs
  const paragraphs = text.split('\n').filter(p => p.trim() !== '');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {paragraphs.map((para, i) => (
          <Text key={i} style={styles.paragraph}>{para}</Text>
        ))}
      </Page>
    </Document>
  );
};

export default TemplateCoverLetter;
