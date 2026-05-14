(function () {
  "use strict";

  const STORAGE_KEY = "faceless-youtube-video-generator:v3";

  const steps = [
    {
      id: "objective",
      eyebrow: "Direction setup",
      title: "What should the generator create first?",
      prompt: "Choose the output that best matches the work you want to ship.",
      type: "single",
      options: [
        ["First video launch", "One polished long-form or standard video"],
        ["Shorts batch", "Several vertical clips from one topic"],
        ["Long-form explainer", "A deeper faceless video with stronger research"],
        ["Repurpose existing content", "Turn a transcript, URL, or notes into new videos"]
      ]
    },
    {
      id: "experience",
      eyebrow: "Creator profile",
      title: "How much faceless YouTube experience do you have?",
      prompt: "The AI direction will adjust how much setup detail and automation it recommends.",
      type: "single",
      options: [
        ["Beginner", "Starting from zero"],
        ["Intermediate", "Published before or tested ideas"],
        ["Advanced", "Optimizing systems or scaling output"]
      ]
    },
    {
      id: "niche",
      eyebrow: "Audience demand",
      title: "Which niche should the video serve?",
      prompt: "Pick the category closest to your viewer and topic.",
      type: "single",
      options: [
        ["Autos and Vehicles", "Cars, EVs, repairs, comparisons"],
        ["Comedy", "Sketches, commentary, compilations"],
        ["Education", "Skills, learning, explainers"],
        ["Entertainment", "Culture, stories, trend breakdowns"],
        ["Film and Animation", "Movies, shorts, animation analysis"],
        ["Gaming", "Guides, lore, updates, analysis"],
        ["How-to and Style", "Tutorials, design, lifestyle systems"],
        ["Music", "Theory, production, artist analysis"],
        ["News and Politics", "Briefings, explainers, context"],
        ["Nonprofits and Activism", "Causes, awareness, impact"],
        ["People and Blogs", "Narrative essays, life systems"],
        ["Science and Technology", "AI, software, devices, science"],
        ["Sports", "Teams, tactics, histories, predictions"],
        ["Travel and Events", "Destinations, routes, local guides"]
      ]
    },
    {
      id: "audience",
      eyebrow: "Viewer promise",
      title: "Who is the primary viewer?",
      prompt: "This helps the AI Director frame hooks, pacing, and vocabulary.",
      type: "single",
      options: [
        ["Curious beginners", "Simple language and quick wins"],
        ["Busy professionals", "Concise insight and practical value"],
        ["Enthusiasts", "More nuance, comparisons, and specifics"],
        ["Skeptics", "Evidence-first framing and careful claims"],
        ["Fans and communities", "Inside references, lore, and momentum"]
      ]
    },
    {
      id: "concept",
      eyebrow: "Content angle",
      title: "What pattern should the video follow?",
      prompt: "Select the structure closest to your idea.",
      type: "single",
      options: [
        ["Activity", "Guided practice or exercises"],
        ["Concept overview", "Simple explanation of a big idea"],
        ["How-to", "Step-by-step tutorial"],
        ["Lecture", "Structured teaching"],
        ["Problem walkthrough", "Diagnose and solve a clear problem"],
        ["Real life application", "Use cases and practical examples"],
        ["Science experiment", "Tests, demos, outcomes"],
        ["Tips", "Fast tactical advice"],
        ["Other", "A custom direction"],
        ["Not sure", "Use AI starter angles"]
      ]
    },
    {
      id: "sourceContextMode",
      eyebrow: "Raw material",
      title: "What source material do you have?",
      prompt: "Bring a seed so the final prompt can direct research, scenes, and captions.",
      type: "context",
      options: [
        ["Topic seed", "A rough idea or title"],
        ["URL or article", "A source to summarize and transform"],
        ["Transcript or notes", "Raw material for repurposing"],
        ["Product or affiliate angle", "A tool, service, or offer to explain"]
      ]
    },
    {
      id: "channelNameMode",
      eyebrow: "Brand fit",
      title: "Do you already have a channel or series name?",
      prompt: "The generated prompt can either audit your name or create brandable options.",
      type: "name",
      options: [
        ["Have a name", "Audit and strengthen it"],
        ["Need suggestions", "Generate brandable names"]
      ]
    },
    {
      id: "visualDirection",
      eyebrow: "Faceless production",
      title: "What should viewers see on screen?",
      prompt: "Choose the visual system that best fits your budget and topic.",
      type: "single",
      options: [
        ["Stock b-roll with captions", "Fastest path for broad topics"],
        ["Screen recordings and overlays", "Best for software, tutorials, workflows"],
        ["Motion graphics and icons", "Good for explainers and abstract ideas"],
        ["Documentary archive style", "Timeline, maps, photos, and sourced visuals"],
        ["AI image sequences", "Stylized scenes with strong visual continuity"],
        ["Charts and data visuals", "For evidence, rankings, and comparisons"]
      ]
    },
    {
      id: "voiceDirection",
      eyebrow: "Narration",
      title: "How should the video sound?",
      prompt: "Pick the voice and pacing direction for the script.",
      type: "single",
      options: [
        ["Calm educator", "Clear, measured, trustworthy"],
        ["High-energy narrator", "Fast hooks and punchy transitions"],
        ["Documentary storyteller", "Cinematic and context-rich"],
        ["News anchor", "Timely, direct, source-focused"],
        ["Conversational coach", "Friendly and practical"],
        ["Captions only", "No voiceover, strong text rhythm"]
      ]
    },
    {
      id: "duration",
      eyebrow: "Output package",
      title: "How long should the main video be?",
      prompt: "The AI Director will use this for word count, beat count, and retention pacing.",
      type: "single",
      options: [
        ["Under 3 minutes", "Shorts or ultra-short videos"],
        ["3-5 minutes", "Short and punchy"],
        ["5-10 minutes", "Flexible standard episodes"],
        ["10-15 minutes", "In-depth but digestible"],
        ["15-20 minutes", "Deep dives and tutorials"],
        ["20+ minutes", "Long-form documentary or masterclass"]
      ]
    }
  ];

  const defaults = {
    stepIndex: 0,
    selections: {
      objective: "",
      experience: "",
      niche: "",
      audience: "",
      concept: "",
      sourceContextMode: "",
      sourceContext: "",
      channelNameMode: "",
      channelName: "",
      visualDirection: "",
      voiceDirection: "",
      duration: ""
    },
    generatedPrompt: ""
  };

  const metrics = {
    words: {
      "Under 3 minutes": "350-450",
      "3-5 minutes": "500-700",
      "5-10 minutes": "900-1400",
      "10-15 minutes": "1500-2100",
      "15-20 minutes": "2200-2800",
      "20+ minutes": "3500+"
    },
    retention: {
      "Under 3 minutes": "85%+ average viewed",
      "3-5 minutes": "70-80% average viewed",
      "5-10 minutes": "55-65% average viewed",
      "10-15 minutes": "45-55% average viewed",
      "15-20 minutes": "40-50% average viewed",
      "20+ minutes": "35-45% average viewed"
    },
    beats: {
      "Under 3 minutes": "hook, proof, payoff",
      "3-5 minutes": "hook, setup, three value beats, payoff",
      "5-10 minutes": "hook, open loop, five chapters, recap, next-video bridge",
      "10-15 minutes": "cold open, context, proof, contrast, examples, recap, next-video bridge",
      "15-20 minutes": "documentary act structure with recurring retention resets",
      "20+ minutes": "chaptered long-form with pattern interrupts every 90 seconds"
    },
    cpm: {
      "Autos and Vehicles": "$4-10",
      "Education": "$5-12",
      "How-to and Style": "$4-11",
      "News and Politics": "$4-10",
      "Science and Technology": "$8-18",
      "default": "$3-8"
    }
  };

  const starterAngles = {
    "Autos and Vehicles": ["Used EV regrets nobody explains", "Repair cost myths versus real invoices", "The hidden checklist before buying used"],
    "Education": ["A hard concept explained with one visual metaphor", "The beginner mistake that slows learning", "A 7-day skill sprint with measurable output"],
    "Entertainment": ["The trend cycle behind one viral format", "A rise-and-fall story told through receipts", "Why this format keeps pulling viewers back"],
    "Gaming": ["The patch change that rewrites the meta", "A lore timeline new fans can understand", "The hidden mechanic most players ignore"],
    "How-to and Style": ["A workflow makeover from messy to repeatable", "The five rules that make beginners look advanced", "A tool stack that saves one hour per project"],
    "News and Politics": ["What changed, who it affects, what happens next", "A policy explained without partisan shorthand", "The timeline that makes the conflict clearer"],
    "Science and Technology": ["The AI workflow nobody is packaging clearly", "A software comparison using real tasks", "The old invention that explains today's tech"],
    "Sports": ["The tactic that changed the game", "A rivalry history in five turning points", "The prospect profile fans should watch"],
    "default": ["Beginner mistakes explained", "A top 7 breakdown with proof", "A case study with a clear before and after"]
  };

  const visualRecipes = {
    "Stock b-roll with captions": "Use fast b-roll changes, bold caption emphasis, pattern interrupts, and source-safe footage prompts.",
    "Screen recordings and overlays": "Use recorded workflows, zoom callouts, cursor highlights, progress labels, and before-after frames.",
    "Motion graphics and icons": "Use shape-based explainers, clean icon scenes, timeline cards, and animated keyword emphasis.",
    "Documentary archive style": "Use maps, dates, archival stills, lower-thirds, evidence callouts, and timeline transitions.",
    "AI image sequences": "Use consistent style prompts, recurring color palette, locked subject details, and scene continuity notes.",
    "Charts and data visuals": "Use ranked charts, simple axes, data source labels, comparison tables, and one insight per frame."
  };

  const voiceRecipes = {
    "Calm educator": "Measured pacing, plain-language explanations, short pauses after key ideas.",
    "High-energy narrator": "Fast first 20 seconds, punchy transitions, active verbs, high-retention open loops.",
    "Documentary storyteller": "Cinematic setup, textured context, act breaks, and reflective closing line.",
    "News anchor": "Direct factual cadence, source references, neutral transitions, and clear uncertainty labels.",
    "Conversational coach": "Warm second-person language, practical examples, and confidence-building recap.",
    "Captions only": "Write compact caption beats, strong visual rhythm, and no voice-dependent jokes."
  };

  const state = loadState();

  const elements = {
    assistStatus: document.getElementById("assistStatus"),
    scoreRing: document.getElementById("scoreRing"),
    scoreValue: document.getElementById("scoreValue"),
    directorStep: document.getElementById("directorStep"),
    directorStepHint: document.getElementById("directorStepHint"),
    assistNext: document.getElementById("assistNext"),
    directionList: document.getElementById("directionList"),
    readinessList: document.getElementById("readinessList"),
    suggestButton: document.getElementById("suggestButton"),
    sampleButton: document.getElementById("sampleButton"),
    stepList: document.getElementById("stepList"),
    progress: document.getElementById("progress"),
    stepCount: document.getElementById("stepCount"),
    completionText: document.getElementById("completionText"),
    progressFill: document.getElementById("progressFill"),
    questionEyebrow: document.getElementById("questionEyebrow"),
    questionTitle: document.getElementById("questionTitle"),
    questionPrompt: document.getElementById("questionPrompt"),
    optionGrid: document.getElementById("optionGrid"),
    nameField: document.getElementById("nameField"),
    channelName: document.getElementById("channelName"),
    contextField: document.getElementById("contextField"),
    sourceContext: document.getElementById("sourceContext"),
    assistBox: document.getElementById("assistBox"),
    assistList: document.getElementById("assistList"),
    summaryGrid: document.getElementById("summaryGrid"),
    wizardView: document.getElementById("wizardView"),
    resultView: document.getElementById("resultView"),
    generatedPrompt: document.getElementById("generatedPrompt"),
    copyStatus: document.getElementById("copyStatus"),
    backButton: document.getElementById("backButton"),
    resetButton: document.getElementById("resetButton"),
    nextButton: document.getElementById("nextButton"),
    copyButton: document.getElementById("copyButton"),
    resultScore: document.getElementById("resultScore"),
    directorBrief: document.getElementById("directorBrief")
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return normalizeState(saved);
    } catch (error) {
      return clone(defaults);
    }
  }

  function normalizeState(saved) {
    const selections = Object.assign({}, defaults.selections, saved.selections || {});
    return Object.assign({}, defaults, saved, {
      stepIndex: Number.isInteger(saved.stepIndex) ? clamp(saved.stepIndex, 0, steps.length - 1) : 0,
      selections
    });
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getSelection(id) {
    return state.selections[id];
  }

  function isStepValid(step) {
    const value = getSelection(step.id);
    if (step.type === "name") {
      if (!value) return false;
      if (value === "Have a name") return state.selections.channelName.trim().length > 1;
      return true;
    }
    if (step.type === "context") {
      return Boolean(value) && state.selections.sourceContext.trim().length > 2;
    }
    return Boolean(value);
  }

  function highestReachableIndex() {
    let highest = 0;
    for (let index = 0; index < steps.length; index += 1) {
      highest = index;
      if (!isStepValid(steps[index])) break;
    }
    return highest;
  }

  function readinessItems() {
    return [
      ["Outcome", Boolean(state.selections.objective)],
      ["Niche", Boolean(state.selections.niche)],
      ["Viewer", Boolean(state.selections.audience)],
      ["Angle", Boolean(state.selections.concept)],
      ["Source", Boolean(state.selections.sourceContextMode && state.selections.sourceContext.trim())],
      ["Visuals", Boolean(state.selections.visualDirection)],
      ["Voice", Boolean(state.selections.voiceDirection)],
      ["Runtime", Boolean(state.selections.duration)]
    ];
  }

  function readinessScore() {
    const items = readinessItems();
    const ready = items.filter((item) => item[1]).length;
    return Math.round((ready / items.length) * 100);
  }

  function direction() {
    const s = state.selections;
    const niche = s.niche || "your niche";
    const concept = s.concept && s.concept !== "Not sure" ? s.concept.toLowerCase() : "clear audience problem";
    const objective = s.objective || "first video launch";
    const duration = s.duration || "5-10 minutes";
    const sourceMode = s.sourceContextMode || "Topic seed";
    const starters = starterAngles[s.niche] || starterAngles.default;
    const hook = starters[0];
    const visual = visualRecipes[s.visualDirection] || "Use simple faceless b-roll, large captions, and clear scene-by-scene visual prompts.";
    const voice = voiceRecipes[s.voiceDirection] || "Use a clear narrator style with short sentences and strong transition lines.";
    const pacing = metrics.beats[duration] || metrics.beats["5-10 minutes"];
    const risk = niche === "News and Politics"
      ? "Label claims, cite sources, and separate facts from commentary."
      : s.visualDirection === "AI image sequences"
        ? "Keep character and style continuity locked across generated scenes."
        : "Keep the title promise matched to the opening 30 seconds.";

    return {
      hook,
      visual,
      voice,
      pacing,
      risk,
      next: nextMove(),
      summary: `${objective} for ${niche} using a ${concept} structure from ${sourceMode.toLowerCase()} material.`
    };
  }

  function nextMove() {
    const firstMissing = steps.find((step) => !isStepValid(step));
    if (!firstMissing) return "Generate the prompt, then use the Director Brief as your production checklist.";
    if (firstMissing.id === "sourceContextMode") return "Add a concrete topic seed or source note so the output has real creative material.";
    if (firstMissing.id === "visualDirection") return "Choose the visual system before voice so the script can match what appears on screen.";
    if (firstMissing.id === "voiceDirection") return "Choose narration style so the hook, pacing, and caption rhythm agree.";
    return `Complete ${firstMissing.title.toLowerCase()}.`;
  }

  function renderStepList() {
    elements.stepList.replaceChildren();
    steps.forEach((step, index) => {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "step-marker";
      item.dataset.complete = String(isStepValid(step));
      if (index === state.stepIndex) item.setAttribute("aria-current", "step");
      item.disabled = index > highestReachableIndex();
      item.addEventListener("click", () => {
        state.generatedPrompt = "";
        state.stepIndex = index;
        saveState();
        render();
      });

      const number = document.createElement("span");
      number.className = "step-number";
      number.textContent = String(index + 1);

      const label = document.createElement("span");
      label.className = "step-label";
      label.textContent = shortLabel(step);

      item.append(number, label);
      elements.stepList.append(item);
    });
  }

  function shortLabel(step) {
    const labels = {
      objective: "Output",
      experience: "Level",
      niche: "Niche",
      audience: "Viewer",
      concept: "Angle",
      sourceContextMode: "Source",
      channelNameMode: "Brand",
      visualDirection: "Visuals",
      voiceDirection: "Voice",
      duration: "Runtime"
    };
    return labels[step.id] || step.title;
  }

  function renderOptions(step) {
    elements.optionGrid.replaceChildren();
    step.options.forEach(([label, hint]) => {
      const selected = getSelection(step.id) === label;
      const option = document.createElement("button");
      option.type = "button";
      option.className = "option";
      option.setAttribute("aria-pressed", String(selected));
      option.addEventListener("click", () => chooseOption(step, label));

      const text = document.createElement("span");
      const labelNode = document.createElement("span");
      labelNode.className = "option-label";
      labelNode.textContent = label;
      const hintNode = document.createElement("span");
      hintNode.className = "option-hint";
      hintNode.textContent = hint;
      text.append(labelNode, hintNode);

      const check = document.createElement("span");
      check.className = "check";
      check.setAttribute("aria-hidden", "true");

      option.append(text, check);
      elements.optionGrid.append(option);
    });
  }

  function chooseOption(step, label) {
    state.generatedPrompt = "";
    state.selections[step.id] = label;
    saveState();
    render();
  }

  function renderConditionalAreas(step) {
    const showName = step.type === "name" && state.selections.channelNameMode === "Have a name";
    elements.nameField.classList.toggle("hidden", !showName);
    elements.channelName.value = state.selections.channelName;

    const showContext = step.type === "context";
    elements.contextField.classList.toggle("hidden", !showContext);
    elements.sourceContext.value = state.selections.sourceContext;

    const showAssist = step.id === "concept" && state.selections.concept === "Not sure";
    elements.assistBox.classList.toggle("hidden", !showAssist);
    elements.assistList.replaceChildren();
    if (showAssist) {
      const suggestions = starterAngles[state.selections.niche] || starterAngles.default;
      suggestions.forEach((suggestion) => {
        const item = document.createElement("li");
        item.textContent = suggestion;
        elements.assistList.append(item);
      });
    }

    const showSummary = state.stepIndex === steps.length - 1 && isStepValid(step);
    elements.summaryGrid.classList.toggle("hidden", !showSummary);
    if (showSummary) renderSummary();
  }

  function renderSummary() {
    const s = state.selections;
    const summary = [
      ["Output", s.objective],
      ["Niche", s.niche],
      ["Viewer", s.audience],
      ["Angle", s.concept],
      ["Visuals", s.visualDirection],
      ["Voice", s.voiceDirection],
      ["Runtime", s.duration],
      ["Source", s.sourceContextMode],
      ["Brand", s.channelNameMode === "Have a name" ? s.channelName : "Needs suggestions"]
    ];
    elements.summaryGrid.replaceChildren();
    summary.forEach(([label, value]) => {
      const item = document.createElement("div");
      item.className = "summary-item";
      const key = document.createElement("span");
      key.textContent = label;
      const val = document.createElement("strong");
      val.textContent = value || "Not selected";
      item.append(key, val);
      elements.summaryGrid.append(item);
    });
  }

  function renderProgress() {
    const stepNumber = state.stepIndex + 1;
    const percent = Math.round((stepNumber / steps.length) * 100);
    elements.stepCount.textContent = `Step ${stepNumber} of ${steps.length}`;
    elements.completionText.textContent = `${percent}% complete`;
    elements.progressFill.style.width = `${percent}%`;
    elements.progress.setAttribute("aria-valuenow", String(stepNumber));
  }

  function renderDirector() {
    const step = steps[state.stepIndex];
    const score = readinessScore();
    const creative = direction();
    elements.scoreRing.style.setProperty("--score", `${score}%`);
    elements.scoreValue.textContent = `${score}%`;
    elements.resultScore.textContent = `${score}%`;
    elements.assistStatus.textContent = score >= 100 ? "Direction ready" : "AI Assist active";
    elements.directorStep.textContent = step.title;
    elements.directorStepHint.textContent = step.prompt;
    elements.assistNext.textContent = creative.next;
    elements.directionList.replaceChildren();
    [
      ["HK", `Hook: ${creative.hook}`],
      ["VS", creative.visual],
      ["VO", creative.voice],
      ["RT", `Pacing: ${creative.pacing}`],
      ["TR", `Trust: ${creative.risk}`]
    ].forEach(([code, text]) => {
      const item = document.createElement("li");
      const badge = document.createElement("span");
      badge.textContent = code;
      const copy = document.createElement("p");
      copy.textContent = text;
      item.append(badge, copy);
      elements.directionList.append(item);
    });

    elements.readinessList.replaceChildren();
    readinessItems().forEach(([label, ready]) => {
      const item = document.createElement("div");
      item.className = `readiness-item ${ready ? "is-ready" : ""}`;
      const badge = document.createElement("span");
      badge.className = "readiness-state";
      badge.textContent = ready ? "OK" : "--";
      const name = document.createElement("span");
      name.textContent = label;
      const stateLabel = document.createElement("strong");
      stateLabel.textContent = ready ? "Ready" : "Needed";
      item.append(badge, name, stateLabel);
      elements.readinessList.append(item);
    });
  }

  function renderWizard() {
    const step = steps[state.stepIndex];
    elements.wizardView.classList.remove("hidden");
    elements.resultView.classList.remove("is-active");
    elements.copyButton.classList.add("hidden");
    elements.nextButton.classList.remove("hidden");
    elements.questionEyebrow.textContent = step.eyebrow;
    elements.questionTitle.textContent = step.title;
    elements.questionPrompt.textContent = step.prompt;
    renderOptions(step);
    renderConditionalAreas(step);
    renderProgress();
    elements.backButton.disabled = state.stepIndex === 0;
    elements.nextButton.disabled = !isStepValid(step);
    elements.nextButton.textContent = state.stepIndex === steps.length - 1 ? "Generate prompt" : "Continue";
  }

  function renderResult() {
    elements.wizardView.classList.add("hidden");
    elements.resultView.classList.add("is-active");
    elements.copyButton.classList.remove("hidden");
    elements.nextButton.classList.add("hidden");
    elements.backButton.disabled = false;
    elements.generatedPrompt.value = state.generatedPrompt;
    elements.copyStatus.textContent = "";
    renderBrief();
  }

  function renderBrief() {
    const creative = direction();
    const items = [
      ["OUT", creative.summary],
      ["HOOK", creative.hook],
      ["VIS", creative.visual],
      ["VOICE", creative.voice],
      ["PACE", creative.pacing],
      ["RISK", creative.risk]
    ];
    elements.directorBrief.replaceChildren();
    items.forEach(([code, text]) => {
      const item = document.createElement("div");
      item.className = "brief-item";
      const badge = document.createElement("span");
      badge.textContent = code;
      const copy = document.createElement("p");
      copy.textContent = text;
      item.append(badge, copy);
      elements.directorBrief.append(item);
    });
  }

  function render() {
    renderStepList();
    renderDirector();
    if (state.generatedPrompt) renderResult();
    else renderWizard();
  }

  function buildPrompt() {
    const s = state.selections;
    const creative = direction();
    const words = metrics.words[s.duration] || "900-1400";
    const retention = metrics.retention[s.duration] || "55-65% average viewed";
    const cpm = metrics.cpm[s.niche] || metrics.cpm.default;
    const channelName = s.channelNameMode === "Have a name" ? s.channelName.trim() : "Needs name suggestions";
    const starters = (starterAngles[s.niche] || starterAngles.default).join(" | ");

    return `FACELESS YOUTUBE VIDEO GENERATION REQUEST

ROLE
Act as an AI creative director, YouTube strategist, scriptwriter, and faceless video producer.

PROJECT SNAPSHOT
- Output goal: ${s.objective}
- Creator experience: ${s.experience}
- Niche: ${s.niche}
- Primary viewer: ${s.audience}
- Content angle: ${s.concept}
- Source material type: ${s.sourceContextMode}
- Source notes or topic seed: ${s.sourceContext}
- Channel or series name: ${channelName}
- Faceless visual system: ${s.visualDirection}
- Voice direction: ${s.voiceDirection}
- Target duration: ${s.duration}

AI DIRECTOR GUIDANCE
- Recommended hook angle: ${creative.hook}
- Visual direction: ${creative.visual}
- Voiceover direction: ${creative.voice}
- Pacing structure: ${creative.pacing}
- Trust and quality guardrail: ${creative.risk}
- Alternate starter angles: ${starters}

PERFORMANCE CONTEXT
- Target script length: ${words} words
- Retention target: ${retention}
- Estimated niche CPM context: ${cpm}

OUTPUT REQUIREMENTS
Create a complete faceless YouTube production package with these sections:

1. Positioning and Viewer Promise
Define the viewer, the video promise, why the topic matters now, and how the first 30 seconds earns attention without misleading clickbait.

2. Title and Thumbnail Direction
Give 8 title options, 4 thumbnail concepts, on-screen text options, contrast notes, and what each option promises.

3. Hook and Retention Plan
Write a 30-second cold open, an open loop, chapter beats, pattern interrupts, and a retention reset plan matched to ${s.duration}.

4. Full Script
Write the full voiceover script in the ${s.voiceDirection} style. Mark scene changes, b-roll prompts, captions, sound cues, and emphasis words inline.

5. Faceless Visual Shot List
Create a scene-by-scene shot list for ${s.visualDirection}. Include asset prompts, screen recording notes, b-roll keywords, chart ideas, and editing transitions.

6. Caption and On-Screen Text Plan
Provide caption blocks, text hierarchy, lower-thirds, source labels, and accessibility notes.

7. Voiceover and Audio Direction
Give pacing, tone, pauses, music bed, sound effects, and mixing notes. If captions-only is selected, replace voiceover notes with text rhythm direction.

8. Production Workflow
Recommend a practical tool stack for research, scripting, voice, visuals, editing, captions, thumbnails, and export settings.

9. Publishing Package
Write the description, chapters, tags, pinned comment, end screen suggestion, playlist fit, and next-video bridge.

10. Quality Checklist
Give a final checklist for factual accuracy, copyright-safe assets, viewer promise match, AI disclosure, pacing, audio levels, and mobile readability.

Return only the production package. Keep every recommendation specific to the inputs above.`;
  }

  async function copyPrompt() {
    const text = elements.generatedPrompt.value;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        elements.generatedPrompt.select();
        document.execCommand("copy");
      }
      elements.copyStatus.textContent = "Prompt copied.";
    } catch (error) {
      elements.copyStatus.textContent = "Select the prompt text and copy it manually.";
    }
  }

  function applySuggestion() {
    Object.assign(state.selections, {
      objective: "First video launch",
      experience: state.selections.experience || "Beginner",
      niche: state.selections.niche || "Science and Technology",
      audience: "Curious beginners",
      concept: "Problem walkthrough",
      sourceContextMode: "Topic seed",
      sourceContext: "A practical explainer showing how a creator can turn one raw idea into a repeatable faceless video workflow.",
      channelNameMode: "Need suggestions",
      channelName: "",
      visualDirection: "Screen recordings and overlays",
      voiceDirection: "Calm educator",
      duration: "5-10 minutes"
    });
    state.stepIndex = steps.length - 1;
    state.generatedPrompt = "";
    saveState();
    render();
  }

  function applySample() {
    Object.assign(state.selections, {
      objective: "Long-form explainer",
      experience: "Intermediate",
      niche: "Science and Technology",
      audience: "Busy professionals",
      concept: "Real life application",
      sourceContextMode: "Topic seed",
      sourceContext: "Explain how small business owners can use AI agents to automate weekly customer follow-ups without sounding robotic.",
      channelNameMode: "Have a name",
      channelName: "Signal Studio",
      visualDirection: "Motion graphics and icons",
      voiceDirection: "Conversational coach",
      duration: "10-15 minutes"
    });
    state.stepIndex = steps.length - 1;
    state.generatedPrompt = "";
    saveState();
    render();
  }

  elements.channelName.addEventListener("input", (event) => {
    state.generatedPrompt = "";
    state.selections.channelName = event.target.value;
    saveState();
    renderStepList();
    renderDirector();
    elements.nextButton.disabled = !isStepValid(steps[state.stepIndex]);
  });

  elements.sourceContext.addEventListener("input", (event) => {
    state.generatedPrompt = "";
    state.selections.sourceContext = event.target.value;
    saveState();
    renderStepList();
    renderDirector();
    elements.nextButton.disabled = !isStepValid(steps[state.stepIndex]);
  });

  elements.backButton.addEventListener("click", () => {
    if (state.generatedPrompt) {
      state.generatedPrompt = "";
      saveState();
      render();
      return;
    }
    state.stepIndex = clamp(state.stepIndex - 1, 0, steps.length - 1);
    saveState();
    render();
  });

  elements.nextButton.addEventListener("click", () => {
    const step = steps[state.stepIndex];
    if (!isStepValid(step)) return;
    if (state.stepIndex === steps.length - 1) {
      state.generatedPrompt = buildPrompt();
    } else {
      state.stepIndex += 1;
    }
    saveState();
    render();
  });

  elements.resetButton.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    Object.assign(state, clone(defaults));
    render();
  });

  elements.copyButton.addEventListener("click", copyPrompt);
  elements.suggestButton.addEventListener("click", applySuggestion);
  elements.sampleButton.addEventListener("click", applySample);

  render();
}());
