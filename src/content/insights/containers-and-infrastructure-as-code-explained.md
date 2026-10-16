---
title: "Containers and infrastructure as code explained: repeatable environments for business software"
description: "What containers, images and orchestration are, how infrastructure as code describes servers and networks in files, and why both reduce drift, speed recovery and need their own controls."
publishDate: 2026-10-16
category: "Technology"
tags:
  - systems
  - automation
  - operations
author: "KEVOS"
featured: false
draft: false
---

One of the oldest complaints in software is that an application works on the developer's machine and nowhere else. An application runs perfectly on the developer's laptop and fails on the test server; the test server works, but production behaves differently; a server that has run reliably for years cannot be rebuilt after a failure because nobody remembers exactly how it was set up. These problems share a cause: the environment in which software runs, its operating system, libraries, settings and supporting services, differs from place to place and changes over time in ways nobody fully records.

Two practices have become standard in modern software operations to address this. **Containers** package an application together with everything it needs to run, so it behaves the same wherever it runs. **Infrastructure as code** describes servers, networks, databases and other infrastructure in files that can be reviewed, versioned and applied automatically, rather than configuring them by hand. Together they make environments repeatable, changes traceable and recovery faster.

Business owners do not need to build containers or write infrastructure code, but they increasingly hear about both from developers, hosting providers and IT suppliers. This article explains what containers, images, registries and orchestration are, how containers differ from virtual machines, what infrastructure as code does, the main approaches and tools, the business benefits, the risks and controls, and when these practices are worth adopting. It is part of a series on software and cloud foundations for business leaders.

## The problem: environments that drift

Every application depends on its environment: a particular version of an operating system, programming language runtime, libraries, configuration settings, certificates and connections to databases and other services. When environments are set up by hand:

- **each environment ends up slightly different**, so software tested in one place fails in another;
- **changes are made directly** to servers and not recorded, a problem called configuration drift;
- **rebuilding after a failure** depends on memory, notes and luck; and
- **knowledge sits with individuals**, so the departure of one administrator can leave a business unable to change its own systems safely.

Servers maintained by hand for years, each with its own history of fixes and tweaks, are sometimes described as "pets": unique, cared for individually and painful to lose. Modern practice aims to make servers more like "cattle": standard, interchangeable and replaceable from a known definition.

## What a container is

A **container** is a lightweight, isolated environment that holds an application and everything it needs to run: its code, runtime, libraries and settings. Containers run on a host computer and share its operating system kernel, the core of the operating system, but each container has its own isolated file system, processes and network settings.

Because a container carries its dependencies with it, the same container behaves the same way on a developer's laptop, a test server and a production cloud service. Containers start in seconds, use fewer resources than full virtual machines and allow many applications, with conflicting requirements, to run side by side on one host without interfering with each other.

The modern use of containers was popularised by Docker, released in 2013, which made building, sharing and running containers straightforward. Containers are now supported by every major cloud provider and many hosting services.

## Images and registries

A container is created from an **image**, a read-only template that contains the application and its environment. Images are built from a short text file, often called a Dockerfile, that lists the steps: start from a base image, such as a minimal operating system with a particular language installed, copy in the application code, install libraries and set the command that starts the application.

Because the build instructions are text, they can be stored in version control, reviewed and repeated. Building the same file produces the same image, and every environment can run exactly the same image.

Images are stored in **registries**, which are libraries of images. Public registries hold images published by software vendors and open-source projects; private registries hold a business's own images. Each image version is identified by a tag, so teams know exactly which version is running in each environment.

## Containers and virtual machines

Containers are often compared with **virtual machines**, which also isolate software from the underlying hardware:

- A **virtual machine** emulates a complete computer, with its own full operating system. It provides strong isolation but is larger, slower to start and uses more resources.
- A **container** shares the host's operating system kernel and contains only what the application needs. It is smaller, faster to start and more efficient, but the isolation between containers is somewhat weaker than between virtual machines.

The two are frequently combined: containers commonly run inside virtual machines in cloud environments, gaining the efficiency of containers and the stronger isolation of virtual machines.

