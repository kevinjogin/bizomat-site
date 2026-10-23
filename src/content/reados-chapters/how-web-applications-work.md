---
title: "How web applications work: browsers, servers, databases and what happens when you click"
description: "What happens between a click and a page: domain names, HTTP and HTTPS, front end and back end, databases, sessions, caching and content delivery, and where performance and security problems arise."
publishDate: 2026-10-16
category: "Technology"
tags:
  - systems
  - operations
  - customers
author: "KEVOS"
featured: false
draft: false
---

Most business software is now used through a web browser. Customer portals, online stores, accounting packages, job management systems, booking tools and internal dashboards all run as **web applications**: software that people reach through an address, use in a browser and never install. Even many phone apps are, underneath, talking to the same kinds of web servers.

Because web applications are so familiar, it is easy to forget how many separate parts are involved each time someone clicks a button. A domain name must be found, a secure connection set up, a request sent to a server, business logic run, a database queried, a response assembled and sent back, and the page drawn on screen. Each part can be slow, fail or be attacked. Understanding the journey helps business owners make better decisions about hosting, performance, security and suppliers, and describe problems more precisely when something goes wrong.

This article explains how web applications work: addresses and domain names, the request and response cycle, HTTP and HTTPS, the front end and back end, databases, sessions and logins, caching and content delivery networks, and how applications are hosted. It then looks at where performance and security problems arise and what to ask suppliers. It is part of a series on software and cloud foundations for business leaders.

## Websites and web applications

The line between a website and a web application is blurred, but a useful distinction is:

- a **website** mainly presents information, such as pages about a business, its services and contact details; and
- a **web application** lets users do things: log in, enter data, place orders, run reports and change records.

A simple informational website can consist of fixed files served to every visitor, as the [why this website has no database](/reados/collections/database-foundations-for-business/why-this-website-has-no-database/) article describes. A web application generates responses for each user and request, usually from a database, which brings more capability and more complexity.

## Addresses and domain names

A web address, or **URL**, such as an address beginning with https, identifies what to fetch. It includes the protocol, usually HTTPS, the **domain name**, such as example.com.au, and a path to a specific page or resource.

Computers on the internet find each other by numerical **IP addresses**, not names. The **Domain Name System**, or DNS, translates domain names into IP addresses, rather like a phone directory. When someone types an address, their computer asks a DNS service where that domain is hosted, and then connects to the address it receives. DNS records are controlled through the business's domain registrar or DNS provider, and errors in them can make a website or email disappear entirely, which is why control of domain accounts matters.

## Requests and responses

The web works through **requests** and **responses**. The browser sends a request to a server, asking for something, and the server sends back a response. A single page often involves dozens of requests: one for the page itself, others for style sheets, scripts, images, fonts and data.

Requests use a set of **methods** that indicate their purpose, most commonly:

- **GET**, to retrieve something, such as a page or a list of orders; and
- **POST**, to send something, such as a submitted form or a new order.

Others, such as PUT, PATCH and DELETE, update or remove resources and are widely used in programming interfaces between systems.

Responses carry a **status code** that indicates the result. Familiar examples include 200 for success, 301 for a resource that has moved permanently, 404 for a resource that cannot be found and 500 for an error on the server. Status codes are useful when diagnosing problems: a 404 suggests a wrong or outdated link, while a 500 suggests something failed inside the application.

```figure
type: svg
title: A request and its response
alt: A browser sends a request over HTTPS to a web server, which may query a database, then returns a response with a status code such as 200 for success, 301 for moved, 404 for not found or 500 for a server error.
caption: Every page is a request and a response; the status code says what happened.
viewbox: 0 0 640 190
body:
<rect class="bx" x="20" y="60" width="140" height="56" rx="8"/>
<text class="txb" x="90" y="93" text-anchor="middle">Browser</text>
<rect class="bxa" x="250" y="60" width="140" height="56" rx="8"/>
<text class="txb" x="320" y="93" text-anchor="middle">Web server</text>
<rect class="bxi" x="480" y="60" width="140" height="56" rx="8"/>
<text class="tx" x="550" y="93" text-anchor="middle">Database</text>
<path class="la flow" d="M160 76H250"/>
<path class="ln flow" d="M250 102H160"/>
<path class="ln dsh" d="M390 88H480"/>
<text class="tx txs" x="205" y="68" text-anchor="middle">request</text>
<text class="tx txs" x="205" y="122" text-anchor="middle">response</text>
<text class="tx txs" x="320" y="160" text-anchor="middle">200 OK · 301 moved · 404 not found · 500 server error</text>
```

## HTTP and HTTPS

