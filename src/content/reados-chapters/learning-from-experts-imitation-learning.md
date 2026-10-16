---
title: "Learning from experts: imitation learning and its limits"
description: "Systems can learn by copying expert demonstrations. How behavioural cloning, cascading errors, expert correction and inverse reinforcement learning work, and what they teach about know-how."
publishDate: 2026-10-03
category: "Technology"
tags:
  - ai
  - automation
  - operations
author: "GoCore"
featured: false
draft: false
---

Some skills are easier to demonstrate than to describe. An experienced machinist can set up a complex job quickly and reliably but may struggle to write down exactly how. A skilled driver handles hundreds of subtle situations without consciously applying rules. A senior customer service officer knows how to calm an angry customer in ways that are hard to put into a manual.

When explicit rules are hard to write and rewards are hard to specify, an alternative is to learn from **demonstrations**: watch experts perform the task and learn to do what they do. This approach is called **imitation learning**, and it is the subject of a chapter of *Algorithms for Decision Making* by Mykel Kochenderfer, Tim Wheeler and Kyle Wray.

This article explains imitation learning in plain English: behavioural cloning, why small errors can compound, methods that let experts correct the learner, and inverse reinforcement learning, which tries to infer what the expert is trying to achieve. It also draws lessons for any organisation trying to capture and transfer expert know-how, whether to software or to people. It is part of GoCore's series on decision making.

## Why learn from demonstrations?

Two other ways of designing decision systems have important limitations.

**Writing explicit rules** requires anticipating every situation and specifying the right action. For complex tasks, this is impractical, and rules often fail in unforeseen situations.

**Reinforcement learning** requires a reward that captures everything that matters, plus large amounts of experience, often gained through trial and error that may be costly or unsafe. As the article [Be careful what you reward](/reados/collections/decision-making-machines/be-careful-what-you-reward/) explains, specifying rewards well is hard.

Demonstrations offer a third route. Experts show what good behaviour looks like, and the system learns from their examples. This can capture subtle judgement that would be hard to express as rules or rewards.

## Behavioural cloning

The simplest form of imitation learning is **behavioural cloning**. It treats the problem as supervised learning: collect pairs of situations and the actions the expert took, then train a model to predict the expert's action from the situation.

For example, to teach a vehicle to stay in its lane, record many hours of an expert driving, pairing camera images with the steering angle the driver chose. Train a model to predict steering from images. Then use the model to steer.

Behavioural cloning is simple and often surprisingly effective. It works best when:

- the expert genuinely knows the best action
- the demonstrations cover the situations the system will encounter
- small mistakes do not lead the system into unfamiliar situations

### The problem of cascading errors

That last condition is the critical weakness. The learned model will make small mistakes. In a sequential task, each mistake changes the situation slightly. A car that drifts a little towards the edge of the lane is now in a position the expert rarely visited, because the expert stayed centred. The model has seen few examples of how to recover from such positions, so it is more likely to make a further mistake, drifting further, into situations it has seen even less.

These **cascading errors** mean that a model that predicts expert actions accurately on the expert's own data can still perform poorly when it is in control. Errors compound over the length of the task. The underlying issue is that the situations the learner encounters differ from those in the training data, a problem often called **distribution shift**.

## Letting the expert correct the learner

Several methods address cascading errors by gathering demonstrations in the situations the learner actually reaches.

### Data set aggregation

**Data set aggregation**, often called DAgger, works iteratively:

1. Train a policy from the expert's demonstrations.
2. Let the learned policy act, and record the situations it encounters.
3. Ask the expert what they would have done in each of those situations.
4. Add these new examples to the training data and retrain.
5. Repeat.

Over time, the training data comes to include the situations the learner actually gets into, including mistakes, along with expert guidance on how to recover. The learned policy becomes much more robust.

### Gradually handing over control

A related approach, described in the book as **stochastic mixing iterative learning**, gradually shifts control from the expert to the learner. Early on, the expert's policy is mostly in control; over successive iterations, the learned policy takes over a growing share. This keeps the learner close to situations where good demonstrations exist, while slowly extending its independence.

Both approaches require an expert who can provide guidance on demand, which can be expensive, but they directly address the gap between what the expert demonstrates and what the learner experiences.

## Inverse reinforcement learning

Behavioural cloning copies what the expert does. **Inverse reinforcement learning** asks a different question: what is the expert trying to achieve? It infers a reward function that would explain the expert's behaviour, then uses reinforcement learning or planning to find a policy that maximises that reward.

The advantage is generalisation. A reward captures the expert's goals and priorities, which may apply in new situations where copying specific actions would fail. If an expert driver's behaviour reveals that they value safety margins and smooth progress, a policy optimising those values can handle road layouts the expert never demonstrated.

The challenge is that many different rewards can explain the same behaviour. The book describes approaches to resolving this:

- **Maximum margin** methods find a reward under which the expert's behaviour is clearly better than alternatives.
- **Maximum entropy** methods find a reward that explains the expert's behaviour while assuming as little else as possible, treating the expert as mostly, but not perfectly, optimal.

### Generative adversarial imitation learning

Another approach, **generative adversarial imitation learning**, trains two components against each other. One tries to produce behaviour that looks like the expert's; the other tries to tell the difference between the learner's behaviour and the expert's. As each improves, the learner's behaviour becomes harder to distinguish from the expert's. This approach draws on the same ideas behind generative adversarial networks used in image generation.

## Strengths and limits of imitation learning

