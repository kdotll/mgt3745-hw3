# Features and specification

Status: ACTIVE.

## Context
Campus recruiters face high-volume application postings that receive 500 to 800 applications within days. Corporate ATS platforms force recruiters to choose between slow, multi-click manual reviews and blunt keyword algorithms that favor keyword-stuffed resumes over authentic, hands-on shop and design competence. Recruiters want to quickly isolate project execution evidence to build a defensible, diverse candidate shortlist for plant hiring managers without being bottlenecked by untrustworthy match scores. Simultaneously, proactive student applicants need visibility into review timelines so they know their materials are being actively evaluated instead of waiting aimlessly in indefinite post-application silence.

## Users
**Primary User Segment:** High-Volume Diversity-Conscious Campus Recruiter (Profile 1 in `USERS.md`). Evaluates 500+ technical applications per open role, distrusts automated keyword rankings, and needs rapid manual scanning to surface candidates with tangible experience
**Secondary User Segment:** Proactive Business Applicant (Profile 2 in `USERS.md`). Crafts tailored project bullets, experiences friction from repetitive account setups across ATS portals, and seeks clear evaluation timeline estimates to avoid waiting in radio silence.

## Scope
**Included Behavior:**
* Receiving large numbers of applications and extracting plain text of candidate PDF resumes
* Deterministic screening of four operational knockout parameters: graduation date range, degree level, work authorization, and relocation readiness.
* Full-screen, keyboard-driven viewer that displays applicant resumes with sub-second navigation hotkeys.
* Contextual snippet formatting that highlights technical verbs linked directly to technical tools within project bullets while suppressing isolated skills banks.
* Candidate-facing read-only status page that displays active review windows and interview milestone dates for specific requisition IDs.
* CSV export of shortlisted candidate records containing extracted project execution evidence.

**Explicit Non-Goals:**
* **No Algorithmic Stack-Ranking:** The system will not generate composite match percentages or automatically rank candidates based on keyword density.
* **No Automated Disqualification of Eligible Candidates:** The system will not send auto-rejections to non-knockout applicants. All rejection and hold decisions remain strictly human-driven.
* **No Generative Text Rewriting:** The system will not generate, rephrase, or ghostwrite bullet points for students.
* **No Direct ATS API Integration:** The system will not write data back into enterprise ATS platforms like Workday, it will function as an external searching tool utilizing CSV/PDF exports.

### Kano hypotheses

| Feature ID | Feature | Kano hypothesis | Segment / date | Evidence and reasoning |
|---|---|---|---|---|
| F-01 | Instant Batch PDF Viewer with Hotkey Navigation | Must-be | Recruiter / 09-10-2026 | Recruiter identified multi-click navigation in Workday as the critical operational bottleneck when manually triaging 500+ applicants at 15–30 seconds per resume. |
| F-02 | Deterministic Operational Knockout Gate | Must-be |  Recruiter / 09-10-2026 | Legal and company policy mandates that candidates failing graduation date, visa, or relocation constraints cannot be advanced. These must be screened before human review. |
| F-03 | Contextual Execution Snippet Highlighter | Performance | Recruiter / 09-10-2026 | Recruiter actively searches for physical manufacturing verbs and component execution in project bullets; automated highlighting directly scales scan speed and consistency. |
| F-04 | Open role Review Timeline & Stage Transparency Badge | Attractive | Business Student / 09-10-2026 | Student expressed that the most unsatisfying part of applying is radio silence; providing clear milestone dates addresses this primary anxiety without adding recruiter overhead. |
| F-05 | Universal Multi-Platform Profile Sync | Indifferent | Business Student / 09-10-2026 | While students dislike repetitive account creation, corporate recruiters cannot accept off-platform profile data due to institutional compliance constraints. |
| F-06 | Automated Algorithmic Candidate Match Scoring | Reverse | Campus Recruiter / 09-10-2026 | Recruiter explicitly distrusts automated match scores because they reward artificial AI keyword-stuffing and penalize authentic candidates from non-traditional backgrounds. |

## Behavior
1. **Requisition Setup & Batch Upload:** The recruiter enters a job ID, defines the four knockout parameters (graduation date range, degree, work authorization, relocation consent), sets public review milestone dates, and uploads a `.zip` archive containing applicant PDF resumes.
2. **Knockout Screening:** The system extracts text from each PDF. Candidates failing one or more knockout parameters are tagged as "Ineligible" and placed in an administrative queue. Eligible candidates are queued for further review.
3. **Execution Snippet Tagging:** For eligible candidates, the ATS reader reads project and experience sections, identifying sentences where a technical tool is paired with an action verb and physical component. These sentences are indexed as "Contextual Snippets."
4. **Keyboard-Driven Research:** The recruiter launches Search Mode. The first resume renders instantly. Contextual snippets are highlighted and isolated skills sections at the bottom of the page are dimmed. The recruiter uses single hotkeys like `1` to Shortlist, `2` to Hold, `J`/`K` to Navigate.
5. **Shortlist Export:** When searching concludes, the recruiter exports a CSV manifest containing candidate names, contact details, notes, and the specific extracted project execution snippets to attach to hiring manager review emails.
6. **Student Status Inspection:** A student navigates to the public review status portal, enters their job ID, and views the active hiring stage, review window dates, and projected notification timeline.

