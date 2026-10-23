---
title: "Location data for field service and logistics: addresses, geocoding, service areas and site information"
description: "Field service and delivery businesses run on location data. How to structure addresses, validate and geocode them, define service areas, record site access details and use routing well."
publishDate: 2026-10-09
category: "Operations"
tags:
  - operations
  - systems
  - customers
author: "KEVOS®"
featured: false
draft: false
---

For businesses that send people or goods to customers, location is a core piece of data. Service technicians, installers, inspectors, delivery drivers and project crews all depend on knowing exactly where to go, how to get in, what to expect when they arrive and how to plan the day's work across many sites. Yet location data is often stored as free text typed by whoever took the call: an address with the unit number in the wrong place, a rural property identified only by a road name, a mine site with a gate several kilometres from its postal address, or access instructions buried in old job notes.

The cost of poor location data is easy to underestimate. Technicians arrive at the wrong gate, drive to the postal address instead of the site, or wait for keys nobody arranged. Schedulers cannot judge travel time, so days are planned with too much or too little work. Service areas are defined loosely, so jobs are accepted that cannot be served profitably. Reports cannot show where customers are or where demand is growing.

This article explains how to structure address and location data, how to validate and geocode addresses using Australian sources, how to record the information people need on arrival, how to define service areas, how routing and scheduling use location data, how to handle vehicle tracking responsibly and how to keep location data accurate. It is general information for operations, service and logistics managers.

## Separate the different kinds of location

A common mistake is treating "the address" as one thing. Businesses usually need several:

| Location | Purpose |
|---|---|
| Billing address | Where invoices are sent |
| Postal address | Where mail is delivered, which may be a post office box |
| Site or service address | Where work is done or goods are delivered |
| Access point | Where vehicles actually enter, such as a gate on a different road |
| Asset location within a site | Building, floor, room, roof or plant area |
| Depot or base | Where technicians and vehicles start and finish |

```figure
type: tree
title: One customer, several locations
caption: Keep each kind of location in its own field; the site is rarely the billing address.
- Customer
  - Billing address | where invoices go
  - Postal address | may be a post office box
  - *Site or service address | where work is done
  - Access point | where vehicles actually enter
  - Asset location | building, floor, room or plant area
```

Each customer may have many sites, each site several access points and many assets. Designing the data this way, rather than with a single address field on the customer record, prevents most location problems. The [master data and the single source of truth](/reados/collections/operational-data-records-and-controls/master-data-and-the-single-source-of-truth/) article explains why core records like customers and sites need clear ownership and controlled creation.

## Structure addresses properly

Free-text addresses are hard to validate, search and map. Store addresses in structured fields:

- **Unit or level**, and building name where relevant.
- **Street number and street name**, with street type.
- **Locality**, sometimes called suburb or town.
- **State or territory.**
- **Postcode.**
- **Country**, where relevant.

Australian addressing conventions, including for rural properties, are set out in the Australian and New Zealand standard for rural and urban addressing, AS/NZS 4819. Many rural properties have numbers based on their distance along the road, which helps navigation when recorded correctly.

## Validate addresses at entry

Validating addresses when they are entered prevents errors from spreading:

- **Address lookup services** suggest complete, standard addresses as users type, reducing spelling and formatting errors.
- **The Geocoded National Address File (G-NAF)**, Australia's authoritative address index, published by Geoscape Australia and available as open data, lists physical addresses with their coordinates. Many address validation and lookup services are built on it.
- **Australia Post** provides address data and certification for mailing addresses.

Validation should allow genuine exceptions, such as new subdivisions not yet in the national file or remote sites without street addresses, while flagging them for checking.

## Geocoding: turning addresses into coordinates

**Geocoding** converts an address into latitude and longitude, so it can be mapped, measured and used for routing. Points to understand:

- **Precision varies.** Some addresses geocode to the exact property; others only to the street, locality or postcode. Record the precision with each coordinate, so a job geocoded only to a town is not treated as an exact location.
- **Property points are not access points.** Coordinates often fall at the centre of a property, which may be far from the entrance on large sites.
- **Datums matter for precise work.** Australia's current official geodetic datum is the Geocentric Datum of Australia 2020 (GDA2020). Coordinates on the older GDA94 datum differ by about 1.8 metres, which is irrelevant for scheduling but matters for precise asset locations, surveying and mapping of underground services.
- **Some sites need manual coordinates.** Mine sites, farms, construction sites and infrastructure assets may need coordinates captured on site using a phone or GPS device.

