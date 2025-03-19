import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import "./styles.css";

const WSIViewer = () => {
  const viewerRef = useRef(null);
  const hubViewerRef = useRef(null);
  const [viewer, setViewer] = useState(null);
  const [hubViewer, setHubViewer] = useState(null);
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [patientInfo, setPatientInfo] = useState({ id: "N/A", sample_type: "N/A",date: "N/A" , status: "N/A"});
  const [cellCounts, setCellCounts] = useState({ RBC: 0, WBC: 0, Platelet: 0});
  const [workerInfo,setWorkerInfo]=useState({workerId:"N/A"});
  const [currentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentDateTime(new Date().toLocaleString());
  }, 1000); // Updates every second

  return () => clearInterval(interval); // Cleanup on unmount
}, []);



  useEffect(() => {
    fetch("/output.json")
    .then((response) => response.json())
    .then((data) => {
      console.log("📥 Fetched JSON Data:", data);
  
      let inferenceResults = data.inference_results;
  
      let fixedString=""
      // 🛠 Fix JSON-like string before parsing
      if (typeof inferenceResults === "string") {
        try {
          let fixedString = inferenceResults
            .replace(/'/g, '"') // ✅ Convert all single quotes to double quotes
            .replace(/,\s*}/g, "}") // ✅ Remove trailing commas before closing braces
            .replace(/,\s*]/g, "]") // ✅ Remove trailing commas before closing brackets
            .replace(/(\w+):/g, '"$1":') // ✅ Ensure property names are double-quoted
            .trim(); // ✅ Remove extra spaces
  
          console.log("🔧 Fixed JSON String Before Parsing:", fixedString.substring(0, 500), "..."); // Print first 500 chars
  
          // 🔴 Validate if the JSON structure is correct BEFORE parsing
          if (!fixedString.startsWith("{") || !fixedString.endsWith("}")) {
            throw new Error("Invalid JSON structure: Does not start or end with { }");
          }
  
          // ✅ Now parse the cleaned string into JSON
          inferenceResults = JSON.parse(fixedString);
        } catch (error) {
          console.error("❌ JSON Parsing Error: The JSON format is still invalid.");
          console.error("🚨 Invalid JSON Sample:", fixedString.substring(0, 500), "...");
          return;
        }
      }
  
      console.log("✅ Parsed Inference Results:", inferenceResults);
  
      // Extract detection_results safely
      const detectionResults = inferenceResults?.output?.detection_results || [];
      console.log("✅ Final Detection Results:", detectionResults);

      // **********************

      setBoundingBoxes(
        detectionResults.map((box) => ({
          x: box[0],
          y: box[1],
          width: box[2] - box[0],
          height: box[3] - box[1],
          type: box[4],
        }))
      );

    
      setPatientInfo({
        id: data.patient_id || "N/A",
        sample_type: data.sample_type || "N/A",
        date:data.date || "N/A",
        status : data.status || "N/A"
      });

      setWorkerInfo({
          workerId: data.workerId || "N/A"
        });
  
      setCellCounts({
        RBC: detectionResults.filter((box) => box[4] === "Circular_RBC").length,
        WBC: detectionResults.filter((box) => box[4] === "WBC").length,
        Platelet: detectionResults.filter((box) => box[4] === "Platelet").length
      });
    })
    .catch((error) => console.error("❌ Error loading output.json:", error));
  
  

    // Initialize OpenSeadragon viewer
    const osdViewer = OpenSeadragon({
      id: "openseadragon-viewer",
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      tileSources: {

        type: "image",
        url: "/7_20241209_024613.png",
       
      },
      
      showNavigator: true,
      navigatorPosition: "BOTTOM_RIGHT",
    });
    setViewer(osdViewer);

    console.log("🖼 OpenSeadragon Image Loaded:", osdViewer.world.getItemCount());


    const osdHubViewer = OpenSeadragon({
      id: "hub-viewer",
      prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
      tileSources: {
        type: "image",
        url: "/7_20241209_024613.png",
      },
      showNavigator: false,
    });
    setHubViewer(osdHubViewer);

    return () => {
      osdViewer.destroy();
      osdHubViewer.destroy();
    };
  }, []);

  useEffect(() => {
    if (viewer && boundingBoxes.length > 0) {
      viewer.clearOverlays(); // Clear old boxes before redrawing

      // Ensure the image is loaded before overlaying bounding boxes
      const tiledImage = viewer.world.getItemAt(0);
      if (!tiledImage) return;

      const imgWidth = tiledImage.getContentSize().x;
      const imgHeight = tiledImage.getContentSize().y;

      boundingBoxes.forEach((box) => {
        const overlay = document.createElement("div");
        overlay.className = "bounding-box";
        overlay.style.border = `2px solid ${box.type === "Circular_RBC" ? "blue" : "green"}`;
        overlay.style.position = "absolute";
        overlay.style.pointerEvents = "none";

        // Convert pixel coordinates to OpenSeadragon viewport coordinates
        const rect = new OpenSeadragon.Rect(
          box.x / imgWidth,
          box.y / imgHeight,
          box.width / imgWidth,
          box.height / imgHeight
        );

        viewer.addOverlay(overlay, rect);
      });
    }
  }, [viewer, boundingBoxes]);

  return (
    <div>
      <div className="title"><h3>Whole Slide Image Viewer</h3></div>
      <div className="current-datetime">
  <h2>{currentDateTime}</h2>
</div>
    <div className="wsi-container">

      <div className="left-panel">
        <h3>Findings</h3>
        <p><strong>Patient Id: </strong>{patientInfo.id}</p>
        <p><strong>Worker Id: </strong>{workerInfo.workerId}</p>
        <p><strong>Sample Type: </strong> {patientInfo.sample_type}</p> 
        <p><strong>RBC Count: </strong> {cellCounts.RBC}</p>
        <p><strong>WBC Count: </strong> {cellCounts.WBC}</p>
        <p><strong>Platelet Count: </strong> {cellCounts.Platelet}</p>
        <p><strong>Reported Date: </strong>{patientInfo.date}</p>
        <p><strong>Status: </strong>{patientInfo.status}</p>
        
      </div>
      <div id="openseadragon-viewer" ref={viewerRef}></div>
      <div className="top-right-panel">
        <div id="hub-viewer" ref={hubViewerRef}></div>
        <div className="patient-info">
          <p><strong>Patient ID:</strong> {patientInfo.id},  <strong>Sample Type:</strong> {patientInfo.sample_type}</p>
          {/* <p><strong>Sample Type:</strong> {patientInfo.sample_type}</p> */}
        </div>
      </div>
    </div>
    </div>
  );
};

export default WSIViewer;
