# Admin Panel Protection

The `/admin` route is protected with a simple password-based authentication.

## Setup

1. **Set the admin password** in your environment variables:
   ```bash
   # .env.local (for local development)
   ADMIN_PASSWORD=your-secure-password-here
   TINA_PUBLIC_IS_LOCAL=true
   ```

2. **For production** (Vercel, Netlify, etc.):
   - Add `ADMIN_PASSWORD` to your deployment platform's environment variables
   - Add `TINA_PUBLIC_IS_LOCAL=true` to disable Tina Cloud authentication
   - Keep it secret - don't commit it to the repository

## Usage

1. Visit `/admin` - you'll see a password prompt
2. Enter the password set in `ADMIN_PASSWORD`
3. Access the TinaCMS admin interface

## Development Mode

If `ADMIN_PASSWORD` is not set, the admin route is accessible without a password (useful for local development).

## Important: Disable Tina Cloud

To prevent redirects to `app.tina.io`, make sure you have:
- `TINA_PUBLIC_IS_LOCAL=true` in your environment variables
- No `NEXT_PUBLIC_TINA_CLIENT_ID` or `TINA_TOKEN` set (these would enable cloud auth)

## Security Notes

- The password is checked server-side
- Use a strong password in production
- Consider using environment-specific passwords for different deployments
- For additional security, you can:
  - Add IP whitelisting
  - Use OAuth (GitHub, Google, etc.)
  - Implement rate limiting
