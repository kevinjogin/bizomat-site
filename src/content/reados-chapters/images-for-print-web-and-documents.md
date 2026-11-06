---
title: "Images for print, web and documents: resolution, file formats, compression and keeping masters"
description: "The same image can look sharp in one place and blurry, huge or broken in another. How resolution, formats and compression work, and how to prepare images for print, websites and documents."
publishDate: 2026-10-09
category: "Technology"
tags:
  - marketing
  - communication
  - systems
author: "BIZOMAT"
featured: false
draft: false
---

Most businesses use the same images in many places: a website, a printed brochure, a trade show banner, a product data sheet, a tender document, a PowerPoint presentation and an email to a customer. An image that looks crisp on a phone screen can print as a soft, blocky mess. A photo straight from a camera can make a web page slow to load, an email bounce or a Word document swell to hundreds of megabytes. A logo stretched from a small web graphic looks amateurish on a sign.

These problems come from a few basic ideas that are easy to misunderstand: how many pixels an image contains, how big it will be shown, whether it is made of pixels or shapes, how it is compressed, which file format suits which job, and whether the original master file has been kept. Getting them right does not require design software expertise; it requires knowing what each use needs and preparing images to suit.

This article explains pixels, resolution and the difference between raster and vector images, how to calculate the resolution needed for print, how to prepare images for websites and office documents, which file formats to use for what, how compression works, and how to manage master files and derivatives. It is general information for marketing staff, engineers, office managers and anyone who prepares business documents and web content.

## Pixels, resolution and size

A digital photograph is a **raster image**: a grid of tiny coloured squares called **pixels**. A camera image might be 6,000 pixels wide and 4,000 pixels high, or 24 million pixels, often called 24 megapixels. The pixel dimensions are the image's real information content.

**Resolution** describes how densely those pixels are packed when the image is shown or printed:

- **PPI**, pixels per inch, describes image pixels across a printed or displayed inch.
- **DPI**, dots per inch, strictly describes how finely a printer places ink dots, although the terms are often used interchangeably.

A file's resolution setting on its own, such as "72 dpi" or "300 dpi", means little. What matters is how many pixels are available for the size at which the image will be used. A 3,000-pixel-wide image printed 10 inches wide has 300 pixels per inch; the same image printed 30 inches wide has only 100.

## Raster and vector images

**Vector images** are made of mathematically defined shapes, lines and text rather than pixels. They can be scaled to any size without losing sharpness. Logos, icons, diagrams, line drawings and text-based graphics should be vector wherever possible.

| | Raster | Vector |
|---|---|---|
| Made of | Pixels | Shapes, lines and text |
| Best for | Photographs, scans, screenshots | Logos, icons, diagrams, technical illustrations |
| Scaling | Loses quality when enlarged | Scales to any size |
| Common formats | JPEG, PNG, WebP, TIFF, HEIC | SVG, PDF, EPS, AI |

A common and avoidable mistake is using a small raster version of the company logo for signs, vehicles or printed material. Ask your designer for vector logo files and keep them safe.

## How much resolution print needs

For high-quality printed material viewed at reading distance, such as brochures, catalogues and data sheets, a common target is about **300 pixels per inch at the final printed size**. Larger items viewed from further away need less: posters and banners often look good at 100 to 200 pixels per inch, and very large signs lower still. Ask your printer for their requirements.

To calculate the pixels needed, convert the printed size to inches by dividing millimetres by 25.4, then multiply by the target resolution. A full A4 page, 210 by 297 mm, is about 8.27 by 11.69 inches, so at 300 pixels per inch it needs about 2,480 by 3,508 pixels, roughly 8.7 megapixels.

To check an existing image, divide its pixel width by the printed width in inches. An image 800 pixels wide placed 150 mm wide in a brochure has about 800 ÷ 5.9, or 135, pixels per inch: noticeably soft in print. For 300 pixels per inch at that size, it would need about 1,770 pixels.

```figure
type: bars
title: Pixels per inch for a 150 mm brochure photo
unit: ppi
max: 320
caption: Divide pixel width by printed width in inches (150 mm ≈ 5.9 in); about 300 ppi is the common print target.
- 800-pixel web image | 135 | looks soft
- *1,800-pixel export from the original | 305 | about 1,800 ÷ 5.9
- Print target | 300
```

**Enlarging** a small image in software does not add real detail. Traditional enlargement makes it blurrier; AI-based enlargement can produce sharper-looking results, but it invents detail, which is unacceptable for technical images where every feature must be real. The only reliable fix for an image that is too small is a larger original.

