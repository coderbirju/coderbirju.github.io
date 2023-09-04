---
date: '2023-08-31'
title: 'Software Development Engineer Intern'
company: 'Amazon Web Services'
location: 'Seattle, Washinton'
range: 'May 2023 - September 2023'
url: 'https://aws.amazon.com/fargate/'
companyShort: 'AWS'
---

- My project involved improving and implementing the performance benchmarks of [soci-snapshotter](https://github.com/awslabs/soci-snapshotter). Soci-snapshotter is a [containerd](https://containerd.io/) plugin that improves container pull times by using lazy loading.
- We needed to ensure that soci continues to perform better and doesn't slow down due to any code changes to the repository. The following lists all my responsibilities.
- The credential helper of the soci-snapshotter benchmark engine was enhanced to ensure compatibility with all container registries. This improvement enabled users to assess the performance of their container images across various registries, extending inclusivity and versatility.
- The command-line interfaces (CLIs) were enriched with command flags, granting users the capability to tailor benchmark runs to their unique preferences and needs.
- A novel git workflow was introduced to the project, allowing for the detection of performance regressions in each pull request. This workflow also simplified the display of historical performance metrics on the project's [GitHub-Pages](https://awslabs.github.io/soci-snapshotter/dev/benchmarks/). This innovative approach strengthened the project's resilience and promoted data-driven decision-making.