Requests and responses follow the **Hypertext Transfer Protocol**, or HTTP. **HTTPS** is HTTP sent over an encrypted connection using Transport Layer Security, or TLS. Encryption prevents others on the network from reading or altering the information exchanged, such as passwords, payment details and personal information, and a **certificate** proves that the browser is talking to the genuine site rather than an impostor.

Today, every website and web application should use HTTPS, including simple informational sites. Browsers warn users about sites that do not, and search engines favour sites that do. Certificates must be renewed periodically; expired certificates cause alarming browser warnings, so renewal should be automated or carefully tracked.

## The front end

The **front end** is the part of the application that runs in the user's browser. It is built from three main technologies:

- **HTML**, which defines the structure and content of a page;
- **CSS**, which controls its appearance, such as layout, colours and fonts; and
- **JavaScript**, a programming language that makes pages interactive, for example by checking form entries, updating parts of a page without reloading or drawing charts.

Some applications generate complete pages on the server and send them to the browser. Others, often called **single-page applications**, send a JavaScript application to the browser once, which then requests data from the server and builds pages itself. Each approach has trade-offs in speed, complexity and how well search engines can read the content.

Front-end design affects usability and accessibility. Applications should work on different screen sizes, with keyboards as well as mice and with assistive technologies such as screen readers. In Australia, accessibility is also a matter of disability discrimination law, and the internationally recognised Web Content Accessibility Guidelines provide the usual benchmark.

## The back end

The **back end** runs on servers, out of the user's sight. It:

- receives requests from browsers and other systems;
- checks who the user is and what they are allowed to do;
- applies business rules, such as pricing, validation and workflow;
- reads and writes data in databases;
- communicates with other services, such as payment providers, email services and accounting systems; and
- assembles responses.

Back ends are written in many programming languages and frameworks. Important business logic belongs in the back end, not only in the browser, because anything running in the browser can be inspected and changed by a determined user. A price or discount checked only in the browser can be manipulated; the same check repeated on the server cannot.

## Databases

Most web applications store their information in one or more **databases**: customers, orders, products, users, prices and records of activity. The back end sends queries to the database to retrieve and update information. Databases manage storage, concurrent access by many users and recovery from failures, as the [what a database management system does](/reados/collections/database-foundations-for-business/what-a-database-management-system-does/) article explains.

The database is often the most important and most fragile part of a web application. Code can be replaced from version control; data cannot be recreated if it is lost. Backups, access control and careful handling of changes to its structure are essential.

## Sessions, cookies and logins

HTTP by itself does not remember anything between requests: each request is independent. To know that a series of requests comes from the same logged-in user, applications use **sessions**. After a user logs in, the server issues a session identifier, usually stored in a **cookie**, a small piece of data the browser sends back with each request. The server uses it to recognise the user until the session expires or the user logs out.

Cookies are also used to remember preferences and, controversially, to track users across websites for advertising. Privacy obligations apply to some uses, and businesses should be able to explain what their cookies do.

Logins should be protected with strong passwords and, for business systems, multi-factor authentication. Many business applications now allow **single sign-on**, letting staff log in with their main work account, which simplifies access and makes it easier to remove access when someone leaves.

## Caching and content delivery

**Caching** keeps copies of frequently requested content so it can be delivered faster. Caching happens in several places:

- **browsers** keep copies of images, scripts and styles so they do not need to download them again;
- **content delivery networks**, or CDNs, keep copies of content on servers around the world, close to users, which reduces delays for distant visitors and absorbs heavy traffic; and
- **applications and databases** cache the results of expensive calculations and queries.

Caching greatly improves speed but introduces a classic problem: making sure users see current information rather than an outdated copy. Prices, stock levels and personal information need careful cache rules.

## Hosting web applications

Web applications run on servers that may be:

- **shared hosting**, where many sites run on one server, which is cheap but limited;
- **virtual private servers or cloud virtual machines**, which give more control and capacity;
- **managed platforms**, where a provider runs the servers and the business supplies the application; or
- **software as a service**, where the business uses an application that the provider builds and runs entirely.

The [cloud, hosted or on-premise business systems](/reados/collections/database-foundations-for-business/cloud-hosted-or-on-premise-business-systems/) article explains how to choose. Whatever the arrangement, someone must be responsible for security updates, backups, monitoring and renewing certificates.

## Where performance problems arise

Slow web applications frustrate users and lose customers. Delays can arise at each step:

- **network distance and capacity**, especially for users far from the server;
- **large pages**, with heavy images and scripts;
- **too many requests** to assemble a page;
- **slow back-end code**, such as inefficient loops or calls to slow external services;
- **slow database queries**, often the largest single cause; and
- **insufficient server capacity** during busy periods.

