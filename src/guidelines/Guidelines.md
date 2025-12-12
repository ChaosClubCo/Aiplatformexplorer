# INT Figma AI Platform Guidelines
## Comprehensive guide for AI-powered design workflows

**Version:** 1.0 | **Last Updated:** December 2025

---

## Executive Summary

This document provides production-ready guidelines for integrating AI into Figma-based design and development workflows at INT. Based on 2025 industry best practices from Figma, Carbon Design System, IBM, SAP, Anthropic, and leading design teams.

**Scope:** AI-optimized file structure, MCP integration, design systems, prompt engineering, security, accessibility, QA

**Target Audience:** Designers, developers, product teams, AI practitioners

---

## Core Principles

### 1. Design for Humans AND Machines
- **Structure over style** - Semantic organization beats visual perfection
- **Context is king** - AI needs documented intent, not just pixels
- **System-first** - Design systems are the foundation for AI success

### 2. AI Enhances, Never Replaces
- **AI handles:** Repetitive tasks, layout generation, token application
- **Humans provide:** Judgment, creativity, brand alignment, quality control
- **Designer's role:** Curator → Editor → Strategic decision-maker

### 3. Quality Over Speed
**Priority order:**
1. Correctness (does it work?)
2. Accessibility (WCAG 2.2 Level AA minimum)
3. Brand alignment (on-brand?)
4. Performance (fast?)
5. Speed of generation (how quickly made?)

⚠️ **Never sacrifice quality for AI speed gains**

---

## Figma File Structure for AI

### Mandatory Organization

**Hierarchical Naming:** `[Category]/[Type]/[Variant]/[State]`

```
✅ GOOD:
├── Components/Button/Primary/Default
├── Components/Button/Primary/Hover
└── Components/Input/Text/Error

❌ BAD:
├── button_1
├── Frame 147
└── temp
```

### Auto Layout Requirements

**Rule:** If it can have Auto Layout, it MUST have Auto Layout

**Benefits for AI:**
- Predictable responsive behavior
- Clear parent-child relationships
- Semantic spacing information
- Easier code generation

### Component Organization

```
📁 Design System
├── 📁 Foundations (Colors, Typography, Spacing, Grid, Icons)
├── 📁 Components
│   ├── 📁 Atoms (Button, Input, Label)
│   ├── 📁 Molecules (Card, Form Field)
│   └── 📁 Organisms (Header, Navigation)
└── 📁 Templates (Layouts, Patterns)
```

### Documentation Requirements (Mandatory)

Every component must include:

1. **Description Field**
   - Purpose (what is this?)
   - Usage (when to use)
   - Restrictions (when NOT to use)

2. **Properties Documentation**
   - All variants documented
   - All props explained
   - Default values specified

3. **Code Connect Mapping** (if code exists)
   - Link to codebase component
   - Props mapping
   - Import path

---

## MCP Server Guidelines

### What is MCP?

**Model Context Protocol** = standardized way AI tools access Figma design data

**Analogy:** MCP is to AI what LSP is to code editors—a universal adapter for context.

### Setup (Quick Start)

**Prerequisites:**
- Paid Figma plan (Professional, Organization, Enterprise)
- Dev or Full seat
- VS Code/Cursor/Windsurf/Claude Code
- Node.js 18+

**Desktop Server Config:**

```json
{
  "mcpServers": {
    "figma-dev-mode": {
      "command": "npx",
      "args": ["-y", "@figma/mcp-server-figma-dev-mode@latest"],
      "env": {
        "FIGMA_PERSONAL_ACCESS_TOKEN": "figd_XXX"
      }
    }
  }
}
```

### MCP Workflow (Link-Based)

1. Copy Figma frame link (`?node-id=123-456`)
2. Paste in AI tool + prompt:
   ```
   "Use Figma MCP to implement the design at [link]
   using our React component library and Tailwind tokens"
   ```
3. AI fetches: hierarchy, variables, Code Connect mappings
4. Validate: visual parity, accessibility, code review

### MCP Tools

| Tool | Purpose | When to Use |
|------|---------|------------|
| `get_design_context` | React + Tailwind output | New components |
| `get_screenshot` | Visual reference | Layout verification |
| `list_variable_bindings` | Token mappings | Design system alignment |
| `get_code_connect_mapping` | Component → code paths | Reuse existing components |

