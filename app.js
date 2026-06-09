const fields = {
  currentRole: document.querySelector("#currentRole"),
  targetRole: document.querySelector("#targetRole"),
  experience: document.querySelector("#experience"),
  goal: document.querySelector("#goal"),
  hours: document.querySelector("#hours"),
  strengths: document.querySelector("#strengths"),
  gaps: document.querySelector("#gaps"),
};

const output = {
  hoursValue: document.querySelector("#hoursValue"),
  fitScore: document.querySelector("#fitScore"),
  readiness: document.querySelector("#readiness"),
  focusArea: document.querySelector("#focusArea"),
  briefTitle: document.querySelector("#briefTitle"),
  coachBrief: document.querySelector("#coachBrief"),
  positioningList: document.querySelector("#positioningList"),
  skillList: document.querySelector("#skillList"),
  roadmapList: document.querySelector("#roadmapList"),
  interviewList: document.querySelector("#interviewList"),
  actionList: document.querySelector("#actionList"),
};

const roleSignals = {
  product: ["product discovery", "roadmap ownership", "experimentation", "technical tradeoffs"],
  leadership: ["delegation", "executive communication", "team operating rhythm", "decision quality"],
  data: ["statistical thinking", "data storytelling", "automation", "business metrics"],
  sales: ["pipeline strategy", "commercial negotiation", "account planning", "buyer discovery"],
  marketing: ["positioning", "campaign measurement", "customer research", "channel strategy"],
};

function splitList(value) {
  return value
    .split(/,|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function inferTrack(targetRole, goal) {
  const text = `${targetRole} ${goal}`.toLowerCase();

  if (text.includes("leader") || text.includes("manager") || text.includes("director")) return "leadership";
  if (text.includes("product")) return "product";
  if (text.includes("data") || text.includes("analyst") || text.includes("analytics")) return "data";
  if (text.includes("sales") || text.includes("account")) return "sales";
  if (text.includes("marketing") || text.includes("growth")) return "marketing";

  return "product";
}

function estimateFit(strengths, gaps, hours, experience) {
  const foundation = Math.min(22, strengths.length * 4);
  const gapPenalty = Math.min(18, gaps.length * 3);
  const timeBoost = Math.min(18, Number(hours) * 1.3);
  const seniorityBoost = experience.includes("10+") ? 10 : experience.includes("6") ? 7 : 4;
  return Math.max(48, Math.min(94, Math.round(58 + foundation + timeBoost + seniorityBoost - gapPenalty)));
}

function rampTime(score, hours) {
  const base = score > 84 ? 8 : score > 72 ? 12 : 16;
  const adjustment = Number(hours) >= 10 ? -2 : Number(hours) <= 4 ? 3 : 0;
  return `${Math.max(6, base + adjustment)} weeks`;
}

function renderList(node, items) {
  node.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function renderRoadmap(items) {
  output.roadmapList.innerHTML = items
    .map(
      (item) => `
        <div class="timeline-item">
          <strong>${item.title}</strong>
          <span>${item.copy}</span>
        </div>
      `
    )
    .join("");
}

function generatePlan() {
  const currentRole = fields.currentRole.value.trim() || "your current role";
  const targetRole = fields.targetRole.value.trim() || "your target role";
  const experience = fields.experience.value;
  const goal = fields.goal.value;
  const hours = fields.hours.value;
  const strengths = splitList(fields.strengths.value);
  const gaps = splitList(fields.gaps.value);
  const track = inferTrack(targetRole, goal);
  const signals = roleSignals[track];
  const score = estimateFit(strengths, gaps, hours, experience);
  const topGap = gaps[0] || signals[0];
  const topStrength = strengths[0] || "domain judgment";

  output.hoursValue.textContent = hours;
  output.fitScore.textContent = score;
  output.readiness.textContent = rampTime(score, hours);
  output.focusArea.textContent = goal.includes("promotion") ? "Influence" : score < 70 ? "Skill gap" : "Positioning";
  output.briefTitle.textContent = `From ${currentRole} to ${targetRole}`;
  output.coachBrief.textContent = `Your strongest path is to frame ${topStrength} as evidence that you can create outcomes in ${targetRole}. The next move is not just learning more; it is proving readiness through a focused work sample, sharper career narrative, and repeated interview practice. With ${hours} focused hours per week, your plan should emphasize visible proof over passive courses.`;

  renderList(output.positioningList, [
    `Lead with a concise transition story: "${currentRole} building toward ${targetRole} through ${topStrength}."`,
    `Translate past work into business outcomes, using numbers, scope, and decision impact wherever possible.`,
    `Create one portfolio artifact that shows how you think in the target role, not just what you have learned.`,
  ]);

  renderList(output.skillList, [
    `Close the first visible gap: ${topGap}.`,
    `Build fluency in ${signals[0]} and ${signals[1]}.`,
    `Practice explaining tradeoffs, constraints, and stakeholder decisions in plain business language.`,
  ]);

  renderRoadmap([
    {
      title: "Weeks 1-2: Diagnose",
      copy: `Audit job descriptions for ${targetRole}, compare against your strengths, and pick one proof project tied to ${topGap}.`,
    },
    {
      title: "Weeks 3-6: Build proof",
      copy: `Spend ${Math.max(2, Math.floor(hours * 0.6))} hours weekly on a practical artifact and the rest on targeted learning.`,
    },
    {
      title: "Weeks 7-12: Market",
      copy: "Update your resume, run mock interviews, ask for calibrated feedback, and begin focused outreach.",
    },
  ]);

  renderList(output.interviewList, [
    `Tell me about a time your work changed a business decision.`,
    `Walk me through a ${targetRole} challenge where you had incomplete information.`,
    `Why this move from ${currentRole}, and why now?`,
  ]);

  renderList(output.actionList, [
    `Block ${hours} hours on your calendar before the week starts.`,
    `Rewrite one resume bullet to show scope, action, and result.`,
    `Draft a 90-second answer for your career transition story.`,
  ]);
}

fields.hours.addEventListener("input", () => {
  output.hoursValue.textContent = fields.hours.value;
});

document.querySelector("#generatePlan").addEventListener("click", generatePlan);

generatePlan();