| Approach | What it learns | Strengths | Limitations |
| --- | --- | --- | --- |
| Behavioural cloning | Expert actions directly | Simple, fast | Cascading errors; limited to demonstrated situations |
| Data set aggregation | Actions, including recovery | Robust to mistakes | Needs an expert available on demand |
| Gradual hand-over | Actions, with mixing | Smooth transition | Requires many iterations |
| Inverse reinforcement learning | The expert's goals | Generalises to new situations | Many possible rewards fit; computationally heavy |
| Adversarial imitation | Behaviour indistinguishable from expert | Flexible | Can be unstable to train |

A fundamental limit applies to all of them: a system that learns only from demonstrations generally cannot do better than the experts it learns from, at least without additional learning or optimisation. If the experts have systematic blind spots or biases, the system will inherit them.

## How many demonstrations are enough?

The amount of demonstration data needed depends on how varied the task is. A task performed in a narrow range of situations may be learned from relatively few examples. A task with many possible situations, such as driving in traffic, requires demonstrations covering that variety, including rare but important situations. Collecting more examples of situations that are already well covered adds little; collecting examples of rare, difficult or recovery situations adds a lot.

A practical check is to test the learned behaviour in situations deliberately chosen to differ from the training data. Where performance drops, more demonstrations of that kind are needed.

## Imitation in modern AI

Ideas related to imitation learning sit behind many recent advances in artificial intelligence. Large language models, for example, first learn by predicting human-written text, which is a form of learning from human examples at enormous scale. They are then commonly refined with curated demonstrations of good responses and with feedback from people comparing alternative responses. These later stages address some of the same issues described here: examples alone do not guarantee the behaviour people want, and feedback on the system's own outputs helps correct it.

## Imitation and safety

Learning from demonstrations has a safety advantage: the learner starts from behaviour that experts consider acceptable, rather than from random trial and error. It also has a safety risk: the learner may behave confidently in situations where it has no relevant examples. Well-designed systems therefore monitor how similar each new situation is to the training data, and hand control back to a person, or fall back to a cautious default, when situations look unfamiliar.

## Lessons for capturing know-how in organisations

The challenges of imitation learning mirror the challenges organisations face in transferring expert knowledge to new staff or into systems.

### Demonstrations miss recovery

Training that shows only how experts handle typical situations leaves learners unprepared for the unusual ones, and especially for recovering from their own mistakes. Just as behavioural cloning suffers cascading errors, new staff who have only seen smooth demonstrations can struggle when things go off track.

**Practice:** include examples of problems, mistakes and recoveries in training. Ask experts not only "how do you do this?" but "what do you do when it goes wrong?"

### Learners need correction in their own situations

Data set aggregation works because the expert guides the learner in the situations the learner actually reaches. The organisational equivalent is coaching on the job: an experienced person reviewing the trainee's actual work and explaining what they would have done differently.

**Practice:** combine demonstrations with regular review of the learner's own work, and gradually reduce supervision as competence grows, much like gradually handing over control.

### Goals transfer better than steps

Inverse reinforcement learning generalises because it captures goals rather than specific actions. People, likewise, handle new situations better when they understand the purpose behind procedures.

**Practice:** document why procedures exist, not just what they are. Explain the priorities experts are balancing, such as safety, quality, speed and customer experience, so learners can make good judgements when procedures do not cover a situation.

### Experts have blind spots

Copying experts also copies their mistakes and biases.

**Practice:** check expert practice against outcomes. Where data shows that an established habit performs poorly, update it before it is passed on.

GoCore's article on service businesses, [Institution or people?](/reados/collections/starting-funding-and-structuring-a-business/institution-or-people/), discusses why turning individual expertise into documented method matters for the long-term value of a business.

## A worked illustration

This is an illustration, not a real business.

A small fabrication workshop wants to reduce its dependence on one senior welder whose work is consistently excellent. The first attempt records the welder completing several standard jobs and turns them into step-by-step instructions. Trainees following the instructions do well on standard jobs but struggle when materials vary or a weld starts to go wrong, a form of cascading error.

The workshop changes approach. The senior welder reviews trainees' actual work each week, explaining corrections in the situations the trainees actually face, including how to recover from common problems. The written guide is revised to explain the goals behind each step: penetration, distortion control and finish quality, and how to trade them off for different jobs. Over several months, trainees handle a growing range of jobs independently, and the guide becomes a useful reference rather than a rigid script.

## Common mistakes

**Showing only ideal performance.** Learners need to see recovery from mistakes.

**Training without feedback on real work.** Correction in the learner's own situations is essential.

**Copying steps without explaining goals.** Purpose helps learners handle the unexpected.

**Assuming experts are always right.** Check established practice against outcomes.

**Expecting imitation to exceed the expert.** Further improvement needs additional learning or optimisation.

## Questions to ask

- Which tasks in our business rely on expertise that is hard to write down?
- Do our training materials show how to recover from mistakes?
- How do learners receive correction on their own real work?
- Do our procedures explain the goals behind each step?
- For your own business: whose know-how would be hardest to replace, and how could it be captured?

## Bringing it together

Imitation learning allows systems to learn from expert demonstrations when rules and rewards are hard to specify. Behavioural cloning is simple but suffers from cascading errors, as small mistakes lead into situations the demonstrations did not cover. Methods such as data set aggregation and gradual hand-over address this by gathering expert guidance in the situations the learner actually reaches. Inverse reinforcement learning goes further, inferring the expert's goals so that behaviour can generalise to new situations.

The same lessons apply to people and organisations: include recovery in training, coach learners on their own work, explain goals rather than just steps, and check expert practice against results before passing it on.

---

*Source: Mykel J. Kochenderfer, Tim A. Wheeler and Kyle H. Wray, Algorithms for Decision Making (MIT Press, 2022). Explanations are GoCore's own; the worked illustration is hypothetical. This article is general information, not professional advice.*