## Images for websites

Websites have the opposite problem: images straight from a camera are far larger than needed and slow pages down, which frustrates visitors, hurts search rankings and wastes mobile data.

- **Resize to the displayed size**. If an image appears at most 1,200 pixels wide on a page, there is little point uploading a 6,000-pixel original. Many high-resolution screens benefit from about twice the displayed width, so 2,400 pixels might be a sensible maximum for that example.
- **Compress sensibly**. A photograph saved at a moderate quality setting often looks the same to viewers at a fraction of the file size.
- **Use modern formats** such as WebP, which current browsers support widely, where your website platform allows.
- **Provide several sizes** so phones receive smaller files than large desktop screens; many website platforms do this automatically.
- **Write alternative text** describing each meaningful image, for people using screen readers and for search engines. Under the Web Content Accessibility Guidelines, non-text content should have a text alternative.
- **Avoid text inside images**. Text in images cannot be read by screen readers or translated, does not resize well on phones and is not indexed by search engines.

## Images in office documents and PDFs

Word processing documents, spreadsheets and presentations often become enormous because full-size photos are inserted directly.

- **Resize or compress images** before inserting them, or use the application's picture compression feature to reduce them to a sensible resolution for the intended use.
- **Delete cropped areas** when compressing, if the application offers it, so hidden parts of images do not remain in the file.
- **Choose PDF export settings** to suit the purpose: high quality for printing, smaller files for email and screen viewing.
- **Remember email limits**: many email systems reject attachments above about 20 to 25 MB, and recipients appreciate smaller files. Use links to shared files for large documents.

## File formats and when to use them

| Format | Type | Best for | Watch out for |
|---|---|---|---|
| JPEG | Raster, lossy compression | Photographs on the web and in documents | Quality loss each time it is edited and re-saved; no transparency |
| PNG | Raster, lossless compression | Screenshots, graphics with sharp edges, images needing transparency | Large files for photographs |
| WebP and AVIF | Raster, modern compression | Smaller web images, including transparency | Not always accepted outside web browsers |
| GIF | Raster, limited to 256 colours | Simple animations | Poor for photographs; largely superseded |
| TIFF | Raster, usually lossless | Master files, scanning, high-quality print | Very large files |
| HEIC | Raster, efficient compression | Default photo format on many phones | Not supported by all software; convert for sharing |
| Camera raw formats | Raster, unprocessed sensor data | Masters for editing photographs | Need processing software; proprietary to camera makers |
| SVG | Vector | Logos, icons and diagrams on websites | Not suited to photographs |
| PDF | Container for vector, raster and text | Documents, print-ready artwork, technical drawings | Settings vary widely between screen and print versions |
| EPS and AI | Vector | Logo and artwork files for printers and designers | Need design software to edit |

For commercial printing, printers often request **print-ready PDF** files made to their specifications, frequently based on the PDF/X standards for print exchange, with images at suitable resolution, fonts embedded and bleed, extra image area beyond the trim edge, included.

## Compression: lossless and lossy

**Lossless compression**, used by PNG and most TIFF files, reduces file size without discarding any information: the original can be reconstructed exactly. **Lossy compression**, used by JPEG and often by WebP, discards detail the eye is less likely to notice, achieving much smaller files.

Lossy compression is excellent for final use but harmful when repeated. Every time a JPEG is opened, edited and saved again, it loses a little more quality, and artefacts such as blockiness around edges and smudged fine detail build up. Edit from a master file and export a fresh copy for each use.

Lossy compression is also a poor choice for screenshots, line drawings and text, where it creates fuzzy halos around sharp edges. Use PNG or vector formats for these.

## Colour basics for different uses

Screens produce colour from red, green and blue light, called **RGB**. Commercial printing usually uses cyan, magenta, yellow and black inks, called **CMYK**. The two systems cannot reproduce exactly the same range of colours, so bright screen colours can look duller in print.

For most business use:

- Keep images for websites, presentations and documents in the **sRGB** colour space, the standard for screens.
- For commercial print, follow your printer's instructions. Many printers prefer to receive RGB images with a colour profile and convert them using their own press profiles; others want CMYK files prepared to their specifications.
- Check important colours, such as brand colours, on printed proofs, not just on screen.

## Hidden information in image files

Image files carry **metadata**: information such as the camera model, date and settings, and often the GPS location where a phone photo was taken. Before publishing photos taken at a home, a customer's site or a sensitive facility, remove location data. Metadata can also carry useful information, such as copyright notices and descriptions, which you may want to keep.

