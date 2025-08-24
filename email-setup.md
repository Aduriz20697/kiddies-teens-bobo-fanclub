# Email Setup Instructions for Kiddies Teen Fan Club with Bobo

## EmailJS Setup (Free Email Service)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Connect your email account
5. Note the **Service ID**

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. **IMPORTANT**: Set the "To Email" field to: `{{to_email}}`
4. Use this template:

**Template Settings:**
- **To Email**: `{{to_email}}` (REQUIRED)
- **From Name**: Kiddies Teens with Bobo Fan Club
- **Subject**: Welcome to Kiddies Teens with Bobo Fan Club! 🎉
- **Reply To**: your-email@gmail.com

**Email Content:**
```
Dear {{to_name}},

Welcome to the Kiddies Teen Fan Club with Bobo! 🎉

We are thrilled to have you as part of our amazing community. Your payment has been received and verified.

📋 Membership Details:
• Name: {{member_name}}
• School: {{school_name}}
• Payment Reference: {{payment_reference}}
• Registration Date: {{registration_date}}

🎁 As a verified member, you now have access to:
• All fan club activities and events
• Educational programs and workshops
• Birthday celebrations and shout-outs
• Exclusive member benefits
• Holiday clinic vocational training

Thank you for joining our community! We look forward to seeing you at our upcoming events.

Best regards,
Kiddies Teen Fan Club with Bobo Team
📞 +234 818 363 0819
📍 Lasustech Student Activities, Ikorodu, Lagos State
```

4. **CRITICAL**: In template settings, make sure:
   - **To Email** field contains: `{{to_email}}`
   - **From Name**: Kiddies Teens with Bobo Fan Club
   - **Reply To**: Your actual email address
5. Save template and note the **Template ID**

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key**

### Step 5: Update Configuration
In `admin.js`, update the EMAIL_CONFIG:

```javascript
const EMAIL_CONFIG = {
    serviceId: 'your_service_id_here',
    templateId: 'your_template_id_here',
    publicKey: 'your_public_key_here'
};
```

## Features

✅ **Automatic Email Sending**: When admin verifies payment
✅ **Fallback System**: Shows email template if EmailJS fails
✅ **Copy to Clipboard**: Easy manual email sending
✅ **Professional Template**: Welcome message with member details
✅ **Error Handling**: Graceful fallback for email issues

## Usage

1. Admin verifies payment by clicking "Toggle Status"
2. System automatically sends welcome email
3. If email fails, shows template for manual sending
4. Member receives professional welcome message

## Cost

- EmailJS Free Plan: 200 emails/month
- Perfect for fan club size
- No setup costs required