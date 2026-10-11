// ระบบประเมินผลการฝึก
const STORAGE_KEY = "trainingEvaluations";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("evaluationForm");
  const scoreFields = document.getElementById("scoreFields");

  // สร้างช่องประเมิน 10 หัวข้อ
  if (scoreFields) {
    const criteria = [
      "ระเบียบวินัย",
      "ความรับผิดชอบ",
      "การตรงต่อเวลา",
      "การปฏิบัติตามคำสั่ง",
      "ความร่วมมือ",
      "การทำงานเป็นทีม",
      "ความตั้งใจในการฝึก",
      "ความรู้ความเข้าใจ",
      "การแก้ไขปัญหา",
      "ความประพฤติ"
    ];

    scoreFields.innerHTML = criteria.map((name, index) => `
      <div class="score-item">
        <label for="score${index}">${index + 1}. ${name} (0–10 คะแนน)</label>
        <input
          id="score${index}"
          name="score${index}"
          type="number"
          min="0"
          max="10"
          value="0"
          required
        >
      </div>
    `).join("");
  }

  // คำนวณคะแนนรวม
  function calculateScore() {
    let total = 0;

    for (let i = 0; i < 10; i++) {
      const input = document.getElementById(`score${i}`);
      if (input) {
        let score = Number(input.value) || 0;
        score = Math.max(0, Math.min(10, score));
        total += score;
      }
    }

    const output = document.getElementById("totalScore");
    if (output) output.textContent = total + " / 100";

    return total;
  }

  document.addEventListener("input", event => {
    if (event.target.matches('input[type="number"]')) {
      calculateScore();
    }
  });

  // โหลดข้อมูลที่บันทึกไว้
  function getEvaluations() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  // ส่งแบบประเมิน
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const traineeName =
        document.getElementById("traineeName")?.value.trim() ||
        document.getElementById("name")?.value.trim();

      if (!traineeName) {
        alert("กรุณากรอกชื่อผู้เข้ารับการฝึก");
        return;
      }

      const scores = [];

      for (let i = 0; i < 10; i++) {
        const input = document.getElementById(`score${i}`);
        const score = Number(input?.value);

        if (!input || input.value === "" ||
            !Number.isFinite(score) || score < 0 || score > 10) {
          alert(`กรุณาตรวจสอบคะแนนหัวข้อที่ ${i + 1}`);
          return;
        }

        scores.push(score);
      }

      const evaluation = {
        id: Date.now(),
        name: traineeName,
        scores,
        total: scores.reduce((sum, score) => sum + score, 0),
        date: new Date().toLocaleDateString("th-TH")
      };

      const evaluations = getEvaluations();
      evaluations.push(evaluation);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
        alert(`บันทึกผลประเมินสำเร็จ คะแนนรวม ${evaluation.total}/100`);
        form.reset();
        calculateScore();
        renderEvaluations();
      } catch {
        alert("บันทึกไม่สำเร็จ พื้นที่จัดเก็บอาจเต็ม");
      }
    });
  }

  // แสดงรายการผลประเมิน
  function renderEvaluations() {
    const list = document.getElementById("evaluationList");
    if (!list) return;

    const evaluations = getEvaluations();

    if (evaluations.length === 0) {
      list.textContent = "ยังไม่มีข้อมูลการประเมิน";
      return;
    }

    list.innerHTML = evaluations.map(item => `
      <div class="evaluation-card">
        <strong>${escapeHTML(item.name)}</strong>
        <p>คะแนน: ${item.total}/100</p>
        <small>${escapeHTML(item.date)}</small>
        <button type="button" data-delete="${item.id}">
          ลบรายการ
        </button>
      </div>
    `).join("");
  }

  // ป้องกันข้อความชื่อถูกแปลเป็น HTML
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  // ลบรายการประเมิน
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;

    if (!confirm("ยืนยันการลบผลประเมินนี้หรือไม่?")) return;

    const id = Number(button.dataset.delete);
    const updated = getEvaluations().filter(item => item.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    renderEvaluations();
  });

  // ส่งออกรายงาน CSV
  const exportButton = document.getElementById("exportCSV");

  if (exportButton) {
    exportButton.addEventListener("click", () => {
      const evaluations = getEvaluations();

      if (!evaluations.length) {
        alert("ยังไม่มีข้อมูลสำหรับส่งออก");
        return;
      }

      const rows = [
        ["ชื่อผู้เข้ารับการฝึก", "คะแนนรวม", "วันที่"],
        ...evaluations.map(item => [
          item.name,
          item.total,
          item.date
        ])
      ];

      const csv = "\uFEFF" + rows.map(row =>
        row.map(value =>
          `"${String(value).replace(/"/g, '""')}"`
        ).join(",")
      ).join("\n");

      const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "training-evaluations.csv";
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  calculateScore();
  renderEvaluations();
});