Check screenshots and photos for confidential content before sharing: customer names on screens, drawings in the background, email notifications and personal details.

## Masters and derivatives

The most valuable habit in managing images is to separate **master files** from **derivatives**:

- **Masters** are the highest-quality versions: raw camera files or high-quality TIFF files for photographs, and vector originals for logos and diagrams. Store them safely, back them up and never overwrite them with compressed versions.
- **Derivatives** are copies prepared for a specific use: a web JPEG, a print-ready PDF, a small email version. Create them from the master whenever needed.

Supporting practices include consistent file names that identify the subject, view, version and use; a folder structure separating masters from derivatives; a record of rights and permissions for each image; and a review when products or branding change. The [owning your website and digital presence](/reados/collections/business-systems-security-and-it-decisions/owning-your-website-and-digital-presence/) article explains why the business, not its suppliers, should hold its master assets.

## A worked example

This is an illustrative example. A small manufacturer is preparing a printed brochure, an updated product page and a tender submission. The marketing coordinator gathers images from the website and from staff phones.

**Problems found.**

- A key product photo, taken from the website, is 800 pixels wide. Placed 150 mm wide in the brochure, it would print at about 135 pixels per inch and look soft.
- The company logo exists only as a small PNG file.
- New photos for the product page come straight from a camera at about 6,000 by 4,000 pixels and 12 MB each.
- The tender document, with 40 inserted photos, has grown to about 180 MB.

**Fixes.**

- The original camera files for the product photo are found on a shared drive. Exported at about 1,800 pixels wide for the brochure position, the photo prints sharply.
- The designer who created the logo supplies SVG, PDF and EPS versions, which are added to a protected brand folder.
- Web images are exported at 2,400 pixels wide, in WebP with a JPEG fallback where the website platform needs it, reducing each to a few hundred kilobytes.
- Photos in the tender document are compressed to suit on-screen reading and a high-quality print version is exported separately; the screen version shrinks to about 9 MB.
- A master image library is created with consistent file names, and staff are asked to save original camera files there.

**Result.** The brochure prints cleanly, the product page loads quickly, the tender submission meets the portal's file limit and future work starts from proper masters.

```figure
type: compare
title: Fixing images for print, web and a tender
cols: Problem | Fix
caption: Start every job from proper masters, and export a derivative for each use.
- Brochure photo | 800 px from the website | 1,800 px from the original camera file
- Logo | Only a small PNG | SVG, PDF and EPS in a brand folder
- Web photos | 6,000 × 4,000 px, 12 MB each | 2,400 px WebP, a few hundred KB
- *Tender document | About 180 MB | About 9 MB screen version, separate print version
```

## Applying this in an Australian business

- **Keep master files** for every important photo and graphic.
- **Get vector versions** of logos and diagrams.
- **Calculate pixels needed** for print from the printed size.
- **Resize and compress** images for websites and documents.
- **Use the right format** for each type of image.
- **Edit from masters**, not from compressed copies.
- **Write alternative text** and avoid text in images on websites.
- **Remove location data** and check for confidential content before publishing.

## Where image handling goes wrong

- **Web images used for print.**
- **Raster logos stretched** for signs and vehicles.
- **Full-size camera files** on websites and in documents.
- **Repeated JPEG editing**, degrading quality.
- **JPEG used for screenshots and diagrams.**
- **Originals lost**, leaving only compressed copies.
- **Photos published with location data** or confidential content visible.

## Questions to ask before using an image

- Where will this image be used, and at what size?
- Does it have enough pixels for that size, or is it far too large?
- Is it a photograph that suits raster formats, or a graphic that should be vector?
- Is this the master, or a compressed copy?
- Does it need alternative text, and does it contain text that should be live text instead?
- Does the file contain location data or anything confidential?

## Bringing it together

Images work well everywhere when they are prepared for each use from good masters. Understand that pixel dimensions, not a resolution label, decide print quality, and calculate what each printed size needs. Use vector formats for logos and diagrams, compress sensibly for websites and documents, choose formats to suit the content, and avoid repeated lossy editing. Keep images in sRGB for screens and follow printers' instructions for print. Remove hidden location data, check for confidential content and keep masters separate from derivatives. The result is sharp printing, fast web pages, manageable documents and an image library the business can rely on.

---

*Source: BIZOMAT editorial notes, drawing on established digital imaging, web publishing and print production practice. The worked example is illustrative. This article is general information.*
