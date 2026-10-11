
/* =========================================
   ระบบประเมินผลการฝึก กรมพระธรรมนูญ
   script.js
   ========================================= */

const STORAGE_KEY = "legalTrainingEvaluation_v1";

const criteria = [
  "วินัยและความรับผิดชอบ",
  "ความตรงต่อเวลา",
  "ความรู้ความเข้าใจ",
  "การปฏิบัติตามคำสั่ง",
  "ทักษะการปฏิบัติงาน",
  "การทำงานเป็นทีม",
  "การสื่อสาร",
  "การแก้ไขปัญหา",
  "ความซื่อสัตย์สุจริต",
  "ความพร้อมในการปฏิบัติหน้าที่"
];

let db = loadData();

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.trainees) &&
        Array.isArray(saved.evaluations)) return saved;
  } catch (error) {
    console.error("อ่านข้อมูลไม่สำเร็จ", error);
  }

  return { trainees: [], evaluations: [] };
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  renderAll();
}

function uid() {
  return Date.now().toString(36) +
    Math.random().toString(36).slice(2, 8);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function getElement(...ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}

function setText(ids, value) {
  const el = getElement(...ids);
  if (el) el.textContent = value;
}

function getScore(evaluation) {
  return criteria.reduce(
    (sum, _, index) => sum + (Number(evaluation.scores?.[index]) || 0),
    0
  );
}

function getGrade(score) {
  if (score >= 90) return "ดีเยี่ยม";
  if (score >= 80) return "ดีมาก";
  if (score >= 70) return "ดี";
  if (score >= 60) return "ผ่าน";
  return "ควรปรับปรุง";
}

function today() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000)
    .toISOString().slice(0, 10);
}

/* ---------- รายชื่อผู้เข้ารับการฝึก ---------- */

function addTrainee(event) {
  event?.preventDefault();

  const nameEl = getElement("traineeName", "name");
  const idEl = getElement("traineeId", "studentId");
  const batchEl = getElement("traineeBatch", "batch");
  const positionEl = getElement("traineePosition", "position");

  if (!nameEl || !nameEl.value.trim()) {
    alert("กรุณากรอกชื่อผู้เข้ารับการฝึก");
    return;
  }

  db.trainees.push({
    id: uid(),
    name: nameEl.value.trim(),
    traineeId: idEl?.value.trim() || "",
    batch: batchEl?.value.trim() || "",
    position: positionEl?.value.trim() || "",
    createdAt: today()
  });

  [nameEl, idEl, batchEl, positionEl].forEach(el => {
    if (el) el.value = "";
  });

  saveData();
  alert("เพิ่มรายชื่อเรียบร้อยแล้ว");
}

function deleteTrainee(id) {
  const trainee = db.trainees.find(item => item.id === id);
  if (!trainee) return;

  if (!confirm(`ต้องการลบรายชื่อ ${trainee.name} หรือไม่?`)) return;

  db.trainees = db.trainees.filter(item => item.id !== id);
  saveData();
}

function renderTrainees() {
  const tbody = getElement("traineeTableBody", "traineeList");
  if (!tbody) return;

  const search = (getElement("traineeSearch", "searchTrainee")?.value || "")
    .toLowerCase().trim();

  const list = db.trainees.filter(t =>
    [t.name, t.traineeId, t.batch, t.position]
      .some(value => String(value || "").toLowerCase().includes(search))
  );

  tbody.innerHTML = list.map(t => `
    <tr>
      <td>${escapeHTML(t.traineeId || "-")}</td>
      <td>${escapeHTML(t.name)}</td>
      <td>${escapeHTML(t.batch || "-")}</td>
      <td>${escapeHTML(t.position || "-")}</td>
      <td>
        <button type="button" data-delete-trainee="${escapeHTML(t.id)}">
          ลบ
        </button>
      </td>
    </tr>
  `).join("");

  if (!list.length) {
    tbody.innerHTML =
      '<tr><td colspan="5">ยังไม่มีรายชื่อ หรือไม่พบข้อมูล</td></tr>';
  }

  renderTraineeOptions();
}

function renderTraineeOptions() {
  const select = getElement("evaluationTrainee", "evalTrainee", "traineeSelect");
  if (!select) return;

  const previous = select.value;
  select.innerHTML = '<option value="">-- เลือกผู้เข้ารับการฝึก --</option>' +
    db.trainees.map(t => `
      <option value="${escapeHTML(t.id)}">
        ${escapeHTML(t.name)}${t.batch ? " - รุ่น " + escapeHTML(t.batch) : ""}
      </option>
    `).join("");

  if (db.trainees.some(t => t.id === previous)) select.value = previous;
}

/* ---------- แบบฟอร์มประเมิน ---------- */

