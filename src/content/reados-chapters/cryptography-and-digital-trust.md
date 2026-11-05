---
title: "Cryptography and digital trust: from wartime codebreaking to public keys and secure commerce"
description: "How codes and ciphers became the mathematics that secures online payments, why public-key cryptography changed everything, what codebreakers exploited and the lessons for business security."
publishDate: 2026-10-16
category: "Ideas"
tags:
  - systems
  - quality
  - strategy
author: "BIZOMAT"
featured: false
draft: false
---

Every time someone pays online, signs in to a bank, sends a message on a phone or downloads a software update, cryptography is working in the background. It keeps information confidential, proves who is on the other end of a connection and shows that data has not been altered. Modern commerce would be impossible without it, yet most people never see it, apart from a small padlock symbol in a browser.

For most of history, cryptography was the business of diplomats, generals and spies, and it was practised as an art: clever ciphers, carefully guarded codebooks and a constant contest with codebreakers. In the twentieth century it became a science and then an industry. Wartime codebreaking drove the development of early electronic computers. In the 1970s, the invention of public-key cryptography solved a problem that had seemed fundamental, and two decades later it made secure commerce on the internet possible. Throughout, the same lesson kept recurring: systems are rarely broken by attacking the mathematics directly; they are broken through people, procedures and keys.

This article traces, in general terms, how cryptography developed from classical ciphers to wartime machines, public-key cryptography and the security of today's internet, and draws out practical lessons for businesses that depend on digital trust. It is a general historical overview and not security advice for any particular system.

## Ciphers before machines

Simple ciphers are ancient. A substitution cipher replaces each letter with another, as in the shift associated with Julius Caesar. Such ciphers are easy to break by **frequency analysis**: in any language, some letters occur more often than others, and those patterns survive substitution. Scholars in the medieval Islamic world described frequency analysis centuries before it became widely known in Europe.

Later ciphers used several alphabets to disguise frequencies, such as the polyalphabetic system associated with Vigenère in the sixteenth century, long regarded as unbreakable until nineteenth-century analysts showed how to attack it. Governments maintained "black chambers" that intercepted and read diplomatic correspondence, and codebooks replaced whole words and phrases with numbers.

In 1883, the Dutch-born cryptographer Auguste Kerckhoffs set out principles for military ciphers. The most enduring is now called **Kerckhoffs's principle**: a system should remain secure even if everything about it except the key is known to the enemy. Security should depend on keeping the key secret, not on keeping the design secret, because designs leak and keys can be changed.

## Machines and codebreakers

In the early twentieth century, electromechanical cipher machines automated encryption. The best known is **Enigma**, used by German forces before and during the Second World War. Its rotors and plugboard produced an enormous number of possible settings, and its users believed it unbreakable.

Polish mathematicians, led by Marian Rejewski, broke early versions of Enigma in the 1930s using mathematics and intelligence material, and they shared their methods with Britain and France shortly before the war. At Bletchley Park in England, codebreakers including Alan Turing designed electromechanical machines called bombes to search for the daily Enigma settings. Their success depended heavily on human weaknesses in how Enigma was used: predictable message formats, stereotyped phrases, operator shortcuts and procedural errors gave the codebreakers "cribs", fragments of probable plaintext that made the search feasible.

To attack a more complex German teleprinter cipher, British engineers led by Tommy Flowers built **Colossus**, which entered service in 1944 and is regarded as one of the first programmable electronic digital computers. Codebreaking was thus one of the forces that drove the development of computing.

## Standard ciphers for a computer age

As businesses and governments began storing and transmitting data electronically, they needed standard, publicly known ciphers that computers could run. In 1977, the United States adopted the **Data Encryption Standard (DES)** for protecting sensitive government data, and it became widely used in banking. As computers grew faster, DES's relatively short key became vulnerable to exhaustive search, and in 2001 a new **Advanced Encryption Standard (AES)** was selected through an open international competition. AES is used today in everything from phones to storage drives.

The open competition was itself an application of Kerckhoffs's principle: the algorithm was public, examined by researchers worldwide, and trusted because it survived that scrutiny.

## The key distribution problem

Ciphers like DES and AES are **symmetric**: the same key encrypts and decrypts. That creates a basic problem. Two parties must share a secret key before they can communicate securely, but how can they agree on a key over an insecure channel without meeting or using a trusted courier? For a bank with thousands of customers or an online shop with millions, distributing keys in advance is impractical.

## Public-key cryptography

