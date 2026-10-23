import { Flashcard } from "../types";

// skill_ref values copy the official AZ-900 skills outline wording exactly.
const R = {
  defineCloud: "Define cloud computing",
  sharedResponsibility: "Describe the shared responsibility model",
  cloudModels: "Define cloud models, including public, private, and hybrid",
  modelUseCases: "Identify appropriate use cases for each cloud model",
  consumption: "Describe the consumption-based model",
  capexOpex: "Compare cloud pricing models (CapEx vs. OpEx)",
  haScalability:
    "Describe the benefits of high availability and scalability in the cloud",
  elasticityPredictability:
    "Describe the benefits of elasticity and predictability in the cloud",
  securityGovernance:
    "Describe the benefits of security and governance in the cloud",
  manageability: "Describe the benefits of manageability in the cloud",
  iaas: "Describe Infrastructure as a Service (IaaS)",
  paas: "Describe Platform as a Service (PaaS)",
  saas: "Describe Software as a Service (SaaS)",
  serviceUseCases:
    "Identify appropriate use cases for each cloud service type (IaaS, PaaS, SaaS)",
  regions: "Describe Azure regions, region pairs, and sovereign regions",
  availabilityZones: "Describe Availability Zones",
  datacenters: "Describe Azure datacenters",
  resourceGroups: "Describe Azure resources and Resource Groups",
  subscriptions: "Describe Azure Subscriptions",
  managementGroups: "Describe Azure Management Groups",
  hierarchy:
    "Describe the hierarchy of resource organization (Management Groups > Subscriptions > Resource Groups > Resources)",
  computeTypes:
    "Describe compute types, including Container instances, Virtual Machines (VMs), and Functions",
  vmOptions:
    "Describe VM options, including Azure Virtual Machines, Azure VM Scale Sets, Availability Sets, and Azure Virtual Desktop",
  vmResources: "Describe resources required for virtual machines",
  appHosting:
    "Describe application hosting options, including Web Apps, containers, and virtual machines",
  networking:
    "Describe virtual networking, including Azure Virtual Networks, subnets, peering, Azure DNS, VPN Gateway, and ExpressRoute",
  endpoints: "Describe public and private endpoints",
  storageServices:
    "Describe Azure Storage services (Blob, Disk, File, Table, Queue)",
  storageTiers: "Describe storage tiers (Hot, Cool, Cold, Archive)",
  redundancy:
    "Describe storage redundancy options (LRS, ZRS, GRS, GZRS, RA-GRS)",
  migration:
    "Describe options for data migration and file management (AzCopy, Azure Storage Explorer, Azure File Sync, Azure Data Box, Azure Migrate)",
  directory:
    "Describe directory services in Azure, including Microsoft Entra ID and Microsoft Entra Domain Services",
  authentication:
    "Describe authentication methods, including Single Sign-On (SSO), Multi-Factor Authentication (MFA), and passwordless",
  externalIdentities:
    "Describe external identities and guest access in Microsoft Entra ID",
  conditionalAccess: "Describe Microsoft Entra Conditional Access",
  rbac: "Describe Azure Role-Based Access Control (RBAC)",
  zeroTrust: "Describe Zero Trust model concepts",
  defenseInDepth: "Describe defense-in-depth principles",
  defender: "Describe Microsoft Defender for Cloud capabilities",
  costFactors: "Describe factors that affect costs in Azure",
  calculators:
    "Describe the Pricing Calculator and Total Cost of Ownership (TCO) Calculator",
  costManagement: "Describe Microsoft Cost Management features",
  tags: "Describe the purpose and implementation of Azure tags",
  purview: "Describe Microsoft Purview features",
  policy: "Describe Azure Policy and policy initiatives",
  locks: "Describe Resource Locks and their scope",
  trustPortal: "Describe the Service Trust Portal and Trust Center",
  managementOptions:
    "Describe management options: Azure Portal, Cloud Shell, Azure CLI, Azure PowerShell, and Azure mobile app",
  arc: "Describe Azure Arc capabilities",
  iac: "Describe Infrastructure as Code (IaC) principles",
  arm: "Describe Azure Resource Manager (ARM) and ARM templates / Bicep",
  advisor: "Describe Azure Advisor recommendations",
  serviceHealth: "Describe Azure Service Health",
  monitor:
    "Describe Azure Monitor, including Log Analytics, alerts, and Application Insights",
} as const;