**Pro Tip:** Be explicit in prompts:
```
✅ "Use get_design_context then get_code_connect_mapping"
❌ "Generate code for this design"
```

---

## Design System for AI

### Token Architecture (3-Tier System)

```
Tier 1: Primitive (raw values)
├── color-blue-500: #3b82f6
├── spacing-4: 16px

Tier 2: Semantic (meaning)
├── color-primary: {color-blue-500}
├── spacing-stack-md: {spacing-4}

Tier 3: Component (usage)
├── button-bg: {color-primary}
├── card-padding: {spacing-stack-md}
```

**Benefits:** Clear inheritance, semantic naming, AI can suggest correct tokens

### Variable Code Syntax (REQUIRED)

**Maps Figma variables to code tokens**

```
Figma Variable: color/brand/primary
Code Syntax: theme.colors.brand.primary

Setup:
1. Open Variables panel in Figma
2. Add Code Syntax for each variable
3. Verify in Dev Mode → Variables tab
```

**Why Critical:** AI knows exact code token to use (no guessing)

### Component Variants Best Practices

```
✅ GOOD:
Button
├── variant: "primary" | "secondary" | "ghost"
├── size: "sm" | "md" | "lg"
└── disabled: boolean

❌ BAD:
Button
├── type1: true/false
├── small: true/false
└── blue: true/false
```

---

## Prompt Engineering

### Context-First Principle

**Bad Prompt:**
```
"Make this look better"
```

**Good Prompt:**
```
"Improve visual hierarchy of this card using our design 
system tokens (spacing/stack/* and typography/heading/*). 
Ensure WCAG AA contrast. Reference Product Card pattern 
in Figma library at [link]."
```

### Standard Template

```
[ROLE & CONTEXT]
You are implementing [component] based on [design system].

[CONSTRAINTS]
- Use variables from [collection]
- Follow component at [Code Connect path]
- Maintain [framework] conventions

[TASK]
Generate [specific output] for: [Figma link]

[REQUIREMENTS]
1. [Requirement 1]
2. [Requirement 2]
3. [Requirement 3]

[OUTPUT FORMAT]
Provide:
- Component code (TypeScript + React)
- Prop types definition
- Usage example
- Accessibility notes
```

### Advanced Pattern: Multi-Step Workflow

```
Step 1: Use get_design_context to understand hierarchy
Step 2: Use get_code_connect_mapping to find existing components
Step 3: Generate only unmapped components (follow template)
Step 4: Run accessibility audit (jest-axe) + verify visual parity
```

### Rules File Generation (Automated)

```bash
npx @figma/mcp-server-figma-dev-mode generate-rules
```

**Output:** `design-system-rules.md` containing:
- Token definitions
- Component library inventory
- Naming conventions
- File structure patterns

**Use in prompts:**
```
"Follow all rules in design-system-rules.md when generating 
components. Prioritize token usage over raw values."
```

---

## Accessibility Requirements (WCAG 2.2 Level AA)

### Non-Negotiable Standards

**Color Contrast:**
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- Interactive elements: 3:1 minimum

**Touch Targets:**
- Minimum size: 44×44px (iOS) / 48×48px (Material)
- Spacing: 8px minimum between targets

**Focus Indicators:**
- Visible on all interactive elements
- 2px minimum thickness
- 3:1 contrast minimum

**Semantic Structure:**
- Proper heading hierarchy (H1 → H6)
- Meaningful labels (not "Click here")
- Alt text for images (descriptive, not decorative)

### AI Prompt Template for Accessibility

```
"Ensure this component meets WCAG 2.2 Level AA:
- Check color contrast (4.5:1 for text)
- Verify touch targets (min 44x44px)
- Add focus indicators (2px outline)
- Use semantic HTML structure
Generate accessibility test cases for jest-axe."
```

### Testing Checklist

**Pre-Publish (Figma):**
- [ ] Color contrast validated
- [ ] Touch targets meet 44×44px minimum
- [ ] Focus states visible
- [ ] Alt text for images
- [ ] Semantic layer naming

**Pre-Deploy (Code):**
- [ ] Automated tests pass (jest-axe, Pa11y)
- [ ] Screen reader tested (NVDA/JAWS/VoiceOver)
- [ ] Keyboard navigation verified
- [ ] Zoom tested (200%, 400%)
- [ ] Lighthouse accessibility score >90

---

## Security & Privacy

