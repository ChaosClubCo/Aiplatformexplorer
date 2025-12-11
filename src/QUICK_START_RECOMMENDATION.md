# Quick Start Guide: AI Platform Recommendation Engine

## 🚀 5-Minute Quick Start

### For End Users

**1. Access the Tool**
```
Click "Get Recommendation" tab (🤖 icon) in the navigation bar
```

**2. Answer Questions (5-7 minutes)**
```
11 questions across 3 categories:
├─ Requirements (What you need)
├─ Constraints (Deal-breakers)
└─ Priorities (Nice-to-haves)

Tip: Answer honestly, skip if unsure
```

**3. Get Results**
```
✅ Top 3 personalized recommendations
✅ Match scores with confidence levels
✅ Strengths, concerns, and differentiators
✅ All platforms ranked by relevance
```

**4. Take Action**
```
📥 Export results (JSON)
💰 Calculate ROI for top picks
📊 Compare platforms side-by-side
📞 Request vendor demos
```

---

## 📋 Question Overview

### Requirements (40% weight)

| # | Question | Type | Time |
|---|----------|------|------|
| 1 | Primary use case | Single-select | 30s |
| 2 | Team size | Range slider | 15s |
| 3 | Integration needs | Multi-select | 30s |

### Constraints (40% weight)

| # | Question | Type | Time |
|---|----------|------|------|
| 4 | Budget per user | Range slider | 20s |
| 5 | Compliance requirements | Multi-select | 30s |
| 6 | Existing ecosystem | Single-select | 20s |
| 7 | Data residency | Multi-select | 20s |

### Priorities (20% weight)

| # | Question | Type | Time |
|---|----------|------|------|
| 8 | Capability priorities | Drag-drop ranking | 45s |
| 9 | Implementation speed | Single-select | 15s |
| 10 | Context window importance | Single-select | 15s |
| 11 | Market leader preference | Single-select | 15s |

**Total Time:** ~5 minutes

---

## 💡 Pro Tips

### Getting the Best Recommendations

**DO:**
- ✅ Answer all questions (or as many as possible)
- ✅ Be realistic about budget constraints
- ✅ Prioritize must-haves in top 3
- ✅ Use "Skip" only if truly unsure
- ✅ Review all top 3 recommendations

**DON'T:**
- ❌ Inflate requirements beyond actual needs
- ❌ Make everything a top priority
- ❌ Ignore budget constraints
- ❌ Skip most questions
- ❌ Only look at #1 recommendation

### Understanding Match Scores

```
90-100% = Excellent Match 🟢
  • Meets all requirements
  • No major concerns
  • High confidence

75-89% = Good Match 🔵
  • Meets most requirements
  • Minor concerns
  • Medium-high confidence

60-74% = Fair Match 🟡
  • Meets some requirements
  • Some concerns
  • Medium confidence

<60% = Poor Match 🔴
  • Missing key requirements
  • Major concerns
  • Low confidence
```

---

## 🎯 Common Use Cases

### Startup Looking for Code Tool

**Typical Answers:**
- Primary use case: Code Generation
- Team size: 5-20
- Budget: $10-20/user/month
- Compliance: None required
- Implementation: Fast (1-3 months)

**Expected Top Recommendations:**
1. ChatGPT (OpenAI)
2. Claude (Anthropic)
3. GitHub Copilot

---

### Enterprise Needing Customer Service

**Typical Answers:**
- Primary use case: Customer Service
- Team size: 500-2000
- Budget: $30-50/user/month
- Compliance: SOC 2, ISO 27001, GDPR
- Ecosystem: Salesforce
- Implementation: Standard (3-6 months)

**Expected Top Recommendations:**
1. Agentforce (Salesforce)
2. Microsoft Copilot
3. Google Gemini

---

### Mid-Market Data Analysis

**Typical Answers:**
- Primary use case: Data Analysis
- Team size: 100-500
- Budget: $20-40/user/month
- Compliance: SOC 2
- Ecosystem: Microsoft 365
- Implementation: Fast (1-3 months)

**Expected Top Recommendations:**
1. Microsoft Copilot
2. ChatGPT Enterprise
3. Google Gemini

---

## 📊 Interpreting Results

### Match Breakdown

Each recommendation shows 3 sub-scores:

**Requirements Score (40% weight)**
```
How well the platform matches your needs:
├─ Use case alignment
├─ Team size support
└─ Integration capabilities
```

**Constraints Score (40% weight)**
```
Deal-breaker compliance:
├─ Budget fit
├─ Compliance certifications
├─ Ecosystem compatibility
└─ Data residency
```

**Priorities Score (20% weight)**
```
Nice-to-have features:
├─ Capability priorities
├─ Implementation speed
├─ Context window size
└─ Market position
```

