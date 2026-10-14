---
title: "Open-source or commercial databases: licences, support, cost and risk for business systems"
description: "Open-source and commercial databases differ in licences, support, cost and risk more than capability. How they compare and how to choose for custom systems, products and packages."
publishDate: 2026-10-09
category: "Technology"
tags:
  - systems
  - finance
  - strategy
author: "KEVOS®"
featured: false
draft: false
---

When a business commissions a custom system, buys software that needs its own database, or builds software into a product it sells, someone has to choose a database. The choice often comes down to two broad families: **commercial databases**, such as Microsoft SQL Server, Oracle Database and IBM Db2, sold under licences by their vendors, and **open-source databases**, such as PostgreSQL, MySQL, MariaDB and SQLite, whose source code is available under licences that allow free use.

The debate between them is often framed as cost against capability, but that is misleading. The leading databases in both families are mature, capable and widely used in critical systems. The real differences lie in licensing terms, support arrangements, the skills available, compatibility with the applications the business uses, and the long-term risks of each. A free licence can still come with significant costs, and an expensive licence can be the cheaper choice when it fits the business's applications and skills.

This article explains what open source means, how the main products compare, the types of licence and their obligations, how to compare costs and support fairly, what to consider when databases are built into products, and how to make a decision. It is general information, not legal advice on licence terms.

## What open source means

**Open-source software** is distributed with its source code under a licence that allows anyone to use, study, modify and redistribute it, subject to the licence's conditions. The Open Source Initiative, founded in 1998, maintains a widely used definition and list of approved licences.

Open source describes the licence, not the price or the quality. Open-source software can be developed by volunteers, by companies or by both, and many open-source databases are backed by commercial firms that sell support, hosting and additional features.

## The main products

| Product | Family | Origins | Typical uses |
|---|---|---|---|
| PostgreSQL | Open source | Grew from the POSTGRES research project at the University of California, Berkeley, begun in 1986 | General business systems, analytics, spatial data, web applications |
| MySQL | Open source with commercial editions | First released in 1995; now owned by Oracle | Web applications, content management, online shops |
| MariaDB | Open source | Created in 2009 as a community-developed fork of MySQL | Similar to MySQL |
| SQLite | Public domain | First released in 2000 | Embedded in applications, devices and mobile apps |
| Microsoft SQL Server | Commercial, with free limited editions | First released in 1989 | Business applications on Microsoft platforms |
| Oracle Database | Commercial | Released in 1979 as one of the first commercial SQL databases | Large enterprise systems |
| IBM Db2 | Commercial | Released in the early 1980s | Enterprise and mainframe systems |

Cloud providers also offer managed versions of several of these, as well as their own database services, which change the cost and support picture again.

## Types of licence

Licences matter most when a business modifies the database or distributes it as part of its own software or products. The main kinds are:

- **Permissive licences**, such as the PostgreSQL, MIT and BSD licences, allow use, modification and redistribution with few conditions, typically keeping copyright notices.
- **Copyleft licences**, such as the GNU General Public License used by MySQL's community edition, require that software distributed with or derived from the licensed code be made available under the same licence in certain circumstances. Running the software internally usually triggers fewer obligations than distributing it.
- **Public domain**, as with SQLite, places essentially no conditions on use.
- **Dual licensing** offers the same software under an open-source licence or, for a fee, a commercial licence without copyleft obligations.
- **Commercial licences** grant rights to use the software for a fee, often per processor core, per server or per user, with terms on where and how it may be run.
- **Source-available licences** publish the code but restrict some uses, such as offering the software as a hosted service. Several database vendors have moved products from open-source to source-available licences in recent years, MongoDB in 2018 being an early example.

Licence terms are legal documents, and their interpretation can depend on how software is combined and distributed. Businesses distributing software should obtain legal advice.

## Comparing costs fairly

Licence fees are only part of the cost of a database. A fair comparison over at least five years includes:

