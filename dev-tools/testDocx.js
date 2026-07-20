import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";
import fs from "fs";

async function test() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            color: "000000",
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          new Paragraph({
            children: [new TextRun("Testing long text to see how wide it goes and what the margins actually look like. Testing long text to see how wide it goes and what the margins actually look like. Testing long text to see how wide it goes and what the margins actually look like. Testing long text to see how wide it goes and what the margins actually look like.")],
            border: {
                bottom: { color: "000000", space: 1, value: BorderStyle.SINGLE, size: 6 },
            }
          })
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync("test.docx", buffer);
  console.log("Written test.docx");
}

test();