## Constraints
* **Performance:** The resume viewer must render the next document within 200 milliseconds of a navigation keystroke to support quick 15-second evaluations.
* **Determinism:** Given identical PDF text and requisition parameters, the snippet extraction logic must yield the identical highlights across repeated executions.
* **Data Privacy:** Candidate resume data must remain local or within the designated tenant to ensure no application data may be used to train public commercial AI models.
* **File Constraints:** The ingestion engine accepts standard text-based PDF files up to 10 MB in size and flags scanned image files that lack an embedded text layer.

## Acceptance

* **Ubiquitous:** The system shall execute candidate review and navigation without calculating or displaying an automated percentage match score.
* **Event-driven:** When the recruiter presses navigation hotkeys (`J` or `K`), the system shall render the corresponding candidate resume within 200 milliseconds.
* **Event-driven:** When an uploaded resume fails any of the four configured knockout parameters, the system shall mark the record as Ineligible within 2.0 seconds.
* **Unwanted:** If an uploaded PDF contains no embedded text layer, then the system shall flag the file as Unreadable and prompt for manual review.
* **Unwanted:** If a candidate enters a job ID that does not exist on the status portal, then the system shall display an Invalid job message and link to the main career page.
* **State-driven:** While in Search Mode, the system shall highlight sentences containing verified action verbs paired with technical tools and visually dim isolated skills banks.
* **Optional:** Where an applicant includes a direct hyperlink to an engineering portfolio or CAD repository, the system shall render an external link button in the viewer header.

## Verification

| Criterion | Steps and input | Expected result | Observed result | Status | Evidence / commit |
|---|---|---|---|---|---|
| F-02 (Knockout Gate - Normal Action) | Entered "Kenneth R.", "Mechanical Engineering", "2027", "Yes", "Yes". Clicked submit. | Candidate saved immediately with green "Eligible" badge within 2.0s. | Record rendered with green "Eligible" badge and success message in ~15ms. | PASS | docs/feature-demo.png |
| F-02 (Knockout Gate - Invalid Input) | Entered "Jordyn R.", "Other", "2028", "Select Status...", "Select Readiness...". Clicked submit. | Validation error prompt displayed; form prevents storage write. | Error message "Please fill out all required fields properly" rendered; storage untouched. | PASS | Manual test |
| F-02 (Knockout Gate - Ineligible Action) | Entered "Jordyn R.", "Other", "2028", "Yes", "Yes". Clicked submit. | Candidate marked and saved as "Ineligible" with red badge. | Record rendered with red "Ineligible" badge in ~12ms. | PASS | docs/feature-demo.png |
| F-02 (Knockout Gate - Persistence) | Evaluated candidates, then reloaded the browser tab (Cmd+R / F5). | Saved candidate records persist and re-render from localStorage. | Both Kenneth R. and Jordyn R. re-rendered identically after refresh. | PASS | docs/feature-demo.png |
| Ubiquitous (No match score) | Inspected submitted candidate records and UI output. | No percentage match scores or rankings computed or rendered. | Only categorical values and binary status badges displayed. | PASS | docs/feature-demo.png |
| Event-driven (Render < 200ms) | Trigger hotkey navigation (J/K) in document viewer. | Resume document renders within 200ms. | Not yet testable; batch PDF viewer belongs to F-01. | CANNOT TEST YET | Deferred to F-01 build |
| Unwanted (Unreadable PDF) | Upload PDF file lacking an embedded text layer. | System flags file as unreadable. | Ingestion pipeline for binary PDFs deferred to Module 4. | CANNOT TEST YET | Deferred to Module 4 |
| Unwanted (Invalid requisition) | Search non-existent requisition ID on status portal. | System displays invalid requisition error banner. | Candidate-facing status lookup portal is part of F-04. | CANNOT TEST YET | Deferred to F-04 build |
| State-driven (Dim skills banks) | Toggle triage search mode on PDF view. | Project action snippets highlighted; skills banks visually dimmed. | Text parsing engine belongs to F-03. | CANNOT TEST YET | Deferred to F-03 build |
| Optional (Portfolio link badge) | Candidate record includes external CAD/portfolio URL. | Render external link badge in header. | Portfolio link parsing postponed to preserve zero-dependency build. | DEFERRED | ADR-001 |