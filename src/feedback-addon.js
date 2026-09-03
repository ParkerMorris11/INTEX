/* ==========================================================================
   WRITTEN-ANSWER FEEDBACK  (add-on for the Interview Prep module)
   --------------------------------------------------------------------------
   The recorder is the main event: you should say your answer out loud. But a
   camera cannot tell you that you never said what the result was, or that you
   left the CIA triad out of a security answer. This panel does.

   Deterministic rule-based analysis. No AI call, no API key, no network - so
   it works offline and every score can be explained line by line, which the
   case explicitly asks of us.

   THREE RUBRICS, because one does not fit every question:

     STORY      "Tell me about a time..."   -> STAR, ownership, evidence
     APPROACH   "How do you...?"            -> stated method, artifact, example
     TECHNICAL  "What is X / how does X..." -> coverage of an answer key

   Applying STAR to "How do you stay organised?" produces confidently wrong
   feedback, and a tool that does that stops being trusted. So the question is
   classified first, from its own wording, and the bank's Behavioral/Technical
   label is only a hint. That also quietly fixes three questions filed under
   "technical" that are really motivational ("Why do you want to work here?").
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- shared helpers -------------------------------------------- */

  function words(t) { return t.trim().split(/\s+/).filter(Boolean); }

  function hasAny(t, pats) {
    for (var i = 0; i < pats.length; i++) {
      if (new RegExp(pats[i], 'i').test(t)) return true;
    }
    return false;
  }

  function countMatches(t, pat) {
    var m = t.match(new RegExp(pat, 'gi'));
    return m ? m.length : 0;
  }

  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 46);
  }

  /* ---------- answer keys for technical questions -----------------------
     Each entry lists the points interviewers actually listen for. This is
     what makes feedback role-specific: leaving out fan-out on a SQL joins
     question gets named, not summarised as "add more detail".
     Keyed by a slug of the question text so reordering the bank is safe.  */

  var KEYS = {};
  function key(question, concepts) { KEYS[slug(question)] = concepts; }

  /* --- software developer --- */
  key("What's your process for a crashing program?", [
    { label: 'Reproduce it reliably first', patterns: ['reproduc', 'consistent', 'steps to', 'repeat'] },
    { label: 'Read the stack trace / error', patterns: ['stack trace', 'error message', 'traceback', 'exception', 'log'] },
    { label: 'Narrow the search space (bisect, isolate)', patterns: ['bisect', 'isolat', 'narrow', 'comment out', 'minimal'] },
    { label: 'One hypothesis at a time', patterns: ['hypothes', 'one.{0,12}(change|thing|variable)', 'assumption'] },
    { label: 'Debugger or targeted logging', patterns: ['debugger', 'breakpoint', 'print', 'console\\.log', 'logging', 'step through'] },
    { label: 'Regression test so it stays fixed', patterns: ['regression', 'test case', 'unit test', 'write a test', 'add a test'] }
  ]);
  key("What process happens after you type in a website's URL?", [
    { label: 'DNS resolution (name to IP)', patterns: ['dns', 'domain name', 'resolve.{0,15}(ip|address)'] },
    { label: 'TCP connection / handshake', patterns: ['tcp', 'handshake', 'socket', 'connection'] },
    { label: 'TLS / HTTPS encryption', patterns: ['tls', 'ssl', 'https', 'certificate', 'encrypt'] },
    { label: 'HTTP request to the server', patterns: ['http request', 'get request', 'request to the server', 'sends? (a|an) request'] },
    { label: 'Server responds with status + HTML', patterns: ['response', 'status code', 'server (respond|return|send)'] },
    { label: 'Browser parses HTML, builds the DOM', patterns: ['parse', 'dom', 'render', 'html'] },
    { label: 'Sub-resources fetched (CSS, JS, images)', patterns: ['css', 'javascript', 'asset', 'image', 'resource'] }
  ]);
  key('What are your most used design patterns and in what contexts do you use them?', [
    { label: 'Names specific patterns', patterns: ['singleton', 'factory', 'observer', 'strategy', 'adapter', 'decorator', 'repository', 'mvc', 'builder', 'facade', 'dependency injection'] },
    { label: 'Says what problem each solves', patterns: ['solve', 'problem', 'when you need', 'useful when', 'lets you', 'because'] },
    { label: 'Gives the context it is used in', patterns: ['context', 'for example', 'i used', 'in my', 'when i', 'on a project'] },
    { label: 'Acknowledges patterns can be over-applied', patterns: ['over.?(use|engineer|apply)', 'not always', 'too much', 'unnecessary', 'simpler', 'avoid'] }
  ]);
  key("How comfortable do you feel reviewing code written by others? What process do you follow when reviewing someone else's code?", [
    { label: 'Read the intent / description first', patterns: ['intent', 'purpose', 'description', 'context', 'ticket', 'what.{0,15}trying to'] },
    { label: 'Correctness before style', patterns: ['correct', 'logic', 'bug', 'edge case', 'before style', 'nitpick'] },
    { label: 'Check tests cover the change', patterns: ['test', 'coverage', 'cases'] },
    { label: 'Readability for the next maintainer', patterns: ['readab', 'naming', 'maintain', 'clear', 'understand later'] },
    { label: 'Kind, specific comments - ask, do not accuse', patterns: ['question', 'ask', 'suggest', 'kind', 'tone', 'non-?blocking', 'nit'] },
    { label: 'Security and error handling', patterns: ['security', 'validation', 'error handling', 'injection', 'sanitiz'] }
  ]);

  /* --- web developer --- */
  key('How do you make sure your websites and applications are accessible to users?', [
    { label: 'Semantic HTML before ARIA', patterns: ['semantic', 'html element', 'native', 'heading', 'landmark', 'real button'] },
    { label: 'Keyboard navigation and visible focus', patterns: ['keyboard', 'tab', 'focus'] },
    { label: 'Colour contrast', patterns: ['contrast', 'colou?r'] },
    { label: 'Alt text and form labels', patterns: ['alt', 'label', 'aria-label', 'screen ?reader'] },
    { label: 'Test with a screen reader / audit tool', patterns: ['screen ?reader', 'voiceover', 'nvda', 'axe', 'lighthouse', 'wave', 'audit'] },
    { label: 'WCAG as the standard', patterns: ['wcag', '\\baa\\b', 'section 508', 'ada', 'guideline'] }
  ]);
  key("How would you improve a webpage that's loading slowly?", [
    { label: 'Measure first (Lighthouse, network tab)', patterns: ['measure', 'profil', 'lighthouse', 'devtools', 'network tab', 'waterfall', 'metric'] },
    { label: 'Optimise and size images', patterns: ['image', 'compress', 'webp', 'avif', 'resize', 'lazy'] },
    { label: 'Reduce / minify JS and CSS', patterns: ['minif', 'bundle', 'tree.?shak', 'payload', 'code split'] },
    { label: 'Caching and a CDN', patterns: ['cach', 'cdn', 'etag', 'expires', 'edge'] },
    { label: 'Defer render-blocking resources', patterns: ['blocking', 'defer', 'async', 'critical'] },
    { label: 'Server time / compression', patterns: ['server', 'quer', 'database', 'gzip', 'brotli', 'ttfb', 'compress'] }
  ]);
  key("What's your favorite programming language and why?", [
    { label: 'Names a specific language', patterns: ['javascript', 'python', 'java\\b', 'c#', 'c\\+\\+', 'typescript', 'go\\b', 'rust', 'ruby', 'swift', 'kotlin', 'sql', 'php'] },
    { label: 'Gives a reason beyond "I like it"', patterns: ['because', 'reason', 'lets me', 'makes it', 'good at', 'strength'] },
    { label: 'Ties it to something you built', patterns: ['i (built|wrote|used|made)', 'project', 'for example', 'in my', 'when i'] },
    { label: 'Names a weakness or a trade-off', patterns: ['however', 'downside', 'weakness', 'trade-?off', 'not great', 'struggle', 'but it', 'limitation'] },
    { label: 'Shows you are not religious about it', patterns: ['depends', 'right tool', 'another language', 'would use', 'context'] }
  ]);
  key('How would you create an endpoint for a new inventory item?', [
    { label: 'Correct HTTP verb (POST to create)', patterns: ['post\\b', 'verb', 'method', 'idempot'] },
    { label: 'Resource-noun URL, plural collection', patterns: ['/inventory', '/items', 'resource', 'noun', 'plural', 'endpoint', 'route'] },
    { label: 'Validate the request body', patterns: ['validat', 'schema', 'required field', 'sanitiz'] },
    { label: 'Meaningful status codes (201, 400, 409)', patterns: ['201', '400', '404', '409', '500', 'status code'] },
    { label: 'Return the created resource / id', patterns: ['return', 'response body', 'location header', '\\bid\\b'] },
    { label: 'Authentication and authorisation', patterns: ['auth', 'token', 'permission', 'jwt', 'api key'] },
    { label: 'Errors that do not leak internals', patterns: ['error', 'exception', 'leak', 'stack trace'] }
  ]);

  /* --- cloud --- */
  key("What are the three main cloud service models (IaaS, PaaS, SaaS), and what's an example of each?", [
    { label: 'IaaS - raw compute, you manage the OS up', patterns: ['iaas', 'infrastructure as a service', 'virtual machine', 'ec2', 'operating system'] },
    { label: 'PaaS - platform runs your code', patterns: ['paas', 'platform as a service', 'beanstalk', 'app engine', 'heroku', 'runtime'] },
    { label: 'SaaS - finished software', patterns: ['saas', 'software as a service', 'salesforce', 'gmail', 'office 365', 'workday'] },
    { label: 'An example for each', patterns: ['example', 'such as', 'e\\.g\\.', 'like '] },
    { label: 'The shared-responsibility line shifts', patterns: ['responsib', 'you manage', 'provider manage', 'control', 'abstraction'] },
    { label: 'Trade-off: control vs overhead', patterns: ['trade-?off', 'control', 'flexib', 'overhead', 'less to manage', 'lock-?in'] }
  ]);
  key("Can you describe how you'd set up and manage an AWS environment for a highly available, scalable web application?", [
    { label: 'Multiple Availability Zones', patterns: ['availability zone', 'multi-?az', '\\baz\\b', 'multiple zone', 'region'] },
    { label: 'Load balancer', patterns: ['load balanc', 'elb', 'alb', 'distribut'] },
    { label: 'Auto scaling group', patterns: ['auto ?scal', 'asg', 'scale out', 'elastic'] },
    { label: 'VPC with public and private subnets', patterns: ['vpc', 'subnet', 'private', 'public', 'security group', 'nat'] },
    { label: 'Replicated managed database (RDS Multi-AZ)', patterns: ['rds', 'aurora', 'database', 'replica', 'failover'] },
    { label: 'S3 + CloudFront for static content', patterns: ['s3', 'cloudfront', 'cdn', 'static'] },
    { label: 'Monitoring and health checks', patterns: ['cloudwatch', 'monitor', 'health check', 'alarm', 'log'] },
    { label: 'Infrastructure as code', patterns: ['terraform', 'cloudformation', 'cdk', 'infrastructure as code', 'iac'] }
  ]);
  key('How do you optimize the cost of running AWS resources, and what tools or techniques do you use?', [
    { label: 'Visibility first: tagging, Cost Explorer, budgets', patterns: ['tag', 'cost explorer', 'budget', 'alarm', 'visibil', 'allocat'] },
    { label: 'Right-size over-provisioned resources', patterns: ['right.?siz', 'over-?provision', 'instance type', 'utiliz|utilis'] },
    { label: 'Shut down / schedule non-production', patterns: ['turn off', 'shut down', 'schedul', 'non-?prod', 'idle', 'nights', 'weekend'] },
    { label: 'Reserved Instances / Savings Plans', patterns: ['reserved', 'savings plan', 'commit', 'discount', 'on-?demand'] },
    { label: 'Spot for interruptible work', patterns: ['spot', 'interrupt', 'batch', 'fault.?toleran'] },
    { label: 'Storage lifecycle and orphaned resources', patterns: ['lifecycle', 'glacier', 'infrequent', 'orphan', 'unattached', 'snapshot'] },
    { label: 'Architecture is a cost decision', patterns: ['serverless', 'lambda', 'architect', 'managed service'] }
  ]);
  key('How do you secure data in transit to and from the cloud?', [
    { label: 'TLS / encryption in transit', patterns: ['tls', 'ssl', 'https', 'encrypt'] },
    { label: 'VPN or private connectivity', patterns: ['vpn', 'direct connect', 'private link', 'peering', 'tunnel'] },
    { label: 'Strong authentication (MFA, keys)', patterns: ['mfa', 'multi-?factor', 'authenticat', 'key', 'certificate'] },
    { label: 'Access control / least privilege', patterns: ['access control', 'least privilege', 'iam', 'role', 'permission'] },
    { label: 'Certificate validation and rotation', patterns: ['certificate', 'rotat', 'expir', 'validat', 'pinning'] },
    { label: 'Monitoring and vulnerability assessment', patterns: ['monitor', 'log', 'vulnerab', 'scan', 'audit', 'dlp'] }
  ]);

  /* --- data analyst --- */
  key('How are joins used in SQL?', [
    { label: 'Joins combine rows across tables on a key', patterns: ['combine', 'related', 'key', 'match', 'two tables'] },
    { label: 'INNER JOIN keeps only matches', patterns: ['inner', 'only.{0,20}match', 'both tables'] },
    { label: 'LEFT / RIGHT JOIN keeps unmatched rows', patterns: ['left join', 'right join', 'left outer', 'keeps? all'] },
    { label: 'FULL OUTER keeps both sides', patterns: ['full outer', 'full join'] },
    { label: 'NULLs where no match exists', patterns: ['null'] },
    { label: 'Fan-out: one-to-many duplicates rows', patterns: ['duplicat', 'fan.?out', 'one-?to-?many', 'multipl', 'grain', 'cardinal'] }
  ]);
  key('How do you manage NULL values in SQL queries?', [
    { label: 'IS NULL / IS NOT NULL, never = NULL', patterns: ['is null', 'is not null', 'cannot use =', "can'?t use ="] },
    { label: 'COALESCE / IFNULL to substitute', patterns: ['coalesce', 'ifnull', 'isnull', 'nvl', 'default value'] },
    { label: 'Aggregates skip NULLs', patterns: ['aggregate', 'avg', 'count\\(', 'sum', 'ignore', 'exclude'] },
    { label: 'NULL propagates through arithmetic', patterns: ['propagat', 'arithmetic', 'comparison', 'unknown', 'three-?valued'] },
    { label: 'Decide with the business: zero or unknown?', patterns: ['business', 'unknown', 'missing', 'means', 'stakeholder', 'zero'] },
    { label: 'NOT IN with NULLs returns no rows', patterns: ['not in', 'anti.?join', 'not exists'] }
  ]);
  key('For Random Forest, what are some more techniques to prevent overfitting?', [
    { label: 'Limit tree depth / size', patterns: ['depth', 'max_?depth', 'prune', 'leaf', 'min_?samples', 'size of the tree'] },
    { label: 'More trees / bagging averages out variance', patterns: ['n_?estimators', 'more trees', 'bagging', 'average', 'ensemble', 'bootstrap'] },
    { label: 'Feature subsampling at each split', patterns: ['max_?features', 'feature.{0,15}(subset|sampl|random)', 'random subset', 'mtry'] },
    { label: 'Cross-validation to detect it', patterns: ['cross.?validat', 'k-?fold', 'holdout', 'validation set', 'test set'] },
    { label: 'More or cleaner training data', patterns: ['more data', 'training data', 'sample size', 'clean'] },
    { label: 'Watch the train/validation gap', patterns: ['train.{0,20}(vs|versus|against|and).{0,20}(valid|test)', 'gap', 'generali[sz]', 'variance'] }
  ]);
  key('How does boosting prevent overfitting?', [
    { label: 'Boosting fits models sequentially on residuals', patterns: ['sequential', 'residual', 'previous.{0,20}error', 'one after', 'iterativ', 'weak learner'] },
    { label: 'Learning rate / shrinkage', patterns: ['learning rate', 'shrink', 'eta\\b', 'step size', 'slow'] },
    { label: 'Shallow trees as weak learners', patterns: ['shallow', 'weak learner', 'stump', 'depth'] },
    { label: 'Early stopping on a validation set', patterns: ['early stop', 'validation', 'stop.{0,15}(when|if)', 'rounds'] },
    { label: 'Regularisation terms', patterns: ['regulari[sz]', 'l1', 'l2', 'lambda', 'penalt'] },
    { label: 'Honest caveat: boosting CAN overfit', patterns: ['can overfit', 'does overfit', 'prone to', 'more likely', 'careful', 'unlike'] }
  ]);

  /* --- cybersecurity --- */
  key("What's your process for building a secure network for an organisation with nothing other than a basic security framework?", [
    { label: 'Inventory assets first', patterns: ['inventor', 'asset', 'discover', 'catalog', 'what.{0,15}(we have|exists)'] },
    { label: 'Risk assessment: threat, vulnerability, impact', patterns: ['risk assess', 'threat', 'vulnerab', 'likelihood', 'impact'] },
    { label: 'Least privilege and identity management', patterns: ['least privilege', 'access control', 'identity', 'iam', 'mfa', 'rbac', 'permission'] },
    { label: 'Network segmentation', patterns: ['segment', 'vlan', 'zone', 'dmz', 'isolat'] },
    { label: 'Patch management and hardened baselines', patterns: ['patch', 'baseline', 'hardening', 'update', 'configuration'] },
    { label: 'Monitoring / logging / SIEM', patterns: ['monitor', 'logging', 'siem', 'detect', 'alert'] },
    { label: 'Incident response plan, tested', patterns: ['incident response', 'disaster recovery', 'backup', 'tabletop', 'playbook'] }
  ]);
  key('What is the difference between a virus and a worm?', [
    { label: 'A virus needs a host file or user action', patterns: ['host', 'attach', 'user.{0,20}(action|execut|open|run)', 'requires', 'needs a'] },
    { label: 'A worm self-replicates on its own', patterns: ['self-?replicat', 'without.{0,20}(user|human|interaction)', 'autonomous', 'independent', 'on its own'] },
    { label: 'Worms spread over networks', patterns: ['network', 'propagat', 'across machines', 'spread'] },
    { label: 'Worms spread faster / wider', patterns: ['faster', 'rapid', 'quickly', 'wider', 'scale'] },
    { label: 'A named example', patterns: ['wannacry', 'conficker', 'stuxnet', 'iloveyou', 'melissa', 'blaster', 'code red', 'morris'] }
  ]);

  /* --- risk / IT audit --- */
  key('How familiar are you with auditing standards and regulations, such as GAAP or IFRS?', [
    { label: 'Names the standards accurately', patterns: ['gaap', 'ifrs', 'sox', 'sarbanes', 'cobit', 'coso', 'nist', 'iso 27001', 'pcaob'] },
    { label: 'Says what they are FOR, not just the acronym', patterns: ['financial report', 'internal control', 'governance', 'framework', 'compliance', 'purpose', 'requires'] },
    { label: 'Connects them to IT controls', patterns: ['itgc', 'it general control', 'access', 'change management', 'segregation of duties', 'systems'] },
    { label: 'Honest about your current level', patterns: ['coursework', 'class', 'learning', 'studying', 'not yet', 'limited', 'familiar with.{0,20}from', 'have not'] },
    { label: 'A plan to close the gap (CISA)', patterns: ['cisa', 'certif', 'studying', 'plan to', 'working toward'] }
  ]);
  key('What type of risk management procedures would you perform if you learned a company was exposed to a significant risk?', [
    { label: 'Assess likelihood and impact', patterns: ['likelihood', 'probabilit', 'impact', 'consequence', 'magnitude', 'severity'] },
    { label: 'Evaluate existing / compensating controls', patterns: ['existing control', 'compensating', 'mitigat', 'residual', 'inherent', 'already in place'] },
    { label: 'Escalate to the right level promptly', patterns: ['escalat', 'report', 'management', 'audit committee', 'inform', 'notify'] },
    { label: 'Four responses: avoid, mitigate, transfer, accept', patterns: ['avoid', 'mitigat', 'transfer', 'accept', 'insur'] },
    { label: 'Document findings and the remediation plan', patterns: ['document', 'workpaper', 'remediat', 'action plan', 'owner', 'deadline'] },
    { label: 'Acceptance is management’s decision, not yours', patterns: ['management.{0,25}decision', 'not.{0,15}my (call|decision)', 'appetite', 'toleran', 'business decides'] }
  ]);

  /* --- business / systems analyst --- */
  key('Can you describe the different modules in the SAP application?', [
    { label: 'MM - Materials Management', patterns: ['\\bmm\\b', 'materials management', 'procure', 'purchas', 'inventor'] },
    { label: 'FI / CO - Financial Accounting and Controlling', patterns: ['\\bfi\\b', '\\bco\\b', 'financ', 'accounting', 'general ledger', 'controlling'] },
    { label: 'SD - Sales and Distribution', patterns: ['\\bsd\\b', 'sales and distribution', 'sales order', 'billing', 'deliver'] },
    { label: 'HR / HCM - Human Capital', patterns: ['\\bhr\\b', 'hcm', 'human', 'payroll', 'personnel'] },
    { label: 'Modules share one integrated data model', patterns: ['integrat', 'single', 'shared', 'real.?time', 'same database', 'one system'] },
    { label: 'A cross-module flow (goods receipt posts to FI)', patterns: ['goods receipt', 'posts to', 'automatically', 'flows? (in)?to', 'triggers', 'journal entry'] }
  ]);
  key("How can you help ensure the company's business systems are scalable?", [
    { label: 'Understand current and projected volume', patterns: ['volume', 'growth', 'forecast', 'load', 'transaction', 'capacity'] },
    { label: 'Identify bottlenecks before they bind', patterns: ['bottleneck', 'constraint', 'chokepoint', 'peak'] },
    { label: 'Modular, loosely coupled design', patterns: ['modular', 'decoupl', 'loosely coupled', 'component', 'microservice', 'api'] },
    { label: 'Remove manual steps that scale with headcount', patterns: ['manual', 'automat', 'headcount', 'by hand'] },
    { label: 'Write it down as a non-functional requirement', patterns: ['non-?functional', '\\bnfr\\b', 'sla', 'requirement', 'documented'] },
    { label: 'Test at projected load, not current load', patterns: ['load test', 'stress test', 'performance test', 'benchmark'] }
  ]);
  key('Can you discuss your process for developing business systems analysis reports?', [
    { label: 'Define the problem and scope', patterns: ['scope', 'problem statement', 'objective', 'define'] },
    { label: 'Gather requirements from stakeholders', patterns: ['stakeholder', 'interview', 'elicit', 'workshop', 'gather'] },
    { label: 'Current state vs future state (as-is / to-be)', patterns: ['current state', 'as-?is', 'future state', 'to-?be', 'gap analysis'] },
    { label: 'Cost-benefit / options analysis', patterns: ['cost.{0,3}benefit', 'roi', 'options', 'alternative', 'trade-?off'] },
    { label: 'Recommendation with rationale', patterns: ['recommend', 'rationale', 'justif', 'propose'] },
    { label: 'Validate with stakeholders before finalising', patterns: ['validat', 'review', 'sign-?off', 'confirm', 'walkthrough'] }
  ]);
  key('What tools are essential for business system analysts?', [
    { label: 'SQL to check claims against source data', patterns: ['sql', 'quer', 'database'] },
    { label: 'Process / data modelling (BPMN, ERD, UML)', patterns: ['bpmn', 'erd', 'uml', 'flowchart', 'data model', 'process map', 'visio', 'lucid'] },
    { label: 'Requirements tracking (Jira, Confluence)', patterns: ['jira', 'azure devops', 'confluence', 'ticket', 'backlog'] },
    { label: 'Spreadsheets for analysis and traceability', patterns: ['excel', 'spreadsheet', 'sheet', 'pivot'] },
    { label: 'BI / visualisation (Tableau, Power BI)', patterns: ['tableau', 'power ?bi', 'dashboard', 'visualiz|visualis'] },
    { label: 'Wireframes to make requirements concrete', patterns: ['wireframe', 'mockup', 'figma', 'prototype'] }
  ]);

  /* --- ERP consultant --- */
  key('What is AppExchange, and when would you use it?', [
    { label: 'Salesforce’s marketplace for apps/components', patterns: ['marketplace', 'app ?store', 'salesforce', 'third.?party', 'packages?'] },
    { label: 'Buy vs build decision', patterns: ['buy', 'build', 'instead of', 'rather than.{0,25}(build|custom)', 'already exists'] },
    { label: 'Saves development time and cost', patterns: ['time', 'cost', 'faster', 'cheaper', 'effort', 'quick'] },
    { label: 'Evaluate: reviews, support, security review', patterns: ['review', 'rating', 'vet', 'support', 'security review', 'vendor', 'evaluate'] },
    { label: 'Watch licence cost and lock-in', patterns: ['licen[sc]', 'cost per user', 'lock-?in', 'dependency', 'ongoing', 'subscription'] }
  ]);
  key("What's the difference between Profiles and Roles in Salesforce?", [
    { label: 'Profile controls what a user can DO', patterns: ['profile.{0,45}(what|permission|do|object|field|crud)', 'object.?level', 'field.?level', 'create.{0,12}read'] },
    { label: 'Role controls what a user can SEE', patterns: ['role.{0,45}(see|visib|record|access|sharing)', 'record.?level', 'hierarchy'] },
    { label: 'Role hierarchy rolls visibility upward', patterns: ['hierarch', 'roll.{0,5}up', 'above', 'manager.{0,20}see', 'upward'] },
    { label: 'Profile required, Role optional', patterns: ['required', 'must have', 'optional', 'every user'] },
    { label: 'Permission sets extend without cloning', patterns: ['permission set', 'extend', 'grant additional'] },
    { label: 'OWD / sharing rules interact with roles', patterns: ['sharing rule', 'owd', 'organi[sz]ation.?wide', 'default'] }
  ]);
  key('What are SAP MM, FI, SD, and HR modules used for?', [
    { label: 'MM - procurement and inventory', patterns: ['\\bmm\\b', 'materials management', 'procure', 'purchas', 'inventor'] },
    { label: 'FI - financial accounting, GL, AP/AR', patterns: ['\\bfi\\b', 'financial accounting', 'general ledger', 'accounts payable', 'receivable'] },
    { label: 'SD - sales orders, delivery, billing', patterns: ['\\bsd\\b', 'sales and distribution', 'sales order', 'billing', 'deliver'] },
    { label: 'HR / HCM - payroll and personnel', patterns: ['\\bhr\\b', 'hcm', 'payroll', 'personnel', 'employee'] },
    { label: 'One integrated data model, real time', patterns: ['integrat', 'single', 'shared', 'real.?time', 'same database'] },
    { label: 'A concrete cross-module posting', patterns: ['goods receipt', 'posts to', 'automatically', 'flows? (in)?to', 'journal entry', 'gr/ir'] }
  ]);
  key('How do you test SAP systems before they go live?', [
    { label: 'Unit testing of individual configuration', patterns: ['unit test', 'individual', 'component', 'single transaction'] },
    { label: 'Integration testing across modules', patterns: ['integration test', 'cross.?module', 'end.?to.?end', 'process test', 'scenario'] },
    { label: 'User acceptance testing with the business', patterns: ['uat', 'user acceptance', 'business user', 'sign-?off'] },
    { label: 'Realistic / migrated test data', patterns: ['test data', 'data migration', 'realistic', 'production.?like', 'volume', 'mock data'] },
    { label: 'Regression testing of existing processes', patterns: ['regression', 'existing', 'did not break', 'still work'] },
    { label: 'Cutover plan and rollback', patterns: ['cutover', 'rollback', 'go.?live plan', 'dry run', 'rehearsal', 'fallback'] }
  ]);

  /* --- project manager --- */
  key('What is your approach to risk management, and how do you identify and mitigate potential risks?', [
    { label: 'Identify risks at kickoff and continuously', patterns: ['identif', 'kickoff', 'workshop', 'brainstorm', 'ongoing', 'continuous', 'throughout'] },
    { label: 'Risk register with named owners', patterns: ['register', 'log', 'owner', 'assign'] },
    { label: 'Score by likelihood and impact', patterns: ['likelihood', 'probabilit', 'impact', 'score', 'matrix', 'priorit'] },
    { label: 'Avoid, mitigate, transfer, accept', patterns: ['avoid', 'mitigat', 'transfer', 'accept'] },
    { label: 'Contingency for accepted risks', patterns: ['conting', 'buffer', 'reserve', 'fallback'] },
    { label: 'Review on a cadence', patterns: ['review', 'cadence', 'weekly', 'regular', 'escalat'] },
    { label: 'Risks are not issues', patterns: ['issue', 'has happened', 'already occurred'] }
  ]);
  key('How do you prioritize tasks and allocate resources to ensure you meet project goals within deadline and budget constraints?', [
    { label: 'Prioritise against a stated goal or value', patterns: ['goal', 'objective', 'value', 'business', 'outcome', 'priorit'] },
    { label: 'Critical path / dependencies', patterns: ['critical path', 'dependenc', 'blocker', 'sequence', 'predecessor'] },
    { label: 'Match people to skills and capacity', patterns: ['skill', 'capacity', 'availab', 'workload', 'who is best', 'strength'] },
    { label: 'Named framework (MoSCoW, RICE, matrix)', patterns: ['moscow', 'rice', 'eisenhower', 'weighted', 'framework', 'must.?have', 'value.{0,10}effort'] },
    { label: 'The triple constraint - something gives', patterns: ['scope', 'time', 'cost', 'quality', 'triple constraint', 'trade-?off', 'something has to'] },
    { label: 'Re-prioritise as things change', patterns: ['re-?priorit', 'revisit', 'weekly', 'change', 'adjust', 'as we learn'] }
  ]);
  key('Describe your process for delegating responsibilities among your team members.', [
    { label: 'Match the task to skill and development goals', patterns: ['skill', 'strength', 'develop', 'grow', 'stretch', 'experience', 'who is best'] },
    { label: 'Delegate the outcome, not the keystrokes', patterns: ['outcome', 'what.{0,20}not how', 'ownership', 'autonom', 'micromanag', 'trust'] },
    { label: 'Make the expectation and deadline explicit', patterns: ['expectation', 'deadline', 'clear', 'definition of done', 'acceptance', 'by when'] },
    { label: 'Agree a check-in cadence', patterns: ['check.?in', 'cadence', 'follow up', 'stand-?up', 'weekly', 'progress'] },
    { label: 'Stay accountable for the result', patterns: ['still.{0,20}(responsible|accountable)', 'my responsibility', 'accountab', 'own the outcome'] },
    { label: 'Unblock rather than take it back', patterns: ['unblock', 'support', 'help', 'take.{0,10}back', 'escalat', 'available'] }
  ]);
  key('What would you do if your project was running over-budget?', [
    { label: 'Quantify the variance and forecast', patterns: ['variance', 'forecast', 'how much', 'quantif', 'burn', 'eac', 'etc'] },
    { label: 'Diagnose the cause', patterns: ['root cause', 'why', 'scope creep', 'estimat', 'rate', 'underestimat'] },
    { label: 'Frame options against the constraints', patterns: ['scope', 'time', 'cost', 'quality', 'trade-?off', 'option'] },
    { label: 'Take options to the sponsor', patterns: ['sponsor', 'stakeholder', 'decision', 'alternatives', 'recommend', 'escalat'] },
    { label: 'Do not silently cut testing or quality', patterns: ['quality', 'test', 'not cut', "don'?t cut", 'silently', 'corners'] },
    { label: 'Tighten tracking going forward', patterns: ['earned value', 'track', 'monitor', 'weekly', 'going forward', 'prevent'] }
  ]);

  /* --- UX --- */
  key('How is UX design different from UI design?', [
    { label: 'UI is the interface surface itself', patterns: ['interface', 'visual', 'look', 'button', 'layout', 'colou?r', 'typograph'] },
    { label: 'UX is the whole experience of a goal', patterns: ['experience', 'journey', 'end.?to.?end', 'goal', 'whole', 'overall'] },
    { label: 'UX includes research, IA, flows', patterns: ['research', 'information architecture', 'flow', 'user testing', 'wireframe', 'journey map'] },
    { label: 'Good UI does not guarantee good UX', patterns: ['does not (mean|guarantee|imply)', 'beautiful but', 'not necessarily', 'can still be'] },
    { label: 'A concrete example of the difference', patterns: ['for example', 'e\\.g\\.', 'example', 'imagine', 'think of'] }
  ]);
  key('What process do you follow as a UX designer?', [
    { label: 'Research before designing', patterns: ['research', 'discover', 'interview', 'observ', 'understand the problem'] },
    { label: 'Define the problem and success criteria', patterns: ['define', 'problem statement', 'success', 'criteria', 'persona', 'jtbd'] },
    { label: 'Explore multiple directions', patterns: ['ideat', 'sketch', 'explore', 'multiple', 'alternatives', 'brainstorm'] },
    { label: 'Prototype at the right fidelity', patterns: ['prototyp', 'wireframe', 'low.?fidelity', 'mockup', 'paper', 'fidelity'] },
    { label: 'Test with real users and iterate', patterns: ['usability test', 'test with', 'iterat', 'feedback', 'validate'] },
    { label: 'Follow through to implementation', patterns: ['hand.?off', 'developer', 'engineer', 'spec', 'implement'] }
  ]);
  key('Which applications have excellent UX design? Why are they better than the rest?', [
    { label: 'Names a specific product', patterns: ['spotify', 'notion', 'stripe', 'duolingo', 'figma', 'airbnb', 'google maps', 'venmo', 'slack', 'apple', 'uber', 'gmail', 'linear', 'instagram', 'netflix'] },
    { label: 'Names the user goal it serves', patterns: ['goal', 'trying to', 'task', 'job', 'need'] },
    { label: 'Points at a specific design decision', patterns: ['because', 'the way it', 'specific', 'for instance', 'decision', 'chose'] },
    { label: 'Talks about friction / cognitive load', patterns: ['friction', 'cognitive load', 'steps', 'effort', 'simple', 'fewer'] },
    { label: 'Names a trade-off or weakness too', patterns: ['however', 'trade-?off', 'downside', 'weakness', 'but it', 'at the cost'] }
  ]);

  /* --- QA --- */
  key('Can you explain the general stages of a defect/bug life cycle?', [
    { label: 'New / Open when logged', patterns: ['new', 'open', 'logged', 'reported', 'raised'] },
    { label: 'Assigned / triaged with a priority', patterns: ['assign', 'triage', 'priorit', 'severity'] },
    { label: 'In progress / fixed by the developer', patterns: ['in progress', 'fixed', 'resolv', 'working on'] },
    { label: 'Retested and verified by QA', patterns: ['retest', 'verif', 'confirm', 'test again', 'validate'] },
    { label: 'Closed when verified', patterns: ['closed'] },
    { label: 'Reopened if the fix fails', patterns: ['reopen', 'back to', 'fails.{0,20}retest'] },
    { label: 'Rejected / deferred / duplicate are valid exits', patterns: ['reject', 'defer', 'duplicate', 'not a bug', "won'?t fix", 'as designed'] }
  ]);
  key('Can you explain what a good test case is in quality assurance?', [
    { label: 'Tests one thing', patterns: ['one thing', 'single', 'specific', 'objective', 'atomic', 'focused'] },
    { label: 'States preconditions and test data', patterns: ['precondition', 'setup', 'test data', 'prerequisite', 'initial state'] },
    { label: 'Unambiguous, repeatable steps', patterns: ['steps', 'repeatab', 'reproduc', 'unambiguous', 'anyone can'] },
    { label: 'Explicit expected result', patterns: ['expected', 'result', 'outcome', 'pass.{0,10}criteria'] },
    { label: 'Independent of other cases', patterns: ['independ', 'isolat', 'not rely', 'standalone', 'any order'] },
    { label: 'Traceable to a requirement', patterns: ['traceab', 'requirement', 'user story', 'acceptance criteria', 'maps to'] }
  ]);
  key("What's the difference between functional and non-functional testing?", [
    { label: 'Functional = does it do what it should', patterns: ['functional.{0,50}(what|does|behavio|feature|requirement)', 'what the system does', 'correct output'] },
    { label: 'Non-functional = how well it does it', patterns: ['non-?functional.{0,50}(how|well|quality)', 'how well', 'quality attribute'] },
    { label: 'Non-functional covers performance, security, usability', patterns: ['performance', 'security', 'usability', 'scalab', 'reliab', 'availab', 'load'] },
    { label: 'Functional examples: login, checkout, validation', patterns: ['login', 'checkout', 'validation', 'calculat', 'submit', 'search'] },
    { label: 'Both are needed to ship', patterns: ['both', 'together', 'not enough', 'as well', 'complement'] }
  ]);
  key('Explain load testing vs. stress testing vs. volume testing.', [
    { label: 'Load = expected usage levels', patterns: ['expected', 'normal', 'anticipated', 'typical'] },
    { label: 'Stress = beyond capacity, find the break point', patterns: ['beyond', 'breaking point', 'break', 'limit', 'until it fails', 'extreme', 'overload'] },
    { label: 'Volume = large amounts of data', patterns: ['volume.{0,25}data', 'large.{0,20}data', 'database size', 'amount of data', 'records', 'rows'] },
    { label: 'Each answers a different question', patterns: ['question', 'purpose', 'goal', 'tells you', 'answers', 'different'] },
    { label: 'Stress also tests recovery', patterns: ['recover', 'graceful', 'degrad', 'comes back', 'restore'] }
  ]);

  /* --- product manager --- */
  key('How would you handle a major feature request from a key customer that conflicts with the current development roadmap?', [
    { label: 'Find the underlying problem, not the feature', patterns: ['underlying', 'actual problem', 'why', 'root', 'job to be done', 'need behind', 'dig'] },
    { label: 'Is it generalisable beyond this customer?', patterns: ['other customer', 'generali[sz]', 'segment', 'how many', 'broader', 'one-?off', 'representative'] },
    { label: 'Cost it against roadmap opportunity cost', patterns: ['opportunity cost', 'trade-?off', 'displace', 'revenue', 'impact', 'priorit'] },
    { label: 'Look for cheaper alternatives', patterns: ['workaround', 'configur', 'integration', 'alternative', 'partial', 'existing'] },
    { label: 'Communicate the decision either way', patterns: ['communicat', 'transparen', 'explain', 'tell them', 'honest', 'expectations'] },
    { label: 'Avoid roadmap capture by the loudest customer', patterns: ['loudest', 'squeaky', 'one customer', 'bespoke', 'consultancy', 'custom.{0,15}build'] }
  ]);

  /* ---------- classification -------------------------------------------- */

  var STORY_MARKERS = [
    '^tell me about', '^describe a', '^name a', '^give me an example',
    '^discuss a', '^walk (me|us) through a', '^talk (me|us) through a',
    '\\ba time\\b', '\\ba situation (in )?which', '^how have you',
    '^what (is|was) the biggest challenge you have', 'favourite|favorite',
    '^explain your'
  ];

  /* Wording that marks a genuine knowledge question, used only as a safety net
     for a technical question that has no answer key yet. */
  var TECH_MARKERS = [
    '^what is', '^what are', "^what's the difference", 'difference between',
    '^explain', '^how does', '^how are', '^can you explain', '^what tools',
    '^what type of', '^describe the [a-z ]{0,20}(stage|cycle|process|module|step)',
    '^which [a-z ]{0,20}(tool|language|framework)'
  ];

  var STAR_CUES = {
    situation: [
      'on (a|an|my|our|the)[^.]{0,34}(project|team|internship|job|class|assignment|engagement)',
      '\\b(during|while|when)\\b', 'last (semester|summer|year|term|month)',
      'at (my|the|a)\\b',
      'in (my|our|a|the)[^.]{0,28}(role|class|internship|job|team|project|course|company)',
      'we were', 'i was (working|interning|on|part of|the|assigned|running|leading)',
      'my (team|group|manager|professor|client|company|first|last|previous)',
      'our (team|group|client|project|company|class)', 'there was', 'i (ran|led|was on)\\b'
    ],
    task: [
      'my (job|task|role|responsibility|goal|part|assignment)',
      '\\b(i|we) (had to|needed to|wanted to|was|were) ',
      '\\bhad to\\b', '\\bneeded to\\b', '\\bwanted to\\b',
      'i was (asked|assigned|responsible|tasked|supposed|expected)',
      'responsible for', 'i owned', 'it was (on me|my)',
      'the (goal|challenge|problem|issue|task|ask|question|tension|risk) was',
      'was to\\b', 'about whether', 'the deadline'
    ],
    action: [
      '\\bi (built|wrote|created|ran|set up|proposed|organi[sz]ed|led|asked|met|' +
      'reached out|analy[sz]ed|tested|designed|documented|scheduled|reviewed|' +
      'mapped|escalated|suggested|implemented|decided|changed|started|split|' +
      'timeboxed|interviewed|checked|fixed|automated|presented|rebuilt|moved|' +
      'added|removed|spent|showed|gave|brought|pushed|found|used|made|went|' +
      'sat|walked|framed|reframed|counted|measured|logged|filed|drafted)\\b',
      'so i ', 'i decided', 'my approach', 'what i did', 'i took', 'instead of',
      'i did not', "i didn'?t", 'rather than[^.]{0,30}i '
    ],
    result: [
      'as a result', 'result(ed|ing)? in',
      '(we|it|they|that) (shipped|delivered|launched|finished|landed|completed|' +
      'reduced|increased|saved|avoided|adopted|approved|accepted|used|worked|' +
      'stopped|passed|ran|went|submitted|agreed|dropped|rose|fell|improved)',
      'ended up', 'in the end', 'the outcome', 'we were able to', 'it worked',
      'went from', '\\bfrom \\d+[^.]{0,18}to \\d+', 'on time', 'ahead of schedule',
      'improved', 'reduced', 'increased', 'saved', 'cut ', 'lifted', 'stopped',
      'they (approved|adopted|used|accepted|took|picked|chose)', '\\d+%',
      'no longer', 'since then', 'still (running|used)'
    ],
    learning: [
      'i learned', 'what i (took|learned|kept)', 'the lesson', 'since then',
      'i now ', 'it taught me', 'going forward', 'what that (taught|showed)',
      'i started ', 'that is now', 'i (try|aim) to', 'the habit'
    ]
  };

  var HEDGES = [
    '\\bi think\\b', '\\bi guess\\b', '\\bkind of\\b', '\\bsort of\\b',
    '\\bmaybe\\b', '\\bprobably\\b', '\\bjust\\b', '\\bbasically\\b',
    '\\bi feel like\\b', '\\bor something\\b', '\\bstuff\\b', '\\bthings like that\\b'
  ];

  /* ---------- scoring ---------------------------------------------------- */

  var W = { ok: 1, mid: 0.55, gap: 0 };

  function finalise(dims, missing) {
    var earned = 0, possible = 0;
    dims.forEach(function (d) {
      var w = d.weight || 1;
      earned += W[d.state] * w;
      possible += w;
    });
    var pct = Math.round((earned / possible) * 100);

    var verdict = pct >= 82 ? 'Interview-ready'
      : pct >= 62 ? 'Solid, with one clear gap'
      : pct >= 40 ? 'Rough draft - the substance is there'
      : 'Needs another pass';

    /* Highest-leverage fix = where the most weighted score is being lost. */
    var target = null, best = 0;
    dims.forEach(function (d) {
      var loss = (d.weight || 1) * (1 - W[d.state]);
      if (loss > best) { best = loss; target = d; }
    });

    var fix;
    if (!target) {
      fix = 'Nothing structural left to fix. Now say it out loud on camera - ' +
            'written answers that score well often run long when spoken.';
    } else if (target.name === 'Concept coverage' && missing && missing.length) {
      fix = 'Work in the missing points, starting with "' + missing[0] +
            '". That one is the most commonly expected part of this answer.';
    } else {
      fix = target.note;
    }
    return { pct: pct, verdict: verdict, dims: dims, fixFirst: fix };
  }

  /* ---------- story rubric ------------------------------------------------ */

  function analyseStory(text) {
    var n = words(text).length, dims = [];

    var present = {};
    ['situation', 'task', 'action', 'result'].forEach(function (k) {
      present[k] = hasAny(text, STAR_CUES[k]);
    });
    var missing = Object.keys(present).filter(function (k) { return !present[k]; });
    var hits = 4 - missing.length;
    var nameOf = {
      situation: 'Situation (where and when)',
      task: 'Task (what you were on the hook for)',
      action: 'Action (what you personally did)',
      result: 'Result (how it turned out)'
    };
    dims.push({
      name: 'STAR structure', weight: 3,
      state: hits === 4 ? 'ok' : hits >= 2 ? 'mid' : 'gap',
      note: hits === 4
        ? 'All four parts are present. An interviewer can follow this without asking follow-ups.'
        : 'Missing: ' + missing.map(function (k) { return nameOf[k]; }).join('; ') +
          '. Interviewers score behavioural answers against STAR, so a missing part reads as vague.'
    });

    var iC = countMatches(text, '\\bi\\b'), weC = countMatches(text, '\\b(we|our|us)\\b');
    var own = (iC + weC) === 0 ? 0 : iC / (iC + weC);
    dims.push({
      name: 'Ownership', weight: 2,
      state: own >= 0.45 ? 'ok' : own >= 0.25 ? 'mid' : 'gap',
      note: own >= 0.45
        ? 'You said "I" ' + iC + ' times against "we" ' + weC + '. Your own contribution is clear.'
        : 'You said "we/our" ' + weC + ' times but "I" only ' + iC +
          '. The interviewer is hiring you, not your team - turn at least two "we" ' +
          'statements into what you personally did.'
    });

    var nums = countMatches(text, '\\b\\d+([.,]\\d+)?%?\\b') +
      countMatches(text, '\\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|' +
        'fifteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|dozen|half|twice)\\b');
    dims.push({
      name: 'Specific evidence', weight: 2,
      state: nums >= 2 ? 'ok' : nums === 1 ? 'mid' : 'gap',
      note: nums >= 2
        ? 'You used ' + nums + ' concrete quantities. That is what makes a story sound like it happened.'
        : nums === 1
        ? 'One number so far. Add a second - how long it took, how many people, how much it moved.'
        : 'No numbers anywhere. Add at least one: how many users, how many hours, what percent ' +
          'it improved. Unquantified stories are indistinguishable from hypothetical ones.'
    });

    dims.push({
      name: 'Length', weight: 1,
      state: (n >= 90 && n <= 260) ? 'ok' : (n >= 55 && n <= 340) ? 'mid' : 'gap',
      note: n < 55
        ? n + ' words. Too short to carry a full story - aim for 90-260, about 60-90 seconds spoken.'
        : n < 90
        ? n + ' words (~' + Math.round(n / 2.6) + 's spoken). A little thin. One more sentence on ' +
          'what you did, or on the result, gets you into the range interviewers expect.'
        : n > 340
        ? n + ' words. Past two minutes spoken - interviewers start skimming. Cut the setup, keep ' +
          'the action and result.'
        : n > 260
        ? n + ' words. Slightly long - trim the setup so the action and result arrive sooner.'
        : n + ' words (~' + Math.round(n / 2.6) + 's spoken). Good range.'
    });

    var hedges = 0;
    HEDGES.forEach(function (h) { hedges += countMatches(text, h); });
    var rate = n === 0 ? 0 : hedges / n;
    dims.push({
      name: 'Confidence', weight: 1,
      state: rate < 0.012 ? 'ok' : rate < 0.03 ? 'mid' : 'gap',
      note: hedges === 0
        ? 'No hedging language. You sound like you are describing something you did.'
        : hedges + ' hedging phrase' + (hedges === 1 ? '' : 's') +
          ' ("I think", "kind of", "just", "maybe"). Each one undercuts the claim attached to it - ' +
          'delete them and the same sentence reads as expertise.'
    });

    dims.push({
      name: 'Reflection', weight: 1,
      state: hasAny(text, STAR_CUES.learning) ? 'ok' : 'mid',
      note: hasAny(text, STAR_CUES.learning)
        ? 'You closed with what you learned. That is the line the interviewer writes down.'
        : 'No explicit takeaway. One closing sentence - "what I took from that is..." - is the ' +
          'cheapest upgrade available on any behavioural answer.'
    });

    return finalise(dims);
  }

  /* ---------- approach rubric --------------------------------------------- */

  function analyseApproach(text) {
    var n = words(text).length, dims = [];

    var stance = hasAny(text, [
      'my (approach|rule|principle|default|process|framework|habit|instinct|first move|working assumption)',
      'i (always|never|start|begin|try to|treat|assume|prefer|aim to|make a point|keep|maintain|run|use|used|look for)',
      'the (way|thing|first thing|one thing|main thing) i', 'i would (start|not)',
      '\\b(two|three|four|five) things\\b', 'the (three|two|four)\\b',
      'the criteria', 'i separate', 'the failure mode', 'mostly by', 'rather than', 'first,'
    ]);
    dims.push({
      name: 'Stated approach', weight: 3,
      state: stance ? 'ok' : 'gap',
      note: stance
        ? 'You lead with a stated method rather than a list of adjectives. That is what this ' +
          'question is asking for.'
        : 'No explicit method. This question wants a repeatable approach - open with one sentence ' +
          'naming it ("my rule is...", "I start by..."), then support it. Without that it reads as improvised.'
    });

    var artifact = hasAny(text, [
      'checklist', 'template', 'log\\b', 'register', 'matrix', 'glossary', 'one-?page',
      'document', 'agenda', 'retro', 'stand-?up', 'sync', 'dashboard', 'ticket', 'jira',
      'confluence', 'trailhead', 'figma', 'excel', 'spreadsheet', 'notion', 'decision log',
      'risk register', 'definition of done', 'acceptance criteria', 'runbook', 'playbook',
      'cadence', 'weekly', 'daily', 'every (day|week|sprint)', 'newsletter', 'user group',
      '\\b\\d+\\b', '\\b(two|three|four|five|six)\\b'
    ]);
    dims.push({
      name: 'Concrete practice', weight: 2,
      state: artifact ? 'ok' : 'gap',
      note: artifact
        ? 'You named something specific - an artifact, tool or cadence. That is what makes an ' +
          'approach answer credible rather than aspirational.'
        : 'Everything here is abstract. Name the actual thing you use: a decision log, a PR ' +
          'checklist, a weekly sync, a specific tool. Otherwise an interviewer cannot tell you ' +
          'apart from someone who has only read about it.'
    });

    var grounded = hasAny(text, [
      'for example', 'for instance', 'e\\.g\\.',
      'on (my|our|one) (project|team|internship|class)', 'last (semester|summer|year|term)',
      'in my (class|internship|role|job)', 'when i ', 'concretely', 'one time', 'we had', 'at my'
    ]);
    dims.push({
      name: 'Grounded in a real instance', weight: 2,
      state: grounded ? 'ok' : 'mid',
      note: grounded
        ? 'You anchored the method in something that actually happened. This is the part most ' +
          'candidates skip on a "how do you" question.'
        : 'You described the method but never showed it working. Add one sentence: "for example, ' +
          'on my class project I..." An ungrounded method reads as a guess about how you would behave.'
    });

    var sentences = text.split(/[.!?]+/).filter(function (x) { return words(x).length > 3; }).length;
    var structured = sentences >= 3 && hasAny(text, [
      'first', 'second', 'third', 'then', 'next', 'finally', 'after that', 'the other',
      'and then', 'beyond that', 'more importantly', 'because', 'so that', 'rather than', 'instead of'
    ]);
    dims.push({
      name: 'Structure', weight: 1,
      state: structured ? 'ok' : sentences >= 3 ? 'mid' : 'gap',
      note: structured
        ? 'Sequenced and easy to follow spoken aloud.'
        : sentences >= 3
        ? 'The points are there but unsignposted. "There are three things I do - first... second..." ' +
          'makes an approach answer far easier to follow.'
        : 'Too short to have a structure. An approach answer wants the method, a concrete practice, ' +
          'and an example.'
    });

    dims.push({
      name: 'Length', weight: 1,
      state: (n >= 80 && n <= 250) ? 'ok' : (n >= 45 && n <= 320) ? 'mid' : 'gap',
      note: n < 45
        ? n + ' words. Too thin to describe a method and show it working.'
        : n < 80
        ? n + ' words (~' + Math.round(n / 2.6) + 's spoken). You have stated the method but not ' +
          'shown it. Add the example.'
        : n > 320
        ? n + ' words. Past ninety seconds spoken. Cut to the method plus one example.'
        : n > 250
        ? n + ' words. Slightly long - keep the method and one example, cut the rest.'
        : n + ' words (~' + Math.round(n / 2.6) + 's spoken). Good range.'
    });

    var hedges = 0;
    HEDGES.forEach(function (h) { hedges += countMatches(text, h); });
    var rate = n === 0 ? 0 : hedges / n;
    dims.push({
      name: 'Confidence', weight: 1,
      state: rate < 0.012 ? 'ok' : rate < 0.03 ? 'mid' : 'gap',
      note: hedges === 0
        ? 'No hedging language. You sound like someone who does this, not someone guessing at it.'
        : hedges + ' hedging phrase' + (hedges === 1 ? '' : 's') + '. On a method question these ' +
          'are especially costly - they make a process sound like a preference.'
    });

    return finalise(dims);
  }

  /* ---------- technical rubric -------------------------------------------- */

  function analyseTechnical(text, concepts) {
    var n = words(text).length, dims = [];
    var hit = [], miss = [];

    if (concepts) {
      concepts.forEach(function (c) {
        (hasAny(text, c.patterns) ? hit : miss).push(c.label);
      });
      var cov = hit.length / concepts.length;
      dims.push({
        name: 'Concept coverage', weight: 4,
        state: cov >= 0.7 ? 'ok' : cov >= 0.4 ? 'mid' : 'gap',
        note: 'You covered ' + hit.length + ' of ' + concepts.length +
          ' points interviewers listen for.' +
          (hit.length ? ' Hit: ' + hit.join('; ') + '.' : '') +
          (miss.length ? ' Missing: ' + miss.join('; ') + '.' : ' Nothing missing.')
      });
    }

    var concrete = hasAny(text, [
      'for example', 'for instance', 'e\\.g\\.', 'such as', 'like when',
      'in my (project|class|internship)', 'i (used|built|ran|set up)', 'i have',
      'last (semester|summer)', 'say '
    ]);
    dims.push({
      name: 'Grounded in experience', weight: 1,
      state: concrete ? 'ok' : 'mid',
      note: concrete
        ? 'You tied the concept to something concrete. That is the difference between knowing a ' +
          'definition and having used it.'
        : 'This reads as a textbook answer. Add one clause - "for example, on my class project I..." ' +
          '- and it becomes evidence rather than recall.'
    });

    var sentences = text.split(/[.!?]+/).filter(function (x) { return words(x).length > 3; }).length;
    var structured = sentences >= 3 && hasAny(text, [
      'first', 'then', 'next', 'finally', 'start', 'after that', 'second', 'the difference',
      'whereas', 'on the other hand', 'because', 'so that', 'the reason'
    ]);
    dims.push({
      name: 'Structure', weight: 1,
      state: structured ? 'ok' : sentences >= 3 ? 'mid' : 'gap',
      note: structured
        ? 'Sequenced with connective language, so it is easy to follow spoken aloud.'
        : sentences >= 3
        ? 'The content is there but it arrives as a list. Signpost it - "first... then... the thing ' +
          'that actually matters is..." - so a listener can track it.'
        : 'Too short to have a structure. Technical answers want a definition, an example, and a ' +
          'trade-off or caveat.'
    });

    var terse = n < 70;
    var covOk = concepts ? (hit.length / concepts.length) >= 0.7 : false;
    dims.push({
      name: 'Length', weight: 1,
      state: (n >= 70 && n <= 260) ? 'ok' : (n >= 40 && n <= 340) ? 'mid' : 'gap',
      /* Written against coverage on purpose: telling someone who named every
         expected point that they sound like they "do not know it" is both wrong
         and the kind of contradiction that makes feedback ignorable. */
      note: (terse && covOk)
        ? n + ' words. You named the right points but compressed them into a list. Give each one a ' +
          'sentence - spoken, this lands as about ' + Math.round(n / 2.6) + ' seconds, which reads as rushing.'
        : n < 40
        ? n + ' words. Too thin - an interviewer will read this as "does not know it".'
        : n < 70
        ? n + ' words (~' + Math.round(n / 2.6) + 's spoken). Short for a technical answer. Add the ' +
          'example or the caveat you left out.'
        : n > 340
        ? n + ' words. Long enough that the key point gets buried. Lead with the direct answer, then elaborate.'
        : n > 260
        ? n + ' words. Slightly long - lead with the direct answer, then elaborate.'
        : n + ' words (~' + Math.round(n / 2.6) + 's spoken). Good range.'
    });

    return finalise(dims, miss);
  }

  /* ---------- public entry ------------------------------------------------ */

  function evaluateAnswer(text, q) {
    var clean = (text || '').trim();
    if (words(clean).length < 12) {
      return {
        pct: 0,
        verdict: 'Not enough to analyse',
        dims: [{
          name: 'Length', weight: 1, state: 'gap',
          note: 'Write at least a couple of sentences. The point of this is that you get the bad ' +
                'version out of your system here rather than in the actual interview.'
        }],
        fixFirst: 'Attempt a real answer, even a rough one. You can reveal the strong version ' +
                  'afterwards - but reading it first is how you convince yourself you know ' +
                  'something you cannot yet say out loud.'
      };
    }

    var concepts = KEYS[slug(q.q)];
    var text = (q.q || '').toLowerCase();

    /* The bank's Behavioral/Technical label is a hint; the question's own
       wording is authoritative.

       Every genuine technical question in the bank has an answer key. So a
       question filed under "technical" with NO key is one of the three that
       are really motivational - "Why do you want to work for this company?",
       "Describe your leadership experience", "What interests you most about
       this role?" - and those belong on the approach rubric. Scoring them for
       concept coverage would produce feedback that is confidently wrong. */
    if (concepts) return analyseTechnical(clean, concepts);
    if (hasAny(text, STORY_MARKERS)) return analyseStory(clean);
    if (hasAny(text, TECH_MARKERS)) return analyseTechnical(clean, null);
    return analyseApproach(clean);
  }

  /* ---------- UI ----------------------------------------------------------- */

  var PANEL_ID = 'written-feedback-panel';

  function buildPanel() {
    if (document.getElementById(PANEL_ID)) return;
    var card = document.getElementById('question-card');
    var model = document.getElementById('model-answer');
    if (!card || !model) return;

    var wrap = document.createElement('div');
    wrap.className = 'wf-wrap';
    wrap.id = PANEL_ID;
    wrap.innerHTML =
      '<label class="wf-label">Draft it in writing first &mdash; optional</label>' +
      '<p class="wf-hint">Type the answer you are about to give. You will get structured ' +
      'feedback on how it is built, then say it on camera.</p>' +
      '<textarea id="wf-text" class="wf-textarea" rows="7" ' +
      'placeholder="Write it the way you would say it out loud. Aim for 90-260 words."></textarea>' +
      '<div class="wf-meta"><span id="wf-count">0 words</span></div>' +
      '<div class="wf-actions">' +
        '<button type="button" class="btn-primary" id="wf-go">Get written feedback</button>' +
        '<button type="button" class="btn-secondary" id="wf-clear">Clear</button>' +
      '</div>' +
      '<div id="wf-out"></div>';

    model.parentNode.insertBefore(wrap, model);

    document.getElementById('wf-text').addEventListener('input', function () {
      var v = this.value.trim();
      document.getElementById('wf-count').textContent =
        (v ? v.split(/\s+/).length : 0) + ' words';
    });
    document.getElementById('wf-go').addEventListener('click', runFeedback);
    document.getElementById('wf-clear').addEventListener('click', function () {
      document.getElementById('wf-text').value = '';
      document.getElementById('wf-count').textContent = '0 words';
      document.getElementById('wf-out').innerHTML = '';
    });
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function runFeedback() {
    var q = (typeof currentQuestions !== 'undefined' && currentQuestions)
      ? currentQuestions[currentIndex] : null;
    if (!q) return;
    var r = evaluateAnswer(document.getElementById('wf-text').value, q);
    var out = document.getElementById('wf-out');

    out.innerHTML =
      '<div class="wf-result">' +
        '<div class="wf-score">' +
          '<div class="wf-ring" style="--pct:' + r.pct + '%"><span>' + r.pct + '</span></div>' +
          '<div>' +
            '<div class="wf-verdict">' + esc(r.verdict) + '</div>' +
            '<div class="wf-sub">Structural score across ' + r.dims.length + ' dimensions. It ' +
            'measures how the answer is built, not whether the facts in it are true.</div>' +
          '</div>' +
        '</div>' +
        '<div class="wf-fix"><strong>Fix this first</strong>' + esc(r.fixFirst) + '</div>' +
        '<div class="wf-dims">' +
          r.dims.map(function (d) {
            var mark = d.state === 'ok' ? '&#10003;' : d.state === 'mid' ? '~' : '!';
            return '<div class="wf-dim wf-' + d.state + '">' +
              '<span class="wf-icon">' + mark + '</span>' +
              '<span class="wf-name">' + esc(d.name) + '</span>' +
              '<span class="wf-note">' + esc(d.note) + '</span>' +
            '</div>';
          }).join('') +
        '</div>' +
        '<details class="wf-how"><summary>How was this scored?</summary><div>' +
          'No AI is involved. The question is classified from its wording as a story ' +
          '("tell me about a time"), an approach ("how do you...") or a technical question, ' +
          'because scoring all three the same way produces feedback that is confidently wrong. ' +
          'Story answers are checked for the four STAR components, the ratio of "I" to "we", ' +
          'concrete quantities, spoken length and hedging. Approach answers are checked for a ' +
          'stated method, a named artifact and a real example. Technical answers are checked ' +
          'against a per-question answer key written from the sourced material. Each dimension ' +
          'scores 1, 0.55 or 0, weighted by importance. The engine cannot tell whether what you ' +
          'wrote is factually correct &mdash; which is exactly why the strong answer is there to ' +
          'compare against.' +
        '</div></details>' +
      '</div>';
    out.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function resetPanel() {
    var t = document.getElementById('wf-text');
    if (!t) return;
    t.value = '';
    document.getElementById('wf-count').textContent = '0 words';
    document.getElementById('wf-out').innerHTML = '';
  }

  /* Wrap loadQuestion so the panel is built once and cleared per question. */
  function hook() {
    if (typeof window.loadQuestion !== 'function') return false;
    var original = window.loadQuestion;
    window.loadQuestion = function () {
      var out = original.apply(this, arguments);
      buildPanel();
      resetPanel();
      return out;
    };
    return true;
  }

  if (!hook()) {
    document.addEventListener('DOMContentLoaded', hook);
  }
})();