In 1976, Whitfield Diffie and Martin Hellman published a method by which two parties could agree on a shared secret over a public channel, without any prior secret, using mathematical operations that are easy to perform but very hard to reverse. They also described the idea of **public-key cryptography**, in which each person has two related keys: a public key that anyone can use to encrypt messages or verify signatures, and a private key, kept secret, that decrypts or signs.

In 1977, Ron Rivest, Adi Shamir and Leonard Adleman published the **RSA** algorithm, which implemented public-key encryption and digital signatures using the difficulty of factoring large numbers. It later emerged that researchers at Britain's signals intelligence agency had developed equivalent ideas earlier in secret, but their work was not declassified until the 1990s.

```figure
type: compare
title: Shared-key and public-key cryptography
cols: Shared key | Public key
best: 2
caption: Public-key methods let strangers agree on a secret over a public channel, without any prior secret.
- Keys | One secret held by both parties | A public key paired with a private key
- *Key distribution | The secret must be delivered safely first | The public key can be shared openly
```

Public-key cryptography made two things possible at scale:

- **Secure key exchange** with strangers, so that a browser and a website can set up an encrypted connection without having met before.
- **Digital signatures**, which prove that a message or piece of software came from the holder of a particular private key and has not been altered.

## Trust on the internet

In the mid-1990s, as commercial use of the web grew, the browser company Netscape introduced the Secure Sockets Layer protocol to encrypt connections between browsers and websites. Its successor, **Transport Layer Security (TLS)**, protects most web traffic today. When a browser connects to a site, the site presents a **certificate**, a digitally signed statement from a certificate authority that the public key belongs to that domain. Browsers trust a set of certificate authorities, and those authorities vouch for websites. This chain of signatures is the basis of the padlock.

```figure
type: timeline
title: From ciphers to digital trust
caption: Kerckhoffs's principle still holds: security should rest on the key, not on keeping the method secret.
- 1883 | Kerckhoffs's principles | for military ciphers
- 1930s | Rejewski breaks Enigma | mathematics and intelligence
- 1944 | Colossus | an early programmable electronic computer
- 1976 | Diffie and Hellman | a shared secret over a public channel
- 1977 | DES and RSA | a standard cipher; public-key encryption
- Mid-1990s | Secure Sockets Layer | encrypted web connections
- *2001 | AES selected | through an open international competition
```

The system works well but depends on processes as much as mathematics: certificate authorities must verify identities carefully, sites must protect private keys and renew certificates before they expire, and browsers must reject compromised certificates. Many security failures arise not from broken cryptography but from stolen passwords, phishing, unpatched software, misconfiguration and lost keys. The [from transistor to smartphone](/reados/collections/engineering-history-modern-era/from-transistor-to-smartphone-engineering-the-digital-economy/) article explains how the networks that carry this traffic were built.

## Cards, terminals and tokens

Card payments show cryptography working quietly at enormous scale. Magnetic-stripe cards stored static data that could be copied, which made card skimming a profitable crime. Chip cards, introduced widely from the 1990s and 2000s, contain a small secure processor that holds keys and produces a fresh cryptographic code for each transaction, so copied data cannot simply be replayed. Contactless payments and phone wallets go further by using **tokens**: substitute card numbers that are useless if stolen from a merchant. Payment card industry security standards require merchants and processors to protect card data, and many small businesses meet much of that obligation by using payment providers that keep card details off their own systems altogether.

## Signed software and the supply chain

Digital signatures also protect software. Operating systems, apps and updates are usually signed by their publishers, and devices check those signatures before installing them, which makes it harder for attackers to slip in malicious code. Attackers have responded by targeting the supply chain itself: compromising a software vendor's build or update system so that a malicious update is signed and distributed as if it were genuine. Such incidents show that a signature proves only who signed, not that the signer's own systems were secure. Businesses therefore pay attention to the security practices of the vendors whose software they install and update automatically.

## Passwords, hashes and multiple factors

Cryptography also protects stored data. Well-designed systems do not store passwords directly; they store a **hash**, the output of a one-way function, so that a stolen database does not immediately reveal passwords. Because people reuse weak passwords, attackers try lists of common and stolen passwords against many accounts. **Multi-factor authentication**, which requires something in addition to a password, such as a code from an app or a hardware key, blocks most of these attacks. Australia's cyber security agency publishes a prioritised set of mitigation strategies for organisations, known as the Essential Eight, which includes multi-factor authentication, patching and backups.

## The next transition

