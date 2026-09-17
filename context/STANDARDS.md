# Standards

Status: ACTIVE in Module 3. Adapt these rules to your feature and follow them.

1. Use descriptive camelCase identifiers. Short conventional event/index names are acceptable when their role is obvious; arbitrary minimum name lengths are unnecessary.
2. Separate HTML, CSS, and JavaScript into index.html, styles.css, and app.js. Use lexical scope; do not create accidental global variables.
3. Explain important reasons in comments, not a narration of every statement. Remove temporary debug output before submission.
4. Write commit messages that name the changed behavior and purpose.
5. Use textContent for user text. Never insert user strings through innerHTML.
6. Associate form controls with labels and make success/error feedback perceivable. Preserve unsaved input when a write fails.
7. Forbidden Pattern: Do not import or link external front-end frameworks (React, Vue), utility CSS libraries (Tailwind, Bootstrap), or CDN scripts. Implement all functionality using standard vanilla Web APIs.

This file is normative if an adapter or context/CLAUDE.md conflicts. Repair inconsistent copies; do not silently choose different policies for humans and agents.

---

## Split Test

### Test 1: Separation of Concerns (Rule 2)
* **Does this rule apply to every task in the project, or to some tasks?** Applies to every code task and file creation in the project.
* **Does it stay the same from task to task, or change?** Stays invariant across all modules.
* **If it lands in the wrong place, which failure mode does that risk?** Risk of **clash** and **confusion** if repeated or altered in task prompts.
* **Verdict:** This rule belongs in `CLAUDE.md`.

### Test 2: DOM Injection Security (Rule 5)
* **Does this rule apply to every task in the project, or to some tasks?** Applies to every task rendering dynamic data to the user interface.
* **Does it stay the same from task to task, or change?** Stays invariant across all rendering code.
* **If it lands in the wrong place, which failure mode does that risk?** Risk of **poisoning** if left out of persistent instructions, resulting in insecure code generation.
* **Verdict:** This rule belongs in `CLAUDE.md`.

### Test 3: Four-Field Knockout Validation Parameters
* **Does this rule apply to every task in the project, or to some tasks?** Applies to only this single feature task (F-02 Candidate Knockout Intake).
* **Does it stay the same from task to task, or change?** Changes across tasks (future tasks handle PDF parsing, UI filtering, and CSV export).
* **If it lands in the wrong place, which failure mode does that risk?** Risk of **distraction** and **context rot** if kept in permanent agent memory, wasting attention tokens on unrelated tasks.
* **Verdict:** This rule belongs in the prompt for the task that needs it.

#### Task Prompt Snippet:
> "Evaluate candidate eligibility strictly against these four parameters: Degree must be 'Mechanical Engineering', Graduation Year must be between 2026 and 2028 inclusive, U.S. Work Authorization must equal 'Yes', and Relocation Readiness must equal 'Yes'. Mark 'Eligible' only when all four hold."

---

## Colleague Test

* **Colleague:** Caleb (Peer Mechanical Engineering Student)
* **What they asked / misunderstood:** Caleb read `CLAUDE.md` and asked whether the rule `Insert user text with textContent; do not use innerHTML for it` meant template literals were completely prohibited, even for static table row wrappers containing no variables.
* **Revision Made:** Clarified the rule in `CLAUDE.md` to state: "Insert user text with textContent; do not use innerHTML for dynamic user-supplied data."