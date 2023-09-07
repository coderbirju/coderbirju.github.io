---
date: '1'
title: 'AutoScale API'
cover: './CloudDiagram.png'
external: 'https://github.com/orgs/Org-Arjun-Raja-002964082/repositories'
github: 'https://github.com/Org-Arjun-Raja-002964082/webapp'
tech:
  - Microservices
  - NestJS
  - AWS Cloudformation
  - AWS S3
  - AWS Lambda
  - Sendgrid
  - AWS RDS
  - AWS Cloudwatch
---

- **Description:** A highly scalable microservice designed to handle a massive customer base, capable of scaling to accommodate hundreds of thousands of users.
- **Backend Technology:** Utilizes Nest.js for the backend API server, ensuring efficient and maintainable code.
- **Infrastructure Hosting:** Hosted on AWS (Amazon Web Services) using an EC2 (Elastic Compute Cloud) instance, offering reliability and scalability.
- **Database:** Stores data in an AWS RDS (Relational Database Service) MySQL database, providing data integrity and flexibility.
- **File Storage:** Utilizes AWS S3 (Simple Storage Service) for file storage, ensuring efficient and secure data management.
- **Email Notifications:** Implemented a robust email notification system triggered by AWS Lambda, which utilizes the AWS SES (Simple Email Service) to send verification emails efficiently.
- **Error Monitoring:** Monitors for errors using AWS CloudWatch, ensuring real-time visibility into system health.
- **Autoscaling:** Implements proactive autoscaling based on API traffic patterns, optimizing resource allocation to handle fluctuations in user demand. Alarms are set up to trigger autoscaling when needed, ensuring a seamless user experience.
