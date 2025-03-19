# 🩸 Whole Slide Image Viewer

## 📌 Project Overview
This project is a **Whole Slide Image (WSI) Viewer** built with **React** and **OpenSeadragon**. It loads a **blood smear image**, displays it with zooming/panning functionality, and overlays **bounding boxes** around detected **RBCs, WBCs, and Platelets** from `output.json`. The left panel shows metadata and cell counts, while the top displays the **current date and time**.

## 🚀 Features
✅ Load Whole Slide Images using **OpenSeadragon**  
✅ Display **bounding boxes** around detected cells  
✅ Show **RBC, WBC, and Platelet counts**  
✅ Live **Date & Time** on top  
✅ Display **Patient ID, Sample Type, Report Date, Status, Worker ID**  
✅ Fetch **detection results** from `output.json` dynamically  

---

## 🏗️ Project Setup

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/shubhampagar24/WSI-Viewer.git
cd WSI-Viewer
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Run the Project**
```sh
npm start
```
Now open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 File Structure
```
/WSI-Viewer
│── /src
│   ├── /components
│   │   ├── WSIViewer.jsx  ✅ (Main Component)
│   │   ├── styles.css ✅ (CSS for styling)
│   ├── /assets
│   │   ├── output.json ✅ (Detection results file)
│   │   ├── 7_20241209_024613.png ✅ (Blood smear image)
│   ├── App.js ✅ (Main App file)
│   ├── index.js ✅ (Entry point)
│── /public
│   ├── output.json ✅ (Can also be placed here if needed)
│   ├── 7_20241209_024613.png ✅ (Can also be placed here)
│── package.json
│── README.md ✅ (You're reading it now!)
```

---

## 📜 **How It Works?**
1. **Loads the WSI Image** using OpenSeadragon
2. **Fetches `output.json`** for cell detection results
3. **Draws Bounding Boxes** around detected RBC, WBC, and Platelets
4. **Displays Patient & Sample Details** in the left panel
5. **Updates Current Date & Time** dynamically every second

---

## 🔥 Technologies Used
- **React.js** - Frontend framework
- **OpenSeadragon** - Image viewer for whole slide images
- **JavaScript (ES6+), HTML, CSS** - Core web technologies
- **JSON** - Input data format for detection results

---

## 📁 Example `output.json` File
```json
{
  "id": 19,
  "patient_id": "7",
  "sample_type": "blood",
  "date": "2024-12-09",
  "status": "completed",
  "workerId": "1234",
  "inference_results": {
    "output": {
      "detection_results": [
        [121, 4, 163, 45, "Circular_RBC"],
        [396, 312, 433, 353, "WBC"],
        [388, 90, 428, 130, "Platelet"]
      ]
    }
  }
}
```

---

## 🛠️ **Customization**
🔹 Modify **styles.css** to change the UI design  
🔹 Adjust bounding box colors in **WSIViewer.jsx**  
🔹 Add more data fields from `output.json` if needed

---

## 🤝 Contributing
Pull requests are welcome! Feel free to fork and enhance the project.

---

## 📜 License
This project is **open-source** under the MIT License.

🚀 **Happy Coding!** 🩸