| Cost | Commercial database | Open-source database |
|---|---|---|
| Licences | Often significant; depends on edition, cores or users | Usually none |
| Support | Often bundled with maintenance fees | Optional subscriptions from vendors or service firms |
| Hosting | Similar, though licensing can affect cloud costs | Similar |
| Skills | Widely available for major products | Widely available for major products; varies locally |
| Tools | Often included, such as reporting and management tools | Many free and commercial tools available |
| Upgrades | Included in maintenance or purchased | Free, but require testing and labour |
| Compliance | Licence audits and the cost of non-compliance | Licence obligations mainly when distributing |

Free editions of commercial databases can be useful for small systems, but they come with limits. Microsoft SQL Server Express, for example, has a maximum database size of 10 GB, which small business systems can outgrow within a few years.

Commercial vendors may audit customers' licence compliance, and under-licensing discovered in an audit can be expensive. Keep records of licences and of how databases are deployed, especially in virtual and cloud environments where counting rules can be complex.

## Support and life cycles

Every database version eventually stops receiving fixes and security updates:

- **Commercial vendors** publish support life cycles. Microsoft, for example, typically provides mainstream and then extended support for each SQL Server version over roughly ten years.
- **Open-source projects** publish their own policies. PostgreSQL, for example, supports each major version for five years.

Running unsupported database versions exposes the business to unpatched security vulnerabilities and makes it harder to get help. Whatever the choice, plan upgrades within the support window. The [managing legacy Visual Basic 6 applications](/insights/managing-legacy-visual-basic-6-applications/) article shows how unsupported platforms become a growing risk.

For open-source databases, support can come from the project community, from consultancies and from companies that sell support subscriptions. For critical systems, a support agreement with defined response times is usually worth having, whichever family the database comes from.

## Often the application decides

For packaged software, the choice is frequently made by the application vendor. Many business applications support only one database, or only certain versions. Choosing a different database is rarely possible, and running an unsupported combination risks losing vendor support.

The choice is genuinely open mainly for:

- **Custom systems** built for the business.
- **Reporting databases and data warehouses.**
- **Software and devices** the business develops and sells.
- **Websites and online services.**

## Databases inside products

Manufacturers increasingly build software into their products: machine controllers, monitoring systems, configuration tools and apps. When a database is distributed as part of a product, licence terms become much more important:

- **Permissive and public domain licences**, such as those of PostgreSQL and SQLite, place few obligations on distribution.
- **Copyleft licences** may require the product's software, or parts of it, to be released under the same licence, unless a commercial licence is purchased.
- **Commercial licences** may charge per device or per installation.

Product developers should keep a register of all third-party software components and their licences, sometimes called a **software bill of materials**, and check obligations before release.

## Risk considerations

| Risk | Commercial | Open source |
|---|---|---|
| Vendor changes prices or terms | Possible at renewal | Licence changes possible for new versions; existing versions remain under old terms |
| Vendor or project declines | Product may be discontinued or sold | Project may lose contributors; code remains available |
| Lock-in to proprietary features | Common | Possible with vendor-specific extensions |
| Licence non-compliance | Audit findings and back-charges | Obligations mainly when distributing |
| Skills availability | Generally good for major products | Generally good for major products |

Both families carry risks. Mature, widely used products in either family are usually safer than niche products in either.

## Judging the health of an open-source project

An open-source database is only as dependable as the community and organisations that maintain it. Before relying on one, look at:

- **Release history**: regular releases and timely security fixes over many years.
- **Contributors**: many active contributors from several organisations, rather than one person or one company.
- **Governance**: a foundation or clear governance model that makes decisions openly.
- **Security process**: a published way to report vulnerabilities and a record of responding to them.
- **Documentation and tools**: good manuals, administration tools and drivers for common programming languages.
- **Commercial ecosystem**: firms offering support, training and hosting, including in Australia.

