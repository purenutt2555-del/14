© Since 2021 nmc-costa. All Rights Reserved. simplifyhit™ is a trademark of nmc-costa.

<p align="center">
  <img src="https://github.com/nmc-costa/HITeval/blob/main/hiteval_logo.svg" width="250">
</p>

# **🎯 HITeval**

Part of the [**SimplifyHIT**](https://github.com/nmc-costa/simplifyhit) ecosystem: Tools to simplify Human-Interface Technologies (HIT).

A **Zero-Setup, Open-Source Dashboard** designed to visualize performance evaluations, generate individual radar charts, and track team evolution over time.

Built for simplicity and scale: No servers, no databases, no installations required. It runs locally in your browser and automatically adapts to your evaluation metrics.

## **🚀 How to Use (Zero Setup)**

You don't need to be a developer to use this tool.

1. **Download the tool:** Click the green \<\> Code button above and select **"Download ZIP"**.  
2. **Extract:** Extract the downloaded folder on your computer.  
3. **Run:** Open the folder and double-click the [HITeval_dashboard.html](https://github.com/nmc-costa/HITeval/blob/main/HITeval_dashboard.html) file. It will open in your default web browser.  
4. **Get the Template:** Inside the app, click "Download CSV Template" to get the standard spreadsheet format.  
5. **Fill & Drop:** Fill the CSV with your team's scores (in Excel or Google Sheets), save as .csv, and drag it back into the app\!

## **📋 Default Example: Unified Performance Evaluation Matrix**

While HITeval is dynamic and accepts any custom metrics, the default template includes our **Unified Performance Evaluation Matrix (From Junior to Coordinator)**. This framework focuses on differentiating between passive execution and proactive ownership.

### **💡 Global Reference Scale**

* 🔴 **1-4 (Insufficient):** Reactive, dependent, needs micromanagement, and blocks when facing obstacles.  
* 🟡 **5-7 (Functional):** Meets expectations, autonomous in daily tasks, reliable, but rarely innovates.  
* 🟢 **8-10 (Excellence/Leader):** Proactive, value generator, anticipates problems, brings solutions, and elevates the team.

### **📏 Evaluation Grid (10 Metrics)**

| **Metric** | **🔴 Reactive (1-4)** | **🟡 Functional (5-7)** | **🟢 Value Generator (8-10)** |
|---|---|---|---|
| **1. Responsibility** | Misses deadlines without notice; shifts blame. | Meets deadlines; delivers exactly what was requested. | Owns the final output; proactively solves blockers; manages technical stack for the future. |
| **2. Collaboration** | Works in silos; withholds information; creates friction. | Participates; helps only when explicitly asked. | Proactively unblocks peers; introduces collaborative tools; promotes team building. |
| **3. Pragmatism** | Focuses on irrelevant details; invents theoretical problems. | Chooses standard solutions; focuses merely on doing the job. | Focuses on ROI (80/20 rule); designs architectures aligned with the roadmap; demonstrates results. |
| **4. Technical Competence** | Recurring basic errors; inefficient code; doesn't evolve. | Clean and functional code; masters the current stack. | Technical/architectural reference; introduces innovations that optimize team efficiency. |
| **5. Communication & Scientific Impact** | Confusing; hides problems. Does not document results or contribute to scientific dissemination. | Reports status correctly. Participates in publications, posters, or workshops when involved. | "Sells" the team well; adapts language to the audience. Leads high-impact publications, creates IP, and attracts visibility/funding. |
| **6. Task Understanding** | Executes outside the scope; misses the "big picture". | Understands the task after a clear briefing. | Masters the business objective and ROI; asks precise questions to avoid rework. |
| **7. Task Delivery** | Incomplete deliveries or obvious bugs. | Tested and perfectly functional deliveries. | Polished, reusable, well-documented deliveries ready for production/client. |
| **8. Motivation** | Passive; "not my job" attitude. | Professional, consistent, and dedicated. | Contagious; motivates others; focuses on the project's and team's overall gain. |
| **9. Autonomy** | Blocks at the first error; waits for instructions. | Works alone; escalates only difficult problems. | Anticipates problems; brings solutions instead of doubts; manages own roadmap. |
| **10. Leadership** | Disorganized; creates confusion. | Organizes own work; leads by example. | Influences decisions; mentors others; inspires trust internally and with partners. |


### **📊 Evaluation Results (Quartiles & KPI Radar Chart)**

The total sum of the 10 metrics (0-100 points) dictates the employee's placement. HITeval automatically generates a **KPI Radar Chart** to visually compare individual metrics against the team average.

* **0-25 Points (Quartile 4):** 🔴 Totally reactive and dependent.  
* **26-50 Points (Quartile 3):** 🔴🟡 Functional, but difficult to coordinate.  
* **51-75 Points (Quartile 2):** 🟡 Meets expectations with autonomy.  
* **76-100 Points (Quartile 1):** 🟢 Proactive, value generator, and reference.

### **⚖️ Expectation Differentiation (Junior vs. Senior)**

The final evaluation score must be contextualized with the employee's seniority level:

* **For a Junior to be Green (🟢):** Must score 🟢 in technical learning. Can be 🟡 in Autonomy (still requires strategic guidance). Extreme passivity is unacceptable (🔴).  
* **For a Senior to be Green (🟢):** Must score 🟢 in Autonomy, Leadership, and Business Understanding. A Senior who merely executes technical tasks (🟡) is unacceptable (🔴), as they do not generate sustainability for the organization nor take the reins on major blockers.

## **⚙️ Advanced: Dynamic Metrics**

**HITeval is completely dynamic\!** If your specific team only evaluates 5 metrics, or uses 15 completely different ones (e.g., *Design, Sales, Marketing*), simply change the column names in the CSV. The system automatically reads the columns, adapts the Radar Chart, and scales the scoring percentages perfectly.

## **📈 Key Features**

* **100% Private:** Your team's data never leaves your computer. The CSV is parsed and rendered locally in your browser.  
* **Highly Scalable:** Built to handle large CSV datasets with thousands of historical records and employees effortlessly.  
* **Individual Radar Charts:** Visually compare a team member's performance across all your custom metrics against the team average.  
* **Team Evolution:** Track the team's overall average score over the years to monitor growth and sustainability.  
* **Export Ready:** Download individual charts and team evolution graphs as high-quality PNG images with a single click, perfectly formatted for your presentations.

*This project is open-source. Feel free to use, modify, adapt, and share it within your organization\!*