## Site access and arrival information

The information that saves the most time is often not the address but what happens on arrival. Useful site fields include:

- **Access instructions**: gate location, parking, loading dock and building entry.
- **Opening hours** and restrictions, such as no deliveries before 7 am.
- **Contacts** on site, with phone numbers.
- **Keys, codes and access cards**, with secure handling of codes.
- **Induction requirements**, such as site safety inductions or security clearances.
- **Hazards**, such as asbestos registers, confined spaces, dogs or remote work risks.
- **Equipment needs**, such as ladders, lifting equipment or four-wheel drive access.
- **Photos** of entrances, switchboards or plant rooms.

Store this information in structured fields where possible, with free-text notes for detail, and ask technicians and drivers to update it after visits. Safety information should be prominent and reviewed, not buried in old job notes.

## Assets within sites

For maintenance and service businesses, the location that matters is often not the site but the equipment within it: the third air-conditioning unit on the east roof, the pump in the basement plant room or the switchboard behind the loading dock. An **asset register** that records each asset's site, building, level, area and description, with photos, saves technicians from searching. Labels or codes fixed to equipment, which technicians scan to open the asset's history, link the physical item to its records and prevent work being recorded against the wrong unit.

## Deliveries and proof of delivery

In logistics, the delivery point matters as much as the address: the loading dock, the site office, the back door or a safe place agreed with the customer. Record delivery instructions as structured data where possible, such as dock hours and vehicle size limits. **Proof of delivery** captured on a phone or scanner, with time, location, recipient name and photos, resolves disputes quickly. Recording reasons for failed deliveries, such as closed sites, wrong addresses or no access, shows which location data needs fixing.

## Service areas

Defining where the business will work helps quoting, scheduling and profitability:

- **Service areas** can be defined by postcodes, localities, drawn map areas or travel time from a depot.
- **Travel time is usually more useful than distance**, because traffic, terrain and road types vary greatly.
- **Zone-based pricing** can add travel charges for areas beyond a standard radius.
- **Area assignment** can route jobs automatically to the right branch or team.

Reviewing completed jobs on a map often reveals clusters of demand, unprofitable outlying work or opportunities for a new base.

## Routing and scheduling

Scheduling field work and deliveries is a version of a well-studied mathematical problem, often called the vehicle routing problem: deciding which vehicle visits which locations in what order, subject to time windows, skills, vehicle capacities and working hours. Routing software uses location data, travel time estimates and job durations to propose efficient schedules.

Its results are only as good as its inputs:

- **Accurate coordinates and access points.**
- **Realistic job durations**, based on history rather than guesses.
- **Correct time windows** and site hours.
- **Technician skills and certifications.**
- **Vehicle capacities and equipment.**
- **Depot and home start locations.**

Schedulers should review and adjust proposed routes; software handles combinations well but does not know everything about customers and sites.

### Measuring how well schedules work

Location data also shows whether scheduling is improving. Useful measures include travel time as a share of paid hours, jobs completed per technician per day, first-visit completion rates, arrivals within promised windows and failed visits by cause. Comparing planned with actual travel times, from tracking or job timestamps, shows where travel estimates need adjusting, such as particular suburbs at peak hour.

## Vehicle tracking and privacy

Telematics and phone-based tracking provide live vehicle locations, actual travel times and evidence of arrival. They can improve scheduling, safety and customer communication. They also raise privacy and workplace obligations. Some states, including New South Wales, have workplace surveillance laws that require notice to employees before tracking. Explain what is tracked and why, limit access to tracking data, use it for the stated purposes and keep it only as long as needed. Seek advice on the requirements in each state where vehicles operate.

## Working where coverage is poor

Many Australian field workers spend time where mobile coverage is weak or absent: rural properties, mines, basements, plant rooms and remote infrastructure. Mobile applications for field staff should store the day's jobs, site details, access instructions, hazards and maps on the device, allow work to be recorded offline and synchronise when coverage returns. Test offline behaviour before rollout, because an application that fails without a signal pushes staff back to paper.

## Telling customers when you will arrive

Accurate locations and travel times make better customer communication possible: realistic arrival windows when booking, a message when the technician is on the way, and a revised time if the previous job runs late. Customers value reliable information more than narrow windows that are frequently missed. Communication also reduces failed visits, because customers make sure someone is there to provide access.