function renderCriteria() {
  const container = getElement("criteriaFields", "evaluationCriteria", "scoreFields");
  if (!container) return;

  container.innerHTML = criteria.map((label, index) => `
    <label class="criteria-row">
      <span>${index + 1}. ${escapeHTML(label)}</span>
      <select name="score${index}" class="score-input" required>
        ${Array.from({ length: 11 }, (_, score) => `
          <option value="${score}">${score} คะแนน</option>
        `).join("")}
      </select>
    </label>
  `).join("");

  container.querySelectorAll(".score-input").forEach(input => {
    input.addEventListener("change", updateScorePreview);
  });

  updateScorePreview();
}

function updateScorePreview() {
  const inputs = document.querySelectorAll(".score-input");
  if (!inputs.length) return;

  const total = [...inputs].reduce(
    (sum, input) => sum + Number(input.value || 0), 0
  );

  setText(["scoreTotal", "totalScore"], `${total} / 100`);
  setText(["scoreGrade", "gradePreview"], getGrade(total));
}

function submitEvaluation(event) {
  event?.preventDefault();

  const traineeSelect = getElement(
    "evaluationTrainee", "evalTrainee", "traineeSelect"
  );
  const traineeId = traineeSelect?.value;

  if (!traineeId) {
    alert("กรุณาเลือกผู้เข้ารับการฝึก");
    return;
  }

  const trainee = db.trainees.find(t => t.id === traineeId);
  if (!trainee) {
    alert("ไม่พบรายชื่อ กรุณาเพิ่มรายชื่อก่อน");
    return;
  }

  const inputs = [...document.querySelectorAll(".score-input")];
  if (inputs.length !== 10) {
    alert("กรุณาตรวจสอบว่ามีช่องคะแนนครบทั้ง 10 หัวข้อ");
    return;
  }

  const scores = inputs.map(input => Number(input.value));
  if (scores.some(score => !Number.isFinite(score) || score < 0 || score > 10)) {
    alert("คะแนนแต่ละหัวข้อต้องอยู่ระหว่าง 0 ถึง 10");
    return;
  }

  const date = getElement("evaluationDate", "evalDate")?.value || today();
  const evaluator = getElement("evaluatorName", "evaluator")?.value.trim() || "";
  const notes = getElement("evaluationNotes", "notes")?.value.trim() || "";

  db.evaluations.push({
    id: uid(),
    traineeId,
    traineeName: trainee.name,
    batch: trainee.batch,
    date,
    evaluator,
    notes,
    scores,
    createdAt: new Date().toISOString()
  });

  saveData();

  const form = getElement("evaluationForm", "evalForm");
  if (form) form.reset();

  if (getElement("evaluationDate", "evalDate")) {
    getElement("evaluationDate", "evalDate").value = today();
  }

  updateScorePreview();
  alert("บันทึกผลประเมินเรียบร้อยแล้ว");
}

/* ---------- แดชบอร์ด ---------- */

function renderDashboard() {
  const evaluations = db.evaluations;
  const traineeCount = db.trainees.length;
  const average = evaluations.length
    ? evaluations.reduce((sum, item) => sum + getScore(item), 0) /
      evaluations.length
    : 0;

  setText(["totalTrainees", "traineeCount"], traineeCount);
  setText(["totalEvaluations", "evaluationCount"], evaluations.length);
  setText(["averageScore", "avgScore"], average.toFixed(1));
  setText(
    ["needsImprovement", "lowScoreCount"],
    evaluations.filter(item => getScore(item) < 60).length
  );

  const recent = getElement("recentEvaluations", "dashboardRecent");
  if (recent) {
    recent.innerHTML = evaluations.slice().reverse().slice(0, 5).map(item => `
      <tr>
        <td>${escapeHTML(item.date)}</td>
        <td>${escapeHTML(item.traineeName)}</td>
        <td>${getScore(item)} / 100</td>
        <td>${escapeHTML(getGrade(getScore(item)))}</td>
      </tr>
    `).join("") || '<tr><td colspan="4">ยังไม่มีผลประเมิน</td></tr>';
  }

  renderChart();
}

function renderChart() {
  const canvas = getElement("scoreChart", "evaluationChart");
  if (!canvas || typeof Chart === "undefined") return;

  if (window.trainingChart) window.trainingChart.destroy();

  const labels = criteria.map(label => label);
  const averages = criteria.map((_, index) => {
    if (!db.evaluations.length) return 0;
    return db.evaluations.reduce(
      (sum, item) => sum + (Number(item.scores?.[index]) || 0), 0
    ) / db.evaluations.length;
  });

  window.trainingChart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "คะแนนเฉลี่ยรายหัวข้อ (เต็ม 10)",
        data: averages,
        backgroundColor: "#245640",
        borderColor: "#c7a44b",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, max: 10 }
      }
    }
  });
}

/* ---------- รายงาน ---------- */