export const cards: Flashcard[] = [
  // ===== DOMAIN 1: CLOUD CONCEPTS =====
  // Skill Area: Cloud Concepts

  {
    id: "cc-01",
    skill_area: "Cloud Concepts",
    skill_ref: R.defineCloud,
    type: "definition",
    front: "What is cloud computing?",
    back: "Using computing services such as servers, storage, databases, networking and software over the internet, and paying for what you use, instead of owning the hardware.",
    explanation:
      "Cloud computing lets you use technology resources on demand without buying and running physical hardware. You rent instead of buy.",
    example:
      "Like renting a hall for one event instead of building your own hall.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cc-02",
    skill_area: "Cloud Concepts",
    skill_ref: R.defineCloud,
    type: "scenario",
    front:
      "A company stops buying its own servers and instead rents computing power from a provider over the internet, paying only for what it uses. What is this approach called?",
    back: "Cloud computing.",
    explanation:
      "Cloud computing replaces owned hardware with computing services delivered over the internet and billed by use.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cc-03",
    skill_area: "Cloud Concepts",
    skill_ref: R.sharedResponsibility,
    type: "definition",
    front: "What is the shared responsibility model in cloud computing?",
    back: "A framework that splits security duties between the cloud provider and the customer. The provider secures the underlying infrastructure. The customer is always responsible for their data, devices, accounts and identities, and the split for everything else depends on the service type.",
    explanation:
      "With IaaS you manage more, such as the guest operating system. With SaaS the provider manages most of the stack. Your data and identities stay with you in every model.",
    example:
      "Like a landlord who looks after the building structure while the tenant locks their own door and protects what is inside.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cc-04",
    skill_area: "Cloud Concepts",
    skill_ref: R.sharedResponsibility,
    type: "scenario",
    front:
      "A company uses Azure Virtual Machines. Who is responsible for patching the guest operating system?",
    back: "The customer.",
    explanation:
      "In IaaS the customer manages the operating system, applications and data. Azure manages the physical hosts, network and datacenter.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cc-05",
    skill_area: "Cloud Concepts",
    skill_ref: R.cloudModels,
    type: "definition",
    front: "What is a public cloud?",
    back: "Cloud resources owned and run by a provider such as Azure and offered to many customers over the internet.",
    explanation:
      "Many organizations share the same underlying hardware, but each customer's data is kept separate. You pay for what you use.",
    example:
      "Like a shared office building where many businesses rent desks and meeting rooms from the same landlord.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cc-06",
    skill_area: "Cloud Concepts",
    skill_ref: R.cloudModels,
    type: "definition",
    front: "What is a private cloud?",
    back: "Cloud computing resources used by a single organization only, hosted either in its own datacenter or by a third party.",
    explanation:
      "You have full control over the hardware and security policies. It usually costs more because the organization pays for and runs the infrastructure itself.",
    example:
      "Like a SACCO that runs its own server room that only its staff can use.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cc-07",
    skill_area: "Cloud Concepts",
    skill_ref: R.cloudModels,
    type: "definition",
    front: "What is a hybrid cloud?",
    back: "A combination of public and private clouds, connected so that data and applications can move between them.",
    explanation:
      "Hybrid lets an organization keep some workloads on private infrastructure and use the public cloud where it fits, for example for extra capacity at busy times.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cc-08",
    skill_area: "Cloud Concepts",
    skill_ref: R.modelUseCases,
    type: "scenario",
    front:
      "A government agency must keep all data within its own datacenter for legal reasons, but needs to handle traffic spikes during tax season. Which cloud model fits?",
    back: "Hybrid cloud.",
    explanation:
      "The agency keeps sensitive data on private infrastructure to meet legal requirements and uses a public cloud for peak demand.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cc-09",
    skill_area: "Cloud Concepts",
    skill_ref: R.consumption,
    type: "definition",
    front: "What is the consumption-based (pay-as-you-go) model?",
    back: "A pricing model where you pay only for the resources you actually use, such as compute time or storage, with no upfront hardware cost.",
    explanation:
      "Resources you switch off do not bill you, but resources left running still do.",
    example:
      "Like a metered water bill: you pay for the litres you used, not for the size of the pipe.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cc-12",
    skill_area: "Cloud Concepts",
    skill_ref: R.consumption,
    type: "scenario",
    front:
      "A shop's website has almost no visitors for most of the month and many during one sale week. Why does a consumption-based model suit it?",
    back: "The shop pays for the capacity it actually uses, so quiet weeks cost little and it does not pay for hardware that sits idle.",
    explanation:
      "With consumption-based pricing, cost follows usage instead of being fixed by the size of an upfront purchase.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cc-10",
    skill_area: "Cloud Concepts",
    skill_ref: R.capexOpex,
    type: "compare",
    front: "Compare CapEx and OpEx in cloud computing.",
    back: "CapEx is upfront spending on physical assets such as servers and a datacenter. OpEx is ongoing spending on services as you use them. Moving to the cloud shifts spending from CapEx toward OpEx.",
    explanation:
      "CapEx needs a large investment up front, and its cost is spread over the asset's life through depreciation. OpEx has no upfront cost and follows usage.",
    example:
      "CapEx is like buying a delivery truck outright. OpEx is like paying per trip to a delivery service.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cc-11",
    skill_area: "Cloud Concepts",
    skill_ref: R.capexOpex,
    type: "scenario",
    front:
      "A startup has limited capital but unpredictable workloads. Why is the cloud's OpEx model better for them than buying servers?",
    back: "OpEx needs no large upfront investment and lets them scale spending with actual usage, avoiding waste on idle hardware.",
    explanation:
      "Startups benefit from low initial costs and from growing their spending only as the business grows.",
    difficulty: 2,
    needs_verification: false,
  },

  // Skill Area: Cloud Benefits

  {
    id: "cb-01",
    skill_area: "Cloud Benefits",
    skill_ref: R.haScalability,
    type: "definition",
    front: "What is high availability in cloud computing?",
    back: "The ability of a service to stay up and reachable for as much of the time as possible, even when parts of it fail. It is usually expressed as a percentage of uptime.",
    explanation:
      "Providers build high availability through redundancy: multiple copies of data, multiple servers and multiple datacenters.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cb-02",
    skill_area: "Cloud Benefits",
    skill_ref: R.haScalability,
    type: "compare",
    front: "What is the difference between scalability and elasticity?",
    back: "Scalability is the ability to change capacity as your needs change. Elasticity is adjusting capacity quickly, often automatically, as demand rises and falls.",
    explanation:
      "Scalability is about being able to grow or shrink capacity. Elasticity adds the idea of doing it rapidly and automatically in response to demand.",
    example:
      "Scalability is like a school adding classrooms for the next term. Elasticity is like a shop calling in extra cashiers only for the lunch rush.",
    difficulty: 2,
    needs_verification: false,
    confused_with: ["cb-03"],
  },
  {
    id: "cb-03",
    skill_area: "Cloud Benefits",
    skill_ref: R.elasticityPredictability,
    type: "definition",
    front: "What is elasticity in the cloud?",
    back: "The ability to add or remove computing resources automatically as demand changes, so you use and pay for only what you need at any moment.",
    explanation:
      "Elasticity means your application can handle a traffic spike without manual work, then shrink again when demand drops.",
    difficulty: 1,
    needs_verification: false,
    confused_with: ["cb-02"],
  },
  {
    id: "cb-04",
    skill_area: "Cloud Benefits",
    skill_ref: R.elasticityPredictability,
    type: "definition",
    front: "What is predictability in cloud computing?",
    back: "Being able to forecast both performance and cost. Performance predictability means the service responds consistently as demand changes. Cost predictability means you can estimate and track what you will spend.",
    explanation:
      "Autoscaling and load balancing help keep performance steady, while tools such as the Pricing Calculator and Cost Management help you plan and track budgets.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cb-05",
    skill_area: "Cloud Benefits",
    skill_ref: R.securityGovernance,
    type: "definition",
    front: "How does the cloud benefit security compared to on-premises?",
    back: "Cloud providers invest heavily in physical security, threat detection and compliance, and they offer built-in security tools you can switch on.",
    explanation:
      "Azure has dedicated security teams, threat protection tools and compliance certifications. You remain responsible for securing your own data and access.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cb-06",
    skill_area: "Cloud Benefits",
    skill_ref: R.securityGovernance,
    type: "definition",
    front: "How does the cloud support governance?",
    back: "Cloud platforms provide tools to enforce rules consistently across all resources, audit who did what, and show compliance with regulations.",
    explanation:
      "Services like Azure Policy, RBAC and activity logs let you set rules once and apply them everywhere, with an audit trail.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cb-07",
    skill_area: "Cloud Benefits",
    skill_ref: R.manageability,
    type: "definition",
    front: "What does manageability mean as a cloud benefit?",
    back: "The ability to manage cloud resources through automation, APIs and central dashboards instead of manual hardware maintenance.",
    explanation:
      "You can automate deployments, monitor everything from one portal and manage thousands of resources with scripts instead of visiting datacenters.",
    example:
      "Like a farmers' cooperative manager who watches every farm from one dashboard instead of visiting each farm daily.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cb-08",
    skill_area: "Cloud Benefits",
    skill_ref: R.manageability,
    type: "scenario",
    front:
      "A company needs to deploy the same configuration to 50 servers. How does cloud manageability help?",
    back: "Infrastructure as Code and automation tools let you deploy identical configurations to all servers from one template or command.",
    explanation:
      "Instead of configuring each server by hand, you define the configuration once and apply it everywhere, which reduces errors and saves time.",
    difficulty: 2,
    needs_verification: false,
  },

  // Skill Area: Cloud Service Types

  {
    id: "cs-01",
    skill_area: "Cloud Service Types",
    skill_ref: R.iaas,
    type: "definition",
    front: "What is Infrastructure as a Service (IaaS)?",
    back: "A cloud service where the provider supplies the computing infrastructure (servers, storage, networking) and you manage the operating system, applications and data.",
    explanation:
      "IaaS gives you the most control and also the most responsibility. You manage the operating system and everything above it.",
    example:
      "Like renting a plot of land with water and electricity: you build and look after the house yourself.",
    difficulty: 1,
    needs_verification: false,
    confused_with: ["cs-02", "cs-03"],
  },
  {
    id: "cs-07",
    skill_area: "Cloud Service Types",
    skill_ref: R.iaas,
    type: "definition",
    front: "Give an example of an IaaS service in Azure.",
    back: "Azure Virtual Machines.",
    explanation:
      "With a virtual machine you choose the operating system and manage it yourself, which is the IaaS pattern.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cs-02",
    skill_area: "Cloud Service Types",
    skill_ref: R.paas,
    type: "definition",
    front: "What is Platform as a Service (PaaS)?",
    back: "A cloud service where the provider manages the infrastructure and the operating system and runtime, and you deploy and manage your applications and data.",
    explanation:
      "PaaS removes the need to manage servers, patches or runtime environments. You focus on your code.",
    example:
      "Like renting a furnished shop: the landlord handles the building, power and fittings, and you just stock it and sell.",
    difficulty: 1,
    needs_verification: false,
    confused_with: ["cs-01", "cs-03"],
  },
  {
    id: "cs-08",
    skill_area: "Cloud Service Types",
    skill_ref: R.paas,
    type: "definition",
    front: "Give an example of a PaaS service in Azure.",
    back: "Azure App Service (Web Apps).",
    explanation:
      "App Service runs your web application without you managing servers or operating system patches.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cs-03",
    skill_area: "Cloud Service Types",
    skill_ref: R.saas,
    type: "definition",
    front: "What is Software as a Service (SaaS)?",
    back: "A cloud service where the provider manages everything (infrastructure, platform and application). You just use the software through a browser or app.",
    explanation:
      "SaaS needs no management from you beyond user accounts and your data. The provider handles updates, patches and availability.",
    example:
      "Like using a mobile money app: you do not run the servers or the code, you just send and receive payments.",
    difficulty: 1,
    needs_verification: false,
    confused_with: ["cs-01", "cs-02"],
  },
  {
    id: "cs-09",
    skill_area: "Cloud Service Types",
    skill_ref: R.saas,
    type: "definition",
    front: "Give an example of a SaaS product from Microsoft.",
    back: "Microsoft 365 (for example, its hosted email).",
    explanation:
      "You use the software through a browser or app while Microsoft runs the infrastructure, platform and application.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cs-04",
    skill_area: "Cloud Service Types",
    skill_ref: R.serviceUseCases,
    type: "scenario",
    front:
      "A developer wants to deploy a web application without managing servers or operating system patches. Which service type is best?",
    back: "PaaS (Platform as a Service).",
    explanation:
      "PaaS handles the infrastructure and platform, so the developer focuses only on the application code.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cs-05",
    skill_area: "Cloud Service Types",
    skill_ref: R.serviceUseCases,
    type: "scenario",
    front:
      "A company needs full control over the operating system to install custom security software. Which service type is best?",
    back: "IaaS (Infrastructure as a Service).",
    explanation:
      "IaaS gives you control over the operating system layer, so you can install custom software that PaaS and SaaS would not allow.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cs-06",
    skill_area: "Cloud Service Types",
    skill_ref: R.serviceUseCases,
    type: "compare",
    front: "In which service type does the customer manage the LEAST?",
    back: "SaaS. The provider manages the infrastructure, platform and application. The customer manages only their data and user access.",
    explanation:
      "SaaS is the most managed service. IaaS is the least managed (the customer manages the most). PaaS sits in between.",
    difficulty: 1,
    needs_verification: false,
  },

  // ===== DOMAIN 2: AZURE ARCHITECTURE AND SERVICES =====
  // Skill Area: Azure Architecture

  {
    id: "aa-01",
    skill_area: "Azure Architecture",
    skill_ref: R.regions,
    type: "definition",
    front: "What is an Azure region?",
    back: "A geographic area where Azure runs one or more datacenters that are linked by a fast private network.",
    explanation:
      "Azure has regions around the world. You choose a region based on how close it is to your users, compliance needs and which services it offers.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "aa-02",
    skill_area: "Azure Architecture",
    skill_ref: R.regions,
    type: "definition",
    front: "What are Azure region pairs?",
    back: "Two Azure regions in the same geography that Microsoft links, usually far enough apart that one event is unlikely to hit both. Azure aims for about 300 miles of separation where it can. Planned updates go to one region of a pair at a time.",
    explanation:
      "Pairing supports recovery planning. Many regions are not paired, and Microsoft advises against relying on automatic failover between a pair as your main disaster recovery plan.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "aa-03",
    skill_area: "Azure Architecture",
    skill_ref: R.regions,
    type: "definition",
    front: "What are Azure sovereign regions?",
    back: "Separate instances of Azure, isolated from public Azure, built to meet specific legal or compliance needs. Examples: Azure Government, for US government bodies and their partners, and Azure China, run by 21Vianet.",
    explanation:
      "They run apart from global Azure and are open only to eligible organizations, such as US government entities for Azure Government.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "aa-04",
    skill_area: "Azure Architecture",
    skill_ref: R.availabilityZones,
    type: "definition",
    front: "What are Azure Availability Zones?",
    back: "Physically separate locations within an Azure region, each with its own power, cooling and networking, connected by fast links.",
    explanation:
      "Availability Zones protect against the failure of one datacenter location. Deploying across zones keeps your application running if one zone goes down.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "aa-05",
    skill_area: "Azure Architecture",
    skill_ref: R.datacenters,
    type: "definition",
    front: "What is an Azure datacenter?",
    back: "A physical facility containing servers, networking equipment and storage that hosts Azure cloud services.",
    explanation:
      "Azure regions contain one or more datacenters. Each datacenter has redundant power, cooling and physical security.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "aa-12",
    skill_area: "Azure Architecture",
    skill_ref: R.datacenters,
    type: "compare",
    front:
      "What is the difference between an Azure datacenter and an Azure region?",
    back: "A datacenter is a physical facility. A region is a geographic area that contains one or more datacenters linked by a fast network. When you deploy, you choose a region.",
    explanation:
      "Think of datacenters as the buildings and a region as the area they serve. You pick the region, and Azure places your resources in its datacenters.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "aa-06",
    skill_area: "Azure Architecture",
    skill_ref: R.resourceGroups,
    type: "definition",
    front: "What is an Azure resource?",
    back: "A manageable item in Azure, such as a virtual machine, storage account or database. Every resource belongs to a resource group.",
    explanation:
      "Resources are the building blocks of Azure. Each one has a unique ID and belongs to exactly one resource group.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "aa-07",
    skill_area: "Azure Architecture",
    skill_ref: R.resourceGroups,
    type: "definition",
    front: "What is an Azure Resource Group?",
    back: "A container that holds related Azure resources for an application or project. Resources in the same group usually share a lifecycle.",
    explanation:
      "Deleting a resource group deletes everything inside it. Resource groups let you manage permissions, costs and deployments as a unit.",
    example:
      "Like a project folder that holds every file for one project. Deleting the folder removes all its contents.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "aa-08",
    skill_area: "Azure Architecture",
    skill_ref: R.subscriptions,
    type: "definition",
    front: "What is an Azure subscription?",
    back: "A logical container that gives you access to Azure and groups resources. It acts as a boundary for billing and for access control.",
    explanation:
      "Azure produces separate billing reports and invoices for each subscription. Organizations often use several subscriptions, for example for development, testing and production.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "aa-13",
    skill_area: "Azure Architecture",
    skill_ref: R.subscriptions,
    type: "scenario",
    front:
      "A company wants separate invoices and separate permissions for its development and production workloads. What can it use?",
    back: "Separate Azure subscriptions.",
    explanation:
      "Billing is reported per subscription, and access can be controlled at the subscription level, so each environment can have its own.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "aa-09",
    skill_area: "Azure Architecture",
    skill_ref: R.managementGroups,
    type: "definition",
    front: "What are Azure Management Groups?",
    back: "Containers that organize multiple subscriptions under one structure, so you can apply policies and access control to all of them at once.",
    explanation:
      "Management groups sit above subscriptions in the hierarchy. They help you govern many subscriptions consistently.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "aa-11",
    skill_area: "Azure Architecture",
    skill_ref: R.managementGroups,
    type: "scenario",
    front:
      "You need to enforce a rule that no one can create resources in a specific region across ALL subscriptions in your company. Where should you apply the policy?",
    back: "At the management group level that contains all those subscriptions.",
    explanation:
      "Policies applied to a management group cascade to all child subscriptions and resource groups, so governance stays consistent.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "aa-10",
    skill_area: "Azure Architecture",
    skill_ref: R.hierarchy,
    type: "definition",
    front: "What is the Azure resource hierarchy from top to bottom?",
    back: "Management Groups > Subscriptions > Resource Groups > Resources.",
    explanation:
      "Policies and permissions applied at a higher level cascade down. A policy on a management group applies to all subscriptions, resource groups and resources beneath it.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "aa-14",
    skill_area: "Azure Architecture",
    skill_ref: R.hierarchy,
    type: "scenario",
    front:
      "Which level of the Azure hierarchy sits directly above a resource group?",
    back: "A subscription.",
    explanation:
      "The order from top to bottom is management groups, subscriptions, resource groups, then resources.",
    difficulty: 1,
    needs_verification: false,
  },

  // Skill Area: Compute & Networking

  {
    id: "cn-01",
    skill_area: "Compute & Networking",
    skill_ref: R.computeTypes,
    type: "definition",
    front: "What are Azure Container Instances?",
    back: "A service that runs containers on Azure without you managing virtual machines. You supply the container image and Azure runs it.",
    explanation:
      "Container Instances is a simple way to run a container without setting up orchestration or managing VMs. It suits simple workloads that do not need a full orchestrator.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cn-02",
    skill_area: "Compute & Networking",
    skill_ref: R.computeTypes,
    type: "definition",
    front: "What are Azure Virtual Machines?",
    back: "IaaS compute resources that give you a full virtual machine in the cloud. You choose the operating system, install software and manage the machine.",
    explanation:
      "VMs give you maximum control and flexibility, but you must manage patching, updates and configuration.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cn-03",
    skill_area: "Compute & Networking",
    skill_ref: R.computeTypes,
    type: "definition",
    front: "What are Azure Functions?",
    back: "A serverless compute service that runs small pieces of code (functions) in response to events, without you managing the infrastructure.",
    explanation:
      "Functions are event-driven. You write the code and define what triggers it, and Azure handles scaling and servers. Billing is typically based on how long your code runs.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cn-04",
    skill_area: "Compute & Networking",
    skill_ref: R.computeTypes,
    type: "compare",
    front: "When would you choose Azure Functions over Virtual Machines?",
    back: "When you need to run small pieces of code triggered by events, without managing servers. Functions are serverless and scale automatically. VMs require you to manage the operating system.",
    explanation:
      "Functions suit event-driven, short-running tasks. VMs are better when you need full control of the operating system or long-running processes.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cn-05",
    skill_area: "Compute & Networking",
    skill_ref: R.vmOptions,
    type: "definition",
    front: "What are Azure VM Scale Sets?",
    back: "A service for creating and managing a group of identical VMs whose number can automatically increase or decrease based on demand or a schedule.",
    explanation:
      "Scale Sets suit applications with variable load. Azure adds VMs when demand rises and removes them when it drops.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cn-06",
    skill_area: "Compute & Networking",
    skill_ref: R.vmOptions,
    type: "definition",
    front: "What is an Azure Availability Set?",
    back: "A grouping of VMs that Azure spreads across fault domains and update domains inside a datacenter, so one hardware failure or one maintenance event does not take them all down.",
    explanation:
      "It protects against rack-level failures and planned maintenance. Availability Zones go further by using separate datacenter locations.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cn-07",
    skill_area: "Compute & Networking",
    skill_ref: R.vmOptions,
    type: "definition",
    front: "What is Azure Virtual Desktop?",
    back: "A service that provides cloud-hosted virtual desktops and remote apps, which users can reach from almost any device.",
    explanation:
      "Azure Virtual Desktop suits organizations that want secure desktop access without managing physical PCs, for example for remote workers.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cn-08",
    skill_area: "Compute & Networking",
    skill_ref: R.vmResources,
    type: "definition",
    front: "What resources does an Azure VM require?",
    back: "A VM size (which sets its CPU and memory), storage disks, and networking: a virtual network, plus optionally a public IP address and port rules.",
    explanation:
      "These supporting resources have their own cost and security settings, so check them when you plan or review a VM.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cn-15",
    skill_area: "Compute & Networking",
    skill_ref: R.vmResources,
    type: "definition",
    front: "What does the size you choose for an Azure VM determine?",
    back: "Its processing power, memory, storage capacity and network bandwidth.",
    explanation:
      "Choose a size that matches the workload. A larger size gives more capacity and costs more.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cn-09",
    skill_area: "Compute & Networking",
    skill_ref: R.appHosting,
    type: "compare",
    front:
      "Compare Azure Web Apps, containers and VMs for hosting a web application.",
    back: "Web Apps (PaaS): simplest, no operating system to manage, scaling built in. Containers: portable and consistent, but need somewhere to run. VMs (IaaS): full control, but the most to manage.",
    explanation:
      "Choose Web Apps for quick deployment with little management, containers for portability, and VMs when you need full control of the operating system.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cn-16",
    skill_area: "Compute & Networking",
    skill_ref: R.appHosting,
    type: "scenario",
    front:
      "A team has packaged its application as a container image and wants it to run the same way everywhere. Which hosting option fits?",
    back: "Containers.",
    explanation:
      "A container bundles the application with what it needs, so it behaves the same on a laptop, a test server or in Azure.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cn-10",
    skill_area: "Compute & Networking",
    skill_ref: R.networking,
    type: "definition",
    front: "What is an Azure Virtual Network (VNet)?",
    back: "A logically isolated network in Azure where you deploy resources. It provides IP addressing, subnets and security controls.",
    explanation:
      "VNets are the basic building block of private networking in Azure. Resources in the same VNet can communicate with each other by default.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cn-11",
    skill_area: "Compute & Networking",
    skill_ref: R.networking,
    type: "definition",
    front: "What is VNet peering?",
    back: "A connection that links two virtual networks so resources in either one can communicate as if they were in the same network.",
    explanation:
      "Peering gives low-latency, high-bandwidth connectivity between VNets. They can be in the same region or different regions.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cn-12",
    skill_area: "Compute & Networking",
    skill_ref: R.networking,
    type: "compare",
    front:
      "Compare VPN Gateway and ExpressRoute for connecting on-premises to Azure.",
    back: "VPN Gateway: an encrypted connection over the public internet, usually lower cost and quick to set up. ExpressRoute: a private connection through a connectivity provider that does not cross the public internet, with more consistent latency and reliability, usually at a higher cost.",
    explanation:
      "VPN Gateway is simpler and cheaper. ExpressRoute suits workloads that need dependable private connectivity or must avoid the public internet.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cn-14",
    skill_area: "Compute & Networking",
    skill_ref: R.networking,
    type: "definition",
    front: "What is Azure DNS?",
    back: "A service for hosting your DNS domains on Azure, so domain names resolve to IP addresses.",
    explanation:
      "Azure DNS lets you manage the DNS records for your domains without running your own DNS servers.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cmp-07",
    skill_area: "Compute & Networking",
    skill_ref: R.networking,
    type: "definition",
    front: "What is a subnet?",
    back: "A range of IP addresses within a virtual network. Subnets let you divide a VNet into smaller sections for organization and security.",
    explanation:
      "Subnets let you group related resources and apply network security rules at the subnet level.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cn-13",
    skill_area: "Compute & Networking",
    skill_ref: R.endpoints,
    type: "compare",
    front:
      "What is the difference between a public endpoint and a private endpoint?",
    back: "Public endpoint: reachable over the internet through a public IP address. Private endpoint: reachable only from within a virtual network, using a private IP address from that network.",
    explanation:
      "Private endpoints improve security by removing public internet exposure. Traffic stays on the Microsoft network.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cn-17",
    skill_area: "Compute & Networking",
    skill_ref: R.endpoints,
    type: "scenario",
    front:
      "A company wants a storage account to be reachable only from inside its virtual network, with no exposure to the public internet. Which feature fits?",
    back: "A private endpoint.",
    explanation:
      "A private endpoint gives the service a private IP address inside your virtual network, so access stays on your private network.",
    difficulty: 2,
    needs_verification: false,
  },

  // Skill Area: Storage Services

  {
    id: "ss-01",
    skill_area: "Storage Services",
    skill_ref: R.storageServices,
    type: "definition",
    front: "What is Azure Blob storage?",
    back: 'Object storage for unstructured data such as documents, images, videos and backups. "Blob" stands for Binary Large Object.',
    explanation:
      "Blob storage suits serving images to browsers, storing files for distributed access and streaming video or audio.",
    example:
      "Like a warehouse that stores boxes of any kind: documents, photos, videos, anything that does not fit in a database.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "ss-02",
    skill_area: "Storage Services",
    skill_ref: R.storageServices,
    type: "definition",
    front: "What is Azure Disk storage?",
    back: "Block storage used as virtual hard disks for Azure Virtual Machines. It gives VMs persistent storage.",
    explanation:
      "Disk storage is the hard drive for your VMs. It holds the operating system, applications and data files.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "ss-03",
    skill_area: "Storage Services",
    skill_ref: R.storageServices,
    type: "definition",
    front: "What is Azure Files?",
    back: "A managed file share service reachable through the SMB or NFS protocol. Multiple VMs and on-premises machines can use the same share at the same time.",
    explanation:
      "Azure Files is like a network file share in the cloud. It is good for lift-and-shift applications that need shared file access.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "ss-04",
    skill_area: "Storage Services",
    skill_ref: R.storageServices,
    type: "definition",
    front: "What is Azure Table storage?",
    back: "A NoSQL data store for structured data without a fixed schema. It stores data as entities with properties, found by a key.",
    explanation:
      "Table storage is a low-cost, fast option for large volumes of structured data that does not need complex queries or relationships.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "ss-05",
    skill_area: "Storage Services",
    skill_ref: R.storageServices,
    type: "definition",
    front: "What is Azure Queue storage?",
    back: "A message queuing service for asynchronous communication between application components. Messages wait in the queue until they are processed.",
    explanation:
      "Queues decouple the parts of an application. A web server can add messages to a queue, and a background worker processes them later.",
    example:
      "Like a ticket system at a clinic: patients (messages) wait in line until a doctor (worker) is free.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cmp-04",
    skill_area: "Storage Services",
    skill_ref: R.storageServices,
    type: "compare",
    front: "When would you use Azure Blob storage vs Azure Files?",
    back: "Blob: for unstructured data accessed over HTTP or REST (images, backups, documents). Azure Files: when you need a shared file system reachable through SMB or NFS, like a network drive.",
    explanation:
      "Blob is for applications that reach data through APIs. Azure Files is for applications that expect a traditional file share.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "ss-06",
    skill_area: "Storage Services",
    skill_ref: R.storageTiers,
    type: "definition",
    front: "What are Azure storage access tiers?",
    back: "Hot: data used often; highest storage cost, lowest access cost. Cool: infrequently used data; lower storage cost, higher access cost. Cold: rarely used data that must still be quick to read; cheaper to store than Cool, costlier to access. Archive: rarely used data you can wait hours for; cheapest storage, but offline, so it must be rehydrated before it can be read.",
    explanation:
      "Choose the tier based on how often you access the data. Hot for active data, Archive for data you must keep but almost never read.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "ss-07",
    skill_area: "Storage Services",
    skill_ref: R.storageTiers,
    type: "scenario",
    front:
      "A company has backup data that must be kept for 7 years but is almost never accessed. Which storage tier is most cost-effective?",
    back: "Archive tier.",
    explanation:
      "Archive has the lowest storage cost, but reading the data means rehydrating it first, which takes hours. That suits compliance data you rarely need.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "ss-08",
    skill_area: "Storage Services",
    skill_ref: R.redundancy,
    type: "definition",
    front: "What is LRS (Locally Redundant Storage)?",
    back: "Data is copied three times within a single datacenter in the primary region. It protects against drive and rack failures but not against losing the whole datacenter.",
    explanation:
      "LRS is the lowest-cost redundancy option. A fire or flood in the datacenter could still lose all copies.",
    difficulty: 1,
    needs_verification: false,
    confused_with: ["ss-09"],
  },
  {
    id: "ss-10",
    skill_area: "Storage Services",
    skill_ref: R.redundancy,
    type: "definition",
    front: "What is ZRS (Zone-Redundant Storage)?",
    back: "Data is copied synchronously across three Availability Zones in the primary region. It protects against the failure of a whole zone.",
    explanation:
      "ZRS gives higher availability than LRS by spreading copies across physically separate locations in the same region.",
    difficulty: 2,
    needs_verification: false,
    confused_with: ["ss-14"],
  },
  {
    id: "ss-09",
    skill_area: "Storage Services",
    skill_ref: R.redundancy,
    type: "compare",
    front:
      "Compare GRS (Geo-Redundant Storage) with RA-GRS (Read-Access Geo-Redundant Storage).",
    back: "Both copy data to a secondary region. With GRS, the secondary copy can be read only after a failover to that region, which you or Microsoft can start. With RA-GRS, the secondary copy can be read at any time.",
    explanation:
      "RA-GRS costs more but gives read access to the secondary copy at all times, which helps with reporting or disaster recovery testing.",
    difficulty: 2,
    needs_verification: false,
    confused_with: ["ss-08"],
  },
  {
    id: "ss-14",
    skill_area: "Storage Services",
    skill_ref: R.redundancy,
    type: "definition",
    front: "What is GZRS (Geo-Zone-Redundant Storage)?",
    back: "ZRS in the primary region, plus an asynchronous copy to a secondary region. It protects against a zone failure and against a regional disaster.",
    explanation:
      "GZRS combines the zone protection of ZRS with the regional protection of geo-redundancy. As with GRS, the secondary copy can be read only after a failover.",
    difficulty: 2,
    needs_verification: false,
    confused_with: ["ss-10", "ss-09"],
  },
  {
    id: "ss-11",
    skill_area: "Storage Services",
    skill_ref: R.migration,
    type: "definition",
    front: "What is AzCopy?",
    back: "A command-line tool for copying data to, from and between Azure Storage accounts. The current version works with Blob Storage and Azure Files.",
    explanation:
      "AzCopy is fast and scriptable, which makes it good for bulk transfers and automation.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "ss-12",
    skill_area: "Storage Services",
    skill_ref: R.migration,
    type: "definition",
    front: "What is Azure Data Box?",
    back: "A physical device that Microsoft ships to you. You copy data onto it locally, then ship it back so the data is uploaded to Azure.",
    explanation:
      "Data Box suits large transfers when sending the data over the network would be too slow, too expensive or impractical.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "ss-13",
    skill_area: "Storage Services",
    skill_ref: R.migration,
    type: "definition",
    front: "What is Azure File Sync?",
    back: "A service that syncs Azure file shares with a Windows Server, giving a local cache for fast access while the files stay in the cloud.",
    explanation:
      "File Sync gives users local-speed access to files while the full set lives in Azure. Only frequently used files are cached locally.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "ss-15",
    skill_area: "Storage Services",
    skill_ref: R.migration,
    type: "definition",
    front: "What is Azure Storage Explorer?",
    back: "A standalone graphical app for managing data in Azure Storage accounts, for people who prefer a visual tool to the command line.",
    explanation:
      "You can browse, upload and download storage data without writing commands.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "ss-16",
    skill_area: "Storage Services",
    skill_ref: R.migration,
    type: "definition",
    front: "What is Azure Migrate?",
    back: "A central hub for discovering, assessing and migrating on-premises servers, databases and web apps to Azure.",
    explanation:
      "Use it to plan a move to Azure: it helps you see what you have, check readiness and then migrate.",
    difficulty: 2,
    needs_verification: false,
  },

  // Skill Area: Identity & Security

  {
    id: "is-01",
    skill_area: "Identity & Security",
    skill_ref: R.directory,
    type: "definition",
    front: "What is Microsoft Entra ID (formerly Azure Active Directory)?",
    back: "Microsoft's cloud-based identity and access management service. It manages user accounts, authentication and access to resources.",
    explanation:
      "Entra ID is the foundation of identity in Azure. It handles sign-in, single sign-on, MFA and access control for cloud resources.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "is-02",
    skill_area: "Identity & Security",
    skill_ref: R.directory,
    type: "definition",
    front: "What is Microsoft Entra Domain Services?",
    back: "A managed service that provides traditional domain features, such as domain join, Group Policy, LDAP and Kerberos/NTLM authentication, without you running domain controller VMs.",
    explanation:
      "Entra Domain Services suits applications that need traditional Active Directory features when you do not want to manage the domain controllers yourself.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "is-03",
    skill_area: "Identity & Security",
    skill_ref: R.authentication,
    type: "definition",
    front: "What is Single Sign-On (SSO)?",
    back: "An authentication method where a user signs in once and can then reach multiple applications without signing in again for each one.",
    explanation:
      "SSO improves user experience and security by reducing the number of passwords people must remember and manage.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "is-04",
    skill_area: "Identity & Security",
    skill_ref: R.authentication,
    type: "definition",
    front: "What is Multi-Factor Authentication (MFA)?",
    back: "An authentication method that requires two or more kinds of proof: something you know (a password), something you have (a phone) or something you are (a fingerprint).",
    explanation:
      "MFA greatly improves security. Even if someone steals a password, they cannot sign in without the second factor.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "is-05",
    skill_area: "Identity & Security",
    skill_ref: R.authentication,
    type: "definition",
    front: "What is passwordless authentication?",
    back: "Authentication that does not use a password, relying instead on things like biometrics, security keys or phone-based verification.",
    explanation:
      "Passwordless removes the risk of stolen or weak passwords. Examples include Windows Hello, FIDO2 security keys and Microsoft Authenticator.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "is-06",
    skill_area: "Identity & Security",
    skill_ref: R.externalIdentities,
    type: "definition",
    front:
      "What are external identities and guest access in Microsoft Entra ID?",
    back: "A way to let people outside your organization (partners, vendors, contractors) access your apps and resources. You invite them as guest users, and they sign in with their own credentials.",
    explanation:
      "Guest access lets you collaborate with outsiders without creating full accounts for them. You control which resources a guest can reach.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "is-13",
    skill_area: "Identity & Security",
    skill_ref: R.externalIdentities,
    type: "scenario",
    front:
      "A company wants a supplier's staff to use one shared app with their own work accounts. Which Entra capability fits?",
    back: "External identities (B2B collaboration): invite the supplier's staff as guest users.",
    explanation:
      "Guests sign in with their own credentials, and the company decides what they can access.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "is-07",
    skill_area: "Identity & Security",
    skill_ref: R.conditionalAccess,
    type: "definition",
    front: "What is Conditional Access in Microsoft Entra ID?",
    back: "A policy engine that checks conditions (who, what, where) at sign-in and enforces a decision such as requiring MFA or blocking access.",
    explanation:
      "Conditional Access works on if/then logic: IF a user signs in from a new location AND opens sensitive data, THEN require MFA.",
    example:
      "Like a security guard who checks your ID, asks where you are going and decides whether to let you in based on several factors.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "is-16",
    skill_area: "Identity & Security",
    skill_ref: R.conditionalAccess,
    type: "scenario",
    front:
      "A company wants users to be asked for MFA only when they sign in from an unfamiliar location. Which Entra feature does this?",
    back: "Conditional Access.",
    explanation:
      "A Conditional Access policy checks conditions such as location at sign-in and then enforces a decision, here requiring MFA.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "is-08",
    skill_area: "Identity & Security",
    skill_ref: R.rbac,
    type: "definition",
    front: "What is Azure RBAC?",
    back: "An authorization system that grants fine-grained access to Azure resources through assigned roles. A role defines what actions a user or group can perform.",
    explanation:
      "RBAC follows the principle of least privilege: give people only the permissions they need. Roles can be assigned at any scope (management group, subscription, resource group or resource).",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cmp-03",
    skill_area: "Identity & Security",
    skill_ref: R.rbac,
    type: "compare",
    front: "Compare RBAC with Conditional Access.",
    back: "RBAC controls WHAT you can do (permissions on resources). Conditional Access controls WHETHER you get access, based on conditions such as identity, location and device.",
    explanation:
      "RBAC is about authorization (which actions are allowed). Conditional Access is about the sign-in decision given the circumstances.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "is-09",
    skill_area: "Identity & Security",
    skill_ref: R.zeroTrust,
    type: "definition",
    front: "What is the Zero Trust security model?",
    back: "A security approach that assumes no user, device or network is trustworthy by default. Every access request must be verified, wherever it comes from.",
    explanation:
      "Zero Trust principles: verify explicitly, use least-privilege access and assume breach. Never trust, always verify.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "is-12",
    skill_area: "Identity & Security",
    skill_ref: R.zeroTrust,
    type: "scenario",
    front:
      "A company implements Zero Trust. An employee working from home tries to open a database. What happens?",
    back: "The system verifies the employee's identity, checks the device, evaluates the request context and grants only the minimum permissions needed.",
    explanation:
      "Under Zero Trust, location does not grant trust. Every request is judged on identity, device health and the resource being requested.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "is-10",
    skill_area: "Identity & Security",
    skill_ref: R.defenseInDepth,
    type: "definition",
    front: "What is defense in depth?",
    back: "A security strategy that uses several layers of protection, so that if one layer fails, others still protect you.",
    explanation:
      "Layers include physical security, identity, network, application and data protection. No single failure exposes everything.",
    example:
      "Like a fortress with a moat, walls, guards and an inner keep: an attacker must get through every layer to reach the treasure.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "is-14",
    skill_area: "Identity & Security",
    skill_ref: R.defenseInDepth,
    type: "scenario",
    front:
      "A firewall blocks an attack, but even if it had failed, the attacker would still need valid credentials and could not read the encrypted data. Which principle does this show?",
    back: "Defense in depth.",
    explanation:
      "Several independent layers (network, identity, data protection) each add protection, so one failure is not enough to cause a breach.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "is-11",
    skill_area: "Identity & Security",
    skill_ref: R.defender,
    type: "definition",
    front: "What is Microsoft Defender for Cloud?",
    back: "A cloud-native application protection platform. It covers security posture management, which finds and fixes weak configurations, and workload protection, which detects threats against servers, containers, databases and other workloads.",
    explanation:
      "Defender for Cloud gives one view of your security posture across Azure, hybrid and other clouds, with recommendations and threat alerts.",
    difficulty: 2,
    needs_verification: false,
    confused_with: ["is-15"],
  },
  {
    id: "is-15",
    skill_area: "Identity & Security",
    skill_ref: R.defender,
    type: "compare",
    front:
      "In Defender for Cloud, what is the difference between CSPM and CWPP?",
    back: "CSPM (cloud security posture management) finds misconfigurations and recommends fixes. CWPP (cloud workload protection platform) protects running workloads by detecting threats against them.",
    explanation:
      "CSPM looks at how your environment is configured. CWPP watches the workloads for active attacks. You need both.",
    difficulty: 2,
    needs_verification: false,
    confused_with: ["is-11"],
  },

  // ===== DOMAIN 3: AZURE MANAGEMENT AND GOVERNANCE =====
  // Skill Area: Cost Management

  {
    id: "cm-01",
    skill_area: "Cost Management",
    skill_ref: R.costFactors,
    type: "definition",
    front: "Name three factors that affect Azure costs.",
    back: "Resource type, how much you use (consumption), and the region you deploy in. Network traffic, subscription type and Azure Marketplace purchases also play a part.",
    explanation:
      "Different services are priced differently, more usage costs more, prices vary by region, and data leaving Azure can be billed.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cmp-09",
    skill_area: "Cost Management",
    skill_ref: R.costFactors,
    type: "scenario",
    front:
      "A company notices its Azure bill went up even though it deployed the same resources. What could explain this?",
    back: "Possible causes: more usage, outbound data transfer charges, resources in a costlier region, or unused resources left running.",
    explanation:
      "Costs depend on usage, not only on what was deployed. Idle resources, data transfer and region choice all affect the final bill.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cm-02",
    skill_area: "Cost Management",
    skill_ref: R.calculators,
    type: "definition",
    front: "What is the Azure Pricing Calculator?",
    back: "A web tool that estimates the monthly cost of Azure services based on your planned configuration, region and usage.",
    explanation:
      "Use the Pricing Calculator before deploying to understand costs. You pick services, set configurations and expected usage, and get an estimate.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cm-03",
    skill_area: "Cost Management",
    skill_ref: R.calculators,
    type: "compare",
    front:
      "Compare the Azure Pricing Calculator with the TCO (Total Cost of Ownership) Calculator.",
    back: "Pricing Calculator: estimates the cost of Azure services you plan to deploy. TCO Calculator: compares the cost of running workloads on-premises with running them on Azure, showing potential savings.",
    explanation:
      "Use the Pricing Calculator to estimate cloud costs. Use the TCO Calculator to build a business case for moving from on-premises to Azure.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cm-04",
    skill_area: "Cost Management",
    skill_ref: R.costManagement,
    type: "definition",
    front: "What is Microsoft Cost Management?",
    back: "A set of Azure tools for monitoring, allocating and optimizing cloud spending, including cost analysis, budgets and recommendations.",
    explanation:
      "Cost Management helps you track spending, set budgets with alerts, analyze costs by resource or department, and find ways to save.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cm-07",
    skill_area: "Cost Management",
    skill_ref: R.costManagement,
    type: "scenario",
    front:
      "A team wants an alert when its monthly Azure spending passes a set amount. Which feature should it use?",
    back: "A budget with alerts in Microsoft Cost Management.",
    explanation:
      "Budgets let you set a spending threshold and notify people when actual or forecast costs approach it.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cm-05",
    skill_area: "Cost Management",
    skill_ref: R.tags,
    type: "definition",
    front: "What are Azure tags?",
    back: "Name-and-value pairs you attach to resources to organize and categorize them for cost tracking, management and automation.",
    explanation:
      "Tags let you group resources by department, environment, project or any other category. Cost Management can then show spending by tag.",
    example:
      'Like labeling boxes in a store room with "Department: Finance" or "Environment: Production" so you can find and track them.',
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cm-06",
    skill_area: "Cost Management",
    skill_ref: R.tags,
    type: "scenario",
    front:
      "A company wants to track which department spends the most on Azure. How should it organize resources?",
    back: 'Apply tags such as "Department: Marketing" or "Department: Engineering" to all resources, then use Cost Management to analyze spending by tag.',
    explanation:
      "Tags make cost allocation possible. Without tags, it is hard to tell which team or project is responsible for which costs.",
    difficulty: 2,
    needs_verification: false,
  },

  // Skill Area: Governance & Compliance

  {
    id: "gc-01",
    skill_area: "Governance & Compliance",
    skill_ref: R.purview,
    type: "definition",
    front: "What is Microsoft Purview?",
    back: "A family of data governance, risk and compliance solutions. On the governance side it helps you discover, catalog and classify data across your data estate. On the compliance side it includes tools such as Compliance Manager.",
    explanation:
      "Purview helps organizations find, classify, protect and govern their data wherever it lives, and manage compliance and risk.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "gc-07",
    skill_area: "Governance & Compliance",
    skill_ref: R.purview,
    type: "scenario",
    front:
      "A company wants one family of tools to find, classify and govern data across Azure, other clouds and on-premises systems, plus compliance tools. Which Microsoft service family fits?",
    back: "Microsoft Purview.",
    explanation:
      "Purview is a family of data governance, risk and compliance solutions.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "gc-02",
    skill_area: "Governance & Compliance",
    skill_ref: R.policy,
    type: "definition",
    front: "What is Azure Policy?",
    back: "A service that creates and enforces rules (policies) on Azure resources so they follow your organization's standards.",
    explanation:
      "Azure Policy can block non-compliant resources from being created or flag existing ones. Policies cascade down the resource hierarchy.",
    example:
      'Like a company rule that says "all vehicles must have insurance", applied automatically to every new vehicle bought.',
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "gc-03",
    skill_area: "Governance & Compliance",
    skill_ref: R.policy,
    type: "definition",
    front: "What is a policy initiative in Azure?",
    back: "A collection of Azure Policy definitions grouped together for a common goal. Assigning an initiative applies all its policies at once.",
    explanation:
      "Initiatives simplify management. Instead of assigning 10 separate policies, you assign one initiative that contains all 10.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "gc-06",
    skill_area: "Governance & Compliance",
    skill_ref: R.policy,
    type: "scenario",
    front:
      "An organization must ensure all VMs are deployed only in specific regions for data residency. Which Azure service enforces this?",
    back: "Azure Policy.",
    explanation:
      "You create a policy that restricts allowed locations and assign it at the right scope (management group, subscription or resource group).",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "gc-04",
    skill_area: "Governance & Compliance",
    skill_ref: R.locks,
    type: "definition",
    front: "What are Azure Resource Locks?",
    back: "Locks that prevent accidental deletion or modification of resources. Two types: Delete (prevents deletion) and Read-only (prevents changes and deletion).",
    explanation:
      "Locks can be applied to a subscription, a resource group or a single resource. They apply regardless of role permissions: even an owner must remove the lock before deleting the resource.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cmp-05",
    skill_area: "Governance & Compliance",
    skill_ref: R.locks,
    type: "compare",
    front: "Compare Azure Policy with Resource Locks.",
    back: "Azure Policy: enforces rules about what resources can be created and how they are configured. Resource Locks: stop specific resources from being deleted or modified.",
    explanation:
      "Policy governs creation and configuration rules. Locks protect specific existing resources from accidental changes or deletion.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "gc-05",
    skill_area: "Governance & Compliance",
    skill_ref: R.trustPortal,
    type: "definition",
    front: "What is the Microsoft Service Trust Portal?",
    back: "A portal where customers can find audit reports, compliance documentation and other resources about how Microsoft cloud services handle security, privacy and compliance.",
    explanation:
      "The Service Trust Portal provides evidence of Microsoft's security controls and compliance certifications. It is useful for audits and regulatory requirements.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "gc-08",
    skill_area: "Governance & Compliance",
    skill_ref: R.trustPortal,
    type: "definition",
    front: "What is the Microsoft Trust Center?",
    back: "A Microsoft website that explains how Microsoft approaches security, privacy, compliance and transparency across its cloud services.",
    explanation:
      "The Trust Center explains Microsoft's approach. The Service Trust Portal links to it and holds the detailed reports and documents.",
    difficulty: 2,
    needs_verification: false,
  },

  // Skill Area: Resource Deployment

  {
    id: "rd-01",
    skill_area: "Resource Deployment",
    skill_ref: R.managementOptions,
    type: "definition",
    front: "What is the Azure Portal?",
    back: "A web-based graphical interface for managing Azure resources. You can create, configure and monitor resources in a browser.",
    explanation:
      "The Portal is the most visual way to manage Azure. It suits learning and one-off tasks, but is not ideal for automation.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "rd-02",
    skill_area: "Resource Deployment",
    skill_ref: R.managementOptions,
    type: "definition",
    front: "What is Azure Cloud Shell?",
    back: "A browser-based command-line environment offering both Bash and PowerShell, available from the Azure portal with nothing to install.",
    explanation:
      "Cloud Shell gives you a command line without installing anything. Azure CLI and PowerShell are available and you are already signed in.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "rd-03",
    skill_area: "Resource Deployment",
    skill_ref: R.managementOptions,
    type: "compare",
    front: "Compare Azure CLI and Azure PowerShell.",
    back: "Both are command-line tools for managing Azure, and both run on Windows, macOS and Linux. Azure CLI uses az commands. Azure PowerShell uses Az cmdlets inside PowerShell.",
    explanation:
      "Pick the one that matches your habits: CLI if you like short az commands, PowerShell if you already script in PowerShell.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cmp-08",
    skill_area: "Resource Deployment",
    skill_ref: R.managementOptions,
    type: "scenario",
    front:
      "An administrator needs to check Azure resource status while commuting. Which tool is most appropriate?",
    back: "The Azure mobile app.",
    explanation:
      "The Azure mobile app gives quick access to resource status, alerts and basic management tasks from a phone.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "rd-04",
    skill_area: "Resource Deployment",
    skill_ref: R.arc,
    type: "definition",
    front: "What is Azure Arc?",
    back: "A service that extends Azure management to infrastructure outside Azure: on-premises servers, other clouds (such as AWS and GCP) and edge devices.",
    explanation:
      "Azure Arc lets you manage non-Azure resources with Azure tools like Azure Policy, RBAC and tags, giving one control plane for everything.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "rd-08",
    skill_area: "Resource Deployment",
    skill_ref: R.arc,
    type: "scenario",
    front:
      "A company has servers in its own datacenter and in another cloud, and wants to manage them with Azure Policy and tags. Which service enables this?",
    back: "Azure Arc.",
    explanation:
      "Arc projects non-Azure servers into Azure so Azure management tools can apply to them.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "rd-05",
    skill_area: "Resource Deployment",
    skill_ref: R.iac,
    type: "definition",
    front: "What is Infrastructure as Code (IaC)?",
    back: "The practice of managing and provisioning infrastructure through machine-readable definition files (code) instead of manual steps.",
    explanation:
      "IaC makes deployments repeatable, version-controlled and auditable. Changes are tracked like application code.",
    example:
      "Like a recipe card: anyone who follows it gets the same dish every time.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "rd-09",
    skill_area: "Resource Deployment",
    skill_ref: R.iac,
    type: "scenario",
    front:
      "A team must rebuild the same environment identically for development, testing and production. Which practice helps most?",
    back: "Infrastructure as Code.",
    explanation:
      "The environment is described once in code and deployed repeatedly, so every copy matches.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "rd-06",
    skill_area: "Resource Deployment",
    skill_ref: R.arm,
    type: "definition",
    front: "What is Azure Resource Manager (ARM)?",
    back: "The deployment and management layer for Azure. Requests to create, update or delete resources go through ARM, which handles authentication, authorization and the operations themselves.",
    explanation:
      "ARM is the layer behind the Portal, CLI and other Azure tools. It keeps management of all Azure resources consistent.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "rd-07",
    skill_area: "Resource Deployment",
    skill_ref: R.arm,
    type: "compare",
    front: "Compare ARM templates and Bicep.",
    back: "Both describe Azure resources as code. ARM templates are written in JSON. Bicep is a simpler language that compiles into ARM templates.",
    explanation:
      "Bicep's syntax is shorter and easier to read than the equivalent JSON, and it deploys through the same Resource Manager.",
    difficulty: 2,
    needs_verification: false,
  },

  // Skill Area: Monitoring Tools

  {
    id: "mt-01",
    skill_area: "Monitoring Tools",
    skill_ref: R.advisor,
    type: "definition",
    front: "What is Azure Advisor?",
    back: "A personalized recommendation service that reviews your Azure resources and suggests improvements, such as to cost, performance, reliability and security.",
    explanation:
      "Advisor analyzes your resource configuration and usage, then gives prioritized, actionable suggestions.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cmp-06",
    skill_area: "Monitoring Tools",
    skill_ref: R.advisor,
    type: "compare",
    front: "Compare Azure Advisor with Azure Monitor.",
    back: "Azure Advisor: recommends optimizations (cost, security, performance). Azure Monitor: collects and analyzes telemetry from your resources.",
    explanation:
      "Advisor suggests improvements. Monitor shows what is happening. Advisor is proactive; Monitor is observational.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "mt-02",
    skill_area: "Monitoring Tools",
    skill_ref: R.serviceHealth,
    type: "definition",
    front: "What is Azure Service Health?",
    back: "A personalized view of the health of the Azure services and regions you use. It shows active issues, planned maintenance and health advisories.",
    explanation:
      "Service Health tells you when Azure itself has a problem that affects your resources. You can set alerts to be notified.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "mt-06",
    skill_area: "Monitoring Tools",
    skill_ref: R.serviceHealth,
    type: "compare",
    front: "Compare Azure Service Health and Azure Monitor.",
    back: "Service Health: reports on the health of Azure platform services and regions (is Azure itself working?). Azure Monitor: monitors YOUR resources and applications (are your services working?).",
    explanation:
      "Service Health tells you about Azure-wide issues. Azure Monitor tells you about the performance and health of your own resources.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "mt-03",
    skill_area: "Monitoring Tools",
    skill_ref: R.monitor,
    type: "definition",
    front: "What is Azure Monitor?",
    back: "A monitoring service that collects, analyzes and acts on telemetry from your Azure and on-premises environments.",
    explanation:
      "Azure Monitor provides metrics, logs and diagnostics for your resources. It is the central monitoring platform for Azure.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "mt-04",
    skill_area: "Monitoring Tools",
    skill_ref: R.monitor,
    type: "definition",
    front: "What is Log Analytics?",
    back: "A tool in Azure Monitor for writing and running queries on log data. It stores logs and lets you analyze them with the Kusto Query Language (KQL).",
    explanation:
      "Log Analytics is where you investigate issues by querying collected log data. You can also create alerts based on query results.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "mt-05",
    skill_area: "Monitoring Tools",
    skill_ref: R.monitor,
    type: "definition",
    front: "What is Application Insights?",
    back: "A feature of Azure Monitor that monitors live applications. It detects performance anomalies, tracks usage and helps diagnose problems.",
    explanation:
      "Application Insights is built for application monitoring: response times, failure rates, dependencies and user behavior.",
    difficulty: 2,
    needs_verification: false,
  },

  // ===== ADDITIONAL SCENARIO CARDS =====

  {
    id: "cmp-01",
    skill_area: "Cloud Concepts",
    skill_ref: R.modelUseCases,
    type: "scenario",
    front:
      "A small business needs email and file storage and has no IT staff. Which cloud model and service type fit best?",
    back: "Public cloud, using SaaS.",
    explanation:
      "Public cloud SaaS services need no on-premises hardware or IT staff to maintain. The provider handles everything.",
    difficulty: 1,
    needs_verification: false,
  },
  {
    id: "cmp-02",
    skill_area: "Azure Architecture",
    skill_ref: R.availabilityZones,
    type: "compare",
    front:
      "What is the difference between Availability Zones and an Availability Set?",
    back: "Availability Zones: separate datacenter locations within a region (physical separation). Availability Set: VMs spread across fault domains and update domains within a datacenter (logical separation).",
    explanation:
      "Zones protect against the failure of a whole datacenter location. Availability Sets protect against rack or server failures and maintenance events within one datacenter. Zones give stronger isolation.",
    difficulty: 2,
    needs_verification: false,
  },
  {
    id: "cmp-10",
    skill_area: "Cloud Benefits",
    skill_ref: R.elasticityPredictability,
    type: "scenario",
    front:
      "An e-commerce site expects ten times its normal traffic during a holiday sale. Which cloud benefit handles this?",
    back: "Elasticity.",
    explanation:
      "Elasticity lets the system scale up automatically for the spike and scale back down afterwards, so you pay only for what you use.",
    difficulty: 1,
    needs_verification: false,
  },
];