Researchers expect that sufficiently powerful quantum computers could break widely used public-key algorithms such as RSA. In response, standards bodies have begun publishing **post-quantum** algorithms designed to resist such attacks, and organisations are being encouraged to plan the transition. The episode highlights the value of **crypto-agility**: designing systems so that algorithms and keys can be replaced without rebuilding everything.

## Lessons for engineers and businesses

### Rely on keys and processes, not secrecy of design

Kerckhoffs's principle applies to any control. Security that depends on nobody discovering how a system works will eventually fail; security based on well-protected keys and credentials can be maintained.

### People and procedures are the usual weak point

Enigma fell partly through predictable habits and shortcuts. Modern breaches often begin with a phishing email or a reused password. Training, simple procedures and controls such as multi-factor authentication matter more than exotic technology.

### Trust is an infrastructure

Certificates and signatures create chains of trust. A business relies on many such chains: banks, suppliers, software vendors and cloud providers. Knowing which ones matter, and what happens if one fails, is part of resilience.

### Plan for change

DES was replaced by AES, and today's public-key algorithms will be replaced too. Systems, contracts and suppliers that allow components to be updated reduce future cost and risk.

### Open scrutiny builds confidence

AES and other standards earned trust through public examination. Controls, calculations and processes that can be reviewed by others are more likely to be sound.

## A worked example

This is an illustrative example. The business and figures are hypothetical.

A small online retailer's website certificate expires on a Saturday morning because the renewal reminder went to the inbox of a staff member who has left. Customers' browsers display security warnings, and most abandon their purchases. The site is effectively down for online sales for about six hours until the owner finds and fixes the problem.

On a typical Saturday, the site takes about $2,400 in orders between 8 am and 2 pm, so the outage costs roughly that much in lost sales, plus some lost trust from customers who saw the warnings. The owner then reviews the business's digital trust arrangements. Certificate renewal is automated through the hosting provider, renewal and domain notices are sent to a shared mailbox, multi-factor authentication is enabled on the hosting, email, banking and payment accounts, and the domain registration is set to renew automatically. The changes take an afternoon and cost almost nothing.

```figure
type: checklist
title: An afternoon's work on digital trust
caption: An expired certificate cost about $2,400 of Saturday sales; the fixes took an afternoon and cost almost nothing.
- x Certificate renewal automated
- x Renewal and domain notices to a shared mailbox
- x Multi-factor authentication on hosting, email, banking and payments
- *x Domain registration set to renew automatically
```

## How this applies to a small Australian business

- **Turn on multi-factor authentication** for email, banking, payments, hosting and administrative accounts.
- **Use a password manager** and unique passwords.
- **Automate certificate and domain renewals**, with notices sent to a shared mailbox.
- **Patch software promptly** and keep tested backups.
- **Know which external parties you trust** with keys, data or payments, and what happens if one fails.
- **Follow the Australian Cyber Security Centre's guidance** for small businesses, and seek specialist advice for complex systems.

## Common mistakes

- **Relying on secrecy of how systems work** instead of protecting credentials.
- **Leaving renewals and keys tied to individuals** who may leave.
- **Assuming encryption alone makes a system secure** while passwords and processes stay weak.
- **Ignoring phishing training** because the technology seems strong.
- **Storing card or identity data you do not need**, which turns a small breach into a serious one.

## Frequently asked questions

**What does the padlock in a browser actually mean?** It means the connection to the site is encrypted and the site has a valid certificate for its domain. It does not prove that the business behind the site is honest.

**Why is multi-factor authentication so effective?** Most account compromises rely on stolen or guessed passwords. A second factor means a password alone is not enough to sign in.

## Questions to ask

- Which accounts in our business still rely on passwords alone?
- Who is notified when certificates, domains or licences are due to expire?
- Which outside parties hold our keys, data or payment access?
- How quickly could we replace a compromised credential or system component?
- When did staff last receive practical training on phishing and scams?

## Bringing it together

Cryptography grew from simple ciphers and codebooks to wartime machines, open standards and the public-key systems that secure modern commerce. Kerckhoffs's principle, the breaking of Enigma through human habits, Colossus and the shift from DES to AES all point to the same lessons, and public-key cryptography made trust between strangers possible at internet scale. The [cyber security basics for small businesses](/reados/collections/business-systems-security-and-it-decisions/cyber-security-basics-for-small-businesses/) article turns them into practical steps. For any business, the message is that security depends on protected keys, sound procedures, trusted relationships and the ability to change, more than on any secret design.

---

*Source: BIZOMAT editorial notes. Examples and figures in this article are illustrations. This article is a general historical overview and does not constitute security advice.*