## Orchestration: running many containers

A single application may consist of several containers, such as a web application, a background worker and a cache. Larger systems may run hundreds. **Orchestration** tools manage containers at scale. They:

- decide which host each container runs on;
- restart containers that fail;
- add or remove copies of a container as demand changes;
- route network traffic to healthy containers; and
- roll out new versions gradually and roll them back if problems appear.

**Kubernetes**, originally developed at Google and released as open-source software in 2014, is the most widely used orchestration system. It is powerful but complex, and running it well requires specialist skills. Cloud providers offer managed Kubernetes services and simpler container platforms that run containers without the customer managing orchestration directly. For small applications, a simple tool that starts a handful of related containers on one server is often enough.

The [high availability for business systems](/insights/high-availability-for-business-systems/) article explains how automatic restarts and multiple copies support uptime targets, and what they cost.

## What infrastructure as code is

**Infrastructure as code** describes infrastructure, such as virtual machines, networks, firewalls, databases, storage, domain records and access permissions, in text files instead of configuring it by hand through consoles and control panels. A tool reads the files and creates or changes the infrastructure to match.

The files are stored in version control alongside application code. Changes are proposed, reviewed and approved like code changes, and the history records who changed what and why. The same files can create identical environments for development, testing and production, and can rebuild an environment after a disaster.

## Declarative and procedural approaches

Infrastructure as code takes two broad forms:

- **Declarative** tools describe the desired end state, such as "three web servers of this size behind this load balancer, with these firewall rules". The tool compares the description with what exists and makes the changes needed to match. Many tools show a plan of intended changes for review before applying them.
- **Procedural** tools describe the steps to perform, such as "install this package, then edit this file, then restart this service".

Declarative tools are widely used for provisioning cloud infrastructure; examples include Terraform and its open-source fork OpenTofu, and the template systems provided by each major cloud provider. **Configuration management** tools, such as Ansible, are often used to set up the software and settings inside servers. Container images themselves are a form of infrastructure as code for the application's environment.

## Business benefits

Containers and infrastructure as code offer benefits that matter beyond the IT team:

- **Consistency**: software tested in one environment behaves the same in production, reducing failed releases.
- **Traceability**: every change to infrastructure is recorded and reviewed, supporting audits and investigations.
- **Faster recovery**: environments can be rebuilt from definitions, often in minutes or hours rather than days.
- **Reduced key-person risk**: knowledge is recorded in files, not held in individuals' heads.
- **Easier testing**: temporary environments can be created for testing and removed afterwards.
- **Portability**: applications in containers can move between hosting providers more easily, reducing lock-in.
- **Cost control**: environments can be created when needed and destroyed when not, and infrastructure definitions make it clear what exists and why.

## Risks and controls

These practices also bring their own risks:

- **Complexity**: orchestration platforms and infrastructure tools have steep learning curves. Small businesses can end up running complex platforms that few people understand, which defeats the purpose.
- **Speed of mistakes**: infrastructure code can destroy resources as quickly as it creates them. A mistaken change can delete a database or open a firewall across every environment at once. Reviewing planned changes before applying them, protecting critical resources from deletion and separating permissions for production are essential.
- **Image security**: images can contain outdated software with known vulnerabilities. Images should be built from trusted, minimal base images, scanned for vulnerabilities and rebuilt regularly to pick up updates.
- **Secrets**: passwords, keys and certificates must not be built into images or written into infrastructure files. They belong in dedicated secret management services.
- **State and data**: containers are designed to be disposable, but databases and files are not. Persistent data must be stored and backed up separately, and database changes need careful handling, as the [changing a live database safely](/insights/changing-a-live-database-safely/) article explains.
- **Manual changes**: if people continue to make changes by hand alongside infrastructure code, the files and reality drift apart. Teams need a rule that all changes go through the code.
- **Licensing**: some container tools and images carry licence conditions, including paid licences for larger organisations, which should be checked.

## When these practices are worth adopting

