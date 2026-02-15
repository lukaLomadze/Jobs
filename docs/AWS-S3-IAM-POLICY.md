# AWS S3 IAM policy for jobs-backend

The backend uses IAM user **jobsUser** to upload CVs (and other files) to the S3 bucket **jobsportal**.  
If you see:

```text
User: arn:aws:iam::159326044321:user/jobsUser is not authorized to perform: s3:PutObject on resource: "arn:aws:s3:::jobsportal/..."
```

then this user does not have the required S3 permissions.

## Fix in AWS Console

1. Open **IAM** → **Users** → **jobsUser** (or the user whose access key you use in `AWS_ACCESS_KEY` / `AWS_SECRET_KEY`).
2. Go to **Permissions** and **Add permissions** → **Create inline policy** (or attach a custom policy).
3. Choose **JSON** and paste the policy below (replace `jobsportal` with your bucket name if different):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::jobsportal/*"
    }
  ]
}
```

4. Name the policy (e.g. `JobsPortalS3Access`) and save.

After saving, the backend will be able to upload (PutObject), download (GetObject), and delete (DeleteObject) objects in the `jobsportal` bucket. No code changes are required.
