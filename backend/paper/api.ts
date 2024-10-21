import express from "express";
import { PaperCarbonOffsetCalculator } from "./calculator";
import { ProjectData, PrintParameters, Document } from "./types";

// In-memory storage for documents and print parameters (For demonstration purposes)
const documentsStore: Record<string, ProjectData> = {};

// Blockchain configuration
const providerUrl = "https://sepolia.base.org"; // Blockchain provider URL
const contractAddress = "0xC3e5c198b7E7599ec171eBB85a6a05d6B947AFaD"; // CCToken contract address
const signerPrivateKey = process.env.PRIVATE_KEY!; // minter address private key

const app = express();
app.use(express.json());

// Endpoint to add a document to the system
app.post("/document", (req, res): any => {
  try {
    const {
      document,
      printParameters,
    }: { document: Document; printParameters: PrintParameters } = req.body;

    const projectData: ProjectData = {
      document,
      printParameters,
      alternativeScenarioEmissions: 0.05, // Example scenario emissions for postal delivery
      recentTransactions: [],
    };

    // Store the project data
    documentsStore[document.id] = projectData;

    return res
      .status(201)
      .send({ message: "Document added successfully", document });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

// Endpoint to generate carbon offsets and mint tokens
app.post("/offsets/:documentId", async (req, res: any) => {
  try {
    const { documentId } = req.params;
    const { pagesSaved, userAddress } = req.body;
    // Retrieve the document and print parameters from the in-memory store
    const projectData = documentsStore[documentId];
    if (!projectData) {
      return res
        .status(404)
        .send({ error: `Document with ID ${documentId} not found` });
    }

    // Create a calculator for the paper-based document
    const calculator = new PaperCarbonOffsetCalculator(
      projectData,
      providerUrl,
      contractAddress,
      signerPrivateKey
    );

    // Generate offsets and mint tokens for the user's address
    await calculator.generateOffset(documentId, pagesSaved, userAddress);

    return res
      .status(200)
      .send({ message: "Offsets generated and tokens minted successfully" });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
});

// Endpoint to retrieve a report for a specific document
app.get("/report/:documentId", (req, res: any) => {
  const { documentId } = req.params;

  try {
    const projectData = documentsStore[documentId];
    if (!projectData) {
      return res
        .status(404)
        .send({ error: `Document with ID ${documentId} not found` });
    }

    const report = {
      documentId: projectData.document.id,
      pagesSaved: projectData.document.pages,
      fileSize: `${projectData.document.fileSizeMb} MB`,
      alternativeScenarioEmissions: `${projectData.alternativeScenarioEmissions} kgCO2e`,
      printParameters: projectData.printParameters,
    };

    return res.status(200).send({ report });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
});

// Endpoint to generate a system-wide report
app.get("/system-report", (req, res): any => {
  try {
    const systemReport = Object.keys(documentsStore).map((docId) => {
      const projectData = documentsStore[docId];
      return {
        documentId: projectData.document.id,
        pagesSaved: projectData.document.pages,
        alternativeScenarioEmissions: `${projectData.alternativeScenarioEmissions} kgCO2e`,
      };
    });

    return res.status(200).send({ report: systemReport });
  } catch (error: any) {
    return res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