### Confidence Indicator

```
90-100% = Very High Confidence
  • Strong match across all dimensions
  • Well-established platform
  • Complete data

75-89% = High Confidence
  • Good match overall
  • Minor gaps
  • Reliable data

60-74% = Medium Confidence
  • Decent match
  • Some uncertainties
  • Partial data

<60% = Low Confidence
  • Weak match or insufficient data
  • Review concerns carefully
```

---

## 🔍 Understanding Reasons

### Strengths (✅)

**Examples:**
- "Excellent for Code Generation (9/10 rating)"
  → Platform scores highly in your primary use case

- "Strong compliance coverage (6 certifications)"
  → Meets regulatory requirements

- "Market leader with 50% adoption"
  → Established, reliable choice

### Concerns (⚠️)

**Examples:**
- "Price ($40/user/mo) is 33% above your budget"
  → Budget constraint violation

- "Missing required certifications: HIPAA, FedRAMP"
  → Compliance gap

- "Not natively integrated with Google Workspace"
  → Ecosystem mismatch

### Differentiators (⭐)

**Examples:**
- "Large context window (200K tokens) for complex tasks"
  → Unique technical capability

- "Industry-standard baseline platform"
  → Widely adopted, safe choice

- "Highly customizable to your needs"
  → Flexibility advantage

---

## 📥 Export Options

### JSON Export

**What's included:**
```json
{
  "generatedAt": "2025-12-11T...",
  "client": "INT Inc.",
  "userRequirements": [...],
  "recommendations": [
    {
      "rank": 1,
      "platform": "Microsoft Copilot",
      "totalScore": 87,
      "confidence": 85,
      "breakdown": {...},
      "strengths": [...],
      "concerns": [...],
      "differentiators": [...]
    }
  ]
}
```

**Use cases:**
- Share with stakeholders
- Archive for later reference
- Import into other tools
- Attach to vendor RFPs

---

## 🚀 Next Steps After Recommendations

### Recommended Flow

**1. Review Top 3 (5 minutes)**
```
├─ Expand details for each
├─ Read strengths and concerns
├─ Note differentiators
└─ Eliminate clear mismatches
```

**2. Calculate ROI (10 minutes)**
```
For your top 1-2 picks:
├─ Click "Calculate ROI"
├─ Input your specific numbers
├─ Review financial projections
└─ Export ROI reports
```

**3. Deep Dive Comparison (15 minutes)**
```
├─ Select top 2-3 platforms
├─ Use Feature Matrix
├─ Review detailed specifications
└─ Check compliance details
```

**4. Vendor Engagement (Ongoing)**
```
├─ Request demos
├─ Run proof-of-concept
├─ Negotiate pricing
└─ Make final decision
```

---

## ❓ Quick FAQ

**Q: Can I change my answers?**
A: Yes, use the "Previous" button or "Start New Recommendation" to restart.

**Q: What if I skip questions?**
A: You'll still get recommendations, but confidence scores will be lower. Try to answer at least 7-8 questions for best results.

**Q: Why is the #2 recommendation sometimes better for me?**
A: The algorithm balances many factors. Review all top 3 - the best match for you might not be #1.

**Q: How often is the data updated?**
A: Platform data is updated monthly. Pricing, market share, and compliance info are kept current.

**Q: Can I save my progress?**
A: Not yet - this is coming in Phase 1.5. For now, complete the wizard in one session (~5 minutes).

**Q: Are recommendations biased?**
A: No. The algorithm has no vendor preferences. Recommendations are purely data-driven based on your inputs.

---

## 🎓 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between options |
| `Space` | Select option |
| `Enter` | Next question |
| `Esc` | Close (if modal) |
| `←` | Previous question |
| `→` | Next question |

---

## 🐛 Troubleshooting

### Common Issues

**Issue: Next button is disabled**
```
Solution: Answer the current question or click "Skip"
```

**Issue: Unexpected recommendations**
```
Solution: Review your answers - budget and compliance
         constraints heavily influence results
```

**Issue: Low confidence scores**
```
Solution: Answer more questions (aim for 9-11)
         and be specific with requirements
```

**Issue: Animation lag**
```
Solution: Close other browser tabs, refresh page
```

---

## 📞 Support

**For Help:**
- Check `/RECOMMENDATION_ENGINE_DOCS.md` for detailed docs
- Review this quick start guide
- Contact support team

**For Feedback:**
- Submit via in-app feedback form
- Email: support@intinc.com
- Include your export JSON for context

---

**Quick Start Version:** 1.0  
**Last Updated:** December 2025  
**Estimated Reading Time:** 5 minutes  
**Estimated Completion Time:** 5-7 minutes