Measuring where time is spent, rather than guessing, is the first step. Browser developer tools and monitoring services show how long each request takes. Optimising images, using a CDN, caching and improving database queries usually yield more than simply buying larger servers.

## Where security problems arise

Web applications are exposed to the whole internet and are attacked constantly, mostly by automated tools looking for known weaknesses. Common problems include:

- **outdated software**, including frameworks, plugins and server operating systems with known vulnerabilities;
- **weak authentication**, such as reused passwords without multi-factor authentication;
- **injection attacks**, in which malicious input is treated as commands by the database or server;
- **cross-site scripting**, in which attackers inject scripts into pages seen by other users;
- **broken access control**, where users can see or change records that are not theirs by altering an address or request; and
- **exposed data**, such as backups, logs or test systems left publicly accessible.

The OWASP Top 10, maintained by the Open Worldwide Application Security Project, is a widely used summary of the most significant web application security risks and a useful reference when discussing security with developers.

## Monitoring and logs

Web applications should be monitored for availability, errors and performance. **Logs** record requests, errors and important events, helping diagnose problems and investigate security incidents. Uptime monitoring services check whether a site is responding and alert someone when it is not. Without monitoring, businesses often learn of outages from customers.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A tile and stone supplier runs an online trade portal where builders check stock, prices and order status. Customers complain that the portal is slow, especially on Monday mornings, and the hosting company suggests upgrading to a larger server.

Before spending, the business asks its developer to measure where the time goes. Browser tools show that the product pages load more than 6 MB of full-resolution photographs. Server logs show that the order status page takes several seconds because it runs a separate database query for every order line. Monday mornings are slow because many builders check orders at the same time.

The developer resizes and compresses images and serves them through a CDN, adds a database index and rewrites the order status query to fetch all lines at once, and caches the product catalogue for a few minutes at a time while keeping stock levels live. Page load times fall from several seconds to around one second, Monday peaks are handled without a larger server and the hosting upgrade is not needed. While reviewing the system, the developer also finds an outdated plugin with a known vulnerability and updates it.

```figure
type: compare
title: A slow trade portal, measured before spending
cols: Cause found | Fix
caption: Page loads fell from several seconds to about one second without a bigger server.
- Product pages | Over 6 MB of full-size photos | Resized, compressed, served by a CDN
- Order status | One query per order line | An index and one query for all lines
- *Monday peaks | Everyone loading the catalogue | Catalogue cached for minutes; stock kept live
```

## How this applies to a small Australian business

- **Control domain and DNS accounts** directly.
- **Use HTTPS everywhere**, with automated certificate renewal.
- **Keep business rules on the server**, not just in the browser.
- **Back up databases** and test restores.
- **Require multi-factor authentication** for administrative and staff access.
- **Keep frameworks and plugins updated.**
- **Measure performance** before buying more capacity.
- **Monitor availability and errors** so problems are found before customers report them.
- **Check accessibility** across devices and assistive technologies.

## Common mistakes

- **Letting a supplier hold the domain** in its own name.
- **Ignoring plugin and framework updates.**
- **Checking prices or permissions only in the browser.**
- **Upgrading servers** without finding the real bottleneck.
- **Leaving test systems or backups publicly accessible.**
- **Learning about outages from customers.**

## Frequently asked questions

**Is a web application less secure than installed software?** Not inherently. Web applications are exposed to the internet, which increases attack attempts, but they can be updated centrally and quickly. Security depends on how well they are built, configured and maintained.

**What does a 500 error mean?** Something went wrong inside the application while handling the request. It usually needs the developer or hosting provider to check the application's logs.

**Why does the site look different on a phone?** Well-designed applications use responsive layouts that adapt to screen size. Problems on phones usually mean the front end was not designed or tested for smaller screens.

**Does a small business need a CDN?** Many hosting and website platforms include one. A CDN is most useful for image-heavy sites, visitors spread across regions and protection against traffic spikes.

**Who should be responsible for updates?** Someone must be named, whether the hosting provider, a developer under a support agreement or an internal staff member. Unclear responsibility is a common reason updates are missed.

## Questions to ask

- Who controls our domain, DNS and hosting accounts?
- Which parts of our application are updated, by whom and how often?
- Where does the time go when our application is slow?
- How would we know if the application stopped working tonight?
- Are our business rules and permissions enforced on the server?

## Bringing it together

Every click in a web application sets off a chain of steps: DNS finds the server, HTTPS secures the connection, the browser sends a request, the back end checks the user and applies business rules, the database supplies data, and the response is assembled, cached where sensible and drawn by the front end. Performance and security problems can arise at each step. Business owners who understand this chain can make better hosting decisions, describe problems precisely, avoid spending on the wrong fixes and hold suppliers to clear responsibilities for updates, backups and monitoring.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
