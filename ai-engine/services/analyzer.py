# ai-engine/services/analyzer.py
import hashlib

def analyze_code(code: str, language: str = "javascript"):
    lines = len(code.splitlines())
    score = 100
    issues = []
    recommendations = []

    # Security & Quality Rules
    if "eval(" in code:
        issues.append("CRITICAL: Use of eval() — Code Execution Risk")
        recommendations.append("Never use eval(). Refactor using safe alternatives.")
        score -= 50

    if "alert(" in code or "document.write(" in code:
        issues.append("Potential XSS vulnerability")
        recommendations.append("Avoid direct DOM manipulation in production")
        score -= 30

    if language == "javascript" and "var " in code:
        issues.append("Outdated 'var' usage")
        recommendations.append("Use 'let' or 'const' for block scoping")
        score -= 10

    if "console.log" in code:
        issues.append("Debug statement left in code")
        recommendations.append("Remove console.log before deployment")
        score -= 5

    if lines > 150:
        issues.append("Function/file too long")
        recommendations.append("Split into smaller, focused modules")
        score -= 20

    if not issues:
        issues.append("No issues detected — excellent code!")
        recommendations.append("Maintain this high standard!")

    return {
        "score": max(10, score),
        "issues": issues,
        "recommendations": recommendations,
        "securityIssues": sum(1 for i in issues if "CRITICAL" in i or "XSS" in i),
        "bestPractices": score >= 90
    }