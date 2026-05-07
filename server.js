import express from "express";
import fs from "fs";
import { exec } from "child_process";
import crypto from "crypto";

const app = express();
app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.send("Pandoc API is running");
});

app.post("/convert/docx", (req, res) => {
  const markdown = req.body.markdown;

  if (!markdown) {
    return res.status(400).send("Missing markdown");
  }

  const id = crypto.randomUUID();
  const inputFile = `${id}.md`;
  const outputFile = `${id}.docx`;

  fs.writeFileSync(inputFile, markdown);

  exec(`pandoc ${inputFile} -o ${outputFile}`, (err) => {
    if (err) {
      return res.status(500).send(err.message);
    }

    const file = fs.readFileSync(outputFile);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    res.send(file);

    fs.unlinkSync(inputFile);
    // fs.unlinkSync(outputFile);
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});

