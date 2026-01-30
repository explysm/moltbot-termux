# THESE ARE TODOS FOR MANUAL MERGING

1. What
Messages containing <think> tags inside code blocks or inline code
were being truncated when sent to Telegram.

Why
The stripReasoningTagsFromText function stripped reasoning tags
globally without respecting markdown code regions. When users discussed
or documented thinking tags, the filter would incorrectly process them,
causing message truncation.

How
Added findCodeRegions() to detect fenced code blocks and inline code
Added isInsideCode() to check if a position falls within code regions
Modified tag stripping logic to skip tags inside code regions
Changed regex from [^>]* to [^<>]* to prevent greedy matching
Testing
Added 21 unit tests covering:
Basic tag stripping functionality
Code block preservation (fenced and inline)
Edge cases (unclosed tags, whitespace, empty input)
Strict vs preserve modes
Trim options
All existing tests pass (no regressions)

2. fix(security): harden SSH target handling to prevent argument injection
Add hostname validation to reject targets starting with '-'
Add '--' delimiter before destination to prevent option injection
Prevents DoS via mDNS poisoning with malicious hostnames
Fixes CWE-88 (Argument Injection)


3. rename moltbot ascii to OpenClaw Termux
