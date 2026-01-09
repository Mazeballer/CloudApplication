# Auto-care Website Quick-Start

## Front-End

### 1. Install Dependencies

Make sure you have **Node.js (v18+)** and **pnpm** installed globally:

```bash
npm install -g pnpm
```

Then, from the project root:

```bash
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the project root.

In `.env`, fill in all the environment variable:

```env
# Backend API
NEXT_PUBLIC_API_URL=https://localhost:7255

# AWS S3 (Image Storage) and SNS (Subscription)
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-s3-bucket-name
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_SESSION_TOKEN=your-aws-session-token
```

### 3. Development

Start the development server:

```bash
pnpm dev
```

Open your browser at [http://localhost:3000](http://localhost:3000).

---

## Back-End

## 1. Environment Variables (`appsettings.json`)

Create an `appsettings.json` file inside the `autocare-api` folder  
(the same directory as `Program.cs`).

Paste the following **example configuration**:

```json
{
  "AllowedHosts": "*",

  "AWS": {
    "Region": "us-east-1",
    "SnsTopicArn": "arn:aws:sns:us-east-1:123456789012:your-sns-topic"
  },

  "FrontendBaseUrl": "http://localhost:3000",

  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### 2. Environment Variables (appsettings.Development.json)

Create an `appsettings.Development.json` file inside the `autocare-api` folder  
(the same directory as `Program.cs`).

In `appsettings.Development.json`, paste this json text:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=your-db-endpoint;Port=5432;Database=postgres;Username=db_user;Password=db_password;Ssl Mode=Require;"
  },

  "OpenCage": {
    "ApiKey": "your-opencage-api-key"
  },

  "Email": {
    "Smtp": {
      "From": "your-email@gmail.com",
      "Host": "smtp.gmail.com",
      "Port": 587,
      "User": "your-email@gmail.com",
      "Password": "your-app-password"
    }
  }
}
```

## 3. Run the Application

Open the solution file (`autocare-api.sln`) using **Visual Studio 2022**.

1. Ensure the startup project is set to `autocare-api`
2. Click the **Run (▶)** button or press **F5**