Not every business needs containers or infrastructure as code. A business using only software-as-a-service products has little infrastructure to describe. These practices pay off when a business:

- develops or commissions custom software that runs on its own cloud or hosted infrastructure;
- has several environments, such as development, test and production, that must stay consistent;
- needs to recover systems quickly or meet audit requirements; or
- relies on suppliers to manage infrastructure and wants a clear, transferable record of what exists.

For a small custom application, a modest approach, such as containers built from version-controlled files and a simple infrastructure definition, often brings most of the benefit without the complexity of a full orchestration platform.

## What to ask developers and suppliers

- Can our environments be rebuilt from definitions stored in version control?
- Where are those definitions kept, and does the business have access?
- How are infrastructure changes reviewed before they are applied?
- How are container images kept up to date and checked for vulnerabilities?
- Where are secrets stored?
- How are databases and files backed up, separately from containers?
- How long would it take to rebuild production from scratch, and has it been tested?

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A training provider runs a custom booking and certificate system on a cloud virtual machine set up by hand five years ago by a contractor who has since moved on. Updating the operating system has been postponed repeatedly because nobody is sure what else the server depends on. A test copy of the system behaves differently from production, so changes are often tested directly in production on quiet evenings.

A new developer packages the application into containers: one for the web application and one for a background task that emails certificates. Build files and infrastructure definitions for the virtual machine, firewall, managed database service, storage and domain records are stored in the business's own repository. The database moves to a managed service with automated backups. Secrets move to the cloud provider's secret store.

Test and production environments are now created from the same definitions and run the same images, so changes are tested reliably before release. Operating system and library updates are applied by rebuilding images, tested and deployed during business hours. When the business runs a recovery exercise, the developer rebuilds the entire production environment in a new region from the definitions and restores the database from backup in under three hours; previously, no one could have estimated how long a rebuild would take.

## How this applies to a small Australian business

- **Ask whether systems can be rebuilt** from recorded definitions.
- **Keep container build files and infrastructure code** in repositories the business controls.
- **Review infrastructure changes** before they are applied, especially in production.
- **Keep images updated and scanned.**
- **Store secrets** in dedicated services, not in images or code.
- **Back up persistent data** separately from containers.
- **Test recovery** by rebuilding environments.
- **Match complexity to need**, avoiding platforms nobody can maintain.

## Common mistakes

- **Adopting complex orchestration** for simple applications.
- **Building secrets into images.**
- **Treating containers as backups** for data.
- **Mixing manual changes** with infrastructure code.
- **Never rebuilding images**, leaving old vulnerabilities in place.
- **Leaving infrastructure definitions** in a supplier's private account.

## Frequently asked questions

**Are containers only for large organisations?** No. Small applications benefit from consistent environments and easier hosting changes. What small businesses usually do not need is complex orchestration.

**Do containers replace virtual machines?** Not entirely. Containers often run on virtual machines, and some workloads still suit virtual machines directly.

**Is infrastructure as code useful if we only use SaaS?** Less so. Some SaaS settings, such as user accounts, security policies and domain records, can be managed as code, but the main benefits apply to businesses running their own infrastructure.

**What happens to data when a container is replaced?** Data stored inside a container is lost when it is replaced. Persistent data must be stored in databases, managed storage or attached volumes that are backed up separately.

## Questions to ask

- Could we rebuild our production systems from definitions, and how long would it take?
- Who can change our infrastructure, and how are changes reviewed?
- When were our container images last rebuilt with updates?
- Where are our secrets, and who can see them?
- Is our platform more complex than our needs justify?

## Bringing it together

Containers package applications with their environments so they behave consistently everywhere; images built from version-controlled files make that environment repeatable; orchestration runs containers at scale. Infrastructure as code describes servers, networks and services in reviewed, versioned files that tools apply automatically. Together they reduce drift, speed recovery, record changes and lower dependence on individuals, provided secrets, data, image updates and change reviews are handled carefully and the complexity matches the business's real needs.

---

*Source: KEVOS editorial notes. Examples and figures in this article are illustrations.*
