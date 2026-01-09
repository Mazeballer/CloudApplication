# Auto-care Website Quick-Start

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
