# Deploying Site in Azure1

You can deploy your Docusaurus site as a robust and scalable Static Web App using Microsoft Azure. This guide walks you through connecting your existing repository to Azure, configuring the necessary build steps, and ensuring continuous deployment with minimal effort.

## Prerequisites

Before starting the deployment process, ensure you have the following items ready:

* An active GitHub account containing your Docusaurus source code repository.

* An active Microsoft Azure subscription.

* Administrative access rights to create resources within Azure.

## Step-by-Step Deployment Guide

You will deploy your site by linking your GitHub repository directly to a new Azure Static Web App resource. This approach automatically handles the build, deployment, and updates whenever you push changes to your main branch.

### 1. Create the Azure Static Web App Resource

First, navigate to the Azure portal and create the primary service container for your site.

1. In the Azure Portal search bar, type **Static Web Apps** and select the service.
2. Click **+ Create**.
3. Fill out the required details:

   * **Subscription:** Select your target subscription.

   * **Resource Group:** Create a new, descriptive resource group (e.g., `docusaurus-rg`).

   * **Name:** Assign a unique name to your application (this will become part of your URL).

### 2. Connect Your GitHub Repository

Next, you must link the Azure resource to your source code hosting service, which is GitHub.

1. Within the newly created Static Web App resource, look for the **Deployment** tab and select **Add Source**.
2. Select **GitHub** as the deployment source type.
3. You will be prompted to authorize Azure to access your repositories. Follow the prompts to grant necessary permissions.
4. After authorizing GitHub, you must specify which repository and branch contain your Docusaurus code. Select the correct repository and choose the primary branch (e.g., `main` or `master`).

### 3. Configure Build Settings

Since Docusaurus requires specific build commands to compile into static assets, you must provide these details during configuration. Azure uses this information to know how to run your project before publishing it.

When prompted for the build settings, enter the following standard configurations:

* **Build Prescribed:** `npm run build`

  * *Note:* This command executes the script defined in your `package.json` that generates the static files (the contents of the `build` folder).

* **Output Directory:** `build`

  * *Note:* This tells Azure where to find the final, compiled website files after the build process completes.

### 4. Finalize Deployment

After you confirm all settings—Resource Group, GitHub connection, and Build Settings—click **Review + Create**.

Azure will now initiate the first build and deployment cycle. Monitor the deployment logs; you should see status messages confirming that the site is compiling successfully. Once the process completes, Azure automatically generates a live endpoint URL where your fully deployed Docusaurus website resides. You can access this public URL to verify the successful implementation of your blog post section or any other updated content.