function renderReports() {
  const tbody = getElement("reportTableBody", "evaluationReport");
  if (!tbody) return;

  const search = (getElement("reportSearch", "searchReport")?.value || "")
    .toLowerCase().trim();

  const list = db.evaluations.filter(item =>
    [item.traineeName, item.batch, item.evaluator, item.date]
      .some(value => String(value || "").toLowerCase().includes(search))
  );

  tbody.innerHTML = list.slice().reverse().map(item => `
    <tr>
      <td>${escapeHTML(item.date)}</td>
      <td>${escapeHTML(item.traineeName)}</td>
      <td>${escapeHTML(item.batch || "-")}</td>
      <td>${escapeHTML(item.evaluator || "-")}</td>
      <td>${getScore(item)} / 100</td>
      <td>${escapeHTML(getGrade(getScore(item)))}</td>
      <td>
        <button type="button" data-delete-evaluation="${escapeHTML(item.id)}">
          ลบ
        </button>
      </td>
    </tr>
  `).join("");

  if (!list.length) {
    tbody.innerHTML =
      '<tr><td colspan="7">ยังไม่มีผลประเมิน หรือไม่พบข้อมูล</td></tr>';
  }
}

function deleteEvaluation(id) {
  if (!confirm("ต้องการลบรายการประเมินนี้หรือไม่?")) return;
  db.evaluations = db.evaluations.filter(item => item.id !== id);
  saveData();
}

function exportCSV() {
  const rows = [
    [
      "วันที่", "ชื่อผู้เข้ารับการฝึก", "รุ่น", "ผู้ประเมิน",
      ...criteria, "คะแนนรวม", "ผลประเมิน", "ข้อสังเกต"
    ],
    ...db.evaluations.map(item => [
      item.date,
      item.traineeName,
      item.batch || "",
      item.evaluator || "",
      ...criteria.map((_, index) => Number(item.scores?.[index]) || 0),
      getScore(item),
      getGrade(getScore(item)),
      item.notes || ""
    ])
  ];

  const csv = "\uFEFF" + rows.map(row =>
    row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
  ).join("\r\n");

  downloadFile(csv, "training-evaluation-report.csv", "text/csv;charset=utf-8");
}

function backupJSON() {
  downloadFile(
    JSON.stringify(db, null, 2),
    "training-evaluation-backup.json",
    "application/json"
  );
}

function restoreJSON(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported.trainees) ||
          !Array.isArray(imported.evaluations)) {
        throw new Error("รูปแบบไฟล์ไม่ถูกต้อง");
      }

      if (!confirm("การนำเข้าจะแทนที่ข้อมูลปัจจุบัน ต้องการดำเนินการต่อหรือไม่?")) {
        event.target.value = "";
        return;
      }

      db = imported;
      saveData();
      alert("นำเข้าข้อมูลสำเร็จ");
    } catch (error) {
      alert("ไฟล์สำรองไม่ถูกต้อง");
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderAll() {
  renderTrainees();
  renderDashboard();
  renderReports();
}

/* ---------- เชื่อมปุ่มและฟอร์ม ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderCriteria();

  const traineeForm = getElement("traineeForm", "addTraineeForm");
  if (traineeForm) traineeForm.addEventListener("submit", addTrainee);

  const evaluationForm = getElement("evaluationForm", "evalForm");
  if (evaluationForm) {
    evaluationForm.addEventListener("submit", submitEvaluation);
  }

  const traineeSearch = getElement("traineeSearch", "searchTrainee");
  if (traineeSearch) traineeSearch.addEventListener("input", renderTrainees);

  const reportSearch = getElement("reportSearch", "searchReport");
  if (reportSearch) reportSearch.addEventListener("input", renderReports);

  const exportButton = getElement("exportCSV", "exportReport");
  if (exportButton) exportButton.addEventListener("click", exportCSV);

  const backupButton = getElement("backupJSON", "backupData");
  if (backupButton) backupButton.addEventListener("click", backupJSON);

  const restoreInput = getElement("restoreJSON", "restoreData");
  if (restoreInput) restoreInput.addEventListener("change", restoreJSON);

  const printButton = getElement("printReport", "printButton");
  if (printButton) printButton.addEventListener("click", () => window.print());

  document.addEventListener("click", event => {
    const traineeButton = event.target.closest("[data-delete-trainee]");
    if (traineeButton) {
      deleteTrainee(traineeButton.dataset.deleteTrainee);
    }

    const evaluationButton = event.target.closest("[data-delete-evaluation]");
    if (evaluationButton) {
      deleteEvaluation(evaluationButton.dataset.deleteEvaluation);
    }
  });

  const dateInput = getElement("evaluationDate", "evalDate");
  if (dateInput && !dateInput.value) dateInput.value = today();

  renderAll();
});
