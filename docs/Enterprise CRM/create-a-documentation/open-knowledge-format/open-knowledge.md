# Open Knowledge

The Open Knowledge Format (OKF) establishes a standardized, structured method for storing essential context—such as schema definitions, metric parameters, and operational runbooks—that feeds into your documentation and agent systems. By adopting OKF, you ensure that critical knowledge resides in a portable format, making it accessible regardless of the proprietary service that consumes it.

<br />

![content pune 3](/img/reorganize-navigation/content-pune-3.png)

## What is open knowledge format?

The Open Knowledge Format represents a commitment to separating raw, functional knowledge from the services that utilize it. Instead of trapping context within a proprietary database structure, OKF provides a universal structure for defining and storing contextual data.

You should think of OKF as a standardized container that defines the *what* and *how* of your business information. This ensures that you do not rely solely on a single platform for access to your most vital assets. The format structure supports various types of metadata, allowing you to define assets that were previously siloed or unstructured.

## Why do you need open knowledge format?

When building complex systems, you require reliable access to diverse data points, such as source system schemas or operational workflows. Relying on a single service to hold all of this context creates vendor lock-in and limits flexibility.

By utilizing OKF, you ensure that your context—including table schemas, metric definitions, and runbook steps—is preserved in a machine-readable, non-proprietary format. This guarantees that you can connect disparate systems and allow agents to interpret complex rules without needing to query an internal, opaque database.

## Defining knowledge assets in OKF

OKF allows you to define three primary types of knowledge assets. These components structure your knowledge base and help agents execute reliable tasks.

### Defining schemas and metrics

When documenting an API endpoint or a data source, you must provide the necessary structural context. Use OKF to define precise `schema` mappings and metric definitions.

When you define a metric, specify:

* The unique name of the metric (e.g., `user_login_failure_rate`).
* The required data type and measurement unit.
* The formula or calculation method, linking it back to specific data fields.

This process ensures that any system reading the knowledge knows exactly how to interpret the data, preventing ambiguity when calculating business results.

### Storing runbooks

Runbooks detail the step-by-step operational procedures required to manage an application or resolve an incident. Within OKF, you organize these steps as structured processes.

When drafting a runbook, structure the procedure using these elements:

1. **Pre-requisites:** List all necessary tools, access permissions, or prerequisite knowledge.
2. **Steps:** Number each action imperatively.
3. **Success/Failure Criteria:** Define clear exit points, including what constitutes a successful resolution or what error codes require escalation.

By structuring runbooks this way, agents can execute tasks with predictable logic, improving overall operational reliability.
