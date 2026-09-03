/* ==========================================================================
   INTERVIEW QUESTION BANK
   --------------------------------------------------------------------------
   Every question here is either (a) reported by candidates on Glassdoor for a
   real company, or (b) published in an employer-facing hiring guide (Indeed,
   Tech Interview Handbook, Salesforce Ben, InterviewPrep, Infosec). None were
   invented. `source` names where it came from so a user can go read the
   original thread.

   `concepts` (technical questions only) is the answer key the feedback engine
   checks a user's response against. Each concept has a label the user sees
   and a list of regex fragments that count as having hit it. This is what
   makes the feedback role-specific instead of generic: missing "CIA triad" in
   a cybersecurity answer is named explicitly, not summarised as "add detail".

   `model` is the strong version of the answer, shown only after the user has
   attempted their own.
   ========================================================================== */

const QUESTIONS = {
  /* ------------------------------------------------------ software dev --- */
  'software-developer': [
    {
      type: 'behavioral',
      q: 'Tell me about a time you had a conflict with a co-worker.',
      source: { label: 'Tech Interview Handbook - 30 most common SWE behavioral questions' },
      model: {
        structure: ['Situation', 'Task', 'Action', 'Result'],
        text:
          'On my junior core team project, another developer and I disagreed about whether to ' +
          'refactor our data layer two days before the deadline. He wanted to ship as-is; I ' +
          'thought the duplicate query logic would break under demo load. Instead of arguing ' +
          'preference, I timeboxed 45 minutes to reproduce the failure with 200 simulated rows ' +
          'and showed him the query taking 4 seconds. We agreed to a narrower fix - extract just ' +
          'the shared query, leave the rest - which took 90 minutes rather than the full day I ' +
          'originally wanted. The demo ran clean, and we adopted "show the failure before ' +
          'arguing for the fix" as a team habit for the rest of the semester.'
      },
      tips:
        'Interviewers are checking whether you attack the problem or the person. Name the ' +
        'disagreement plainly, show the evidence you brought, and land on a compromise.'
    },
    {
      type: 'behavioral',
      q: 'Tell me about a time you needed information from someone who was not responsive. How did you handle it?',
      source: { label: 'Indeed Career Guide - 10 Behavioral Interview Questions for Software Engineers' },
      model: {
        structure: ['Situation', 'Task', 'Action', 'Result'],
        text:
          'During my internship I was blocked on an API contract that only one engineer on ' +
          'another team knew, and he had not answered two Slack messages in three days. Rather ' +
          'than escalate immediately, I wrote up exactly what I needed as three yes/no questions ' +
          'and posted them in his team channel where his teammates could also answer. One of them ' +
          'replied within an hour with the schema. I unblocked myself in a day instead of a week, ' +
          'and I started defaulting to specific, answerable questions in a public channel rather ' +
          'than open-ended DMs.'
      },
      tips:
        'The trap is sounding either passive ("I waited") or aggressive ("I escalated to his ' +
        'manager"). Show one self-directed step before escalation.'
    },
    {
      type: 'behavioral',
      q: 'Name a difficult challenge you faced while working on a project, how you overcame it, and what you learned.',
      source: { label: 'Tech Interview Handbook - 30 most common SWE behavioral questions' },
      model: {
        structure: ['Situation', 'Task', 'Action', 'Result', 'Learning'],
        text:
          'Our team inherited a class project where the previous group had no version control - ' +
          'just files named final_v3_REAL.js. With nine days left, I had to make four people able ' +
          'to work in parallel. I spent one evening putting it under Git, wrote a one-page branch ' +
          'and PR convention, and pair-walked each teammate through their first pull request. We ' +
          'went from one person editing at a time to four, and shipped two days early with zero ' +
          'overwrite incidents. What I learned is that process work feels like a detour and is ' +
          'usually the shortest path - I now set up the repo before writing any feature code.'
      },
      tips: 'End on the learning. Interviewers score the reflection as heavily as the fix.'
    },
    {
      type: 'technical',
      q: "What is your process when a program is crashing?",
      source: { label: 'Indeed Career Guide - Top 10 Programming/Coding Interview Questions' },
      concepts: [
        { label: 'Reproduce it reliably first', patterns: ['reproduc', 'consistent', 'repeat.{0,12}(it|bug|crash)', 'steps to'] },
        { label: 'Read the actual error / stack trace', patterns: ['stack trace', 'error message', 'traceback', 'exception', 'log'] },
        { label: 'Narrow the search space (bisect / isolate)', patterns: ['bisect', 'isolat', 'narrow', 'binary search', 'comment out', 'minimal'] },
        { label: 'Form and test one hypothesis at a time', patterns: ['hypothes', 'one.{0,10}(change|thing|variable)', 'assumption', 'theory'] },
        { label: 'Use a debugger or targeted logging', patterns: ['debugger', 'breakpoint', 'print', 'console\\.log', 'logging', 'step through'] },
        { label: 'Write a regression test so it stays fixed', patterns: ['regression', 'test case', 'unit test', 'write a test', 'add a test'] }
      ],
      model: {
        structure: ['Reproduce', 'Read the error', 'Isolate', 'Hypothesise', 'Fix', 'Lock it in'],
        text:
          'First I get a reliable reproduction - if I cannot make it crash on demand I am ' +
          'guessing. Then I actually read the stack trace rather than skimming it, because it ' +
          'usually names the file and line. Next I narrow the search space, either by bisecting ' +
          'recent commits or by cutting the input down to the smallest case that still fails. ' +
          'From there I form one hypothesis at a time and test it with a breakpoint or a targeted ' +
          'log line, changing one variable per run so I know what caused what. Once I find it I ' +
          'fix the root cause rather than the symptom, and I write a regression test that would ' +
          'have caught it, so it cannot silently come back.'
      },
      tips:
        'Entry-level interviewers are not testing whether you know a specific bug. They are ' +
        'testing whether you have a repeatable method or panic randomly.'
    },
    {
      type: 'technical',
      q: 'What happens after you type a website URL into your browser and press enter?',
      source: { label: 'Indeed Career Guide - Top 10 Programming/Coding Interview Questions' },
      concepts: [
        { label: 'DNS resolution (name to IP)', patterns: ['dns', 'domain name', 'name server', 'resolve.{0,15}(ip|address)'] },
        { label: 'TCP connection / handshake', patterns: ['tcp', 'handshake', 'socket', 'connection'] },
        { label: 'TLS / HTTPS encryption', patterns: ['tls', 'ssl', 'https', 'certificate', 'encrypt'] },
        { label: 'HTTP request sent to the server', patterns: ['http request', 'get request', 'request to the server', 'sends? (a|an) request'] },
        { label: 'Server processes and returns a response', patterns: ['server (respond|return|process|send)', 'response', 'status code'] },
        { label: 'Browser parses HTML and builds the DOM', patterns: ['parse', 'dom', 'render', 'html'] },
        { label: 'Additional assets fetched (CSS, JS, images)', patterns: ['css', 'javascript', 'asset', 'image', 'resource'] }
      ],
      model: {
        structure: ['Resolve', 'Connect', 'Secure', 'Request', 'Respond', 'Render'],
        text:
          'The browser first resolves the domain to an IP address through DNS, checking its own ' +
          'cache, then the OS, then a resolver upstream. With an IP it opens a TCP connection to ' +
          'that server, and for HTTPS it performs a TLS handshake to agree on encryption and ' +
          'verify the certificate. It then sends an HTTP GET request with headers like Host and ' +
          'Accept. The server routes that request, does whatever work it needs, and returns a ' +
          'status code plus the HTML body. The browser parses that HTML into a DOM, discovers ' +
          'references to CSS, JavaScript and images, fetches those in parallel, and paints the ' +
          'page - running JavaScript as it goes, which may trigger further requests.'
      },
      tips:
        'This is the single most common "do you understand the stack" question. You do not need ' +
        'every layer, but you should get from DNS to render without a gap.'
    },
    {
      type: 'technical',
      q: 'How comfortable are you reviewing code written by others? What process do you follow?',
      source: { label: 'Indeed Career Guide - 29 Software Engineer Interview Questions' },
      concepts: [
        { label: 'Understand the intent / read the PR description first', patterns: ['intent', 'purpose', 'description', 'what.{0,15}trying to', 'context', 'ticket'] },
        { label: 'Correctness before style', patterns: ['correct', 'logic', 'bug', 'edge case', 'before style', 'nitpick'] },
        { label: 'Check tests exist and cover the change', patterns: ['test', 'coverage', 'cases'] },
        { label: 'Readability and naming for the next maintainer', patterns: ['readab', 'naming', 'maintain', 'clear', 'understand later'] },
        { label: 'Comment kindly and specifically, ask rather than accuse', patterns: ['question', 'ask', 'suggest', 'kind', 'tone', 'non-?blocking', 'nit:'] },
        { label: 'Security and error handling', patterns: ['security', 'validation', 'error handling', 'injection', 'sanitiz'] }
      ],
      model: {
        structure: ['Intent', 'Correctness', 'Tests', 'Readability', 'Tone'],
        text:
          'I start by reading the description to understand what the change is supposed to do, ' +
          'because I cannot judge code I do not understand the intent of. Then I look for ' +
          'correctness first - logic errors, unhandled edge cases, missing input validation - ' +
          'before I touch anything stylistic. I check that tests exist and actually cover the new ' +
          'behaviour, not just that a test file changed. After that I look at readability and ' +
          'naming, since the next person to read it will not have the author available. For tone, ' +
          'I phrase things as questions when I might be missing context, and I label ' +
          'non-blocking comments as nits so the author knows what actually has to change.'
      },
      tips:
        'Teams care enormously about this because a bad reviewer slows everyone down. Mention ' +
        'tone explicitly - most candidates only talk about what they look for, not how they say it.'
    }
  ],

  /* --------------------------------------------------- systems analyst --- */
  'systems-analyst': [
    {
      type: 'behavioral',
      q: 'How have you balanced technical and business perspectives in your previous roles?',
      source: { label: 'Indeed Career Guide (India) - Business Systems Analyst Interview Questions' },
      model: {
        structure: ['Situation', 'Task', 'Action', 'Result'],
        text:
          'In a class consulting project for a local dental office, the owner wanted a full ' +
          'custom scheduling system and our developer wanted to build it. My job was to scope ' +
          'something deliverable in six weeks. I mapped their actual appointment workflow, ' +
          'counted how many steps were manual, and found that 80% of the pain was double-entry ' +
          'between two tools - not scheduling itself. I proposed an integration instead of a ' +
          'rebuild, with a one-page cost-benefit showing 6 hours/week saved versus 200+ dev hours ' +
          'for the custom build. The owner picked the integration, we delivered it in four weeks, ' +
          'and I learned to quantify the problem before agreeing to the solution someone asked for.'
      },
      tips:
        'The analyst job is saying no to the wrong build. Show that you measured before you ' +
        'recommended.'
    },
    {
      type: 'behavioral',
      q: 'How would you handle a situation where the development team says a user story is too large for a single sprint?',
      source: { label: 'Medium - Ace Your Next Interview: 10 Business Systems Analyst Questions' },
      model: {
        structure: ['Situation', 'Action', 'Result'],
        text:
          'I would treat that as useful information rather than pushback. First I would ask what ' +
          'specifically makes it large - unclear requirements, an unknown integration, or genuine ' +
          'scope. Then I would split it along a value seam, not a technical one: find the thinnest ' +
          'slice that still delivers something a user can do end-to-end, and move the rest into ' +
          'follow-up stories with explicit acceptance criteria. On my last project that turned a ' +
          '13-point story into a 3 and an 8, and the 3 shipped that sprint so stakeholders saw ' +
          'progress instead of a blank sprint review.'
      },
      tips:
        'Say "split along a value seam, not a technical one" - vertical vs horizontal slicing is ' +
        'the exact thing this question is testing.'
    },
    {
      type: 'behavioral',
      q: 'What organizational tools do you use to stay organized and efficient as a business systems analyst?',
      source: { label: 'Indeed Career Guide (Canada) - 41 Business System Analyst Interview Questions' },
      model: {
        structure: ['Tools', 'Method', 'Evidence'],
        text:
          'I keep three artifacts current rather than a long tool list. A requirements traceability ' +
          'matrix in a shared sheet, so every requirement maps to a story and a test. A single ' +
          'decision log with date, decision, and who approved it, which has saved me twice when ' +
          'someone remembered a decision differently. And the team board in Jira, where I write ' +
          'acceptance criteria before refinement rather than during it. The habit that matters ' +
          'more than the tools is a fifteen-minute end-of-day pass to update all three, because ' +
          'stale documentation is worse than none.'
      },
      tips:
        'Name specific artifacts (traceability matrix, decision log) rather than just software ' +
        'brands. That is what separates an analyst from a user of Jira.'
    },
    {
      type: 'technical',
      q: 'How can you help ensure a company’s business systems are scalable?',
      source: { label: 'Indeed Career Guide (Canada) - 41 Business System Analyst Interview Questions' },
      concepts: [
        { label: 'Understand current and projected volume', patterns: ['volume', 'growth', 'forecast', 'load', 'transaction', 'user count', 'capacity'] },
        { label: 'Identify bottlenecks before they bind', patterns: ['bottleneck', 'constraint', 'chokepoint', 'peak'] },
        { label: 'Design modular / loosely coupled processes', patterns: ['modular', 'decoupl', 'loosely coupled', 'component', 'microservice', 'api'] },
        { label: 'Avoid manual steps that do not scale with headcount', patterns: ['manual', 'automat', 'headcount', 'by hand'] },
        { label: 'Non-functional requirements documented explicitly', patterns: ['non-?functional', 'nfr', 'sla', 'performance requirement', 'requirement'] },
        { label: 'Test at projected load, not current load', patterns: ['load test', 'stress test', 'performance test', 'benchmark'] }
      ],
      model: {
        structure: ['Measure', 'Find the constraint', 'Design for it', 'Verify'],
        text:
          'Scalability starts as a requirements problem, not a technology problem. I would first ' +
          'establish current transaction volume and a projected figure the business will commit ' +
          'to - say 3x in two years - and write that down as an explicit non-functional ' +
          'requirement, because systems fail at the volume nobody wrote down. Then I would map ' +
          'the process end to end and find the constraint: usually a manual approval step or a ' +
          'single batch job, not the database. I would push for modular, loosely coupled ' +
          'components with clear interfaces so one piece can be scaled or replaced without ' +
          'touching the rest, and eliminate steps whose cost grows with headcount. Finally I ' +
          'would insist on load testing at the projected number, not the current one, before ' +
          'sign-off.'
      },
      tips:
        'The strong answer reframes scalability as requirements + constraints. A weak answer just ' +
        'says "use the cloud".'
    },
    {
      type: 'technical',
      q: 'Can you walk through your process for developing a business systems analysis report?',
      source: { label: 'Indeed Career Guide (Canada) - 41 Business System Analyst Interview Questions' },
      concepts: [
        { label: 'Define the problem and scope', patterns: ['scope', 'problem statement', 'objective', 'define'] },
        { label: 'Gather requirements from stakeholders', patterns: ['stakeholder', 'interview', 'elicit', 'workshop', 'gather'] },
        { label: 'Document current state vs future state', patterns: ['current state', 'as-?is', 'future state', 'to-?be', 'gap analysis'] },
        { label: 'Cost-benefit / options analysis', patterns: ['cost.{0,3}benefit', 'roi', 'options', 'alternative', 'trade-?off'] },
        { label: 'Recommendation with rationale', patterns: ['recommend', 'rationale', 'justif', 'propose'] },
        { label: 'Validate with stakeholders before finalising', patterns: ['validat', 'review', 'sign-?off', 'confirm', 'walkthrough'] }
      ],
      model: {
        structure: ['Scope', 'Elicit', 'As-is / To-be', 'Options', 'Recommend', 'Validate'],
        text:
          'I open with a scoped problem statement so everyone agrees what is and is not in ' +
          'question. Then I elicit requirements through stakeholder interviews and process ' +
          'walkthroughs, working across levels because managers and end users describe the same ' +
          'process very differently. I document the current state, then the proposed future ' +
          'state, and the gap between them becomes the body of the report. I present at least two ' +
          'options with a cost-benefit comparison rather than a single answer, because a report ' +
          'with one option reads as a decision already made. I close with a recommendation and ' +
          'explicit rationale, then walk it back to the stakeholders for validation before it is ' +
          'finalised - findings that surprise the reader in a final report are a process failure.'
      },
      tips:
        '"As-is / to-be / gap" is the vocabulary this role is screened on. Use it explicitly.'
    },
    {
      type: 'technical',
      q: 'What tools are essential for a business systems analyst?',
      source: { label: 'Indeed Career Guide (Canada) - 41 Business System Analyst Interview Questions' },
      concepts: [
        { label: 'SQL for querying source data directly', patterns: ['sql', 'quer', 'database'] },
        { label: 'Process/data modeling notation (BPMN, ERD, UML)', patterns: ['bpmn', 'erd', 'uml', 'flowchart', 'data model', 'process map', 'visio', 'lucid'] },
        { label: 'Requirements / ticket tracking (Jira, Azure DevOps)', patterns: ['jira', 'azure devops', 'confluence', 'ticket', 'backlog'] },
        { label: 'Spreadsheets for analysis and traceability', patterns: ['excel', 'spreadsheet', 'sheet', 'pivot'] },
        { label: 'BI / visualization (Tableau, Power BI)', patterns: ['tableau', 'power ?bi', 'dashboard', 'visualiz'] },
        { label: 'Wireframing to make requirements concrete', patterns: ['wireframe', 'mockup', 'figma', 'prototype'] }
      ],
      model: {
        structure: ['Query', 'Model', 'Track', 'Communicate'],
        text:
          'The one I would not give up is SQL, because being able to check a claim against the ' +
          'source data instead of asking someone to run a report changes how fast I can work. ' +
          'For modeling I use BPMN or simple swimlane diagrams for process and ERDs for data, ' +
          'built in Lucidchart or Visio. For tracking, Jira with Confluence for the requirements ' +
          'themselves, plus a traceability matrix in Excel so nothing silently drops. And for ' +
          'communicating to stakeholders, either a Power BI view or a wireframe - a wireframe ' +
          'surfaces misunderstandings about requirements faster than any written document, ' +
          'because people react to a picture.'
      },
      tips:
        'Lead with SQL and explain why. Listing six tools with no reasoning is the median answer.'
    }
  ],

  /* ------------------------------------------------------ data analyst --- */
  'data-analyst': [
    {
      type: 'behavioral',
      q: 'Walk us through a recent project where you solved a challenging problem, and the approach you took.',
      source: { label: 'Glassdoor - "Data analyst" candidate-reported interview questions' },
      model: {
        structure: ['Situation', 'Task', 'Action', 'Result'],
        text:
          'For a class project analysing three years of campus dining transactions, the raw ' +
          'export had duplicate rows from a mid-year POS migration - about 8% of records. My task ' +
          'was a revenue-by-hour analysis, and the duplicates were quietly inflating the lunch ' +
          'peak. I found them by checking for identical timestamp-plus-amount pairs within a ' +
          'five-second window, confirmed with the dining office that the migration overlapped, ' +
          'and wrote a deduplication step in SQL rather than deleting rows by hand so the work ' +
          'was reproducible. The corrected analysis moved the peak recommendation from 12:15 to ' +
          '11:45, which changed the staffing recommendation we gave. The lesson I kept is to ' +
          'profile the data for integrity before analysing it - I now run row counts and ' +
          'duplicate checks before any aggregation.'
      },
      tips:
        'Include a number. Data analyst answers without a single quantity read as hypothetical.'
    },
    {
      type: 'behavioral',
      q: 'Tell me about a time you had to change the way you generally approach a problem.',
      source: { label: 'Glassdoor - "Data analyst" candidate-reported interview questions' },
      model: {
        structure: ['Situation', 'Task', 'Action', 'Result'],
        text:
          'My default is to build the full model first and present at the end. On a group project ' +
          'for a nonprofit, I spent a week building an elaborate churn model and presented it - ' +
          'and the director told me she could not act on any of it because she needed to know ' +
          'which donors to call this month, not a probability distribution. I rebuilt the output ' +
          'as a ranked call list of 40 names with one reason each. Same underlying model, ' +
          'completely different artifact. She used it that week. Now I ask "what decision does ' +
          'this feed?" before I start building, which has saved me more time than any technical ' +
          'skill I picked up that year.'
      },
      tips:
        'The best version of this answer shows you changed a habit, not just a tool.'
    },
    {
      type: 'behavioral',
      q: 'Discuss a specific project where you used Python and SQL, including the challenges you faced.',
      source: { label: 'Glassdoor / InterviewQuery - Data Analyst Interview Questions + Guide' },
      model: {
        structure: ['Project', 'Stack', 'Challenge', 'Result'],
        text:
          'I built a dashboard tracking intramural signup conversion across a semester. SQL did ' +
          'the heavy lifting - joining registrations to a sessions table and using a window ' +
          'function to get each student’s first signup date - and Python (pandas) handled the ' +
          'messy part, which was normalising free-text team names that had 60+ spellings of the ' +
          'same six teams. The challenge was that fuzzy matching produced false merges, so I ' +
          'capped it with a similarity threshold and manually reviewed the 30 pairs in the grey ' +
          'zone rather than trusting the algorithm. Final dataset was clean enough that the ' +
          'intramural office used the conversion figures to move their signup deadline, which ' +
          'lifted completed registrations about 12% the following semester.'
      },
      tips:
        'Name the specific SQL feature (window function, CTE) and the specific pandas problem. ' +
        'Generic "I used Python and SQL" tells the interviewer nothing.'
    },
    {
      type: 'technical',
      q: 'How are joins used in SQL?',
      source: { label: 'Glassdoor - "Data analyst" candidate-reported interview questions' },
      concepts: [
        { label: 'Joins combine rows across tables on a key', patterns: ['combine', 'related', 'key', 'on ', 'match', 'two tables'] },
        { label: 'INNER JOIN keeps only matches', patterns: ['inner', 'only.{0,20}match', 'both tables'] },
        { label: 'LEFT / RIGHT JOIN keeps unmatched rows from one side', patterns: ['left join', 'right join', 'left outer', 'keeps? all'] },
        { label: 'FULL OUTER JOIN keeps both sides', patterns: ['full outer', 'full join'] },
        { label: 'NULLs appear where no match exists', patterns: ['null'] },
        { label: 'Watch for fan-out / row multiplication on one-to-many', patterns: ['duplicat', 'fan.?out', 'one-?to-?many', 'multipl', 'grain', 'cardinal'] }
      ],
      model: {
        structure: ['Definition', 'Types', 'Gotcha'],
        text:
          'A join combines rows from two tables based on a related column, usually a key. An ' +
          'INNER JOIN returns only rows where the key exists on both sides. A LEFT JOIN returns ' +
          'every row from the left table and fills NULL where the right side has no match, which ' +
          'is what you want when you are asking "which customers have no orders". RIGHT JOIN is ' +
          'the mirror, and FULL OUTER keeps unmatched rows from both. The thing that actually ' +
          'bites analysts is fan-out: if the right table has multiple rows per key, your left ' +
          'rows get duplicated and any SUM downstream is silently wrong. So I check the grain of ' +
          'both tables and compare row counts before and after the join.'
      },
      tips:
        'Every candidate can name the join types. Mentioning fan-out / row multiplication is what ' +
        'separates someone who has actually broken a report from someone who has read a tutorial.'
    },
    {
      type: 'technical',
      q: 'How do you handle NULL values in SQL queries?',
      source: { label: 'Indeed Career Guide (India) - 32 Data Analyst SQL Interview Questions' },
      concepts: [
        { label: 'IS NULL / IS NOT NULL, never = NULL', patterns: ['is null', 'is not null', 'cannot use =', "can'?t use ="] },
        { label: 'COALESCE / IFNULL / ISNULL to substitute a default', patterns: ['coalesce', 'ifnull', 'isnull', 'nvl', 'default value'] },
        { label: 'NULLs are excluded from aggregates like AVG and COUNT(col)', patterns: ['aggregate', 'avg', 'count\\(', 'sum', 'ignore', 'exclude'] },
        { label: 'NULL propagates through arithmetic and comparisons', patterns: ['propagat', 'arithmetic', 'comparison', 'unknown', 'three-?valued'] },
        { label: 'Decide with the business whether NULL means zero or unknown', patterns: ['business', 'unknown', 'missing', 'means', 'stakeholder', 'zero'] },
        { label: 'Watch NOT IN with NULLs returning no rows', patterns: ['not in', 'anti.?join', 'not exists'] }
      ],
      model: {
        structure: ['Test', 'Substitute', 'Aggregate behaviour', 'Business meaning'],
        text:
          'You test for NULL with IS NULL or IS NOT NULL - a comparison like = NULL always ' +
          'evaluates to unknown, so it silently returns nothing. To substitute a value I use ' +
          'COALESCE, which takes the first non-null argument. The behaviour that catches people ' +
          'is aggregation: AVG and COUNT(column) skip NULLs entirely, so an average over a column ' +
          'that is 40% NULL is an average of the other 60%, not of everything. NULL also ' +
          'propagates through arithmetic, so any expression touching it becomes NULL. And NOT IN ' +
          'against a subquery containing a NULL returns zero rows, which is a classic silent bug ' +
          '- I use NOT EXISTS instead. Before any of that though, I ask the business whether NULL ' +
          'here means zero or means unknown, because those two get handled completely differently.'
      },
      tips:
        'The "= NULL does not work" point and the aggregate-skipping point are the two the ' +
        'interviewer is listening for.'
    },
    {
      type: 'technical',
      q: 'Explain p-values and hypothesis testing as you would use them in an analysis.',
      source: { label: 'Glassdoor - Discover Data Analyst interview report (SQL + Python + stats round)' },
      concepts: [
        { label: 'Null and alternative hypothesis stated first', patterns: ['null hypothes', 'alternative', 'h0', 'h1', 'no difference'] },
        { label: 'p-value = probability of data this extreme IF null is true', patterns: ['if the null', 'assuming', 'given.{0,15}null', 'as extreme', 'probability of'] },
        { label: 'Significance level chosen before the test', patterns: ['alpha', '0\\.05', 'significance level', 'threshold', 'beforehand', 'in advance'] },
        { label: 'p-value is NOT the probability the hypothesis is true', patterns: ['not the probability', 'common misconception', 'does not mean', 'misinterpret'] },
        { label: 'Statistical vs practical significance', patterns: ['practical', 'effect size', 'business.{0,15}(mean|significan)', 'magnitude', 'meaningful'] },
        { label: 'Sample size affects what you can detect', patterns: ['sample size', 'power', 'large sample', 'small sample'] }
      ],
      model: {
        structure: ['Set up', 'Define', 'Decide', 'Caveat'],
        text:
          'I start by stating a null hypothesis - typically that there is no difference between ' +
          'two groups - and an alternative. The p-value is the probability of seeing data at ' +
          'least as extreme as what I observed, assuming the null is true. It is not the ' +
          'probability that the null is true, which is the most common misreading of it. I pick ' +
          'my significance level before running the test, usually 0.05, because choosing it after ' +
          'seeing the result is how you talk yourself into a conclusion. And I always separate ' +
          'statistical from practical significance: with a large enough sample almost any ' +
          'difference becomes significant, so I report the effect size next to the p-value and ' +
          'ask whether a lift that small would change what the business does.'
      },
      tips:
        'Stating explicitly that a p-value is not "the probability the hypothesis is true" is a ' +
        'strong signal. Most candidates get this wrong.'
    }
  ],

  /* ------------------------------------------------------ cybersecurity --- */
  cybersecurity: [
    {
      type: 'behavioral',
      q: 'Describe a time you explained a complex security issue to someone with no IT knowledge. How did you keep your language accessible?',
      source: { label: 'Indeed Career Guide (Australia) - 47 Cyber Security Interview Questions' },
      model: {
        structure: ['Situation', 'Task', 'Action', 'Result'],
        text:
          'I was the tech lead for a student club and discovered we had been sharing one ' +
          'password for the club email across nine officers, some of whom had graduated. I had ' +
          'to convince a non-technical president to change it. I did not talk about credential ' +
          'hygiene - I said "seven people who no longer hold office can read every message this ' +
          'account gets, including the ones with member phone numbers." That landed immediately. ' +
          'I then gave two options with the effort spelled out, and she picked a password manager ' +
          'with per-officer accounts. We rotated within a week and removed six stale accounts. ' +
          'What I took from it is to lead with who can do what, not with the mechanism.'
      },
      tips:
        'Security roles screen hard for this. Show the actual sentence you said - concrete ' +
        'language beats describing that you used simple language.'
    },
    {
      type: 'behavioral',
      q: 'What unique qualities would you bring to our cybersecurity team?',
      source: { label: 'Indeed Career Guide (UK) - 35 Cyber Security Interview Questions' },
      model: {
        structure: ['Claim', 'Evidence', 'Fit'],
        text:
          'Two things. First, I come from an information systems programme rather than pure ' +
          'computer science, so I am trained to ask what a control costs the business, not just ' +
          'whether it is technically stronger - which matters when you are asking a finance team ' +
          'to accept friction. Second, I have built the habit of writing things up: I documented ' +
          'our club’s access review in a one-pager that the next officer actually used, and ' +
          'security work that is not written down does not survive turnover. I know I am early - ' +
          'I have Security+ material about half done and no incident response experience yet - so ' +
          'what I would bring on day one is careful documentation and a willingness to ask before ' +
          'I touch production.'
      },
      tips:
        'Naming a genuine gap alongside your strengths reads as honest rather than weak, ' +
        'especially in security where overconfidence is a real risk.'
    },
    {
      type: 'behavioral',
      q: 'Tell me about a time you showed leadership.',
      source: { label: 'Indeed Career Guide (Canada) - 57 Security Analyst Interview Questions' },
      model: {
        structure: ['Situation', 'Task', 'Action', 'Result'],
        text:
          'Our four-person class team lost a member two weeks before a deadline and momentum ' +
          'collapsed - nobody wanted to absorb his part. I did not have any formal authority, so ' +
          'I broke his work into three specific chunks with time estimates instead of asking who ' +
          'wanted to help, and took the largest one myself. Framing it as three two-hour tasks ' +
          'rather than "cover for Ben" got both others to claim one within a day. We submitted on ' +
          'time. What I learned is that people do not resist helping, they resist unbounded ' +
          'commitments - so leadership without authority is mostly making the ask specific.'
      },
      tips:
        'Leadership stories from students are stronger when they involve no formal authority. ' +
        'Say so explicitly.'
    },
    {
      type: 'technical',
      q: 'Explain the CIA triad and how it guides day-to-day security decisions.',
      source: { label: 'Eduyush - Top Cybersecurity Analyst Interview Questions (core areas reported across real interviews)' },
      concepts: [
        { label: 'Confidentiality - only authorised parties can read', patterns: ['confidential', 'authoriz|authoris', 'only.{0,20}(access|read)', 'disclosure'] },
        { label: 'Integrity - data is not altered undetectably', patterns: ['integrity', 'alter', 'tamper', 'accurate', 'unchanged', 'hash'] },
        { label: 'Availability - authorised users can get to it when needed', patterns: ['availab', 'uptime', 'accessible when', 'denial of service', 'ddos'] },
        { label: 'The three trade off against each other', patterns: ['trade-?off', 'tension', 'balance', 'at the expense', 'conflict'] },
        { label: 'Concrete controls mapped to each', patterns: ['encrypt', 'access control', 'backup', 'checksum', 'redundan', 'mfa', 'least privilege'] }
      ],
      model: {
        structure: ['Define', 'Map to controls', 'Show the trade-off'],
        text:
          'The CIA triad is the three properties every security control is ultimately protecting. ' +
          'Confidentiality means only authorised parties can read the data - enforced with ' +
          'encryption, access control, least privilege. Integrity means data cannot be altered ' +
          'without detection - hashing, checksums, audit logs, change control. Availability means ' +
          'authorised users can actually reach it when they need it - redundancy, backups, DDoS ' +
          'protection. The reason it is a useful model rather than a list is that the three trade ' +
          'off against each other: encrypting everything and requiring MFA on every action raises ' +
          'confidentiality and hurts availability, and an aggressive backup retention policy helps ' +
          'availability while widening the confidentiality exposure. So in practice I use it to ' +
          'ask which property a given decision is buying and which one it is spending.'
      },
      tips:
        'Anyone can list C, I and A. The trade-off point is the answer that gets remembered.'
    },
    {
      type: 'technical',
      q: 'What is the difference between a virus and a worm?',
      source: { label: 'Springboard - 53 Cyber Security Interview Questions & Answers' },
      concepts: [
        { label: 'A virus requires a host file or user action', patterns: ['host', 'attach', 'user.{0,20}(action|execut|open|run)', 'requires', 'needs a'] },
        { label: 'A worm self-replicates and spreads on its own', patterns: ['self-?replicat', 'own', 'without.{0,20}(user|human|interaction)', 'autonomous', 'independent'] },
        { label: 'Worms spread over networks', patterns: ['network', 'propagat', 'spread.{0,20}network', 'across machines'] },
        { label: 'Worms typically spread faster / wider', patterns: ['faster', 'rapid', 'quickly', 'wider', 'scale'] },
        { label: 'A concrete example', patterns: ['wannacry', 'conficker', 'stuxnet', 'iloveyou', 'melissa', 'blaster', 'code red', 'morris'] }
      ],
      model: {
        structure: ['Virus', 'Worm', 'Why it matters'],
        text:
          'A virus attaches itself to a host file or program and needs a user to do something - ' +
          'open the file, run the executable - before it can execute and spread. A worm is ' +
          'standalone and self-replicating: it propagates across a network on its own without any ' +
          'user interaction, typically by exploiting a service vulnerability. That difference is ' +
          'why worms scale so much faster - WannaCry moved through unpatched SMB across ' +
          'thousands of hosts in hours, which no virus dependent on someone clicking could match. ' +
          'Operationally it changes your response too: for a virus you are largely looking at ' +
          'user behaviour and endpoint controls, while for a worm you are looking at network ' +
          'segmentation and patch level, and containment means isolating segments fast.'
      },
      tips:
        'Adding a named example (WannaCry) and the operational consequence turns a definition ' +
        'into a strong answer.'
    },
    {
      type: 'technical',
      q: 'What is your process for building a secure network for an organisation that has nothing beyond a basic security framework?',
      source: { label: 'Indeed Career Guide (Australia) - 47 Cyber Security Interview Questions' },
      concepts: [
        { label: 'Inventory assets first - you cannot protect what you cannot see', patterns: ['inventor', 'asset', 'discover', 'what.{0,15}(we have|exists)', 'catalog'] },
        { label: 'Risk assessment: threats, vulnerabilities, likelihood, impact', patterns: ['risk assess', 'threat', 'vulnerab', 'likelihood', 'impact'] },
        { label: 'Least privilege and identity/access management', patterns: ['least privilege', 'access control', 'identity', 'iam', 'mfa', 'rbac', 'permission'] },
        { label: 'Network segmentation', patterns: ['segment', 'vlan', 'zone', 'dmz', 'isolat'] },
        { label: 'Patch management and secure baselines', patterns: ['patch', 'baseline', 'hardening', 'update', 'configuration'] },
        { label: 'Monitoring / logging / SIEM', patterns: ['monitor', 'logging', 'siem', 'detect', 'alert'] },
        { label: 'Incident response and recovery plan tested, not just written', patterns: ['incident response', 'disaster recovery', 'backup', 'tabletop', 'test.{0,15}plan', 'playbook'] }
      ],
      model: {
        structure: ['Inventory', 'Assess risk', 'Control', 'Monitor', 'Prepare to fail'],
        text:
          'I would start with an asset inventory, because every control decision after that ' +
          'depends on knowing what exists - systems, data stores, who owns each, and what is ' +
          'internet-facing. Then a risk assessment: for each asset, what are the credible threats ' +
          'and vulnerabilities, and what is the likelihood and impact, so remediation gets ' +
          'prioritised by risk rather than by whatever is easiest. On controls I would go for the ' +
          'highest-leverage basics first - MFA and least-privilege access, a patch management ' +
          'process with defined SLAs, and network segmentation so a compromise in one zone does ' +
          'not reach finance. Then monitoring, because prevention will eventually fail: ' +
          'centralised logging into a SIEM with alerting on the handful of events that actually ' +
          'matter, rather than everything. And finally an incident response and recovery plan ' +
          'that gets tested with a tabletop exercise - an untested plan is a document, not a ' +
          'capability.'
      },
      tips:
        '"Inventory first" and "assume prevention fails" are the two framing moves that make ' +
        'this sound like an analyst rather than a checklist.'
    }
  ],

  /* ------------------------------------------------------ web developer --- */
  'web-developer': [
    {
      type: 'behavioral',
      q: 'Explain your favourite project and the methods you used to complete it.',
      source: { label: 'Indeed Career Guide - Web Developer Interview Questions' },
      model: {
        structure: ['What', 'Why it mattered', 'How', 'Outcome'],
        text:
          'I built a single-page scheduling tool for my ward’s service projects because ' +
          'coordination was happening across three group texts and people kept double-booking. I ' +
          'kept the stack deliberately boring - vanilla JS, no framework, data in localStorage - ' +
          'because the person maintaining it after me would not know React. I did the layout ' +
          'mobile-first since almost everyone opened it on a phone, and tested with four actual ' +
          'users before shipping, which caught that my date picker was unusable one-handed. About ' +
          '60 people used it over two months and the double-bookings stopped. The decision I am ' +
          'most happy with is choosing the boring stack - it is still running and I have not ' +
          'touched it in a year.'
      },
      tips:
        'Interviewers listen for a technical decision with a stated reason. "I chose X because Y" ' +
        'is the whole game.'
    },
    {
      type: 'behavioral',
      q: 'How do you approach working with other developers, designers, content creators and project managers?',
      source: { label: 'Indeed Career Guide (India) - Top 10 Web Developer Interview Questions' },
      model: {
        structure: ['Principle', 'Practice', 'Example'],
        text:
          'My working assumption is that each of those roles is optimising for something ' +
          'different and all of it is legitimate - the designer for the experience, the PM for ' +
          'the date, me for maintainability. So I try to surface the trade-off early rather than ' +
          'silently resolving it in code. Concretely, when a design came in with a custom ' +
          'animated dropdown two weeks from launch, I did not just build it or refuse it - I gave ' +
          'the designer two options with time costs, the custom one at about a day and an ' +
          'accessible native one at an hour, and flagged the accessibility difference. She took ' +
          'the native version and spent the saved time on the onboarding flow, which mattered ' +
          'more. Giving people costed options works better than either compliance or pushback.'
      },
      tips: 'The phrase "costed options" is a strong, concrete answer to a soft question.'
    },
    {
      type: 'behavioral',
      q: 'What led you into web development, and how have you moved between front-end, back-end or full-stack work?',
      source: { label: 'Indeed Career Guide (India) - Top 10 Web Developer Interview Questions' },
      model: {
        structure: ['Origin', 'Progression', 'Where you are now'],
        text:
          'I started on the front end because I could see the result immediately - my first real ' +
          'project was rebuilding a family business site that was unusable on a phone. That ' +
          'pulled me into CSS layout and then into JavaScript when static was not enough. I moved ' +
          'toward the back end when I hit the limit of what I could do without persistence, and ' +
          'built a small Node and Postgres API for a class project. Right now I would call myself ' +
          'front-end leaning full-stack: strongest in HTML, CSS and JavaScript, comfortable ' +
          'writing and consuming a REST API, and still building depth in database design. For an ' +
          'internship I would rather go deep on front-end work than claim both ends evenly.'
      },
      tips:
        'Being specific about where you are weaker is a strength here - it tells the interviewer ' +
        'you can assess your own level, which they will otherwise have to test for.'
    },
    {
      type: 'technical',
      q: 'How would you improve a web page that is loading slowly?',
      source: { label: 'Indeed Career Guide - Web Developer Interview Questions' },
      concepts: [
        { label: 'Measure first with real tooling', patterns: ['measure', 'profil', 'lighthouse', 'devtools', 'network tab', 'waterfall', 'benchmark', 'metric'] },
        { label: 'Optimise and correctly size images', patterns: ['image', 'compress', 'webp', 'avif', 'resize', 'lazy'] },
        { label: 'Reduce and minify JS/CSS payload', patterns: ['minif', 'bundle', 'tree.?shak', 'payload', 'reduce.{0,15}(js|javascript|css)', 'code split'] },
        { label: 'Caching and CDN', patterns: ['cach', 'cdn', 'etag', 'expires', 'edge'] },
        { label: 'Reduce request count / blocking resources', patterns: ['requests', 'blocking', 'defer', 'async', 'critical'] },
        { label: 'Server / query time and compression', patterns: ['server', 'quer', 'database', 'gzip', 'brotli', 'ttfb', 'compress'] }
      ],
      model: {
        structure: ['Measure', 'Find the biggest cost', 'Fix', 'Re-measure'],
        text:
          'I would measure before changing anything - Lighthouse plus the network waterfall in ' +
          'DevTools, because "slow" can mean a slow server response, a huge payload, or blocking ' +
          'render, and those have completely different fixes. Usually the biggest single win is ' +
          'images: serving correctly sized and modern formats like WebP, and lazy-loading ' +
          'anything below the fold. Next I would look at the JavaScript payload - minify, code ' +
          'split, and defer or async anything not needed for first paint, since render-blocking ' +
          'scripts in the head are a common cause. Then caching: proper cache headers on static ' +
          'assets and a CDN so bytes are served from near the user. If time to first byte is the ' +
          'problem it is server side instead - usually an unindexed query - and I would enable ' +
          'compression. Then I re-measure, because performance work without a before-and-after ' +
          'number is guessing.'
      },
      tips:
        '"Measure first, re-measure after" is the framing that makes this answer sound ' +
        'professional. Diving straight to fixes is the common mistake.'
    },
    {
      type: 'technical',
      q: 'How do you make sure your websites and applications are accessible to users?',
      source: { label: 'Indeed Career Guide - Web Developer Interview Questions' },
      concepts: [
        { label: 'Semantic HTML before ARIA', patterns: ['semantic', 'html element', 'button.{0,20}div', 'native', 'heading', 'landmark'] },
        { label: 'Keyboard navigability and visible focus', patterns: ['keyboard', 'tab', 'focus'] },
        { label: 'Colour contrast', patterns: ['contrast', 'colou?r'] },
        { label: 'Alt text and labels for non-text content', patterns: ['alt', 'label', 'aria-label', 'screen ?reader'] },
        { label: 'Test with assistive tech / automated audits', patterns: ['screen ?reader', 'voiceover', 'nvda', 'axe', 'lighthouse', 'wave', 'audit', 'test'] },
        { label: 'WCAG as the standard', patterns: ['wcag', 'aa', 'section 508', 'ada', 'guideline'] }
      ],
      model: {
        structure: ['Semantics', 'Keyboard', 'Contrast', 'Verify'],
        text:
          'I start with semantic HTML, because most accessibility comes free if you use a real ' +
          'button instead of a div with a click handler - it gets keyboard focus, an accessible ' +
          'role and Enter/Space handling with no extra work. ARIA is for when semantics genuinely ' +
          'run out, not a first resort. Then I check the whole flow with the keyboard alone: ' +
          'everything reachable in a sensible order, and a visible focus indicator, which people ' +
          'often delete for looks. I check colour contrast against WCAG AA, 4.5:1 for body text. ' +
          'Images get alt text that describes purpose rather than appearance, and form inputs get ' +
          'real labels. Then I verify with an automated audit like axe or Lighthouse for the ' +
          'mechanical failures, and at minimum a pass with a screen reader, since automated tools ' +
          'catch maybe a third of real issues.'
      },
      tips:
        '"Automated tools catch about a third" is a detail that signals you have actually done ' +
        'this rather than read about it.'
    },
    {
      type: 'technical',
      q: 'How would you create an endpoint for a new inventory item, and what makes a REST API well designed?',
      source: { label: 'Glassdoor - Indeed Software Developer interview report (REST API screening)' },
      concepts: [
        { label: 'Correct HTTP verb (POST to create)', patterns: ['post', 'verb', 'method', 'get.{0,10}put.{0,10}delete', 'idempot'] },
        { label: 'Resource-noun URL, plural collection', patterns: ['/inventory', '/items', 'resource', 'noun', 'plural', 'endpoint path', 'url'] },
        { label: 'Validate the request body', patterns: ['validat', 'schema', 'required field', 'sanitiz', 'check the'] },
        { label: 'Meaningful status codes (201, 400, 404, 500)', patterns: ['201', '200', '400', '404', '409', '500', 'status code'] },
        { label: 'Return the created resource / its identifier', patterns: ['return', 'response body', 'location header', 'id'] },
        { label: 'Authentication and authorisation', patterns: ['auth', 'token', 'permission', 'jwt', 'api key'] },
        { label: 'Error handling that does not leak internals', patterns: ['error', 'exception', 'leak', 'stack trace', 'message'] }
      ],
      model: {
        structure: ['Verb + path', 'Validate', 'Persist', 'Respond', 'Secure'],
        text:
          'It would be POST /inventory/items, because creating a resource is a POST and the path ' +
          'is a plural noun collection rather than a verb like /createItem. The handler first ' +
          'validates the request body against a schema - required fields, types, and sane ranges ' +
          'on things like quantity - and rejects with a 400 and a message naming which field ' +
          'failed. Assuming it validates, I persist it and return 201 Created with the created ' +
          'resource including its new id, and a Location header pointing at it. If an item with ' +
          'that SKU already exists that is a 409 Conflict, not a 400. The endpoint sits behind ' +
          'authentication, and I check the caller is authorised to write to that inventory rather ' +
          'than just that they are logged in. Errors get logged server-side with detail but ' +
          'return a generic message to the client, so I am not leaking stack traces.'
      },
      tips:
        'Distinguishing 400 from 409, and authentication from authorisation, are the two details ' +
        'that mark a strong entry-level answer.'
    }
  ],

  /* -------------------------------------------------------- ux designer --- */
  'ux-designer': [
    {
      type: 'behavioral',
      q: 'Which of your prior projects is your favourite, and which did you find least enjoyable? Why?',
      source: { label: 'Indeed Career Guide (India) - Interview Questions For UX Designers' },
      model: {
        structure: ['Favourite + why', 'Least + why', 'What it revealed'],
        text:
          'My favourite was redesigning the check-in flow for a campus food pantry, because I got ' +
          'to watch eight real users struggle with the existing form before I designed anything - ' +
          'and the actual problem turned out to be that people did not want to be seen filling it ' +
          'out in the lobby, which no amount of form redesign would have fixed. We moved it to a ' +
          'phone-based check-in. My least favourite was a group project where the client had ' +
          'already decided the solution and wanted mockups of it. I did the work, but without ' +
          'access to users I was decorating a decision rather than designing. What that pair ' +
          'taught me is that my enjoyment tracks almost exactly with whether I have access to ' +
          'users - which is now the first thing I ask about a project.'
      },
      tips:
        'Do not answer the "least enjoyable" half with a fake weakness. Naming a real structural ' +
        'frustration and what you learned reads as maturity.'
    },
    {
      type: 'behavioral',
      q: 'What do you do when a client expresses dissatisfaction with a design?',
      source: { label: 'Indeed Career Guide (India) - Interview Questions For UX Designers' },
      model: {
        structure: ['Listen', 'Diagnose', 'Reframe', 'Resolve'],
        text:
          'My first move is to separate the reaction from the reason - "I do not like it" is data ' +
          'but not a brief. I ask what specifically is not working and, more usefully, what they ' +
          'expected to see, because the gap is usually a misalignment about goals rather than ' +
          'taste. On one project a client hated a dashboard I was proud of, and it turned out he ' +
          'needed to answer one question at a glance and I had designed for exploration. That was ' +
          'my miss, not his. I reframed the conversation around the decision the screen had to ' +
          'support, redesigned around a single hero metric, and he approved it that day. When the ' +
          'disagreement really is preference rather than goals, I say so directly and bring ' +
          'evidence - usability findings or a quick five-user test.'
      },
      tips:
        'The strongest version of this answer includes a case where the client was right and you ' +
        'were wrong.'
    },
    {
      type: 'behavioral',
      q: 'What is your process for deciding which features make it into a final product and which get cut?',
      source: { label: 'Indeed Hiring Guide - 5 UX Designer Interview Questions' },
      model: {
        structure: ['Criteria', 'Method', 'Example'],
        text:
          'I try to make it a criteria question rather than an opinion question. The three I use ' +
          'are: does it serve the primary user job this release is about, what does it cost to ' +
          'build and maintain, and what is the evidence anyone wants it. Features with no ' +
          'evidence beyond a stakeholder request get prototyped, not built. On the food pantry ' +
          'project we had eleven requested features and six weeks. I mapped each to the primary ' +
          'job - get checked in quickly and privately - and five did not serve it at all, ' +
          'including a nutrition-tracking feature that one board member badly wanted. Cutting it ' +
          'was easier because we were arguing against stated criteria rather than against him. ' +
          'The ones we shipped got usability tested; two were revised, one was dropped after ' +
          'testing showed nobody found it.'
      },
      tips:
        'Naming explicit criteria makes prioritisation defensible. That is the skill being tested.'
    },
    {
      type: 'technical',
      q: 'How is UX design different from UI design?',
      source: { label: 'Indeed Career Guide - 10 UX Designer Interview Questions' },
      concepts: [
        { label: 'UI is the interface surface itself', patterns: ['interface', 'visual', 'look', 'button', 'layout', 'colou?r', 'typograph'] },
        { label: 'UX is the whole experience of achieving a goal', patterns: ['experience', 'journey', 'end.?to.?end', 'goal', 'whole', 'overall'] },
        { label: 'UX includes research, IA, flows - not just screens', patterns: ['research', 'information architecture', 'flow', 'user testing', 'wireframe', 'journey map'] },
        { label: 'Good UI does not guarantee good UX', patterns: ['does not (mean|guarantee|imply)', 'beautiful but', 'good ui.{0,25}(bad|poor)', 'not necessarily'] },
        { label: 'A concrete example of the difference', patterns: ['for example', 'e\\.g\\.', 'example', 'imagine', 'think of'] }
      ],
      model: {
        structure: ['Define UI', 'Define UX', 'Show the gap'],
        text:
          'UI is the interface itself - the layout, controls, type and colour a person actually ' +
          'touches. UX is the whole experience of getting something done, which includes ' +
          'research into what people are trying to do, the information architecture, the flow ' +
          'across screens, and everything before and after the interface, including error states ' +
          'and the email that arrives afterwards. The key point is that good UI does not ' +
          'necessarily imply good UX. A beautifully designed checkout that requires account ' +
          'creation before it shows shipping cost has excellent UI and poor UX, because the ' +
          'experience of the task is bad regardless of how the buttons look. UI is a subset of ' +
          'the surface area UX is responsible for.'
      },
      tips:
        'Interviewers ask this specifically to check whether you think UX means "making it ' +
        'pretty". Say the "good UI does not imply good UX" line explicitly.'
    },
    {
      type: 'technical',
      q: 'What process do you follow as a UX designer?',
      source: { label: 'Indeed Hiring Guide - 5 UX Designer Interview Questions' },
      concepts: [
        { label: 'Discover / research the problem before designing', patterns: ['research', 'discover', 'interview', 'observ', 'understand the problem'] },
        { label: 'Define the problem and success criteria', patterns: ['define', 'problem statement', 'success', 'criteria', 'goal', 'persona', 'jtbd'] },
        { label: 'Ideate and explore multiple directions', patterns: ['ideat', 'sketch', 'explore', 'multiple', 'alternatives', 'brainstorm'] },
        { label: 'Prototype at the lowest fidelity that answers the question', patterns: ['prototyp', 'wireframe', 'low.?fidelity', 'mockup', 'paper'] },
        { label: 'Test with real users and iterate', patterns: ['usability test', 'test with', 'iterat', 'feedback', 'validate'] },
        { label: 'Hand off and follow through with engineering', patterns: ['hand.?off', 'developer', 'engineer', 'spec', 'implement'] }
      ],
      model: {
        structure: ['Discover', 'Define', 'Ideate', 'Prototype', 'Test', 'Ship'],
        text:
          'I use a discover-define-ideate-prototype-test loop, but the part I would emphasise is ' +
          'that I do not treat it as linear. Discovery is user interviews and observing the ' +
          'current workaround, because people describe what they do differently from how they do ' +
          'it. Define turns that into a problem statement and success criteria I can be wrong ' +
          'about later. Ideation is deliberately multiple directions - if I only sketch one, I ' +
          'have chosen before I have compared. I prototype at the lowest fidelity that answers ' +
          'the open question: paper if I am testing flow, high fidelity only when I am testing ' +
          'visual comprehension, because high fidelity too early makes people critique colour ' +
          'instead of structure. Then usability testing with five or so users, iterate, and stay ' +
          'involved through handoff, since implementation decisions change the experience.'
      },
      tips:
        'The "lowest fidelity that answers the question" principle is a strong, specific thing to ' +
        'say. It shows judgement rather than a memorised process.'
    },
    {
      type: 'technical',
      q: 'Which applications have excellent UX design, and why are they better than the rest?',
      source: { label: 'Indeed Career Guide (India) - Interview Questions For UX Designers' },
      concepts: [
        { label: 'Names a specific product', patterns: ['spotify', 'notion', 'stripe', 'duolingo', 'figma', 'airbnb', 'google maps', 'venmo', 'slack', 'apple', 'uber', 'gmail', 'linear'] },
        { label: 'Explains the user goal it serves well', patterns: ['goal', 'trying to', 'task', 'job', 'need'] },
        { label: 'Points to a specific design decision, not vibes', patterns: ['because', 'the way it', 'specific', 'for instance', 'decision', 'chose'] },
        { label: 'Mentions reducing friction / cognitive load', patterns: ['friction', 'cognitive load', 'steps', 'effort', 'simple', 'fewer'] },
        { label: 'Notes a weakness or trade-off too', patterns: ['however', 'trade-?off', 'downside', 'weakness', 'but it', 'at the cost'] }
      ],
      model: {
        structure: ['Product', 'The job it serves', 'The specific decision', 'The trade-off'],
        text:
          'Stripe’s checkout is the one I point to. The user job is narrow - pay and get out - ' +
          'and almost every decision serves that. Card fields autodetect the card type and format ' +
          'the number as you type, so you never think about spacing; validation happens inline ' +
          'rather than on submit, so you fix errors where you made them; and it asks for the ' +
          'minimum information for the transaction rather than the maximum the business would ' +
          'like. That is a reduction in cognitive load at each step, not a visual style. The ' +
          'trade-off is that it is deliberately generic-looking, so it gives up brand expression ' +
          'to feel familiar and trustworthy - which for a payment form is the right trade, but it ' +
          'is a real cost, and a consumer app optimising for delight would not make the same call.'
      },
      tips:
        'Naming a trade-off is what separates a designer from a fan. Never answer this one with ' +
        'praise alone.'
    }
  ],

  /* --------------------------------------------------------- qa tester --- */
  'qa-tester': [
    {
      type: 'behavioral',
      q: 'Tell me about a time you worked with other team members to solve a problem.',
      source: { label: 'Resume Worded - QA Software Tester Interview Questions' },
      model: {
        structure: ['Situation', 'Task', 'Action', 'Result'],
        text:
          'On a class project our build broke intermittently and the two developers each thought ' +
          'the other’s changes caused it, which stalled for three days. I offered to isolate it ' +
          'rather than take a side. I ran the test suite twenty times on each of the last four ' +
          'commits and logged pass/fail, which showed the failure appearing on one specific ' +
          'commit but only about a third of the time - a race condition, not either person’s ' +
          'logic being wrong. Having data ended the argument in one meeting. We added a wait ' +
          'condition and the suite went green. What I took from it is that in a disagreement ' +
          'between developers the tester’s most useful contribution is evidence, not opinion.'
      },
      tips:
        'QA interviews reward showing you can deliver bad news without creating conflict. Frame ' +
        'yourself as the source of evidence.'
    },
    {
      type: 'behavioral',
      q: 'How do you demonstrate that you are a team player when your job is finding fault in other people’s work?',
      source: { label: 'Glassdoor - "QA tester" candidate-reported interview questions' },
      model: {
        structure: ['Principle', 'Practice', 'Example'],
        text:
          'I treat a defect report as being about the product, never about the person, and I put ' +
          'work into making it easy to act on rather than easy to write. That means exact repro ' +
          'steps, expected versus actual, environment, and a screenshot or log - so the developer ' +
          'spends their time fixing rather than reconstructing. I also verify before filing, ' +
          'because a bad bug report costs the team more than a missed bug. On my last project I ' +
          'started dropping a one-line note in the channel before filing anything severe, so the ' +
          'developer heard it from me directly rather than from a ticket notification. That ' +
          'changed the relationship noticeably - they started asking me to look at things early, ' +
          'which is where testing is cheapest.'
      },
      tips: '"Costs the team more than a missed bug" is a line that lands well with QA leads.'
    },
    {
      type: 'behavioral',
      q: 'How do you ensure your team follows quality assurance procedures?',
      source: { label: 'Indeed Career Guide - 40 Quality Assurance Specialist Interview Questions' },
      model: {
        structure: ['Make it easy', 'Make it visible', 'Make it owned'],
        text:
          'Mostly by making the right thing the easy thing rather than by enforcement. A ' +
          'checklist in the pull request template gets followed; a wiki page nobody opens does ' +
          'not. On our project I moved the definition of done into the PR template as five ' +
          'checkboxes, and compliance went from occasional to nearly universal without me asking ' +
          'anyone. Second, make the state visible - a simple pass/fail column on the board meant ' +
          'nobody had to ask what was tested. And third, when a procedure keeps getting skipped I ' +
          'assume the procedure is wrong before assuming the person is careless. We had a manual ' +
          'regression step everyone skipped because it took forty minutes; automating the ' +
          'top-ten path fixed it properly.'
      },
      tips:
        '"Assume the procedure is wrong before the person is careless" is a memorable, mature ' +
        'answer to a process question.'
    },
    {
      type: 'technical',
      q: 'Explain the general stages of a defect / bug life cycle.',
      source: { label: 'Indeed Career Guide - QA Interview Questions' },
      concepts: [
        { label: 'New / Open when first logged', patterns: ['new', 'open', 'logged', 'reported', 'raised'] },
        { label: 'Assigned / triaged to a developer with a priority', patterns: ['assign', 'triage', 'priorit', 'severity'] },
        { label: 'In progress / fixed by the developer', patterns: ['in progress', 'fixed', 'resolv', 'working on'] },
        { label: 'Retested / verified by QA', patterns: ['retest', 'verif', 'confirm', 'test again', 'validate'] },
        { label: 'Closed when verified', patterns: ['closed'] },
        { label: 'Reopened if the fix fails', patterns: ['reopen', 'fails.{0,20}retest', 'back to'] },
        { label: 'Rejected / deferred / duplicate as valid outcomes', patterns: ['reject', 'defer', 'duplicate', 'not a bug', "won'?t fix", 'as designed'] }
      ],
      model: {
        structure: ['New', 'Triage', 'Fix', 'Verify', 'Close'],
        text:
          'A defect starts as New or Open when it is logged with repro steps, expected and actual ' +
          'behaviour. It gets triaged - assigned to a developer with a severity and a priority, ' +
          'which are separate things: severity is impact on the system, priority is how soon the ' +
          'business needs it. The developer moves it to In Progress and then Fixed. It comes back ' +
          'to QA for retest in the environment it was reported against, and if it passes it goes ' +
          'to Closed. If the fix does not hold it is Reopened rather than logged fresh, so the ' +
          'history stays together. There are also legitimate exits that are not fixes - Rejected ' +
          'when it is working as designed, Duplicate, and Deferred when it is real but not worth ' +
          'fixing this release. Getting those recorded honestly matters, because a backlog that ' +
          'only contains open bugs hides what the team decided not to do.'
      },
      tips:
        'Distinguishing severity from priority is the detail QA leads listen for. Almost nobody ' +
        'volunteers it.'
    },
    {
      type: 'technical',
      q: 'What makes a good test case?',
      source: { label: 'Indeed Career Guide - QA Interview Questions' },
      concepts: [
        { label: 'Clear objective - tests one thing', patterns: ['one thing', 'single', 'specific', 'objective', 'atomic', 'focused'] },
        { label: 'Preconditions and test data stated', patterns: ['precondition', 'setup', 'test data', 'prerequisite', 'initial state'] },
        { label: 'Unambiguous, repeatable steps', patterns: ['steps', 'repeatab', 'reproduc', 'unambiguous', 'anyone can'] },
        { label: 'Explicit expected result', patterns: ['expected', 'result', 'outcome', 'pass.{0,10}criteria'] },
        { label: 'Independent of other test cases', patterns: ['independ', 'isolat', 'not rely', 'standalone', 'any order'] },
        { label: 'Traceable to a requirement', patterns: ['traceab', 'requirement', 'user story', 'acceptance criteria', 'maps to'] }
      ],
      model: {
        structure: ['One objective', 'Preconditions', 'Steps', 'Expected result', 'Independent'],
        text:
          'A good test case tests exactly one thing, so when it fails you know what broke without ' +
          'investigating. It states its preconditions and test data explicitly - which user, what ' +
          'state the system starts in - because a case that only passes on my machine is not a ' +
          'test. The steps are unambiguous enough that someone who has never seen the feature can ' +
          'execute it identically. It has one explicit expected result, written before execution, ' +
          'not "verify it works". It is independent of other cases, so the suite can run in any ' +
          'order or in parallel and one failure does not cascade. And it traces back to a ' +
          'requirement or acceptance criterion, so coverage is measurable and you can tell what ' +
          'is untested rather than just counting how many tests you have.'
      },
      tips:
        '"Expected result written before execution" and "independent so it can run in any order" ' +
        'are the two markers of experience here.'
    },
    {
      type: 'technical',
      q: 'Explain the difference between load testing, stress testing and volume testing.',
      source: { label: 'Indeed Career Guide - QA Interview Questions' },
      concepts: [
        { label: 'Load = expected/normal usage levels', patterns: ['expected', 'normal', 'anticipated', 'typical', 'peak.{0,15}normal'] },
        { label: 'Stress = beyond capacity, to find the breaking point', patterns: ['beyond', 'breaking point', 'break', 'limit', 'until it fails', 'extreme', 'overload'] },
        { label: 'Volume = large amounts of data specifically', patterns: ['volume.{0,25}data', 'large.{0,20}data', 'database size', 'amount of data', 'records'] },
        { label: 'Different questions each answers', patterns: ['question', 'purpose', 'goal', 'tells you', 'answers'] },
        { label: 'Graceful degradation / recovery after stress', patterns: ['recover', 'graceful', 'degrad', 'comes back', 'restore'] }
      ],
      model: {
        structure: ['Load', 'Stress', 'Volume', 'Why separate'],
        text:
          'Load testing runs the system at expected usage - if we anticipate 500 concurrent ' +
          'users at peak, we test at 500 and confirm response times stay within the SLA. Stress ' +
          'testing deliberately goes past capacity to find the breaking point and, just as ' +
          'importantly, to see how it breaks: does it degrade gracefully and recover when load ' +
          'drops, or does it corrupt data and stay down. Volume testing is about the size of the ' +
          'data rather than the number of users - the same 50 users against a table with 50 ' +
          'million rows instead of 50 thousand, which surfaces missing indexes and pagination ' +
          'that never show up in load testing. They are separate because they answer different ' +
          'questions, and a system can pass load testing comfortably and still fall over in year ' +
          'three purely from accumulated data.'
      },
      tips:
        'The recovery point in stress testing - "how it breaks, not just when" - is the strongest ' +
        'part of this answer.'
    }
  ],

  /* -------------------------------------------------------- it auditor --- */
  'it-auditor': [
    {
      type: 'behavioral',
      q: 'How would you handle discovering evidence of fraud during an audit?',
      source: { label: 'Indeed Career Guide - 33 Auditor Interview Questions' },
      model: {
        structure: ['Do not investigate alone', 'Preserve', 'Escalate per policy', 'Document'],
        text:
          'The one thing I would not do is start investigating it myself or confront the person, ' +
          'because that risks tipping them off and compromising evidence, and it is outside my ' +
          'role. I would preserve what I found exactly as found - no changes to the records, ' +
          'screenshots and timestamps documented contemporaneously - and I would escalate ' +
          'immediately through the channel the firm’s policy specifies, which is typically the ' +
          'audit partner or engagement manager, and in some structures directly to the audit ' +
          'committee if management may be involved. I would keep it strictly confidential, ' +
          'including from colleagues not on the engagement. And I would document what I observed ' +
          'factually rather than characterising it as fraud, because determining intent is not my ' +
          'call - my job is to report the anomaly accurately and let the process work.'
      },
      tips:
        'The tested instinct is whether you report rather than stay silent or freelance an ' +
        'investigation. Say "I would not investigate it myself" explicitly.'
    },
    {
      type: 'behavioral',
      q: 'Tell me about a time when an audit result exceeded your expectations.',
      source: { label: 'Indeed Career Guide (India) - Interview Questions and Answers for an Auditor' },
      model: {
        structure: ['Situation', 'Expectation', 'What happened', 'Learning'],
        text:
          'Reviewing our student club’s finances at the end of a term, I expected to find sloppy ' +
          'receipts and instead found that the treasurer had built a reconciliation habit nobody ' +
          'asked for - every transaction matched to a receipt within a week. My expectation had ' +
          'been shaped by the previous year, which was a mess. Two things came out of it. First I ' +
          'wrote up what she was doing as a one-page procedure so it survived her leaving office, ' +
          'because good controls that live in one person’s head are not controls. Second, I ' +
          'realised I had walked in with a conclusion and had been looking for evidence to ' +
          'support it, which is exactly the bias audit procedures exist to prevent. I now write ' +
          'down what I expect to find before I start, so I can notice when I am fitting evidence ' +
          'to a prior.'
      },
      tips:
        'Auditors are hired for skepticism about their own conclusions. Showing you caught your ' +
        'own bias is unusually strong.'
    },
    {
      type: 'behavioral',
      q: 'Describe the steps you take after completing an audit.',
      source: { label: 'Indeed Hiring Guide - Auditor Interview Questions' },
      model: {
        structure: ['Draft', 'Validate facts', 'Report', 'Follow up'],
        text:
          'I draft findings while the work is fresh, each one structured the same way: condition, ' +
          'criteria, cause, effect, and recommendation - so the reader can see what the standard ' +
          'was and how far off it we are, not just that something is wrong. Then I validate the ' +
          'facts with the process owner before the report goes anywhere. That is not asking ' +
          'permission for the finding, it is confirming I have not misunderstood how the process ' +
          'works, and it prevents the meeting where a finding collapses because I missed a ' +
          'compensating control. Then the formal report to management with findings ranked by ' +
          'risk rather than by discovery order. And the step people skip: agreed remediation ' +
          'owners and dates, with follow-up scheduled. An audit that ends at the report has ' +
          'produced a document, not an improvement.'
      },
      tips:
        '"Condition, criteria, cause, effect, recommendation" is the standard finding structure. ' +
        'Naming it signals you know the profession.'
    },
    {
      type: 'technical',
      q: 'How would you scope and execute an IT risk assessment?',
      source: { label: 'Infosec - IT Auditor Interview Questions and Answers' },
      concepts: [
        { label: 'Identify and inventory assets', patterns: ['asset', 'inventor', 'identify.{0,20}(system|data)', 'scope', 'catalog'] },
        { label: 'Identify threats and vulnerabilities', patterns: ['threat', 'vulnerab', 'weakness', 'exposure'] },
        { label: 'Assess likelihood and impact', patterns: ['likelihood', 'probabilit', 'impact', 'consequence', 'magnitude'] },
        { label: 'Rank / prioritise by risk', patterns: ['priorit', 'rank', 'risk rating', 'heat map', 'matrix', 'high.{0,10}medium.{0,10}low'] },
        { label: 'Evaluate existing controls (inherent vs residual risk)', patterns: ['existing control', 'residual', 'inherent', 'mitigat', 'compensating'] },
        { label: 'Recommend remediation with owners', patterns: ['remediat', 'recommend', 'owner', 'action plan', 'treatment'] },
        { label: 'Risk appetite / acceptance is a business decision', patterns: ['appetite', 'toleran', 'accept', 'business decision', 'management decides'] }
      ],
      model: {
        structure: ['Scope', 'Threats', 'Likelihood x Impact', 'Controls', 'Prioritise', 'Report'],
        text:
          'I scope it first by identifying the assets in question - systems, data, and the ' +
          'processes that depend on them - because an unscoped risk assessment never finishes. ' +
          'For each asset I identify credible threats and the vulnerabilities that would let them ' +
          'land, then assess likelihood and impact to get an inherent risk rating. Then I ' +
          'evaluate the controls that already exist and rate residual risk, because the gap ' +
          'between inherent and residual is what the control environment is actually buying. I ' +
          'rank everything on a consistent scale so remediation is prioritised by risk rather ' +
          'than by whoever complained loudest. Findings go out with recommended treatments and ' +
          'named owners. The part I would be careful to state is that accepting a risk is ' +
          'management’s decision, not mine - my job is to make sure the decision is informed and ' +
          'documented, not to make it.'
      },
      tips:
        'Inherent versus residual risk, and "risk acceptance is management’s call", are the two ' +
        'phrases that mark a real audit answer.'
    },
    {
      type: 'technical',
      q: 'How do you maintain independence when reporting IT control weaknesses?',
      source: { label: 'Infosec - IT Auditor Interview Questions and Answers' },
      concepts: [
        { label: 'Do not audit work you performed or designed', patterns: ['own work', 'designed', 'implemented', 'self.?review', 'conflict of interest'] },
        { label: 'Report through a line independent of the audited function', patterns: ['reporting line', 'audit committee', 'board', 'independent of', 'not report to'] },
        { label: 'Evidence-based findings, not opinion', patterns: ['evidence', 'documented', 'workpaper', 'support', 'fact'] },
        { label: 'Disclose relationships / potential conflicts', patterns: ['disclose', 'declare', 'relationship', 'recuse'] },
        { label: 'Professional skepticism', patterns: ['skeptic', 'sceptic', 'verify', 'corroborat', 'independent'] },
        { label: 'Consistent standards regardless of who is audited', patterns: ['consistent', 'same standard', 'regardless', 'without favour', 'objectiv'] }
      ],
      model: {
        structure: ['Structural independence', 'Personal independence', 'Evidence', 'Consistency'],
        text:
          'Independence has a structural part and a personal part. Structurally, internal audit ' +
          'should report functionally to the audit committee rather than to the IT leadership ' +
          'whose controls it is testing, and I should never audit a system I helped design or ' +
          'implement - that is a self-review threat, and if it came up I would recuse and ' +
          'disclose it. Personally it means findings are grounded in evidence in the workpapers ' +
          'rather than my impression, so a finding survives someone senior disagreeing with it. ' +
          'It also means applying the same standard regardless of who owns the process - the ' +
          'quiet failure mode is softening a finding because the owner is senior or friendly. ' +
          'And it means professional skepticism as a default: I corroborate what I am told rather ' +
          'than accepting it, not because I assume bad faith but because unverified assertions ' +
          'are not audit evidence.'
      },
      tips:
        'Naming the "self-review threat" and the audit committee reporting line shows genuine ' +
        'familiarity with the profession.'
    },
    {
      type: 'technical',
      q: 'How familiar are you with auditing standards and regulations such as SOX, GAAP or COBIT?',
      source: { label: 'Indeed Career Guide - 33 Auditor Interview Questions' },
      concepts: [
        { label: 'SOX and IT general controls', patterns: ['sox', 'sarbanes', 'itgc', 'general control', 'internal control over financial'] },
        { label: 'A control framework (COBIT, COSO, NIST, ISO 27001)', patterns: ['cobit', 'coso', 'nist', 'iso 27001', 'framework'] },
        { label: 'Access, change and operations control domains', patterns: ['access', 'change management', 'segregation of duties', 'sod', 'operations', 'backup'] },
        { label: 'Honest about current level of familiarity', patterns: ['coursework', 'class', 'learning', 'studying', 'not yet', 'limited', 'familiar with.{0,20}from'] },
        { label: 'Concrete plan to close the gap (CISA)', patterns: ['cisa', 'certif', 'studying', 'plan to', 'working toward'] }
      ],
      model: {
        structure: ['What you know', 'From where', 'What you do not', 'The plan'],
        text:
          'I would be straightforward about my level. From coursework I understand the purpose of ' +
          'SOX - that public companies must maintain and attest to internal control over ' +
          'financial reporting, and that IT general controls matter because financial data sits ' +
          'in systems, so access management, change management and operations are in scope. I ' +
          'understand COBIT as a governance framework mapping IT processes to control objectives, ' +
          'and COSO as the broader internal control framework it aligns to. Where I have hands-on ' +
          'exposure is limited to a class project testing segregation of duties in a small ERP ' +
          'configuration. I have not worked a real SOX cycle. I am working through CISA material ' +
          'now with the intent to sit for it once I have the experience requirement, and I would ' +
          'expect to spend my first months learning the firm’s methodology rather than assuming ' +
          'my coursework transfers directly.'
      },
      tips:
        'Overclaiming here is fatal - auditors test for it professionally. A precise account of ' +
        'what you know, from where, plus a plan, beats a confident bluff.'
    }
  ],

  /* --------------------------------------------------- erp consultant --- */
  'erp-consultant': [
    {
      type: 'behavioral',
      q: 'How do you keep stakeholders from multiple departments on the same page during an implementation?',
      source: { label: 'InterviewPrep - 20 Common Salesforce Consultant Interview Questions' },
      model: {
        structure: ['Situation', 'Method', 'Result'],
        text:
          'The failure mode is that each department hears a different version of scope and finds ' +
          'out at go-live. On a class implementation project with three stakeholder groups, I ' +
          'used three things. A single written scope document with an explicit out-of-scope ' +
          'section, because what is excluded causes more conflict than what is included. A ' +
          'standing fifteen-minute weekly sync with one representative from each group, so ' +
          'decisions were made in front of everyone rather than relayed. And a decision log with ' +
          'date and approver, which settled two "we never agreed to that" moments without ' +
          'argument. When finance and ops genuinely conflicted on an approval workflow, I did not ' +
          'try to mediate the preference - I escalated it to the sponsor with both options and ' +
          'the cost of each, and got a decision in a day.'
      },
      tips:
        'The out-of-scope section and the decision log are specific, credible artifacts. ' +
        'Consulting interviews reward artifacts over intentions.'
    },
    {
      type: 'behavioral',
      q: 'How do you handle miscommunication between technical developers and non-technical business stakeholders?',
      source: { label: 'Indeed Career Guide (India) - Interview Questions And Answers For A SAP Consultant' },
      model: {
        structure: ['Diagnose', 'Translate', 'Verify', 'Example'],
        text:
          'Most of what looks like miscommunication is two groups using the same word for ' +
          'different things. On one project "customer" meant a billing account to the developers ' +
          'and an individual contact to the sales team, and we built two weeks on that gap before ' +
          'anyone noticed. Now I build a shared glossary early and make people define terms out ' +
          'loud rather than nodding. When I translate, I go both directions - I tell the business ' +
          'what a technical constraint costs them in their terms, and I tell developers what the ' +
          'business outcome is rather than passing along a solution. And I verify by asking the ' +
          'other side to restate the requirement back, or better, by showing a mockup or ' +
          'configured screen, because people catch a misunderstanding in a screenshot that they ' +
          'will nod along to in a document.'
      },
      tips:
        'The "same word, different meaning" diagnosis is the most common real cause and shows ' +
        'you have been in the room.'
    },
    {
      type: 'behavioral',
      q: 'How do you stay informed about best practices on your platform?',
      source: { label: 'InterviewPrep - 20 Common Salesforce Consultant Interview Questions' },
      model: {
        structure: ['Sources', 'Cadence', 'Application'],
        text:
          'For Salesforce specifically I work through Trailhead modules - I have completed the ' +
          'Admin Beginner and Data Modeling trails and I am partway through the Admin ' +
          'certification path. I follow the three release notes a year, because the platform ' +
          'changes under you and a consultant recommending a workaround for something that ' +
          'shipped natively last release loses credibility fast. I read Salesforce Ben for ' +
          'practitioner-level writing, and I am in a local user group, which is where I learn ' +
          'what actually broke for people rather than what the documentation says. The habit that ' +
          'makes it stick is building the thing in a developer org rather than just reading about ' +
          'it - I set up a small nonprofit-style org to practise flows and permission sets.'
      },
      tips:
        'Naming a free developer org and specific Trailhead trails proves the claim. "I read blogs" ' +
        'does not.'
    },
    {
      type: 'technical',
      q: 'What is the difference between Profiles and Roles in Salesforce?',
      source: { label: 'Indeed Career Guide (Singapore) - Interview Questions for a Salesforce Consultant' },
      concepts: [
        { label: 'Profiles control what a user can DO (object/field permissions)', patterns: ['profile.{0,40}(what|permission|do|object|field|crud)', 'object.?level', 'field.?level', 'create.{0,10}read.{0,10}edit'] },
        { label: 'Roles control what a user can SEE (record visibility)', patterns: ['role.{0,40}(see|visib|record|access|sharing)', 'record.?level', 'hierarchy'] },
        { label: 'Role hierarchy rolls visibility upward', patterns: ['hierarch', 'roll.{0,5}up', 'above', 'manager.{0,20}see', 'upward'] },
        { label: 'Every user needs a Profile; a Role is optional', patterns: ['required', 'must have', 'optional', 'every user'] },
        { label: 'Permission sets extend profiles without cloning them', patterns: ['permission set', 'extend', 'grant additional', 'without.{0,20}(clone|new profile)'] },
        { label: 'Sharing rules / OWD interact with roles', patterns: ['sharing rule', 'owd', 'organi[sz]ation.?wide', 'default'] }
      ],
      model: {
        structure: ['Profile = can do', 'Role = can see', 'How they combine'],
        text:
          'The short version is that a Profile controls what a user can do and a Role controls ' +
          'what they can see. A Profile sets object-level and field-level permissions - whether ' +
          'you can create, read, edit or delete Accounts, and which fields are visible or ' +
          'editable - plus things like login hours and app access. Every user must have exactly ' +
          'one Profile. A Role sits in the role hierarchy and drives record-level visibility: ' +
          'users higher in the hierarchy can see records owned by people below them. A Role is ' +
          'optional, though you need one for hierarchy-based sharing to work. In practice they ' +
          'work with the org-wide defaults and sharing rules - OWD sets the baseline restriction ' +
          'and roles and sharing rules open it back up. And rather than cloning a Profile every ' +
          'time one user needs one extra permission, I would use a Permission Set, which keeps ' +
          'the number of Profiles manageable.'
      },
      tips:
        'The "do versus see" framing plus the permission-set point is exactly what a Salesforce ' +
        'interviewer wants to hear.'
    },
    {
      type: 'technical',
      q: 'Two sets of users share the same object but need different visibility on one field. How do you solve it - Page Layouts or Field-Level Security?',
      source: { label: 'Salesforce Ben - 30 Salesforce Consultant Interview Questions & Answers' },
      concepts: [
        { label: 'Field-Level Security is the real security control', patterns: ['field.?level security', 'fls', 'actual security', 'true security', 'enforced'] },
        { label: 'Page layouts only affect the UI, not API/report access', patterns: ['page layout.{0,50}(ui|display|visual|only)', 'api', 'report', 'still access', 'not secure', 'workaround'] },
        { label: 'Use FLS when the data must genuinely be hidden', patterns: ['sensitive', 'must be hidden', 'confidential', 'salary', 'ssn', 'genuinely'] },
        { label: 'Use layouts for decluttering / relevance', patterns: ['declutter', 'relevan', 'tidy', 'organiz|organis', 'cleaner'] },
        { label: 'FLS is set per profile or permission set', patterns: ['profile', 'permission set'] }
      ],
      model: {
        structure: ['Ask what "visibility" means', 'FLS for security', 'Layouts for relevance'],
        text:
          'My first question would be whether this is a security requirement or a usability one, ' +
          'because the answer differs. If the field genuinely must not be seen by one group - ' +
          'say a cost or compensation field - it has to be Field-Level Security, set per profile ' +
          'or permission set. Page layouts only control what renders on the record page; the data ' +
          'is still reachable through reports, list views, the API and even the URL, so using a ' +
          'layout as a security control is a real and common mistake. If instead the field is ' +
          'simply irrelevant to one group and the goal is a cleaner page, a page layout is the ' +
          'right tool and is much less disruptive. In practice I would often use both: FLS to ' +
          'enforce the boundary, and layouts on top so each group sees a page that fits how they ' +
          'work.'
      },
      tips:
        'This question exists specifically to catch people who think page layouts are security. ' +
        'Say the API/reports point out loud.'
    },
    {
      type: 'technical',
      q: 'What are the SAP MM, FI, SD and HR modules used for, and how do they interact?',
      source: { label: 'Indeed Career Guide - 10 SAP MM Interview Questions' },
      concepts: [
        { label: 'MM = Materials Management (procurement, inventory)', patterns: ['mm.{0,30}(material|procure|purchas|inventor)', 'materials management'] },
        { label: 'FI = Financial Accounting (GL, AP, AR, reporting)', patterns: ['fi.{0,30}(financ|accounting|general ledger|gl|ap|ar)', 'financial accounting'] },
        { label: 'SD = Sales and Distribution (orders, delivery, billing)', patterns: ['sd.{0,30}(sales|distribut|order|billing|deliver)', 'sales and distribution'] },
        { label: 'HR/HCM = Human Capital (payroll, personnel)', patterns: ['hr.{0,30}(human|payroll|personnel|employee)', 'hcm', 'human capital'] },
        { label: 'Modules share one integrated data model', patterns: ['integrat', 'single', 'shared', 'real.?time', 'same database', 'one system'] },
        { label: 'A concrete cross-module flow (e.g. goods receipt posts to FI)', patterns: ['goods receipt', 'posts to', 'automatically.{0,25}(fi|financ|account)', 'flows? (in)?to', 'triggers', 'journal entry'] }
      ],
      model: {
        structure: ['Each module', 'The integration point', 'Why it matters'],
        text:
          'MM is Materials Management - procurement, purchase orders, goods receipt and ' +
          'inventory. FI is Financial Accounting - the general ledger, accounts payable and ' +
          'receivable, and statutory reporting. SD is Sales and Distribution - sales orders, ' +
          'pricing, delivery and billing. HR, or HCM, covers personnel administration, payroll ' +
          'and time. The reason SAP is valuable is that they are not separate applications ' +
          'passing files - they share one integrated data model, so a transaction in one posts ' +
          'through the others in real time. The example I would give is a goods receipt in MM ' +
          'automatically generating the accounting document in FI that debits inventory and ' +
          'credits GR/IR, with no re-entry. Likewise an SD billing document posts a receivable in ' +
          'FI. For a consultant that matters because a configuration change in one module has ' +
          'downstream financial effects, which is why cross-module testing exists.'
      },
      tips:
        'The goods-receipt-to-FI posting is the canonical example. Having one concrete cross-module ' +
        'flow ready makes the answer.'
    }
  ],

  /* ------------------------------------------------ it project manager --- */
  'it-project-manager': [
    {
      type: 'behavioral',
      q: 'Tell me about a time a project milestone was delayed. How did you recover?',
      source: { label: 'Indeed Hiring Guide: Project Manager - real PM-hiring-team questions' },
      model: {
        structure: ['Situation', 'Task', 'Action', 'Result'],
        text:
          'On a six-week class project our integration milestone slipped by nine days because a ' +
          'third-party API we depended on required an approval process nobody had checked the ' +
          'lead time on. Once it was clear we would miss, I did three things in order. I told the ' +
          'stakeholder that day rather than waiting for the milestone date, with a revised ' +
          'estimate and options, because late bad news costs more than early bad news. I ' +
          'resequenced - we pulled forward the reporting work that did not depend on the ' +
          'integration, so the delay cost us calendar time but not idle team time. And I built a ' +
          'stub for the API so development and testing could continue against fake data. We ' +
          'landed two days late instead of nine. The root cause was that I had not identified ' +
          'external dependencies as risks at kickoff, which is now a standing item in my ' +
          'planning.'
      },
      tips:
        'Communicate early, resequence, unblock. And name the root cause in your own planning ' +
        'rather than blaming the vendor.'
    },
    {
      type: 'behavioral',
      q: 'A manager pulls one of your assigned resources to cover another priority for two weeks. How do you address it?',
      source: { label: 'Indeed Hiring Guide: Project Manager - real PM-hiring-team questions' },
      model: {
        structure: ['Understand', 'Quantify the impact', 'Present options', 'Escalate if needed'],
        text:
          'I would not fight it in the moment - the other priority may genuinely outrank mine, ' +
          'and I do not have the full picture. First I would understand what is being covered and ' +
          'for how long. Then I would quantify the impact on my project specifically rather than ' +
          'complaining generally: this person owns the migration script, losing them for two ' +
          'weeks moves go-live from the 14th to the 28th and puts us past the quarter close. Then ' +
          'I would bring options to the manager and my sponsor - descope feature X to hold the ' +
          'date, accept the new date, or backfill with someone else and accept a ramp-up cost. ' +
          'The decision belongs to the sponsor, not to me, but making it explicit means the ' +
          'trade-off is chosen rather than discovered later. What I would not do is silently ' +
          'absorb it and miss the date, because that is how a PM loses credibility.'
      },
      tips:
        'The key move is converting a resource complaint into a dated, costed trade-off for a ' +
        'decision-maker.'
    },
    {
      type: 'behavioral',
      q: 'How would you communicate risk to a project stakeholder?',
      source: { label: 'Indeed Hiring Guide: Project Manager - real PM-hiring-team questions' },
      model: {
        structure: ['In their terms', 'Likelihood x impact', 'With a response', 'On a cadence'],
        text:
          'I translate it into what they care about - cost, date, or scope - rather than the ' +
          'technical mechanism. "There is a risk the vendor API certification takes four weeks ' +
          'instead of two, which would move go-live past quarter close" lands where "there is an ' +
          'integration risk" does not. I give likelihood and impact so they can size it, and I ' +
          'never bring a risk without a proposed response - mitigate, accept, transfer or avoid - ' +
          'because a risk with no option is just anxiety. I raise material risks as soon as I see ' +
          'them rather than saving them for the status meeting, and everything else goes in a ' +
          'risk register reviewed on a regular cadence so nothing sits unowned. Every risk has a ' +
          'named owner and a review date, because unowned risks are the ones that become issues.'
      },
      tips:
        '"Never bring a risk without a proposed response" is a line worth using verbatim.'
    },
    {
      type: 'technical',
      q: 'What is your approach to risk management - how do you identify and mitigate risks?',
      source: { label: 'Indeed Career Guide - 41 Project Manager Interview Questions' },
      concepts: [
        { label: 'Identify risks systematically at kickoff and continuously', patterns: ['identif', 'kickoff', 'workshop', 'brainstorm', 'ongoing', 'continuous', 'throughout'] },
        { label: 'Risk register with owners', patterns: ['register', 'log', 'owner', 'assign'] },
        { label: 'Score by likelihood and impact', patterns: ['likelihood', 'probabilit', 'impact', 'score', 'matrix', 'rank', 'priorit'] },
        { label: 'Four responses: avoid, mitigate, transfer, accept', patterns: ['avoid', 'mitigat', 'transfer', 'accept'] },
        { label: 'Contingency / buffer for accepted risks', patterns: ['conting', 'buffer', 'reserve', 'fallback', 'plan b'] },
        { label: 'Review on a cadence; escalate when triggered', patterns: ['review', 'cadence', 'weekly', 'regular', 'escalat', 'trigger'] },
        { label: 'Distinguish risks from issues', patterns: ['issue', 'has happened', 'already occurred', 'risk.{0,20}issue'] }
      ],
      model: {
        structure: ['Identify', 'Score', 'Respond', 'Review'],
        text:
          'I run a risk identification session at kickoff with the team rather than writing the ' +
          'register alone, because the developers know the technical risks and I do not. ' +
          'Everything goes into a risk register with a named owner - unowned risks do not get ' +
          'managed. I score each by likelihood and impact so attention goes to the top of the ' +
          'list rather than to whatever was raised most recently. For each significant risk I ' +
          'pick one of four responses: avoid by changing the plan, mitigate by reducing ' +
          'likelihood or impact, transfer through a vendor or contract, or accept it explicitly ' +
          'with contingency set aside. Accepting is a legitimate answer as long as it is written ' +
          'down and budgeted. Then I review the register on a regular cadence, because risk ' +
          'profiles change - and I keep risks and issues separate, since a risk is something that ' +
          'might happen and an issue has already happened and needs a different response.'
      },
      tips:
        'Naming all four responses and separating risks from issues are the two things that make ' +
        'this sound trained rather than improvised.'
    },
    {
      type: 'technical',
      q: 'What would you do if your project was running over budget?',
      source: { label: 'Indeed Career Guide - Common IT Manager Interview Questions' },
      concepts: [
        { label: 'Quantify the variance and the forecast to complete', patterns: ['variance', 'forecast', 'etc', 'eac', 'how much', 'quantif', 'burn'] },
        { label: 'Find the root cause (scope creep, estimate, rate)', patterns: ['root cause', 'why', 'scope creep', 'estimat', 'rate', 'underestimat'] },
        { label: 'The triple constraint: scope, time, cost, quality', patterns: ['scope', 'time', 'cost', 'quality', 'triple constraint', 'trade-?off'] },
        { label: 'Bring options to the sponsor rather than a single answer', patterns: ['option', 'sponsor', 'stakeholder', 'decision', 'alternatives', 'recommend'] },
        { label: 'Do not silently cut quality or testing', patterns: ['quality', 'test', 'not cut', "don'?t cut", 'silently', 'corners'] },
        { label: 'Prevent recurrence: earned value / tighter tracking', patterns: ['earned value', 'track', 'monitor', 'weekly', 'going forward', 'prevent'] }
      ],
      model: {
        structure: ['Quantify', 'Diagnose', 'Options', 'Prevent'],
        text:
          'First I would quantify it properly - not just that we are over, but by how much and ' +
          'what the forecast at completion looks like, because a 3% overrun and a 40% overrun are ' +
          'different conversations. Then diagnose the cause, since the fix depends on it: scope ' +
          'creep is handled through change control, a bad original estimate means re-baselining, ' +
          'and a rate or vendor issue is a procurement conversation. Then I take options to the ' +
          'sponsor rather than a single recommendation, framed against the constraints - reduce ' +
          'scope to hold the budget, extend the date if that lowers burn, or request additional ' +
          'funding with a justification. What I would not do is quietly cut testing or QA to ' +
          'absorb it, because that converts a visible cost overrun into an invisible quality ' +
          'problem that surfaces after go-live and costs more. Going forward I would tighten ' +
          'tracking - weekly actuals against plan - so the next variance is caught at 5% instead ' +
          'of 25%.'
      },
      tips:
        'The "do not silently cut testing" point is the ethical core of this question and is ' +
        'often what the interviewer is really probing.'
    },
    {
      type: 'technical',
      q: 'How do you handle scope creep on an IT project?',
      source: { label: 'Free-Work.com - IT Project Manager Interview Guide: 74 Key Questions' },
      concepts: [
        { label: 'A documented baseline scope to compare against', patterns: ['baseline', 'documented', 'scope statement', 'charter', 'agreed', 'in writing'] },
        { label: 'Formal change control process', patterns: ['change control', 'change request', 'formal', 'process', 'cr\\b'] },
        { label: 'Assess impact on cost, schedule, resources', patterns: ['impact', 'cost', 'schedule', 'timeline', 'resource', 'estimate'] },
        { label: 'Sponsor/CCB approves, not the PM alone', patterns: ['sponsor', 'approv', 'ccb', 'board', 'stakeholder decide', 'not.{0,15}my (call|decision)'] },
        { label: 'Say yes to the request, not to the free change', patterns: ['not no', 'not saying no', 'trade-?off', 'what comes out', 'in exchange', 'displace'] },
        { label: 'Distinguish creep from legitimate evolving requirements', patterns: ['legitimate', 'evolv', 'agile', 'backlog', 'reprioriti', 'genuine'] }
      ],
      model: {
        structure: ['Baseline', 'Change control', 'Impact', 'Decision'],
        text:
          'Scope creep is only definable against a baseline, so the first defence is a documented ' +
          'scope statement everyone signed off, including an explicit out-of-scope list. When a ' +
          'new request arrives I do not refuse it - refusing makes people route around you - I ' +
          'run it through change control: write it up, estimate the impact on cost, schedule and ' +
          'resources, and put it to the sponsor or change board with a recommendation. The framing ' +
          'I use is not "no", it is "yes, and here is what it displaces" - because on a fixed ' +
          'timeline something has to come out. The decision is the sponsor’s, not mine. I would ' +
          'also distinguish genuine creep from legitimately evolving requirements: on an Agile ' +
          'project new requirements are expected, and the control is that they enter a ' +
          'prioritised backlog and displace something else, rather than being added to a fixed ' +
          'sprint.'
      },
      tips:
        '"Yes, and here is what it displaces" is the single most useful sentence for this ' +
        'question.'
    }
  ],

  /* ---------------------------------------------------- product manager --- */
  'product-manager': [
    {
      type: 'behavioral',
      q: 'Describe a situation where a product you were managing was not doing well, and how you turned it around.',
      source: { label: 'IGotAnOffer - Apple PM interview (mined from Glassdoor reports)' },
      model: {
        structure: ['Situation', 'Diagnosis', 'Action', 'Result'],
        text:
          'I ran a study-group matching tool for my major that got 140 signups and about 12 ' +
          'active users after three weeks. My instinct was that we needed more features. Instead ' +
          'I interviewed nine people who signed up and stopped, and the pattern was immediate: ' +
          'they got matched and then nobody messaged first. The product had solved matching and ' +
          'ignored the awkwardness of the first contact. So rather than building features, we ' +
          'added one thing - an auto-generated first message with a proposed time and place that ' +
          'either person could send in one tap. Active groups went from 12 to 47 over the next ' +
          'two weeks. The lesson I actually carry is that low usage is a research problem before ' +
          'it is a building problem, and I had wanted to build because building felt like ' +
          'progress.'
      },
      tips:
        'PMs are hired for diagnosis. Show that you resisted the urge to build and went and ' +
        'talked to users first.'
    },
    {
      type: 'behavioral',
      q: 'Tell me about a time you had to balance user needs with business priorities.',
      source: { label: 'IGotAnOffer - Netflix PM interview (mined from Glassdoor reports)' },
      model: {
        structure: ['Tension', 'Data', 'Decision', 'Result'],
        text:
          'On a campus marketplace project, the business side wanted mandatory account creation ' +
          'before browsing to build an email list, and users clearly wanted to browse first - our ' +
          'test showed 40% drop-off at the signup wall. Rather than arguing preference, I reframed ' +
          'the goal: the business did not actually want a signup wall, it wanted contactable ' +
          'users. So I proposed browsing freely and requiring an account only at the point of ' +
          'contacting a seller, which is where intent is highest. We captured about 70% as many ' +
          'emails from a much larger top of funnel, so absolute signups went up while drop-off ' +
          'fell. That is the version of this trade-off I look for - usually the stated positions ' +
          'conflict and the underlying goals do not.'
      },
      tips:
        'The strongest structure is: positions conflict, goals do not, find the option serving ' +
        'both. Do not answer with "the user always wins".'
    },
    {
      type: 'behavioral',
      q: 'How do you manage working with people you may not get along with?',
      source: { label: 'IGotAnOffer - 8 Most-Asked Product Manager Behavioral Interview Questions' },
      model: {
        structure: ['Principle', 'Situation', 'Action', 'Result'],
        text:
          'PMs have almost no formal authority, so I cannot afford for friction to become a ' +
          'blocker. My approach is to get very concrete about what we each need, since most ' +
          'friction I have had came from unclear expectations rather than genuine dislike. On a ' +
          'group project one engineer was consistently short with me in reviews, and I assumed he ' +
          'did not respect the role. I asked him directly, low-stakes, what would make my ' +
          'requests more useful. His answer was that I was bringing him solutions instead of ' +
          'problems, and he wanted to make the technical calls himself. That was a fair critique. ' +
          'I changed how I wrote tickets - problem and constraints, not implementation - and the ' +
          'friction disappeared. What I took from it is to ask before diagnosing, because I had ' +
          'been reading it as a personality issue when it was a working-style issue.'
      },
      tips:
        'Show you asked rather than assumed, and that the feedback was partly about you. That is ' +
        'the version interviewers believe.'
    },
    {
      type: 'technical',
      q: 'How would you handle a major feature request from a key customer that conflicts with the current roadmap?',
      source: { label: 'Poised - List of Behavioral Interview Questions for Product Managers' },
      concepts: [
        { label: 'Understand the underlying problem, not the requested feature', patterns: ['underlying', 'actual problem', 'why', 'root', 'job to be done', 'need behind', 'dig'] },
        { label: 'Assess how generalisable it is beyond this customer', patterns: ['other customer', 'generali[sz]', 'segment', 'how many', 'broader', 'one-?off', 'representative'] },
        { label: 'Quantify value against roadmap opportunity cost', patterns: ['opportunity cost', 'trade-?off', 'displace', 'revenue', 'impact', 'value', 'priorit'] },
        { label: 'Consider alternatives (workaround, config, services)', patterns: ['workaround', 'configur', 'integration', 'alternative', 'partial', 'existing'] },
        { label: 'Communicate the decision transparently either way', patterns: ['communicat', 'transparen', 'explain', 'tell them', 'honest', 'expectations'] },
        { label: 'Avoid roadmap capture by the loudest customer', patterns: ['loudest', 'squeaky', 'one customer', 'bespoke', 'custom.{0,15}(build|work)', 'consultancy'] }
      ],
      model: {
        structure: ['Diagnose', 'Generalise', 'Cost it', 'Decide', 'Communicate'],
        text:
          'First I would separate the request from the problem, because customers usually ask for ' +
          'a solution they have already imagined. I would get to what they are actually trying to ' +
          'accomplish and what it costs them today. Then the key question: is this problem ' +
          'specific to them or does it represent a segment? I would check support tickets and ' +
          'talk to two or three similar accounts, because building a bespoke feature for one ' +
          'customer turns a product company into a consultancy. Then I would cost it honestly ' +
          'against what it displaces - the roadmap item that slips is the real price. I would ' +
          'look for cheaper paths that solve the problem: configuration, an integration, a ' +
          'services workaround. Then I would decide and communicate it transparently either way, ' +
          'including saying no with the reasoning, because a clear no with a rationale preserves ' +
          'the relationship better than a vague "it is on our roadmap".'
      },
      tips:
        'The "product company versus consultancy" framing and "the roadmap item that slips is the ' +
        'real price" are both strong, specific lines.'
    },
    {
      type: 'technical',
      q: 'How do you prioritise a feature backlog?',
      source: { label: 'BrainStation - Product Manager Interview Questions (case study / product sense bucket)' },
      concepts: [
        { label: 'A stated framework (RICE, ICE, MoSCoW, Kano, WSJF)', patterns: ['rice', 'ice\\b', 'moscow', 'kano', 'wsjf', 'weighted', 'framework', 'value.{0,10}effort'] },
        { label: 'Impact / value estimated against a goal', patterns: ['impact', 'value', 'goal', 'okr', 'metric', 'outcome'] },
        { label: 'Effort / cost estimated with engineering', patterns: ['effort', 'cost', 'engineering', 'estimate', 'complexity', 'size'] },
        { label: 'Confidence / evidence behind the estimate', patterns: ['confidence', 'evidence', 'data', 'assumption', 'uncertain', 'validated'] },
        { label: 'Non-feature work: tech debt, bugs, compliance', patterns: ['tech debt', 'technical debt', 'bug', 'complianc', 'security', 'maintenance', 'keep the lights'] },
        { label: 'Framework informs, does not replace, judgement', patterns: ['judgement|judgment', 'not.{0,20}(mechanical|automatic)', 'sanity', 'gut', 'discussion', 'input to'] }
      ],
      model: {
        structure: ['Anchor to a goal', 'Score', 'Reserve capacity', 'Sanity-check'],
        text:
          'I start from the goal the quarter is actually serving, because prioritisation without a ' +
          'stated objective just ranks by preference. Then I use RICE as a scoring scaffold - ' +
          'reach, impact, confidence, effort - with effort estimated with engineering rather than ' +
          'by me. The confidence term is the one people skip and it is the most useful, because ' +
          'it stops a high-impact guess from outranking a moderate-impact certainty. I ' +
          'deliberately reserve capacity for non-feature work: tech debt, bugs and compliance ' +
          'never win a value-scoring contest, so if they are not carved out they never happen, ' +
          'and I typically hold something like 20%. Then I sanity-check the ranked list with ' +
          'engineering and design, because the score is an input to a judgement, not a ' +
          'replacement for one - if the output feels wrong, usually an input was wrong and it is ' +
          'worth finding out which.'
      },
      tips:
        'Reserving capacity for tech debt, and treating the framework as an input to judgement, ' +
        'are the two things that make this answer sound like a working PM.'
    },
    {
      type: 'technical',
      q: 'How would you measure whether a feature you shipped was successful?',
      source: { label: 'BrainStation - Product Manager Interview Questions (product sense bucket)' },
      concepts: [
        { label: 'Define success metrics BEFORE shipping', patterns: ['before', 'in advance', 'up front', 'ahead of', 'pre-?defin', 'beforehand'] },
        { label: 'A primary metric tied to the user problem', patterns: ['primary', 'north star', 'key metric', 'one metric', 'main'] },
        { label: 'Guardrail / counter metrics', patterns: ['guardrail', 'counter', 'regress', 'side effect', 'unintended', 'health metric'] },
        { label: 'Adoption vs engagement vs retention', patterns: ['adoption', 'engagement', 'retention', 'repeat', 'usage'] },
        { label: 'A/B test or comparison against a baseline', patterns: ['a/b', 'experiment', 'control', 'baseline', 'holdout', 'before and after'] },
        { label: 'Qualitative feedback alongside the numbers', patterns: ['qualitativ', 'interview', 'feedback', 'survey', 'talk to', 'why'] }
      ],
      model: {
        structure: ['Pre-define', 'Primary + guardrails', 'Measure', 'Ask why'],
        text:
          'The most important part happens before shipping: I write down what success looks like ' +
          'and what number would tell me I was wrong, because defining success after seeing the ' +
          'data means you will always find a metric that moved. I pick one primary metric tied to ' +
          'the user problem the feature was meant to solve - for a first-contact prompt, the ' +
          'percentage of matched pairs that exchange a message within 48 hours, not raw feature ' +
          'clicks. Alongside it I set guardrails so I catch damage elsewhere: unsubscribes, ' +
          'support tickets, latency. I distinguish adoption from engagement from retention, ' +
          'because a spike in first use often decays and only the third week tells you anything. ' +
          'Where possible I compare against a control through an A/B test or at minimum a clean ' +
          'baseline. And I pair it with a handful of user conversations, because the numbers tell ' +
          'me what happened and not why, and the why is what determines the next build.'
      },
      tips:
        '"Write down what number would tell me I was wrong" is a strong, quotable commitment to ' +
        'intellectual honesty.'
    }
  ],

  /* ----------------------------------------------------- cloud engineer --- */
  'cloud-engineer': [
    {
      type: 'behavioral',
      q: 'What motivated you to pursue cloud computing, and why that platform specifically?',
      source: { label: 'Indeed Career Guide (India) - AWS Cloud Engineer Interview Questions' },
      model: {
        structure: ['Origin', 'Why this platform', 'Evidence', 'Direction'],
        text:
          'I got into it sideways. I was hosting a small project on an old desktop under my desk, ' +
          'the power went out during finals week, and I spent two days rebuilding it. Moving it ' +
          'to AWS took an afternoon and it has not gone down since - that contrast is what got ' +
          'my attention. I chose AWS specifically because it has the largest market share and so ' +
          'the deepest documentation and community answers, which matters a lot when you are ' +
          'learning alone, and because the free tier let me actually build rather than read. ' +
          'Since then I have set up a VPC with public and private subnets, put an EC2 instance ' +
          'behind an ALB, and moved my static content to S3 with CloudFront. I am working toward ' +
          'Solutions Architect Associate. Long term I care more about infrastructure as code than ' +
          'about any one provider - the concepts port.'
      },
      tips:
        'A specific origin story plus specific services you have actually touched beats ' +
        '"I am passionate about cloud" every time.'
    },
    {
      type: 'behavioral',
      q: 'What is the biggest challenge you have faced working with cloud infrastructure, and how did you overcome it?',
      source: { label: 'Indeed Career Guide (India) - AWS Cloud Engineer Interview Questions' },
      model: {
        structure: ['Situation', 'Task', 'Action', 'Result'],
        text:
          'My first real one was a surprise bill. I left a NAT gateway and an unattached EBS ' +
          'volume running from a class project and got charged about $60 across a month I was not ' +
          'using the account at all. It sounds small but it was my money and it taught me ' +
          'something structural: cloud resources cost money while idle, unlike hardware you have ' +
          'already bought. I went through Cost Explorer to find what was actually accruing, tore ' +
          'down what I did not need, set a billing alarm at a threshold I would notice, and ' +
          'started tagging resources by project so I could tell what belonged to what. Since then ' +
          'I have tried to build with teardown in mind - infrastructure as code so environments ' +
          'can be destroyed and recreated instead of left running because nobody is sure what ' +
          'they do.'
      },
      tips:
        'A cost story is more credible from a student than an outage story, and cost discipline is ' +
        'something cloud teams genuinely screen for.'
    },
    {
      type: 'behavioral',
      q: 'How do you keep up with the latest trends and practices in cloud computing?',
      source: { label: 'Indeed Career Guide - 30+ Interview Questions for Cloud Engineers' },
      model: {
        structure: ['Sources', 'Practice', 'Filter'],
        text:
          'I follow the AWS What’s New feed and the architecture blog, and I read the re:Invent ' +
          'keynote summaries rather than watching everything, because the volume is unmanageable ' +
          'otherwise. Reading alone does not stick for me though, so the main thing is that I ' +
          'keep a personal account where I build the thing - if I read about a service I spin up ' +
          'the smallest possible version of it and then tear it down. I also follow a couple of ' +
          'practitioners who write about failures rather than launches, which is where the real ' +
          'lessons are. And I try to filter deliberately: the field generates far more news than ' +
          'anyone can absorb, so I go deep on the fundamentals that do not change much - ' +
          'networking, identity, state - and stay shallow on service announcements until I have a ' +
          'reason to care.'
      },
      tips:
        'Distinguishing durable fundamentals from service churn is a mature answer to a question ' +
        'most people answer with a list of newsletters.'
    },
    {
      type: 'technical',
      q: 'What are IaaS, PaaS and SaaS, and what is an example of each?',
      source: { label: 'Indeed Career Guide - 30+ Interview Questions for Cloud Engineers' },
      concepts: [
        { label: 'IaaS = raw compute/storage/network, you manage the OS up', patterns: ['iaas', 'infrastructure as a service', 'virtual machine', 'ec2', 'raw', 'operating system'] },
        { label: 'PaaS = platform runs your code, you manage the app', patterns: ['paas', 'platform as a service', 'elastic beanstalk', 'app engine', 'heroku', 'deploy.{0,20}code', 'runtime'] },
        { label: 'SaaS = finished software, you manage only your data/config', patterns: ['saas', 'software as a service', 'salesforce', 'gmail', 'office 365', 'workday', 'end user'] },
        { label: 'The shared responsibility line shifts between them', patterns: ['responsib', 'you manage', 'provider manage', 'control', 'abstraction'] },
        { label: 'Trade-off: control versus operational overhead', patterns: ['trade-?off', 'control', 'flexib', 'overhead', 'less to manage', 'lock-?in'] }
      ],
      model: {
        structure: ['Define each', 'Give an example', 'Name the line'],
        text:
          'They are three points on a spectrum of how much the provider manages. IaaS gives you ' +
          'raw compute, storage and networking - EC2 is the classic example - and you are ' +
          'responsible for the operating system upward: patching, runtime, application. PaaS ' +
          'gives you a managed platform where you deploy code and the provider handles the OS, ' +
          'runtime and scaling; Elastic Beanstalk, App Engine or Heroku. SaaS is finished ' +
          'software where you manage only your data and configuration - Salesforce, Workday, ' +
          'Google Workspace. The useful way to think about it is the shared responsibility line ' +
          'moving up the stack: as you move from IaaS to SaaS you give up control and gain less ' +
          'operational overhead. Neither end is correct by default - you pick based on how much ' +
          'the specific workload needs to be controlled versus how much ops capacity you have.'
      },
      tips:
        'Framing it as "where the shared responsibility line sits" rather than three definitions ' +
        'is what makes this sound like an engineer.'
    },
    {
      type: 'technical',
      q: 'How would you set up an AWS environment for a highly available, scalable web application?',
      source: { label: 'Indeed Career Guide (India) - AWS Cloud Engineer Interview Questions' },
      concepts: [
        { label: 'Multiple Availability Zones', patterns: ['availability zone', 'multi-?az', 'az', 'multiple zone', 'region'] },
        { label: 'Load balancer distributing traffic', patterns: ['load balanc', 'elb', 'alb', 'distribut'] },
        { label: 'Auto scaling group', patterns: ['auto ?scal', 'asg', 'scale out', 'scale in', 'elastic'] },
        { label: 'VPC with public and private subnets', patterns: ['vpc', 'subnet', 'private', 'public', 'security group', 'nat'] },
        { label: 'Managed, replicated database (RDS Multi-AZ)', patterns: ['rds', 'aurora', 'database', 'multi-?az', 'replica', 'failover'] },
        { label: 'Static content on S3 / CloudFront CDN', patterns: ['s3', 'cloudfront', 'cdn', 'static'] },
        { label: 'Monitoring and health checks', patterns: ['cloudwatch', 'monitor', 'health check', 'alarm', 'log'] },
        { label: 'Infrastructure as code', patterns: ['terraform', 'cloudformation', 'cdk', 'infrastructure as code', 'iac'] }
      ],
      model: {
        structure: ['Network', 'Compute', 'Data', 'Edge', 'Observe', 'Codify'],
        text:
          'I would start with a VPC spanning at least two Availability Zones, with public subnets ' +
          'for the load balancer and private subnets for the application and database, so nothing ' +
          'stateful is directly internet-reachable. An Application Load Balancer in the public ' +
          'subnets distributes across an Auto Scaling group of instances in the private subnets ' +
          'in both AZs, so the loss of a single AZ degrades capacity rather than causing an ' +
          'outage, and scaling policies handle load rather than me over-provisioning. For data, ' +
          'RDS Multi-AZ so there is a synchronous standby with automatic failover, plus read ' +
          'replicas if reads dominate. Static assets go in S3 behind CloudFront so they are ' +
          'served from the edge and never touch the application tier. CloudWatch for metrics, ' +
          'alarms and centralised logs, with load balancer health checks so unhealthy instances ' +
          'get replaced automatically. And I would define all of it in Terraform or ' +
          'CloudFormation, because an environment that cannot be recreated from code is not ' +
          'really recoverable.'
      },
      tips:
        'Answer in layers - network, compute, data, edge, observability - rather than listing ' +
        'services. The structure is what gets remembered.'
    },
    {
      type: 'technical',
      q: 'How do you optimise the cost of running cloud resources?',
      source: { label: 'Indeed Career Guide (India) - AWS Cloud Engineer Interview Questions' },
      concepts: [
        { label: 'Visibility first: tagging, cost explorer, budgets/alarms', patterns: ['tag', 'cost explorer', 'budget', 'alarm', 'visibil', 'report', 'allocat'] },
        { label: 'Right-size over-provisioned resources', patterns: ['right.?siz', 'over-?provision', 'instance type', 'downsiz', 'utilization|utilisation'] },
        { label: 'Turn off / schedule non-production environments', patterns: ['turn off', 'shut down', 'schedul', 'non-?prod', 'idle', 'nights', 'weekend'] },
        { label: 'Reserved Instances / Savings Plans for steady workloads', patterns: ['reserved', 'savings plan', 'commit', 'discount', 'on-?demand'] },
        { label: 'Spot instances for interruptible work', patterns: ['spot', 'interrupt', 'batch', 'fault.?toleran'] },
        { label: 'Storage lifecycle policies and orphaned resources', patterns: ['lifecycle', 'glacier', 'infrequent', 'orphan', 'unattached', 'snapshot', 'old'] },
        { label: 'Architectural choices (serverless, autoscaling) affect cost', patterns: ['serverless', 'lambda', 'auto ?scal', 'architect', 'managed service'] }
      ],
      model: {
        structure: ['See it', 'Cut waste', 'Commit', 'Architect'],
        text:
          'You cannot optimise what you cannot attribute, so I start with tagging by project, ' +
          'environment and owner, then Cost Explorer to see where money actually goes and budget ' +
          'alarms so surprises surface in days rather than at the invoice. The biggest early wins ' +
          'are almost always waste rather than pricing: right-sizing instances that were sized ' +
          'from a guess, deleting unattached EBS volumes and old snapshots, and scheduling ' +
          'non-production environments to shut down nights and weekends, which is roughly a 70% ' +
          'reduction on those environments for essentially no risk. Once the baseline is genuinely ' +
          'steady, I would commit to Savings Plans or Reserved Instances for the predictable ' +
          'portion, and use Spot for anything interruptible like batch processing. Storage gets ' +
          'lifecycle policies to move cold data to cheaper tiers automatically. Beyond that the ' +
          'architecture itself is a cost decision - serverless for spiky low-volume workloads can ' +
          'beat an always-on instance substantially.'
      },
      tips:
        'Lead with tagging and visibility. Most candidates jump straight to Reserved Instances, ' +
        'which is the last step, not the first.'
    }
  ]
};
