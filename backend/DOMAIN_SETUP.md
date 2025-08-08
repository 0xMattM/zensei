# Domain Setup Guide for zensei.fun

This guide walks you through setting up your `zensei.fun` domain from Hostinger to work with Cloudflare tunnels.

## Prerequisites

- Domain `zensei.fun` registered with Hostinger
- Cloudflare account (free tier is sufficient)
- Access to both Hostinger and Cloudflare dashboards

## 🎯 Recommended Approach: Transfer DNS to Cloudflare

This is the **easiest method** and allows our automated setup script to work perfectly.

### Step 1: Add Domain to Cloudflare

1. **Login to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Login to your account

2. **Add Your Site**
   - Click "Add a Site" 
   - Enter `zensei.fun`
   - Click "Add Site"

3. **Choose Plan**
   - Select "Free" plan (sufficient for our needs)
   - Click "Continue"

4. **DNS Records Scan**
   - Cloudflare will scan existing DNS records
   - Review and click "Continue"
   - Don't worry if it's empty - our script will add the needed records

### Step 2: Update Nameservers at Hostinger

1. **Get Cloudflare Nameservers**
   - In Cloudflare dashboard, you'll see something like:
     ```
     keenan.ns.cloudflare.com
     olga.ns.cloudflare.com
     ```
   - **Copy these nameservers** (yours will be different)

2. **Login to Hostinger**
   - Go to [hpanel.hostinger.com](https://hpanel.hostinger.com)
   - Login to your account

3. **Navigate to Domain Management**
   - Go to "Domains" section
   - Find `zensei.fun` and click "Manage"

4. **Change Nameservers**
   - Look for "Nameservers" or "DNS Zone" section
   - Change from Hostinger nameservers to Cloudflare nameservers
   - Enter the two nameservers from Cloudflare:
     ```
     keenan.ns.cloudflare.com
     olga.ns.cloudflare.com
     ```
   - Save changes

### Step 3: Verify in Cloudflare

1. **Back to Cloudflare Dashboard**
   - Click "Done, check nameservers"
   - Cloudflare will verify the change

2. **Wait for Activation**
   - This can take 5 minutes to 24 hours
   - You'll get an email when it's active
   - Status will show "Active" in Cloudflare dashboard

### Step 4: Run Zensei Setup

Once Cloudflare shows "Active":

```bash
cd zensei

# Run our automated setup
./setup-tunnel.sh

# The script will automatically:
# - Create tunnel
# - Add DNS records for eliza.zensei.fun, cambrian.zensei.fun, etc.
# - Configure everything
```

---

## 🔧 Alternative: Manual DNS at Hostinger

If you prefer to keep DNS management at Hostinger, you can manually add records. **This is more complex and requires manual updates.**

### Step 1: Create Cloudflare Tunnel Manually

```bash
# Install cloudflared first
cloudflared tunnel login
cloudflared tunnel create zensei
cloudflared tunnel token zensei  # Save this token
```

### Step 2: Add DNS Records at Hostinger

In Hostinger DNS management, add these CNAME records:

| Name | Type | Value |
|------|------|-------|
| eliza | CNAME | `<tunnel-id>.cfargotunnel.com` |
| cambrian | CNAME | `<tunnel-id>.cfargotunnel.com` |
| mcp | CNAME | `<tunnel-id>.cfargotunnel.com` |
| health | CNAME | `<tunnel-id>.cfargotunnel.com` |

Where `<tunnel-id>` is your tunnel UUID from the tunnel creation.

### Step 3: Update .env File

Add the tunnel token to your `.env` file:
```bash
CLOUDFLARED_TOKEN=your-tunnel-token-here
```

---

## ✅ Verification Steps

After setup (either method):

### 1. Check DNS Propagation
```bash
# Check if DNS is working
nslookup eliza.zensei.fun
nslookup cambrian.zensei.fun
nslookup mcp.zensei.fun
```

### 2. Start Services
```bash
# Start with tunnel
./start.sh start-tunnel

# Check status
./start.sh status
```

### 3. Test Access
- **https://eliza.zensei.fun** - Should show Eliza interface
- **https://cambrian.zensei.fun** - Should show Cambrian platform
- **https://mcp.zensei.fun** - Should show MCP server
- **https://health.zensei.fun** - Should show health status

## 🐛 Troubleshooting

### Domain Not Active in Cloudflare
- **Issue**: Nameservers not changed or not propagated
- **Solution**: 
  - Verify nameservers are correctly set in Hostinger
  - Wait up to 24 hours for propagation
  - Check with: `dig NS zensei.fun`

### DNS Not Resolving
- **Issue**: Subdomains not resolving
- **Solution**:
  - If using Cloudflare: Run `./setup-tunnel.sh` again
  - If manual: Verify CNAME records in Hostinger
  - Check propagation: `nslookup eliza.zensei.fun`

### Tunnel Not Connecting
- **Issue**: Services not accessible via web
- **Solution**:
  - Check tunnel token in `.env`
  - Verify tunnel is running: `docker-compose logs cloudflared`
  - Test local access first: `http://localhost:3010`

### SSL Certificate Issues
- **Issue**: HTTPS not working
- **Solution**:
  - Cloudflare automatically handles SSL
  - Wait 5-10 minutes after DNS propagation
  - Check Cloudflare SSL/TLS settings (should be "Full")

## 📋 Quick Summary

**Recommended Steps:**
1. Add `zensei.fun` to Cloudflare
2. Update nameservers in Hostinger to Cloudflare nameservers  
3. Wait for activation (5min - 24hrs)
4. Run `./setup-tunnel.sh`
5. Start services with `./start.sh start-tunnel`
6. Access at `https://eliza.zensei.fun`

**Timeline:**
- Setup: 10 minutes
- DNS propagation: 5 minutes to 24 hours  
- Total: Usually working within 30 minutes

## 🆘 Need Help?

If you run into issues:
1. Check Cloudflare dashboard for domain status
2. Verify nameservers with `dig NS zensei.fun`
3. Test local access first before web access
4. Check service logs with `./start.sh logs`

The key is getting the nameservers changed - once that's done, everything else is automated! 🚀 