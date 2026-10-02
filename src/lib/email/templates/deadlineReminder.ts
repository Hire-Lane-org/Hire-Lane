export interface DeadlineEmailProps {
  userName: string;
  companyName: string;
  role: string;
  deadlineDate: string;
  daysRemaining: string;
  jobPostingLink?: string | null;
}

export function generateDeadlineEmailHtml(props: DeadlineEmailProps): string {
  const { userName, companyName, role, deadlineDate, daysRemaining, jobPostingLink } = props;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Application Deadline Reminder - HireLane</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; border: 1px solid #E2E8F0; overflow: hidden; }
    .header { background: #0F172A; padding: 24px 32px; text-align: left; }
    .logo-text { font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .logo-accent { color: #0047FF; }
    .content { padding: 32px; color: #334155; }
    h1 { font-size: 20px; color: #0F172A; margin-top: 0; }
    .card { background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 20px; margin: 24px 0; }
    .row { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .label { color: #64748B; font-size: 13px; font-weight: 500; }
    .value { color: #0F172A; font-size: 14px; font-weight: 600; text-align: right; }
    .badge { display: inline-block; background: #FEF2F2; color: #EF4444; font-weight: 700; padding: 4px 10px; border-radius: 20px; font-size: 13px; }
    .btn { display: inline-block; background: #0047FF; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; margin-top: 16px; }
    .footer { border-top: 1px solid #E2E8F0; padding: 24px 32px; text-align: center; color: #94A3B8; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-text">Hire<span class="logo-accent">Lane</span></div>
    </div>
    <div class="content">
      <h1>Application Deadline Alert</h1>
      <p>Hello ${userName || 'there'},</p>
      <p>This is an automated reminder that your job application deadline is approaching soon.</p>
      
      <div class="card">
        <div style="margin-bottom: 12px;">
          <span class="badge">⏳ ${daysRemaining}</span>
        </div>
        <table width="100%" cellpadding="6" cellspacing="0">
          <tr>
            <td class="label">Company</td>
            <td class="value">${companyName}</td>
          </tr>
          <tr>
            <td class="label">Position</td>
            <td class="value">${role}</td>
          </tr>
          <tr>
            <td class="label">Deadline Date</td>
            <td class="value">${deadlineDate}</td>
          </tr>
        </table>
      </div>

      ${jobPostingLink ? `<a href="${jobPostingLink}" class="btn" target="_blank">View Job Posting &rarr;</a>` : ''}
      <p style="margin-top: 24px; font-size: 14px; color: #64748B;">Make sure your resume, portfolio, and application forms are finalized before the deadline.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} HireLane. Organize your applications, track interviews, and ace your dream job.
    </div>
  </div>
</body>
</html>
  `.trim();
}