The leading open-source databases score well on all of these. Smaller projects may not, however attractive their features.

## Switching later is possible, but not free

Businesses sometimes plan to start with one database and move later. That is feasible, but each database has its own dialect of SQL, data types, functions and procedural code, so applications written for one rarely run unchanged on another. Data must be migrated and reconciled, and performance must be retested. The cost of switching rises with every use of product-specific features. If future flexibility matters, ask developers to keep database-specific code to a minimum and document where it is used.

## Common mistakes

- **Treating a free licence as a free system**, ignoring support, skills and upgrade costs.
- **Outgrowing a free edition's limits** without noticing until the system stops accepting data.
- **Running unsupported versions** because upgrades were never planned.
- **Under-licensing commercial databases** after moving them to virtual or cloud servers.
- **Shipping products with third-party software** whose licence obligations were never checked.
- **Choosing a niche product** because of one attractive feature, then struggling to find skills and support.

## A decision guide

| Situation | Considerations |
|---|---|
| Packaged business software | Use the database the vendor supports |
| Custom business system, Microsoft-centred IT | SQL Server is often a natural fit; check edition limits and licence costs |
| Custom business system, cost-sensitive or cloud-based | PostgreSQL is a strong, widely supported option |
| Web application or online shop | MySQL, MariaDB or PostgreSQL are common choices; follow the platform's requirements |
| Software embedded in devices or apps | SQLite or other embedded databases; check licences for distribution |
| Very large enterprise systems | Commercial and open-source options both used; skills and support usually decide |

## A worked example

This is an illustrative example. A manufacturer of packaging machines is commissioning a custom system to manage machine configurations, quotes and production data. It is also adding a local data log to the controller software in each machine it sells, about 150 machines a year.

**Business system.** The developer compares a commercial database, licensed per core for a four-core server, against PostgreSQL on a managed cloud service. Over five years, the commercial option is estimated at about $28,000 in licences and maintenance plus hosting, and the PostgreSQL option at about $24,000 in managed service fees with no licence cost. The business's IT provider supports both, and the reporting tool the business uses connects to both. The difference is modest, so the decision rests on the developer's skills and the managed service's included backups; the business chooses PostgreSQL with a support arrangement through its IT provider.

**Machine controller.** For the data log inside each machine, the developer proposes SQLite, which is public domain and designed for embedded use, avoiding any per-device licence or distribution obligations. The business records SQLite and every other third-party component in a software register for each machine release.

**Result.** The business makes both decisions on documented grounds of cost, skills, support and licence obligations, rather than on the assumption that free or commercial is automatically better.

## Applying this in an Australian business

- **Check whether the application already decides** the database.
- **Compare five-year costs**, including support, skills and upgrades.
- **Plan upgrades** within each product's support life cycle.
- **Keep licence records**, especially for virtual and cloud deployments.
- **Get support agreements** for critical systems, whichever family is used.
- **Register third-party software** in products you distribute, and check licence obligations.
- **Prefer mature, widely used products** over niche ones.

## Questions worth considering

- Which database versions are we running, and when does their support end?
- Are we sure our commercial database licences match how we deploy them?
- Who would support our open-source databases if something went wrong at night?
- Do our products contain third-party software whose licences we have not checked?
- Would a free edition's limits affect our systems as data grows?

## Bringing it together

Open-source and commercial databases are both capable of running critical business systems. The meaningful differences are in licences, support, skills, compatibility and long-term risk. Packaged applications often decide the question; for custom systems and products, compare five-year costs fairly, plan for support life cycles, keep licence records and check distribution obligations carefully. A deliberate, documented choice in either family is far better than an assumption that free is cheap or that expensive is safe.

---

*Source: KEVOS® editorial notes, drawing on general information technology and software licensing practice. Product facts are summarised for orientation and licence terms change; check current terms with vendors and obtain legal advice where needed. Costs in the worked example are illustrative assumptions. This article is general information, not legal advice.*