### Data Privacy

**Default for INT:** Content training = `OFF` (opt-in only)

**Rules:**
- Explicit consent before AI training
- Remove PII before processing
- Aggregate data (no individual tracking)
- Use synthetic data for examples

### Authentication

**Personal Access Tokens:**
```bash
# Store securely (never commit)
.env
FIGMA_PERSONAL_ACCESS_TOKEN=figd_XXX

# Rotate quarterly
```

**Scopes:** `files:read` (minimum for MCP)

### Audit Logging

**Required logs:**
```json
{
  "timestamp": "2025-12-12T10:30:00Z",
  "user": "user@int.com",
  "action": "mcp_fetch_design",
  "resource": "file/abc123?node-id=456-789",
  "status": "success"
}
```

**Retention:** 90 days minimum | **Storage:** Immutable

---

## Common Pitfalls & Solutions

### 1. Over-Relying on AI
**Problem:** Accepting output without critique
**Solution:** AI = assistant. Always: generate → review → edit → approve

### 2. Missing Design System Context
**Problem:** Prompting without system reference
**Solution:** Always provide: tokens, Code Connect, design-system-rules.md

### 3. Poor File Structure
**Problem:** No Auto Layout, hardcoded values
**Solution:** Run "Design Lint" weekly, fix violations

### 4. Missing Code Connect
**Problem:** AI generates duplicates
**Solution:** Add `figma.connect()` to all components, publish quarterly

### 5. Inadequate A11y Testing
**Problem:** WCAG violations ship
**Solution:** Mandatory jest-axe (CI) + manual testing + block deploys

---

## AI Tool Recommendations

### Primary Tools

1. **Figma MCP Server** (Design-to-Code)
   - Official integration, token-aware, Code Connect support

2. **Figma Make** (Rapid Prototyping)
   - Prompt-to-app, no code required

3. **Figma AI Features** (Native)
   - Rename layers, search similar, Auto Layout suggestions

### Supporting Tools

4. **Storybook** (Component Playground)
5. **Chromatic/Percy** (Visual Testing)
6. **axe DevTools** (Accessibility)
7. **Figma Plugins:** Contrast, Stark, Design Lint, Token Studio

---

## Workflow Templates

### New Component Creation

**Phase 1: Design**
1. Research existing → create with Auto Layout + tokens
2. Document → validate → publish

**Phase 2: Development**
3. Setup → generate with AI → review & refine
4. Test (unit, a11y, visual) → publish

### Figma File Audit

**Monthly checklist:**
- [ ] Naming convention followed
- [ ] Auto Layout everywhere
- [ ] Variables (no hardcoded values)
- [ ] Code syntax added
- [ ] Documentation complete
- [ ] Accessibility validated
- [ ] Code Connect published

### Accessibility Audit

**Quarterly:**
1. Automated (Figma plugins, jest-axe, Lighthouse)
2. Manual (screen reader, keyboard, zoom)
3. Remediation (prioritize → fix → re-test)
4. Documentation (report → update guidelines)

---

## Implementation Roadmap

**Month 1: Foundation**
- File structure, variable collections, naming conventions
- MCP server setup, team training

**Month 2: Integration**
- Code Connect, rules file, automated testing
- Workflow documentation, pilot components

**Month 3: Scale**
- Component migration, team onboarding
- Review processes, quality metrics, iterate

**Ongoing:**
- Monthly file audits
- Quarterly accessibility audits
- Continuous documentation updates

---

## Key Takeaways

1. **Design for Humans and Machines** - Structure, context, systems enable AI
2. **AI Enhances, Never Replaces** - Human oversight remains essential
3. **Accessibility is Mandatory** - WCAG 2.2 Level AA minimum
4. **Design Systems are the Foundation** - Tokens, Code Connect guide AI
5. **Iteration is Essential** - AI output requires human refinement

---

## Resources

**Official:**
- Figma MCP: https://figma.com/dev-mode/mcp
- Model Context Protocol: https://modelcontextprotocol.io
- WCAG 2.2: https://w3.org/WAI/WCAG22

**Community:**
- Figma Community: https://figma.com/community
- Design Systems Slack: designsystems.com/slack
- A11y Project: https://a11yproject.com

---

**Questions?** design-systems-team@int.com

**Version:** 1.0 | **Last Updated:** December 12, 2025 | **Next Review:** March 2026
