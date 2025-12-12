# AI Platform Explorer - Strategic Roadmap

**Version:** 2.0 | **Status:** Draft | **Target:** Enterprise AI Selection Teams

This document outlines the next two major phases of development for the AI Platform Explorer, focusing on transforming the tool from a static comparison engine into a collaborative decision-support platform.

---

## Phase 2: Enterprise Contextualization & Governance
**Focus:** Enabling organizations to tailor the evaluation criteria to their specific needs and manage the platform selection process securely.

### 2.1 Custom Evaluation Weighting Engine (Priority: High)
**Objective:** Allow users to adjust the importance of different feature categories based on their organizational priorities (e.g., Security > Cost vs. Capabilities > Security).

*   **Key Features:**
    *   Interactive sliders for key categories (Core, Security, Cost, Ease of Use).
    *   Real-time recalculation of "Weighted Scores" for each platform.
    *   "Persona Presets" (e.g., "CISO View", "Developer View", "CFO View").
    *   Visual indication of rank changes based on weight adjustments.
*   **Technical Implementation:**
    *   **State:** Extend `AppContext` to store `weights` object `{ [category]: number }`.
    *   **Component:** `WeightControls` component with accessible sliders.
    *   **Logic:** Update `FeatureMatrix` sorting algorithm to use `weightedScore = Σ(score * weight) / Σ(weights)`.

### 2.2 Advanced Scenario Planning
**Objective:** Enable users to save, load, and compare different "What-if" scenarios for ROI and Platform Selection.

*   **Key Features:**
    *   "Save Scenario" button in ROI Calculator and Matrix.
    *   Sidebar for managing saved scenarios (local storage first, database later).
    *   "Compare Scenarios" view (Side-by-side ROI comparison).
*   **Technical Implementation:**
    *   **Storage:** `services/scenarioService.ts` using `localStorage` or `IndexedDB`.
    *   **Schema:** JSON schema for `Scenario` object (inputs, weights, selection).

### 2.3 Role-Based Access Control (RBAC) & Team Management
**Objective:** Support multi-user evaluation teams with different permission levels.

*   **Key Features:**
    *   User Roles: `Admin` (Edit settings, invite), `Editor` (Create scenarios), `Viewer` (Read-only).
    *   Project-level permissions.
    *   Audit log of changes to evaluation criteria.
*   **Technical Implementation:**
    *   **Auth:** Integration with Supabase Auth (already pre-configured).
    *   **Database:** `user_roles` and `project_members` tables.
    *   **Middleware:** Route protection logic.

### 2.4 Compliance & Security Deep Dive
**Objective:** Provide granular details on security compliance (SOC2, HIPAA, GDPR) beyond simple scores.

*   **Key Features:**
    *   Dedicated "Security Profile" view for each platform.
    *   Downloadable "Compliance Certificates" (mock or real links).
    *   CIS Benchmark mapping.
*   **Technical Implementation:**
    *   **Data:** Expand `PLATFORMS_DATA` with `security: { compliance: [], encryption: string, dataResidency: string[] }`.
    *   **UI:** New `SecurityMatrix` component.

---

## Phase 3: Decision Intelligence & Integration
**Focus:** Leveraging data and algorithms to automate recommendations and monitor vendor health in real-time.

### 3.1 "Best Fit" Recommendation Engine
**Objective:** Automate the initial screening process by matching organizational requirements to platform capabilities.

*   **Key Features:**
    *   "Requirements Wizard" questionnaire (Budget, Users, Industry, Tech Stack).
    *   Matching algorithm returning "Top 3 Recommendations".
    *   "Gap Analysis" chart showing where platforms fail requirements.
*   **Technical Implementation:**
    *   **Algorithm:** Vector matching or weighted multi-criteria decision analysis (MCDA).
    *   **UI:** Multi-step Wizard component.

### 3.2 Real-time Vendor Risk Monitor
**Objective:** Track the operational stability and reputational risk of AI vendors.

*   **Key Features:**
    *   Live feed of API outages (mock or status page integration).
    *   News feed aggregation for security incidents.
    *   "Risk Score" trending over time.
*   **Technical Implementation:**
    *   **Backend:** Edge Functions to fetch status RSS feeds.
    *   **Frontend:** `RiskDashboard` widget.

### 3.3 TCO & ROI Validation Tracker
**Objective:** Move beyond *projected* ROI to *actual* value realization tracking.

*   **Key Features:**
    *   "Implementation Phase" in ROI Calculator.
    *   Input actual costs vs projected.
    *   Input actual adoption rates (manual or API).
    *   Variance reporting (Projected vs Actual).
*   **Technical Implementation:**
    *   **Data Model:** `Deployment` entity linked to `ROIModel`.
    *   **Charts:** Variance charts using Recharts.

### 3.4 Collaborative Workspace
**Objective:** Turn the analysis into a living document for the buying committee.

*   **Key Features:**
    *   Inline comments on Feature Matrix cells (e.g., "@Jane check this security spec").
    *   Approval workflow (Request Review -> Approved).
    *   Export to Jira/Linear ticket for implementation.
*   **Technical Implementation:**
    *   **Real-time:** Supabase Realtime for comments.
    *   **Notifications:** Email/In-app notifications for mentions.
