---
title: 'Random Tidbits, Part 1: Garbage Collection in Go'
description: How Go's garbage collector keeps the kitchen clean, explained with a baker, a pantry, and a very patient cleaning team.
date: 2026-10-16
draft: false
slug: /blog/random-tidbits-go-gc
cover: ./gopher.jpg
tags:
  - Go
  - Garbage Collection
  - Random Tidbits
---

Random Tidbits is a series of small blogs where I share simplified explanations of technical concepts, polished(ish) versions of my own notes in no apparent order. If this series helps even one person understand a topic on a more granular level, that would be a great achievement for me. Anyway, let's talk about garbage collection in Go.

Before we talk about garbage collection, we should know a bit about memory. There are two types of memory: heap memory and stack memory. Both of these come from the memory available to your program, which in most cases is roughly the RAM left over after the OS and other running applications have taken their share.

Imagine you are a baker in a bakery trying to make many dishes, and your code is the recipe to make a dish. The stack memory would be the dish in which the actual baking is happening; this is the currently running function. Once the function (baking) is completed, the food is taken out and the stack (dish) is cleared, no cleaning team required.

The heap memory is the pantry from which different items (bytes of memory) can be requested. The pantry initially starts off as a basket of items. As the dish starts demanding more and more items and the basket starts reaching its limit, it is replaced by a newer container, and in Go, by default, that container is allowed to grow to roughly double the size of what is actually being used before anyone cleans up (crazy I know, but bear with me as I'm currently incapable of finding better ways to describe this process, and we'll come back to this doubling later).

Now imagine you use a bunch of items from the pantry for your dish and some of the leftovers are still scattered across the kitchen. If these items continue to be scattered around the kitchen, there will be chaos, the amount of workable space will keep shrinking, and at some point the kitchen will be so full that there will be no place left to make the dish. This is precisely why we have garbage collectors: their job is to make sure that the kitchen stays clean and tidy so that the baker can cook (some spaghetti code... sorry).

Now that we have a terrible understanding of what a garbage collector's job is, let's see how a garbage collector works. The garbage collector works in regular intervals, each of these intervals is called a cycle, and in each cycle the garbage collector goes through three phases: the mark phase, the sweep phase and the off phase. Together this is called mark and sweep garbage collection.

Coming back to our original analogy of the baker in the kitchen, imagine the garbage collector to be the cleaning team that is tasked with cleaning up the kitchen. They do this in three phases. First is the mark phase, where one person from the GC team goes through the kitchen and labels all of the items in the heap as white, which means we don't know yet if they are still being used. Then they start from the things the baker is definitely holding on to right now, the dishes on the counter (goroutine stacks) and the recipe book (global variables), these are called roots. Every item a root points to is labeled gray, meaning "needed, but not yet checked". The GC team then takes each gray item, labels everything it points to as gray, and labels the item itself black, meaning "needed and checked". This continues until there are no gray items left. Since the baker keeps cooking the whole time, every time the baker moves an item around the GC team gets a heads up (this is called a write barrier) so nothing slips through. At the end of the mark phase, every item in the kitchen is either white or black.

That is the mark phase of the cycle. Once the mark phase is completed, another person from the GC team initiates the sweep phase. This is literally what it sounds like: this person will simply go and pick up all the stuff from the heap container that is still marked as white. All the non-white memory allocations are called "live" memory. After that, the GC team goes into the off phase and waits for the next cycle. That is Go garbage collection on a high level.

Traditionally, many garbage collectors (older Java collectors, for example) follow a process where the GC team literally tells the kitchen to stop working while they clean up. This is because these GCs also move the objects around in the heap (called compaction) so that the free space sits together in one place and future allocations can quickly be added to the heap. If they were to do this concurrently, there would be a chance of the baker trying to find an object at a position that now holds some other object. This would be memory corruption, hence stop the world is a requirement. (C++ doesn't have a garbage collector at all, the baker cleans up after themselves, and modern Java collectors like G1 and ZGC do most of their work concurrently.) With Go's garbage collector the situation is different: Go never moves objects around, the GC team simply goes and sweeps the white marked objects and leaves. That's why the STW (stop the world) time is very minimal, Go only stops the kitchen for a brief moment at the start and end of the mark phase, and everything else happens concurrently while the baker keeps cooking.

The frequency of these GC cycles is set by a third teammate called the pacer. The pacer's job is to decide when to do garbage collection. Too frequent garbage collection would mean that a significant amount of compute goes to the GC team instead of the baker, which is not good. If garbage collection is few and far between, there is a risk of running out of memory (OOM). Go provides the GOGC environment variable to control this, it sets how much the heap can grow, relative to the live memory left after the last cycle, before the next GC is triggered. The default GOGC=100 means the heap can grow to double the live memory (remember the doubling container?). Since Go 1.19 there is also GOMEMLIMIT, which sets a soft limit on total memory, and the pacer gets more aggressive as you get close to it.

So that's it, that was a small tidbit of how garbage collection works in Go.

---

_The Go gopher was designed by [Renée French](https://reneefrench.blogspot.com/) and is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)._