## Keeping location data accurate

- **Validate at entry** and restrict free-text addresses.
- **Update after visits**: give technicians and drivers a quick way to correct addresses, access details and coordinates.
- **Review exceptions**: addresses that failed validation or geocoded imprecisely.
- **Merge duplicate sites** created when the same location was entered differently.
- **Retire closed sites** while keeping their history.
- **Keep safety information current**, with review dates.

### Who updates what

Assign responsibility for each part of location data: customer service or sales for new sites and contacts, schedulers for service areas and travel estimates, technicians and drivers for access details and coordinates captured on site, and safety staff for hazard information and its review. Clear responsibility keeps updates flowing rather than relying on whoever happens to notice a problem.

## Using location data for analysis

Location data supports decisions beyond scheduling:

- **Mapping customers and revenue** by area.
- **Analysing travel time** as a share of paid working time.
- **Testing new depot locations** against customer locations.
- **Identifying underserved or unprofitable areas.**
- **Planning stock** for vans or regional stores.

Many relational databases and reporting tools can store and analyse locations directly, using spatial features that calculate distances and areas.

## Common mistakes

- **One address field** for billing, postal and site addresses.
- **Free-text addresses** without validation.
- **Treating geocodes as exact** when precision is only to a street or town.
- **Ignoring access points** on large sites.
- **Access and safety information in job notes** rather than structured site records.
- **Scheduling on distance** instead of travel time.
- **Unrealistic job durations** in routing software.
- **Tracking vehicles** without clear notice and purpose.

## A worked example

This is an illustrative example. A heating, ventilation and air-conditioning service company with 25 technicians maintains equipment at about 3,000 customer sites across a metropolitan area and nearby regional towns. Addresses are free text on customer records, and access details are scattered through job notes.

**Clean-up.** The company separates customers from sites, structures site addresses and validates them against an address lookup service based on the national address file. About 6% of sites fail validation or geocode only to the street or town, mostly industrial estates, new subdivisions and rural properties. Technicians capture accurate coordinates and access points for these on their next visits.

**Site information.** Access instructions, contacts, induction requirements, hazards and plant room photos move into structured site fields, with technicians prompted to confirm them at the end of each visit.

**Scheduling.** With accurate coordinates and job durations based on two years of history, the company introduces routing software. Schedulers review proposed routes each afternoon.

**Result.** In this illustration, average daily driving per technician falls by about 12%, wasted trips caused by access problems drop sharply, and each technician completes on average one more job a week. Mapping completed work shows that jobs in one regional town are consistently unprofitable once travel is counted, leading to a travel charge for that zone.

```figure
type: stats
title: An air-conditioning service company after cleaning its site data
caption: 25 technicians and about 3,000 sites; jobs in one regional town now carry a travel charge.
- About 6% | Sites failing validation | fixed by technicians on site
- *About 12% | Less daily driving | per technician
- +1 | Job a week | per technician on average
```

## Applying this in an Australian business

- **Separate billing, postal, site and access locations** in your data.
- **Structure and validate addresses** using national address data.
- **Record geocode precision**, and capture coordinates on site where needed.
- **Use GDA2020 coordinates** for precise asset and mapping work.
- **Keep access and safety details** in structured site records.
- **Define service areas** by travel time, and price zones where appropriate.
- **Feed routing tools** with realistic durations and constraints.
- **Handle vehicle tracking** in line with workplace surveillance and privacy obligations.

## Questions worth considering

- How often do our technicians or drivers go to the wrong place or wait for access?
- Can we see all of a customer's sites, or are they mixed into one address?
- Where is our site safety information recorded, and is it current?
- How much of our paid time is spent travelling?
- Which areas do we serve at a loss once travel is counted?

## Bringing it together

Location data is core operational data for field service and logistics businesses. Separate the kinds of location, structure and validate addresses, geocode them with recorded precision, record access and safety details as structured site information, define service areas by travel time, give routing tools accurate inputs, treat vehicle tracking with care and keep data current through feedback from the field. Done well, it means fewer wasted trips, better schedules and clearer decisions about where to work.

---

*Source: KEVOS® editorial notes, drawing on general field service, logistics and spatial data practice. Legal obligations are summarised for orientation; seek advice for your circumstances. Figures in the worked example are illustrative. This article is general information.*
